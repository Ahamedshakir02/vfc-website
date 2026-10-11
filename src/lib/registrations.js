import { isFirebaseConfigured } from './firebase.js'
import { COLLECTIONS, PAYMENT_METHOD, PAYMENT_STATUS } from '../data/schema.js'

/**
 * The form only accepts submissions when it can really store them. The other
 * things it needs (a fee, and somewhere to pay it) are checked by the form
 * itself, which says so plainly instead of pretending to work.
 */
export const canStoreRegistrations = isFirebaseConfigured

/**
 * A link that opens the phone's UPI app with the club and the fee already
 * filled in. `upiId` is the club's, from the site settings.
 */
export const upiPayLink = (upiId, note, fee) =>
  `upi://pay?${new URLSearchParams({ pa: upiId, pn: 'VFC Arts, Sports & Welfare Club', am: String(fee), cu: 'INR', tn: note })}`

/** The registrant's own details, tidied the way both ways of paying store them. */
export const tidyDetails = (values) => ({
  name: values.name.trim(),
  phone: values.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, ''),
  email: values.email.trim(),
  category: values.category,
  teamName: values.teamName.trim(),
})

export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024

// Left alone, Firebase keeps retrying a dead connection for minutes and an
// offline Firestore write never settles at all. Give up and say so instead.
const SEND_TIMEOUT_MS = 25000

const withTimeout = (promise) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('registration-timeout')), SEND_TIMEOUT_MS)),
  ])

/**
 * Returns `{ field: errorKey }` for everything wrong; an empty object means
 * valid. Proof of payment is only asked of someone paying by UPI: an online
 * payment proves itself.
 */
export function validateRegistration(values, method = PAYMENT_METHOD.upi) {
  const errors = {}
  const phoneDigits = values.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')

  if (values.name.trim().length < 2) errors.name = 'required'
  if (!values.phone.trim()) errors.phone = 'required'
  else if (!/^[6-9]\d{9}$/.test(phoneDigits)) errors.phone = 'phone'
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'email'
  if (!values.category) errors.category = 'required'
  if (method === PAYMENT_METHOD.online) return errors

  // Apps label this differently (UTR, reference, transaction ID), so accept
  // any plausible reference rather than insisting on exactly twelve digits.
  if (!values.paymentRef.trim()) errors.paymentRef = 'required'
  else if (!/^[A-Za-z0-9]{8,35}$/.test(values.paymentRef.trim())) errors.paymentRef = 'paymentRef'
  if (!values.screenshot) errors.screenshot = 'required'
  else if (!values.screenshot.type.startsWith('image/')) errors.screenshot = 'screenshotType'
  else if (values.screenshot.size > MAX_SCREENSHOT_BYTES) errors.screenshot = 'screenshotSize'

  return errors
}

/**
 * A registration paid by UPI: stores the payment screenshot, then the
 * registration that points at it, for an officer to check.
 *
 * Firestore and Storage are loaded only here, so visitors who never register
 * never download them. The screenshot's path is saved rather than a public
 * URL: the storage rules let anyone upload one but only club officers read it.
 */
export async function submitRegistration(eventId, values) {
  if (!canStoreRegistrations) throw new Error('registration-not-configured')

  const [{ collection, doc, setDoc, serverTimestamp }, { ref, uploadBytes }, { db, storage }] = await Promise.all([
    import('firebase/firestore'),
    import('firebase/storage'),
    import('./services.js'),
  ])

  const registration = doc(collection(db, COLLECTIONS.registrations))
  const extension = (values.screenshot.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const screenshotPath = `payment-screenshots/${eventId}/${registration.id}.${extension || 'jpg'}`

  storage.maxUploadRetryTime = SEND_TIMEOUT_MS
  await withTimeout(
    uploadBytes(ref(storage, screenshotPath), values.screenshot, { contentType: values.screenshot.type }),
  )

  await withTimeout(setDoc(registration, {
    eventId,
    ...tidyDetails(values),
    paymentMethod: PAYMENT_METHOD.upi,
    paymentRef: values.paymentRef.trim(),
    paymentScreenshotPath: screenshotPath,
    paymentStatus: PAYMENT_STATUS.pending,
    createdAt: serverTimestamp(),
  }))

  return registration.id
}
