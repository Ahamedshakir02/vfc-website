import { useEffect, useRef } from 'react'
import { gsap, MOTION_OK } from '../lib/motion.js'

/**
 * A small gold marker that trails the pointer and opens into a ring over
 * anything clickable. Mouse users only — the native cursor stays visible, and
 * touch devices never mount the listeners.
 */
export default function Cursor() {
  const dot = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || !window.matchMedia(MOTION_OK).matches) return undefined

    const el = dot.current
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    let visible = false

    const move = (e) => {
      x(e.clientX)
      y(e.clientY)
      if (!visible) {
        visible = true
        gsap.to(el, { opacity: 1, duration: 0.3 })
      }
      const over = e.target.closest?.('a, button, [data-cursor]')
      el.classList.toggle('is-over', Boolean(over))
    }
    const leave = () => {
      visible = false
      gsap.to(el, { opacity: 0, duration: 0.3 })
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block">
      <div ref={dot} className="cursor-dot" />
    </div>
  )
}
