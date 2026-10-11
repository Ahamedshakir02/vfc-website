import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { useContent } from '../lib/content.jsx'
import Button from './Button.jsx'
import crestWhite from '../assets/vfc-crest-white.png'
import crestPurple from '../assets/vfc-crest-purple.png'
import LanguageToggle from './LanguageToggle.jsx'

const links = [
  { to: '/', key: 'home', end: true },
  { to: '/events', key: 'events' },
  { to: '/about', key: 'about' },
  { to: '/awards', key: 'awards' },
  { to: '/gallery', key: 'gallery' },
]
// Contact lives in the phone menu and the footer; the bar keeps its one
// button for the thing people come to do.
const contact = { to: '/contact', key: 'contact' }

/**
 * A single floating bar. Every page opens on a purple field, so it starts
 * clear with white lettering; once the page has moved it becomes a solid,
 * rounded strip, and it steps out of the way while you scroll down.
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

  // While an event is taking registrations the bar's button goes straight to it.
  const { openEvent } = useContent()
  const action = openEvent
    ? { to: `/events/${openEvent.id}`, label: t(strings.actions.registerNow) }
    : { to: contact.to, label: t(strings.nav[contact.key]) }

  // The current page sits on a soft tab; the rest brighten on hover.
  const linkClass = ({ isActive }) =>
    [
      'rounded-control px-3 py-1.5 text-sm font-medium transition-colors duration-300',
      light
        ? isActive
          ? 'bg-white/15 text-white'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
        : isActive
          ? 'bg-brand/10 text-brand'
          : 'text-ink/75 hover:bg-brand/5 hover:text-brand',
    ].join(' ')

  return (
    <>
      <header
        className={[
          'fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-300 will-change-transform',
          // Keyboard focus inside the header brings it back into view. Mouse
          // clicks don't count, or it would never hide again after a click.
          hidden && !open ? '-translate-y-[130%] has-[:focus-visible]:translate-y-0' : 'translate-y-0',
        ].join(' ')}
      >
        {/* Narrower than the page column by its own padding, so the crest lines up with the content below. */}
        <div
          className={[
            'mx-auto flex max-w-[calc(72rem-1.5rem)] items-center gap-3 rounded-tile border py-2 pl-2 pr-2 transition-colors duration-300 sm:pl-5 sm:pr-3',
            light ? 'border-transparent bg-transparent' : 'border-brand/10 bg-sand',
          ].join(' ')}
        >
          <Link to="/" className="flex items-center gap-3 rounded-control">
            <span className="relative block h-11 w-8">
              <img
                src={crestPurple}
                alt="VFC Arts, Sports & Welfare Club"
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${light ? 'opacity-0' : 'opacity-100'}`}
              />
              <img
                src={crestWhite}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${light ? 'opacity-100' : 'opacity-0'}`}
              />
            </span>
            <span
              className={`hidden font-display text-sm font-bold leading-tight transition-colors duration-300 lg:block ${light ? 'text-white' : 'text-brand'}`}
            >
              VFC Arts, Sports
              <br />& Welfare Club
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {t(strings.nav[l.key])}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <LanguageToggle onDark={light} />
            {/* Phones reach this from the menu sheet and the page itself. */}
            <span className="hidden md:block">
              <Button to={action.to} variant="gold" size="sm">
                {action.label}
              </Button>
            </span>
          </div>

          <button
            type="button"
            className="relative h-10 w-10 shrink-0 rounded-control md:hidden"
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
                  'absolute left-2 right-2 h-0.5 rounded-full transition-[transform,top,background-color] duration-300',
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
        {[...links, contact].map((l, i) => (
          <span key={l.to} className="block overflow-hidden border-b border-white/10 py-2">
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
        <p
          style={{ transitionDelay: open ? '520ms' : '0ms' }}
          className={`mt-8 text-sm text-white/60 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
        >
          {t(strings.home.heroTagline)}
        </p>
      </nav>
    </>
  )
}
