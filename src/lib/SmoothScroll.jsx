import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion.js'

let lenis = null
export const getLenis = () => lenis

/** Jump to the top without animating — used when a route swaps in. */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}

/**
 * The single source of truth for scrolling.
 *
 * Lenis is driven by GSAP's ticker and ScrollTrigger reads from Lenis, so
 * there is exactly one clock. Touch keeps native momentum — forcing smooth
 * scroll onto a mid-range Android phone only makes it feel laggy.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    })
    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Fonts and late images move things; re-measure when the page changes height.
    let timer
    const remeasure = () => {
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 200)
    }
    const observer = new ResizeObserver(remeasure)
    observer.observe(document.body)
    document.fonts?.ready.then(remeasure)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenis = null
    }
  }, [])

  return children
}
