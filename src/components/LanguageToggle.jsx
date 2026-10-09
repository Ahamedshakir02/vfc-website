import { useLang } from '../i18n/LanguageContext.jsx'
import { LANGUAGES } from '../i18n/strings.js'

export default function LanguageToggle({ onDark = false }) {
  const { lang, setLang } = useLang()

  const base = onDark
    ? 'border-white/30 text-white/80 hover:text-white'
    : 'border-brand/25 text-brand hover:text-brand-deep'
  const active = onDark ? 'bg-white text-brand' : 'bg-brand text-white'

  return (
    <div className={`inline-flex overflow-hidden rounded-control border ${base}`} role="group" aria-label="Language">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`px-3 py-1 text-sm transition-colors ${lang === l.code ? active : ''}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
