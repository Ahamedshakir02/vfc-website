import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/** Every animation on the site is gated behind this query. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

/*
  A second off switch besides the OS setting: a host that renders the
  components outside the site (the kit's VfcProvider) can ask for the static
  page, with every element in its final place.
*/
let motionEnabled = true
export const setMotion = (enabled) => {
  motionEnabled = Boolean(enabled)
}

export const prefersReducedMotion = () =>
  !motionEnabled || (typeof window !== 'undefined' && !window.matchMedia(MOTION_OK).matches)

/** One easing language for entrances, so the site moves as a single voice. */
export const EASE = 'expo.out'

/**
 * Run GSAP animations scoped to a container, with automatic cleanup.
 *
 * Everything created inside `setup` is reverted on unmount, and nothing runs
 * at all for visitors who asked the OS to reduce motion — they get the static
 * page, with every element in its final place.
 */
export function useGsap(setup, deps = []) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (!motionEnabled) return undefined
    const mm = gsap.matchMedia(ref)
    mm.add(MOTION_OK, () => setup())
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

/*
  Page intros wait for whatever is covering the screen: the loader on the first
  visit, the route curtain after that.
*/
let booted = false
export const markBooted = () => {
  booted = true
}
export const introDelay = () => (booted ? 0.3 : 1.0)
