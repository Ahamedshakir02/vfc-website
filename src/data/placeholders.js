/**
 * TODO — every value in this file is a placeholder waiting on the client.
 *
 * These are NOT invented facts: each one is a labelled blank that renders
 * through <Todo> so it shows up on the page as an obvious flag. Replace with
 * real values (and delete the TODO wrapper at the call site) as they arrive.
 *
 * Still outstanding per the spec + copy doc:
 *   - real impact numbers (members / events / awards)
 *   - founding story, year, area
 *   - award records and dates
 *   - event photos
 *   - address, phone, email
 */

/** Home impact stats — copy doc explicitly says do not invent these numbers. */
export const IMPACT_STATS = [
  { key: 'members', value: 'TODO: [X]' },
  { key: 'events', value: 'TODO: [X]' },
  { key: 'awards', value: 'TODO: [X]' },
]

/** Contact details — all three still unknown. */
export const CONTACT = {
  address: 'TODO: [club address]',
  phone: 'TODO: [phone number]',
  email: 'TODO: [email address]',
  mapsUrl: null, // TODO: [Google Maps link once the address is confirmed]
}

/**
 * Award slots. Records and dates not handed over yet, so these carry no real
 * content — just enough structure to lay the page out. Shape matches the
 * `awards` collection in src/data/schema.js.
 */
export const AWARD_PLACEHOLDERS = [
  { id: 'award-1', year: 'TODO: [year]', title: 'TODO: [award title]', description: 'TODO: [what this award was for]' },
  { id: 'award-2', year: 'TODO: [year]', title: 'TODO: [award title]', description: 'TODO: [what this award was for]' },
  { id: 'award-3', year: 'TODO: [year]', title: 'TODO: [award title]', description: 'TODO: [what this award was for]' },
  { id: 'award-4', year: 'TODO: [year]', title: 'TODO: [award title]', description: 'TODO: [what this award was for]' },
]

/** Gallery slots — photos pending handover. Shape matches the `gallery` collection. */
export const GALLERY_PLACEHOLDERS = Array.from({ length: 9 }, (_, i) => ({
  id: `photo-${i + 1}`,
  caption: `TODO: [photo ${i + 1} — caption]`,
  category: 'TODO: [category]',
}))
