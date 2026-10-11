/**
 * Firestore collection names and shapes: the one place field names are agreed.
 *
 * Text shown on the site in both languages is stored as a pair, `{ en, ml }`,
 * which is what the language helper `t()` takes. Malayalam may be left empty;
 * the English then shows in both.
 */

export const COLLECTIONS = {
  events: 'events',
  registrations: 'registrations',
  awards: 'awards',
  gallery: 'gallery',
  // settings/site: contact details, impact figures and how the club is paid.
  settings: 'settings',
  // admins/{uid}: one empty document per club officer, added in the Firebase
  // console. Its existence is what lets that account use /admin.
  admins: 'admins',
  // orders/{gatewayOrderId}: online payments in progress. Written and read by
  // the Cloud Functions only (functions/index.js); no browser can touch it.
  orders: 'orders',
}

export const SITE_SETTINGS = 'site'

export const EVENT_STATUS = {
  upcoming: 'upcoming',
  open: 'open',
  closed: 'closed',
}

export const PAYMENT_STATUS = {
  pending: 'pending',
  verified: 'verified',
}

export const PAYMENT_METHOD = {
  upi: 'upi', // paid in the visitor's own UPI app; an officer checks the screenshot
  online: 'online', // paid through the gateway; recorded by a Cloud Function, already verified
}

export const CONTENT_CATEGORIES = ['sports', 'arts', 'welfare']

/** events/{id} */
export const eventFields = [
  'title', // { en, ml }
  'description', // { en, ml }
  'category', // sports | arts | welfare
  'status', // upcoming | open | closed
  'startsOn', // 'YYYY-MM-DD' or null
  'closesOn', // 'YYYY-MM-DD' or null: the last day to register
  'venue', // text or null
  'fee', // whole rupees, or null while it is not decided
  'categories', // [{ id, label: { en, ml } }]: what a registrant chooses between
  'image', // key of a built-in illustration (src/data/illustrations.js)
  'coverUrl', // an uploaded photo, used instead of `image` when present
  'coverPath', // where that photo sits in Storage, so it can be removed
  'sample', // true while the entry is placeholder content
  'createdAt',
]

/** registrations/{id}: single-language by design; names and phones aren't translated. */
export const registrationFields = [
  'eventId',
  'name',
  'phone',
  'email',
  'category',
  'teamName', // optional
  'paymentMethod', // upi | online (absent on the earliest entries, which were all UPI)
  'paymentRef', // the UPI reference typed by the registrant, or the gateway's payment id
  'paymentScreenshotPath', // UPI only. A Storage path, not a public URL: only officers may read it
  'paymentStatus', // pending | verified
  'createdAt',
]

/** awards/{id} */
export const awardFields = ['title', 'description', 'year', 'imageUrl', 'imagePath', 'sample', 'createdAt']

/** gallery/{id} */
export const galleryFields = ['imageUrl', 'imagePath', 'caption', 'category', 'sample', 'createdAt']

/** settings/site */
export const siteFields = [
  'contact', // { address, phone, email, mapsUrl, instagram, facebook, whatsapp }
  'contactSample', // true while those are placeholders
  'stats', // [{ key: members | events | awards, value, suffix }]
  'statsSample',
  'upiId', // where UPI payments are sent
  'payOnline', // offer the payment gateway on the registration form
  'sampleNotice', // show the "sample content" line in the footer
]
