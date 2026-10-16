import { contactHref } from '../lib/format.js'

/**
 * A line of the club's contact details. Once officers have marked them real,
 * the phone number dials and the email address opens a new message.
 */
export default function ContactValue({ row, live, className = '' }) {
  const href = live ? contactHref(row.kind, row.value) : null
  return href ? (
    <a href={href} className={className}>
      {row.value}
    </a>
  ) : (
    row.value
  )
}
