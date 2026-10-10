/**
 * Firestore collection shapes, transcribed from the spec's data model.
 * Documentation + a shared source of field names for stage 2; nothing here
 * touches Firestore yet.
 */

export const COLLECTIONS = {
  events: 'events',
  registrations: 'registrations',
  awards: 'awards',
  gallery: 'gallery',
  // admins/{uid}: one empty document per club officer, added in the Firebase
  // console. Its existence is what lets that account read registrations.
  admins: 'admins',
}

export const EVENT_STATUS = {
  upcoming: 'upcoming',
  open: 'open',
  closed: 'closed',
}

export const PAYMENT_STATUS = {
  pending: 'pending',
  verified: 'verified',
}

/** events/{id} */
export const eventFields = [
  'title_en',
  'title_ml',
  'description_en',
  'description_ml',
  'date',
  'location',
  'category',
  'status', // upcoming | open | closed
  'coverImage',
  'createdAt',
]

/** registrations/{id} - single-language by design; names and phones aren't translated. */
export const registrationFields = [
  'eventId',
  'name',
  'phone',
  'email',
  'category',
  'teamName', // optional
  'paymentRef',
  'paymentScreenshotPath', // Storage path, not a public URL: only officers may read it
  'paymentStatus', // pending | verified
  'createdAt',
]

/** awards/{id} */
export const awardFields = [
  'title_en',
  'title_ml',
  'year',
  'imageUrl',
  'description_en',
  'description_ml',
]

/** gallery/{id} */
export const galleryFields = [
  'imageUrl',
  'caption_en',
  'caption_ml',
  'eventId', // optional
  'category',
]
