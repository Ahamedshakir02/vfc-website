/**
 * SAMPLE CONTENT — nothing in this file is a real fact about the club unless
 * a comment says so.
 *
 * The club has not yet supplied its numbers, award records, photos or contact
 * details, so these values stand in for them and let the design be judged as
 * it will look. Each one renders through <Sample>, and while SAMPLE_CONTENT is
 * true the footer carries a notice saying so.
 *
 * To go live: replace the values below with the real ones, drop the <Sample>
 * wrapper at each call site, then set SAMPLE_CONTENT to false.
 *
 * Still outstanding per the spec + copy doc:
 *   - real impact numbers (members / events / awards)
 *   - founding story
 *   - award records and dates
 *   - event photos and captions
 *   - full address, phone, email, social links
 */
export const SAMPLE_CONTENT = true

/** Home impact stats. Invented round figures, not the club's counts. */
export const IMPACT_STATS = [
  { key: 'members', value: 120, suffix: '+' },
  { key: 'events', value: 45, suffix: '+' },
  { key: 'awards', value: 18, suffix: '' },
]

/**
 * Contact details. The locality is real (spec: Vellalur, Palakkad); the street
 * address is still missing. Phone and email are deliberately unusable.
 */
export const CONTACT = {
  address: 'Vellalur, Palakkad, Kerala',
  phone: '+91 00000 00000',
  email: 'club@example.com',
  socials: ['Instagram', 'Facebook', 'WhatsApp'],
  mapsUrl: null, // TODO: [Google Maps link once the address is confirmed]
}

/**
 * Award slots, shaped like the `awards` collection in src/data/schema.js.
 * Titles, years and descriptions are invented examples.
 */
export const AWARD_PLACEHOLDERS = [
  {
    id: 'award-1',
    year: '2024',
    title: 'District league winners',
    description: 'Sample entry. The club’s real honours go here once the record arrives.',
  },
  {
    id: 'award-2',
    year: '2022',
    title: 'Fair play award',
    description: 'Sample entry. Replace with what the award was for.',
  },
  {
    id: 'award-3',
    year: '2019',
    title: 'Community service recognition',
    description: 'Sample entry. Replace with what the award was for.',
  },
  {
    id: 'award-4',
    year: '2015',
    title: 'Best organised tournament',
    description: 'Sample entry. Replace with what the award was for.',
  },
]

/*
  Gallery slots, shaped like the `gallery` collection. Each holds one of the
  collage illustrations (see src/data/illustrations.js) and a category taken
  from the club's name; the caption shown on the tile is that category in the
  active language. The illustrations are artwork, not photos of club events:
  real photographs replace them here as they arrive.
*/
const IMAGES = ['volleyball', 'drummers', 'badminton', 'cricket', 'community', 'runner', 'dancer', 'footballer', 'trophy']
const CATEGORIES = ['sports', 'arts', 'sports', 'sports', 'welfare', 'sports', 'arts', 'sports', 'sports']

export const GALLERY_PLACEHOLDERS = IMAGES.map((image, i) => ({
  id: `photo-${i + 1}`,
  image,
  category: CATEGORIES[i],
}))
