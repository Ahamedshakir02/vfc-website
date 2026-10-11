/**
 * Paying the entry fee on the page, through the club's payment gateway
 * (Cashfree Payments).
 *
 * The amount and the proof of payment are both settled by the Cloud Functions
 * in functions/index.js; this file only carries messages between them and the
 * payment page. Loaded on demand, when a visitor chooses to pay online.
 */
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'
import { EMULATOR_HOST, EMULATOR_PORTS, app, emulated } from './firebase.js'

const functions = getFunctions(app, 'asia-south1') // as in functions/index.js
if (emulated) connectFunctionsEmulator(functions, EMULATOR_HOST, EMULATOR_PORTS.functions)

const createOrder = httpsCallable(functions, 'createPaymentOrder')
const confirm = httpsCallable(functions, 'confirmPayment')

const CHECKOUT_SCRIPT = 'https://sdk.cashfree.com/js/v3/cashfree.js'

/** Cashfree's payment page, fetched from Cashfree the first time it is needed. */
function loadCheckout() {
  if (window.Cashfree) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = CHECKOUT_SCRIPT
    script.onload = resolve
    script.onerror = () => {
      script.remove()
      reject(new Error('checkout-unreachable'))
    }
    document.head.append(script)
  })
}

/**
 * Opens the payment page over this one. Resolves true when the payer went
 * through with it, false when they closed it or the payment failed. Either
 * way the functions ask Cashfree what really happened before registering.
 */
async function payWithCashfree(order) {
  const result = await window.Cashfree({ mode: order.mode }).checkout({
    paymentSessionId: order.paymentSessionId,
    redirectTarget: '_modal',
  })
  return !result?.error
}

export class PaymentError extends Error {
  /** `stage` is 'start' (nothing was charged) or 'confirm' (money may have moved; `ref` is the order to quote). */
  constructor(stage, ref = '') {
    super(`payment-${stage}`)
    this.stage = stage
    this.ref = ref
  }
}

/**
 * Takes the visitor through paying for one registration.
 *
 * `askDemo` shows the stand-in payment page and resolves true or false; it is
 * only ever used for a demo order, which only the local emulators hand out.
 * Resolves with `{ registrationId, paymentId }` when registered, or `null` if the payer backs out.
 */
export async function payAndRegister(event, details, askDemo) {
  let order
  try {
    order = (await createOrder({ eventId: event.id, ...details })).data
    if (!order.demo) await loadCheckout()
  } catch {
    throw new PaymentError('start')
  }

  const paid = order.demo ? await askDemo(order) : await payWithCashfree(order)
  if (!paid) return null

  try {
    const { data } = await confirm({ orderId: order.orderId })
    return { registrationId: data.registrationId, paymentId: data.paymentId }
  } catch {
    // The webhook may still register them; either way they must not pay twice.
    throw new PaymentError('confirm', order.orderId)
  }
}
