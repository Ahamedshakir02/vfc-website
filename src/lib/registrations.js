import { isFirebaseConfigured } from './firebase.js'
import { COLLECTIONS, PAYMENT_STATUS } from '../data/schema.js'

/** The club's UPI ID, set at build time. Empty until the club supplies it. */
export const CLUB_UPI_ID = (import.meta.env.VITE_CLUB_UPI_ID ?? '').trim()

/**
 * The form only accepts submissions when it can really store them and the
 * payer can really pay: Firebase must be configured and the UPI ID known.
 * Otherwise it says so plainly instead of pretending to work.
 */
export const canRegisterOnline = isFirebaseConfigured && Boolean(CLUB_UPI_ID)

/**
 * A link that opens the phone's UPI app with the club already filled in as the
 * payee. The amount is left for the payer to type: the fee is shown beside it.
 */
export const upiPayLink = (note) =>
  `upi://pay?${new URLSearchParams({ pa: CLUB_UPI_ID, pn: 'VFC Arts, Sports & Welfare Club', cu: 'INR', tn: note })}`

export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024

// Left alone, Firebase keeps retrying a dead connection for minutes and an
// offline Firestore write never settles at all. Give up and say so instead.
const SEND_TIMEOUT_MS = 25000

const withTimeout = (promise) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('registration-timeout')), SEND_TIMEOUT_MS)),
  ])

/** Returns `{ field: errorKey }` for everything wrong; an empty object means valid. */
export function validateRegistration(values) {
  const errors = {}
  const phoneDigits = values.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')

  if (values.name.trim().length < 2) errors.name = 'required'
  if (!values.phone.trim()) errors.phone = 'required'
  else if (!/^[6-9]\d{9}$/.test(phoneDigits)) errors.phone = 'phone'
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'email'
  if (!values.category) errors.category = 'required'
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
 * Stores the payment screenshot, then the registration that points at it.
 *
 * Firestore and Storage are loaded only here, so visitors who never register
 * never download them. The screenshot's path is saved rather than a public
 * URL: the storage rules let anyone upload one but only club officers read it.
 */
export async function submitRegistration(eventId, values) {
  if (!canRegisterOnline) throw new Error('registration-not-configured')

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
    name: values.name.trim(),
    phone: values.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, ''),
    email: values.email.trim(),
    category: values.category,
    teamName: values.teamName.trim(),
    paymentRef: values.paymentRef.trim(),
    paymentScreenshotPath: screenshotPath,
    paymentStatus: PAYMENT_STATUS.pending,
    createdAt: serverTimestamp(),
  }))

  return registration.id
}
