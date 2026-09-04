import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'

export default function NotFound() {
  const { t } = useLang()
  return (
    <Section tone="white" heading="404">
      <p className="text-ink/70">This page doesn't exist yet.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white"
      >
        {t(strings.nav.home)}
      </Link>
    </Section>
  )
}
