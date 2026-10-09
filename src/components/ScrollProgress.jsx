import Ball from './Ball.jsx'
import { gsap, useGsap } from '../lib/motion.js'

const SIZE = 22

/**
 * Page progress as a touchline: a gold line along the bottom of the screen
 * with the ball rolling along it. Stays out of the way until the hero has
 * been scrolled past.
 */
export default function ScrollProgress() {
  const ref = useGsap(() => {
    const whole = { start: 0, end: 'max', scrub: 0.25, invalidateOnRefresh: true }
    const travel = () => window.innerWidth - SIZE

    gsap.fromTo('.progress-line', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: whole })
    gsap.fromTo(
      '.progress-ball',
      { x: 0, rotation: 0 },
      {
        x: travel,
        // Distance over radius: the ball turns exactly as far as it travels.
        rotation: () => (travel() / (SIZE / 2)) * (180 / Math.PI),
        ease: 'none',
        scrollTrigger: whole,
      },
    )
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
      <div className="progress-ball absolute bottom-0.5 left-0" style={{ width: SIZE, height: SIZE }}>
        <Ball id="progress-ball" className="block h-full w-full" />
      </div>
      <div className="progress-line h-0.5 origin-left bg-gold" />
    </div>
  )
}
