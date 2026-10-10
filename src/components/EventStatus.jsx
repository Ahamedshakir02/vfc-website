import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { EVENT_STATUS } from '../data/schema.js'

// Open is the one status that gets the gold: it is the thing to act on.
const onLight = {
  [EVENT_STATUS.open]: 'bg-gold text-brand-deep',
  [EVENT_STATUS.upcoming]: 'bg-brand/10 text-brand-deep',
  [EVENT_STATUS.closed]: 'border border-brand/25 text-ink/65',
}
const quietOnDark = 'border border-white/40 bg-white/15 text-white'

/** Pass `onDark` when the tag sits on a purple surface. */
export default function EventStatus({ status, onDark = false }) {
  const { t } = useLang()
  const look = onDark && status !== EVENT_STATUS.open ? quietOnDark : onLight[status]

  return (
    <span className={`inline-block rounded-control px-3 py-1.5 text-[0.8125rem] font-semibold ${look}`}>
      {t(strings.status[status])}
    </span>
  )
}
