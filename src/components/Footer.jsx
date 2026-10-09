import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { CONTACT, SAMPLE_CONTENT } from '../data/placeholders.js'
import { gsap, useGsap } from '../lib/motion.js'
import Button from './Button.jsx'
import crestWhite from '../assets/vfc-crest-white.png'
import LanguageToggle from './LanguageToggle.jsx'
import Sample from './Sample.jsx'

const links = [
  { to: '/', key: 'home' },
  { to: '/about', key: 'about' },
  { to: '/awards', key: 'awards' },
  { to: '/gallery', key: 'gallery' },
  { to: '/contact', key: 'contact' },
]

/**
 * Three tidy bands: who the club is and how to reach it, then where to go and
 * the details, then the small print. The oversized mark sits behind it all.
 */
export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  const details = [
    { label: t(strings.contact.address), value: CONTACT.address },
    { label: t(strings.contact.phone), value: CONTACT.phone },
    { label: t(strings.contact.email), value: CONTACT.email },
  ]

  // The oversized club mark rises into place as the page runs out.
  const ref = useGsap(() => {
    gsap.from('.footer-mark', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
  })

  return (
    <footer ref={ref} className="relative overflow-hidden bg-brand-deep text-white">
      <p
        aria-hidden="true"
        className="footer-mark pointer-events-none absolute -bottom-[5.5vw] right-[2vw] select-none font-display text-[24vw] font-extrabold leading-none tracking-[-0.03em] text-white/[0.05] will-change-transform"
      >
        VFC
      </p>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 py-12 sm:py-14">
          <Link to="/" className="flex items-center gap-4 rounded-control">
            <img src={crestWhite} alt="" aria-hidden="true" className="h-16 w-auto" />
            <span>
              <span className="block font-display text-xl font-bold leading-tight">
                VFC Arts, Sports
                <br />& Welfare Club
              </span>
              <span className="mt-1.5 block text-sm text-gold">{t(strings.home.heroTagline)}</span>
            </span>
          </Link>
          <Button to="/contact" variant="gold">
            {t(strings.contact.heading)}
          </Button>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-[1fr_2fr] md:gap-16">
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-white/75 sm:max-w-xs">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-grow transition-colors hover:text-white">
                    {t(strings.nav[l.key])}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <dl className="grid gap-x-8 gap-y-6 text-sm sm:grid-cols-3">
            {details.map((row) => (
              <div key={row.label}>
                <dt className="text-white/50">{row.label}</dt>
                <dd className="mt-1.5 break-words font-medium text-white/90">
                  <Sample>{row.value}</Sample>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-white/10 py-5 text-xs text-white/60">
          <span>{t(strings.footer.rights, { year })}</span>
          <LanguageToggle onDark />
          {/* Shown for as long as the site is running on sample content. */}
          {SAMPLE_CONTENT && (
            <span className="basis-full text-gold">
              Sample content: photos, figures, awards and contact details are placeholders.
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}
