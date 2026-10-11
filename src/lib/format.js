import { ILLUSTRATIONS } from '../data/illustrations.js'

/** Whole rupees as the site shows them: 500 becomes "₹500". Null stays null. */
export const formatFee = (fee) => (typeof fee === 'number' && fee > 0 ? `₹${fee.toLocaleString('en-IN')}` : null)

/** A stored 'YYYY-MM-DD' in the reader's language: "14 December 2026". Null stays null. */
export function formatDate(iso, lang = 'en') {
  if (!iso) return null
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(lang === 'ml' ? 'ml-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** An event's picture: the photo an officer uploaded, else its built-in illustration. */
export const eventImage = (event) => event.coverUrl || ILLUSTRATIONS[event.image] || ILLUSTRATIONS.athlete

/** True where a value on an otherwise real event is still a placeholder. */
export const isSampleField = (event, field) => Boolean(event.sample || event.sampleFields?.includes(field))
