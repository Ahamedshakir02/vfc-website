/**
 * Online payment for event registrations, through Cashfree Payments.
 *
 * The browser cannot be trusted to say what was paid, so the two halves that
 * matter run here: the amount is taken from the event (never from the
 * request), and a registration is only written once Cashfree itself says the
 * order is paid. Registrations made this way arrive already verified;
 * officers have nothing to check.
 *
 *   createPaymentOrder  the form's details in, a Cashfree order out
 *   confirmPayment      asks Cashfree whether that order has been paid
 *   cashfreeWebhook     the same confirmation, sent by Cashfree itself, for
 *                       the payer whose browser closed before step two
 *
 * Keys come from functions/.env (see functions/.env.example). With no keys,
 * and only inside the local emulators, orders are "demo" ones that the site
 * settles with a stand-in payment page: nothing leaves the machine.
 */
import crypto from 'node:crypto'
import { initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { setGlobalOptions } from 'firebase-functions/v2'
import { HttpsError, onCall, onRequest } from 'firebase-functions/v2/https'

initializeApp()
const db = getFirestore()

// Mumbai: closest to the people paying. The site names the same region in src/lib/payments.js.
setGlobalOptions({ region: 'asia-south1', maxInstances: 5 })

const APP_ID = process.env.CASHFREE_APP_ID ?? ''
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY ?? ''
// "sandbox" is Cashfree's test mode, where no money moves; anything else is treated as it too.
const MODE = process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox'
const API = MODE === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg'
const API_VERSION = '2023-08-01'

const hasKeys = Boolean(APP_ID && SECRET_KEY)
const inEmulator = process.env.FUNCTIONS_EMULATOR === 'true'

async function cashfree(path, body) {
  const response = await fetch(`${API}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      'x-client-id': APP_ID,
      'x-client-secret': SECRET_KEY,
      'x-api-version': API_VERSION,
      'Content-Type': 'application/json',
    },
    body: body && JSON.stringify(body),
  })
  if (!response.ok) {
    console.error('Cashfree refused', path, response.status, await response.text())
    throw new HttpsError('unavailable', 'gateway')
  }
  return response.json()
}

const text = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

/** The same checks as the form and firestore.rules, made again where they cannot be skipped. */
function readDetails(data) {
  const details = {
    name: text(data?.name, 120),
    phone: text(data?.phone, 20).replace(/\D/g, '').replace(/^91(?=\d{10}$)/, ''),
    email: text(data?.email, 200),
    category: text(data?.category, 60),
    teamName: text(data?.teamName, 120),
  }
  if (details.name.length < 2) throw new HttpsError('invalid-argument', 'name')
  if (!/^[6-9]\d{9}$/.test(details.phone)) throw new HttpsError('invalid-argument', 'phone')
  if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) throw new HttpsError('invalid-argument', 'email')
  return details
}

export const createPaymentOrder = onCall(async ({ data }) => {
  const eventId = text(data?.eventId, 120)
  if (!eventId) throw new HttpsError('invalid-argument', 'eventId')
  const details = readDetails(data)

  const [event, site] = await Promise.all([db.doc(`events/${eventId}`).get(), db.doc('settings/site').get()])
  if (!site.data()?.payOnline) throw new HttpsError('failed-precondition', 'online-payment-off')
  if (!event.exists || event.data().status !== 'open') throw new HttpsError('failed-precondition', 'event-not-open')

  const { fee, categories = [] } = event.data()
  if (!Number.isInteger(fee) || fee <= 0) throw new HttpsError('failed-precondition', 'no-fee')
  if (categories.length && !categories.some((category) => category.id === details.category)) {
    throw new HttpsError('invalid-argument', 'category')
  }
  if (!hasKeys && !inEmulator) throw new HttpsError('failed-precondition', 'gateway-not-configured')

  // Ours to choose, so the order can be found again whichever way its payment is confirmed.
  const orderId = `${hasKeys ? 'vfc' : 'demo'}_${crypto.randomBytes(12).toString('hex')}`
  let paymentSessionId = null
  if (hasKeys) {
    const order = await cashfree('/orders', {
      order_id: orderId,
      order_amount: fee,
      order_currency: 'INR',
      order_note: text(event.data().title?.en, 100),
      customer_details: {
        customer_id: `phone_${details.phone}`,
        customer_name: details.name,
        customer_phone: details.phone,
        ...(details.email && { customer_email: details.email }),
      },
    })
    paymentSessionId = order.payment_session_id
  }

  await db.doc(`orders/${orderId}`).set({
    eventId,
    ...details,
    amount: fee,
    demo: !hasKeys,
    status: 'created',
    createdAt: FieldValue.serverTimestamp(),
  })

  return { orderId, paymentSessionId, mode: MODE, demo: !hasKeys }
})

/**
 * Turns a paid order into a registration, once. Both confirmPayment and the
 * webhook end up here, in either order, and the second to arrive changes nothing.
 */
async function register(orderId, paymentId) {
  const orderRef = db.doc(`orders/${orderId}`)

  return db.runTransaction(async (transaction) => {
    const order = await transaction.get(orderRef)
    if (!order.exists) throw new HttpsError('not-found', 'order')
    const { registrationId, eventId, name, phone, email, category, teamName } = order.data()
    if (registrationId) return { registrationId, paymentId: order.data().paymentId }

    const registration = db.collection('registrations').doc()
    transaction.set(registration, {
      eventId,
      name,
      phone,
      email,
      category,
      teamName,
      paymentMethod: 'online',
      paymentRef: paymentId,
      paymentStatus: 'verified',
      createdAt: FieldValue.serverTimestamp(),
    })
    transaction.update(orderRef, { status: 'paid', paymentId, registrationId: registration.id })
    return { registrationId: registration.id, paymentId }
  })
}

export const confirmPayment = onCall(async ({ data }) => {
  const orderId = text(data?.orderId, 80)
  if (!/^[\w-]+$/.test(orderId)) throw new HttpsError('invalid-argument', 'orderId')

  const order = await db.doc(`orders/${orderId}`).get()
  if (!order.exists) throw new HttpsError('not-found', 'order')

  if (order.data().demo) {
    // A demo order is settled on the payer's say-so, which is only acceptable on someone's own machine.
    if (!inEmulator || hasKeys) throw new HttpsError('permission-denied', 'demo-order')
    return register(orderId, `demo_pay_${crypto.randomBytes(8).toString('hex')}`)
  }

  // Nothing the browser sends is taken as proof: Cashfree is asked directly.
  const paid = await cashfree(`/orders/${orderId}`)
  if (paid.order_status !== 'PAID' || Number(paid.order_amount) !== order.data().amount) {
    throw new HttpsError('failed-precondition', 'not-paid')
  }
  const payments = await cashfree(`/orders/${orderId}/payments`)
  const payment = payments.find((entry) => entry.payment_status === 'SUCCESS')
  return register(orderId, String(payment?.cf_payment_id ?? paid.cf_order_id))
})

/** Cashfree signs each webhook with the account's secret key: base64(HMAC-SHA256(timestamp + body)). */
function signedByCashfree(request) {
  const given = Buffer.from(String(request.get('x-webhook-signature') ?? ''))
  const expected = Buffer.from(
    crypto
      .createHmac('sha256', SECRET_KEY)
      .update(String(request.get('x-webhook-timestamp') ?? '') + request.rawBody)
      .digest('base64'),
  )
  return given.length === expected.length && crypto.timingSafeEqual(given, expected)
}

export const cashfreeWebhook = onRequest(async (request, response) => {
  if (!hasKeys || !signedByCashfree(request)) {
    response.status(401).send('bad signature')
    return
  }

  const { order, payment } = request.body?.data ?? {}
  if (request.body?.type === 'PAYMENT_SUCCESS_WEBHOOK' && payment?.payment_status === 'SUCCESS' && order?.order_id) {
    try {
      await register(order.order_id, String(payment.cf_payment_id))
    } catch (error) {
      // An order this project never made (another site on the same Cashfree account): nothing to do.
      if (error.code !== 'not-found') throw error
    }
  }
  response.status(200).send('ok')
})
