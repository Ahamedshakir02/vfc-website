import { gsap, useGsap } from '../lib/motion.js'

/**
 * Page progress as a touchline: a gold line that draws along the bottom of
 * the screen. Stays out of the way until the hero has been scrolled past.
 */
export default function ScrollProgress() {
  const ref = useGsap(() => {
    const whole = { start: 0, end: 'max', scrub: 0.25, invalidateOnRefresh: true }
    gsap.fromTo('.progress-line', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: whole })
    gsap.fromTo(
      ref.current,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        ease: 'none',
        scrollTrigger: {
          start: () => window.innerHeight * 0.55,
          end: () => window.innerHeight * 0.85,
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    )
  })

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 motion-reduce:hidden"
    >
      <div className="progress-line h-1 origin-left bg-gold" />
    </div>
  )
}
