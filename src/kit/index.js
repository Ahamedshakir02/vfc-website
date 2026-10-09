/*
  The site's components as a library, for use outside the site itself (this is
  what gets synced to Claude Design). The site does not import from here.
  Build with `npm run build:kit`; types are hand-written in index.d.ts because
  the components are plain JSX.
*/
import './kit.css'

export { default as VfcProvider } from './VfcProvider.jsx'

export { default as Ball } from '../components/Ball.jsx'
export { default as Button } from '../components/Button.jsx'
export { default as Crest } from '../components/Crest.jsx'
export { default as Cut } from '../components/Cut.jsx'
export { default as Footer } from '../components/Footer.jsx'
export { default as Header } from '../components/Header.jsx'
export { default as LanguageToggle } from '../components/LanguageToggle.jsx'
export { default as Marquee } from '../components/Marquee.jsx'
export { default as PageHero } from '../components/PageHero.jsx'
export { default as PageTransition } from '../components/PageTransition.jsx'
export { default as PhotoPlaceholder } from '../components/PhotoPlaceholder.jsx'
export { default as PlaceholderArt } from '../components/PlaceholderArt.jsx'
export { default as Sample } from '../components/Sample.jsx'
export { default as ScrollProgress } from '../components/ScrollProgress.jsx'
export { default as Section } from '../components/Section.jsx'
export { default as Reveal } from '../components/motion/Reveal.jsx'
export { default as Words } from '../components/motion/Words.jsx'

// PageTransition takes <Route> children, and they must come from the same
// router instance the kit bundles.
export { Route } from 'react-router-dom'
