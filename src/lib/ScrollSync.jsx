import { useEffect } from 'react'
import { ScrollTrigger } from './motion.js'

/** Jump to the top without animating — used when a route swaps in. */
export function scrollToTop() {
  window.scrollTo(0, 0)
}

/**
 * Keeps scroll-linked animation measured against the real page.
 *
 * Scrolling itself is left entirely to the browser: it runs off the main
 * thread and answers the wheel or finger immediately, which a scripted smooth
 * scroll cannot do on a modest laptop or a mid-range phone. This only
 * re-measures the triggers when fonts or late images change the page height.
 */
export default function ScrollSync({ children }) {
  useEffect(() => {
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
    }
  }, [])

  return children
}
