import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import LanguageToggle from './LanguageToggle.jsx'

// Events is listed but not built yet - stage 2 owns that page.
const links = [
  { to: '/', key: 'home', end: true },
  { to: '/about', key: 'about' },
  { to: '/awards', key: 'awards' },
  { to: '/gallery', key: 'gallery' },
  { to: '/contact', key: 'contact' },
]

export default function Header() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    [
      'px-3 py-2 text-sm font-medium transition-colors',
      isActive ? 'bg-brand text-white' : 'text-ink/75 hover:bg-brand/10 hover:text-brand',
    ].join(' ')

  return (
    <header className="sticky top-0 z-50 border-b border-brand/10 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src="/logo/vfc-logo-purple.png"
            alt="VFC Arts, Sports & Welfare Club"
            className="h-11 w-auto"
            width="44"
            height="44"
          />
          <span className="hidden font-display text-sm font-bold leading-tight text-brand sm:block">
            VFC Arts, Sports
            <br />
            & Welfare Club
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {t(strings.nav[l.key])}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto md:ml-0">
          <LanguageToggle />
        </div>

        <button
          type="button"
          className="border border-brand/25 px-3 py-2 text-brand md:hidden"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <nav className="border-t border-brand/10 bg-sand px-5 py-3 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 text-base font-medium ${
                  isActive ? 'bg-brand text-white' : 'text-ink/80'
                }`
              }
            >
              {t(strings.nav[l.key])}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
