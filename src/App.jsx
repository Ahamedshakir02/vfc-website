import { lazy, Suspense } from 'react'
import { Route, useLocation } from 'react-router-dom'
import { useLang } from './i18n/LanguageContext.jsx'
import { strings } from './i18n/strings.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import PageTransition from './components/PageTransition.jsx'
import ScrollSync from './lib/ScrollSync.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Awards from './pages/Awards.jsx'
import Events from './pages/Events.jsx'
import EventPage from './pages/EventPage.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

// Fetched only at /admin, so visitors never download the officers' screens or Firebase Auth.
const Admin = lazy(() => import('./pages/Admin.jsx'))

export default function App() {
  const { t } = useLang()
  const { pathname } = useLocation()

  // The club's own screens stand apart from the public site: no header, footer or curtain.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    )
  }

  return (
    <ScrollSync>
      <div className="flex min-h-screen flex-col">
        {/* First stop for keyboard users: jump past the navigation. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-deep"
        >
          {t(strings.actions.skipToContent)}
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {/* Owns the routes: it holds the old page on screen until the curtain covers it. */}
          <PageTransition>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </PageTransition>
        </main>
        <Footer />
        <ScrollProgress />
      </div>
    </ScrollSync>
  )
}
