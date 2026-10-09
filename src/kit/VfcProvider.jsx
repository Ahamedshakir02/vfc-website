import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '../i18n/LanguageContext.jsx'
import { setMotion } from '../lib/motion.js'

/**
 * Everything the components expect from the site around them: a router (for
 * links and the active page), the language, and the motion switch.
 *
 * Wrap anything built from the kit in this once, at the top. Without it,
 * Header, Footer, Button links, LanguageToggle and PageTransition throw,
 * because they read the router and the language from context.
 */
export default function VfcProvider({ lang = 'en', path = '/', motion = true, children }) {
  // Set during render so it is in place before any child's layout effect runs.
  setMotion(motion)

  return (
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
    </MemoryRouter>
  )
}
