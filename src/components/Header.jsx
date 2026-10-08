import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { getLenis } from '../lib/SmoothScroll.jsx'
import LanguageToggle from './LanguageToggle.jsx'

// Events is listed but not built yet - stage 2 owns that page.
const links = [
  { to: '/', key: 'home', end: true },
  { to: '/about', key: 'about' },
  { to: '/awards', key: 'awards' },
  { to: '/gallery', key: 'gallery' },
  { to: '/contact', key: 'contact' },
]

/**
 * Every page opens on a purple field, so the header starts clear and white on
 * top of it, turns solid once the page has moved, and steps out of the way
 * while you scroll down.
 */
export default function Header() {
  const { t } = useLang()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 24)
      setHidden(y > 480 && y > last)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The menu closes on navigation and holds the page still while it is open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const lenis = getLenis()
    if (open) lenis?.stop()
    else lenis?.start()
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const light = !solid || open

  const linkClass = ({ isActive }) =>
    [
      'link-grow px-1 py-1 text-sm font-medium transition-colors duration-300',
      light ? 'text-white' : 'text-ink',
      isActive ? '[background-size:100%_2px]' : 'opacity-80 hover:opacity-100',
    ].join(' ')

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
          light ? 'border-b border-transparent bg-transparent' : 'border-b border-brand/10 bg-sand/90 backdrop-blur',
        ].join(' ')}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="relative block h-11 w-8">
              <img
                src="/logo/vfc-crest-purple.png"
                alt="VFC Arts, Sports & Welfare Club"
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${light ? 'opacity-0' : 'opacity-100'}`}
              />
              <img
                src="/logo/vfc-crest-white.png"
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${light ? 'opacity-100' : 'opacity-0'}`}
              />
            </span>
            <span
              className={`hidden font-display text-sm font-bold leading-tight transition-colors duration-300 sm:block ${light ? 'text-white' : 'text-brand'}`}
            >
              VFC Arts, Sports
              <br />& Welfare Club
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {t(strings.nav[l.key])}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto md:ml-2">
            <LanguageToggle onDark={light} />
          </div>

          <button
            type="button"
            className="relative h-10 w-10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                aria-hidden="true"
                className={[
                  'absolute left-2 right-2 h-0.5 transition-[transform,top,background-color] duration-300',
                  light ? 'bg-white' : 'bg-brand',
                  open ? 'top-[19px]' : i === 0 ? 'top-[15px]' : 'top-[23px]',
                  open ? (i === 0 ? 'rotate-45' : '-rotate-45') : '',
                ].join(' ')}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile menu: a full purple sheet that drops in, links following one by one. */}
      <nav
        id="mobile-menu"
        inert={open ? undefined : ''}
        className={[
          'fixed inset-0 z-40 flex flex-col justify-center bg-brand-deep px-6 md:hidden',
          'transition-[clip-path,visibility] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]',
          open
            ? 'visible [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]'
            : 'invisible [clip-path:polygon(0_0,100%_0,100%_0,0_0)]',
        ].join(' ')}
      >
        {links.map((l, i) => (
          <span key={l.to} className="block overflow-hidden py-1">
            <NavLink
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${160 + i * 60}ms` : '0ms' }}
              className={({ isActive }) =>
                [
                  'block font-display text-[clamp(1.6rem,8vw,2.25rem)] font-bold leading-snug transition-transform duration-500 ease-out',
                  open ? 'translate-y-0' : 'translate-y-full',
                  isActive ? 'text-gold' : 'text-white',
                ].join(' ')
              }
            >
              {t(strings.nav[l.key])}
            </NavLink>
          </span>
        ))}
      </nav>
    </>
  )
}
