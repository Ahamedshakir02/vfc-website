import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { CONTACT } from '../data/placeholders.js'
import Todo from './Todo.jsx'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <img
            src="/logo/vfc-logo-white.png"
            alt="VFC Arts, Sports & Welfare Club"
            className="h-14 w-auto"
            width="56"
            height="56"
          />
          <p className="mt-4 max-w-xs text-sm text-white/70">{t(strings.home.heroTagline)}</p>
        </div>

        <nav className="text-sm">
          <h3 className="mb-3 font-display font-semibold text-gold">{t(strings.nav.home)}</h3>
          <ul className="space-y-2 text-white/75">
            <li><Link to="/about" className="hover:text-white">{t(strings.nav.about)}</Link></li>
            <li><Link to="/awards" className="hover:text-white">{t(strings.nav.awards)}</Link></li>
            <li><Link to="/gallery" className="hover:text-white">{t(strings.nav.gallery)}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t(strings.nav.contact)}</Link></li>
          </ul>
        </nav>

        <div className="text-sm">
          <h3 className="mb-3 font-display font-semibold text-gold">{t(strings.contact.heading)}</h3>
          <dl className="space-y-2 text-white/75">
            <div>
              <dt className="sr-only">{t(strings.contact.phone)}</dt>
              <dd><Todo>{CONTACT.phone}</Todo></dd>
            </div>
            <div>
              <dt className="sr-only">{t(strings.contact.email)}</dt>
              <dd><Todo>{CONTACT.email}</Todo></dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/60 sm:px-8">
        {t(strings.footer.rights, { year })}
      </div>
    </footer>
  )
}
