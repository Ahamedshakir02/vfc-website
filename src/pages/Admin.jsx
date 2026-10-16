import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import SignIn from '../components/admin/SignIn.jsx'
import Registrations from '../components/admin/Registrations.jsx'
import Events from '../components/admin/Events.jsx'
import Gallery from '../components/admin/Gallery.jsx'
import Awards from '../components/admin/Awards.jsx'
import Club from '../components/admin/Club.jsx'
import { ROLE, canUseAdmin, signOutOfficer, watchSession } from '../lib/admin.js'
import { usePageTitle } from '../lib/usePageTitle.js'
import crestWhite from '../assets/vfc-crest-white.png'

const sideButton =
  'inline-flex h-11 items-center justify-center rounded-control border border-white/30 px-4 text-sm font-medium text-white transition-colors hover:bg-white hover:text-brand-deep'

const SCREENS = [
  { to: '/admin', name: 'Registrations', end: true },
  { to: '/admin/events', name: 'Events' },
  { to: '/admin/gallery', name: 'Gallery' },
  { to: '/admin/awards', name: 'Awards' },
  { to: '/admin/club', name: 'Club details' },
]

// Why the officers list could not be read, by Firestore error code.
const ACCESS_PROBLEMS = {
  unavailable: 'Check your connection, then reload the page.',
  'permission-denied':
    "Firestore turned the request down. The club's security rules are probably not published yet: run firebase deploy --only firestore:rules,storage, then reload.",
  'not-found': 'This Firebase project has no Firestore database yet. Create one in the Firebase console, then reload.',
  'failed-precondition': 'This Firebase project has no Firestore database yet. Create one in the Firebase console, then reload.',
}

/** Everything short of the working screen: one white panel on the club's purple. */
function Gate({ children }) {
  return (
    <div lang="en" className="flex min-h-screen flex-col items-center justify-center gap-8 bg-brand-deep px-5 py-12">
      <img src={crestWhite} alt="VFC Arts, Sports & Welfare Club" className="h-20 w-auto" />
      <div className="w-full max-w-md rounded-tile bg-white p-7 text-ink sm:p-9">{children}</div>
      <Link to="/" className="inline-flex min-h-11 items-center text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline">
        Back to the site
      </Link>
    </div>
  )
}

/**
 * The club's side of the site, at /admin: sign in, then check registrations
 * and edit what the site shows (events, gallery, awards, the club's details).
 *
 * In English only, for a handful of officers. Signing in proves who someone
 * is; what they may see is decided by the Firestore and Storage rules, not by
 * anything on this page.
 */
export default function Admin() {
  usePageTitle('Admin')
  const [session, setSession] = useState(null) // null until Firebase says who is here

  // The public pages lift the first-paint cover with their curtain; here it just goes.
  useLayoutEffect(() => {
    document.getElementById('boot')?.remove()
  }, [])

  // Keep the officers' screen out of search results.
  useEffect(() => {
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.append(robots)
    return () => robots.remove()
  }, [])

  useEffect(() => (canUseAdmin ? watchSession(setSession) : undefined), [])

  if (!canUseAdmin) {
    return (
      <Gate>
        <h1 className="text-4xl font-extrabold text-brand">Not set up yet</h1>
        <p className="mt-3 text-ink/80">
          This site is not connected to Firebase, so there is nothing to sign in to. Add the VITE_FIREBASE_ values
          where the site is built (on Vercel: Settings, Environment Variables; on a computer: .env.local), then build
          it again.
        </p>
      </Gate>
    )
  }

  if (!session) {
    return (
      <Gate>
        <p role="status" className="text-ink/65">
          Checking who is signed in…
        </p>
      </Gate>
    )
  }

  if (!session.user) {
    return (
      <Gate>
        <SignIn />
      </Gate>
    )
  }

  if (session.role !== ROLE.officer) {
    return (
      <Gate>
        {session.role === ROLE.unknown ? (
          <>
            <h1 className="text-4xl font-extrabold text-brand">Could not check your access</h1>
            <p className="mt-3 text-ink/80">{ACCESS_PROBLEMS[session.problem] ?? ACCESS_PROBLEMS.unavailable}</p>
            {session.problem && session.problem !== 'unavailable' && (
              <p className="mt-3 font-mono text-sm text-ink/65">{session.problem}</p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold text-brand">Not an officer account</h1>
            <p className="mt-3 text-ink/80">
              {session.user.email} is signed in, but it has not been given access to the club's screens. Whoever looks
              after the club's Firebase project can add it, using this account ID:
            </p>
            <p className="mt-3 break-all rounded-control bg-sand p-3 font-mono text-sm">{session.user.uid}</p>
          </>
        )}
        <button
          type="button"
          onClick={signOutOfficer}
          className="mt-6 h-11 rounded-control border border-brand/35 px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          Sign out
        </button>
      </Gate>
    )
  }

  return (
    <div lang="en" className="min-h-screen bg-sand md:flex">
      {/* A strip across the top on a phone, a column down the side from a tablet up. */}
      <aside className="flex flex-wrap items-center gap-x-6 gap-y-4 bg-brand-deep px-5 py-4 text-white md:sticky md:top-0 md:h-screen md:w-60 md:flex-none md:flex-col md:flex-nowrap md:items-stretch md:gap-7 md:py-7">
        <div className="flex items-center gap-3">
          <img src={crestWhite} alt="" className="h-[2.625rem] w-auto" />
          <div>
            <div className="font-display text-lg font-bold leading-tight">VFC Club</div>
            <div className="text-[0.8125rem] text-white/75">Admin</div>
          </div>
        </div>

        {/* Scrolls sideways on a phone rather than pushing the page down. */}
        <nav aria-label="Admin" className="order-last -mx-5 flex basis-full gap-1 overflow-x-auto px-5 md:order-none md:mx-0 md:basis-auto md:flex-col md:overflow-visible md:px-0">
          {SCREENS.map((screen) => (
            <NavLink
              key={screen.to}
              to={screen.to}
              end={screen.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-control px-3.5 py-3 font-semibold transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {screen.name}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex flex-wrap items-center gap-2 md:ml-0 md:mt-auto md:flex-col md:items-stretch">
          <p className="hidden break-all text-[0.8125rem] text-white/75 md:block">{session.user.email}</p>
          <button type="button" onClick={signOutOfficer} className={sideButton}>
            Sign out
          </button>
          <Link to="/" className={sideButton}>
            View the site
          </Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 pb-16 pt-8 sm:px-10 sm:pt-10">
        <Routes>
          <Route path="/admin" element={<Registrations />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/gallery" element={<Gallery />} />
          <Route path="/admin/awards" element={<Awards />} />
          <Route path="/admin/club" element={<Club />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}
