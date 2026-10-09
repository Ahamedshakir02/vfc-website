import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { CONTACT, SAMPLE_CONTENT } from '../data/placeholders.js'
import { gsap, useGsap } from '../lib/motion.js'
import Sample from './Sample.jsx'

const links = [
  { to: '/about', key: 'about' },
  { to: '/awards', key: 'awards' },
  { to: '/gallery', key: 'gallery' },
  { to: '/contact', key: 'contact' },
]

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  // The oversized club mark rises into place as the page runs out.
  const ref = useGsap(() => {
    gsap.from('.footer-mark', {
      yPercent: 45,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
  })

  return (
    <footer ref={ref} className="relative overflow-hidden bg-brand-deep text-white">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pb-10 pt-16 sm:px-8 md:grid-cols-3">
        <div>
          <img
            src="/logo/vfc-crest-white.png"
            alt="VFC Arts, Sports & Welfare Club"
            className="h-16 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-white/70">{t(strings.home.heroTagline)}</p>
        </div>

        <nav className="text-sm">
          <h3 className="mb-3 font-semibold text-gold">{t(strings.nav.home)}</h3>
          <ul className="space-y-2 text-white/75">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-grow transition-colors hover:text-white">
                  {t(strings.nav[l.key])}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <h3 className="mb-3 font-semibold text-gold">{t(strings.contact.heading)}</h3>
          <dl className="space-y-2 text-white/75">
            <div>
              <dt className="sr-only">{t(strings.contact.phone)}</dt>
              <dd><Sample>{CONTACT.phone}</Sample></dd>
            </div>
            <div>
              <dt className="sr-only">{t(strings.contact.email)}</dt>
              <dd><Sample>{CONTACT.email}</Sample></dd>
            </div>
          </dl>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="footer-mark pointer-events-none -mb-[4vw] select-none will-change-transform px-4 font-display text-[36vw] font-extrabold leading-[0.74] tracking-[-0.03em] text-white/[0.06] sm:px-8"
      >
        VFC
      </p>

      <div className="relative z-10 border-t border-white/10 bg-brand-deep px-5 py-5 text-xs text-white/60 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-8 gap-y-2">
          <span>{t(strings.footer.rights, { year })}</span>
          {/* Shown for as long as the site is running on sample content. */}
          {SAMPLE_CONTENT && (
            <span className="text-gold">
              Sample content: photos, figures, awards and contact details are placeholders.
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}
