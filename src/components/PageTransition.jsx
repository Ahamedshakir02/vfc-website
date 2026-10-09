import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Routes, useLocation } from 'react-router-dom'
import { gsap, ScrollTrigger, markBooted, prefersReducedMotion } from '../lib/motion.js'
import { scrollToTop } from '../lib/ScrollSync.jsx'
import crestWhite from '../assets/vfc-crest-white.png'

/**
 * Loader and route curtain in one: a purple sheet with the same diagonal edge
 * as the hero. It lifts once on the first visit, then sweeps across on every
 * navigation while the next page swaps in behind it.
 */
export default function PageTransition({ children }) {
  const location = useLocation()
  const [shown, setShown] = useState(location)
  const curtain = useRef(null)
  const line = useRef(null)
  // True from the moment a route curtain starts until it has fully cleared.
  const inFlight = useRef(false)

  // First visit: take over from the static boot screen in index.html.
  useLayoutEffect(() => {
    document.getElementById('boot')?.remove()

    if (prefersReducedMotion()) {
      gsap.set(curtain.current, { yPercent: -125 })
      markBooted()
      return undefined
    }

    const tl = gsap.timeline({ onComplete: markBooted })
    tl.fromTo(line.current, { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: 'power2.inOut' })
      .to(line.current, { opacity: 0, duration: 0.2 }, 0.55)
      .fromTo(
        curtain.current,
        { yPercent: 0 },
        { yPercent: -125, duration: 0.8, ease: 'expo.inOut' },
        0.55,
      )
    return () => tl.kill()
  }, [])

  // Navigation: cover, swap the page, uncover.
  useEffect(() => {
    if (location.pathname === shown.pathname) {
      if (location !== shown) setShown(location)
      // Back to the page already on screen while the curtain was on its way
      // in (a quick click, then Back): send it out again rather than leave it
      // stranded half across the page.
      if (inFlight.current) {
        inFlight.current = false
        gsap.to(curtain.current, { yPercent: 125, duration: 0.35, ease: 'power3.out' })
      }
      return undefined
    }

    const swap = () => {
      setShown(location)
      scrollToTop()
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    if (prefersReducedMotion()) {
      swap()
      return undefined
    }

    inFlight.current = true
    const tl = gsap.timeline({
      onComplete: () => {
        inFlight.current = false
      },
    })
    tl.set(curtain.current, { yPercent: 125 })
      .to(curtain.current, { yPercent: 0, duration: 0.42, ease: 'expo.inOut' })
      .add(swap)
      .to(curtain.current, { yPercent: -125, duration: 0.6, ease: 'expo.inOut' }, '+=0.04')
    return () => tl.kill()
    // `shown` is deliberately left out: it changes as a result of this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <>
      <Routes location={shown}>{children}</Routes>

      <div
        ref={curtain}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 -top-[12vh] z-[90] h-[124vh] will-change-transform"
      >
        <div className="absolute inset-0 -skew-y-3 bg-brand-deep" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <img src={crestWhite} alt="" className="w-16 sm:w-20" />
          <span ref={line} className="block h-0.5 w-28 origin-left bg-gold" />
        </div>
      </div>
    </>
  )
}
