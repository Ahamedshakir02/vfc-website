import { Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import PageTransition from './components/PageTransition.jsx'
import SmoothScroll from './lib/SmoothScroll.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Awards from './pages/Awards.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {/* Owns the routes: it holds the old page on screen until the curtain covers it. */}
          <PageTransition>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            {/* TODO (stage 2): /events and /events/:id with the registration form. */}
            <Route path="*" element={<NotFound />} />
          </PageTransition>
        </main>
        <Footer />
        <ScrollProgress />
        <Cursor />
      </div>
    </SmoothScroll>
  )
}
