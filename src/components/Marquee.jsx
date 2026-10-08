import Crest from './Crest.jsx'
import { gsap, ScrollTrigger, useGsap } from '../lib/motion.js'

/**
 * A running band of words, crest between each. It drifts on its own and
 * picks up the speed and direction of the scroll, then settles back.
 */
export default function Marquee({ items, className = '' }) {
  const ref = useGsap(() => {
    const drift = gsap.to('.marquee-track', {
      xPercent: -50,
      duration: 32,
      ease: 'none',
      repeat: -1,
    })
    // Start well into the loop so there is room to run backwards.
    drift.totalTime(drift.duration() * 50)

    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => drift.paused(!self.isActive),
      onUpdate: (self) => {
        const velocity = self.getVelocity()
        const direction = velocity < 0 ? -1 : 1
        const boost = gsap.utils.clamp(1, 7, 1 + Math.abs(velocity) / 350)
        gsap.killTweensOf(drift)
        gsap
          .timeline()
          .to(drift, { timeScale: direction * boost, duration: 0.2, ease: 'power2.out' })
          .to(drift, { timeScale: direction, duration: 1.1, ease: 'power2.out' })
      },
    })
  }, [items.join('|')])

  const row = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-6 sm:px-10">{item}</span>
          <Crest className="h-7 w-7 shrink-0 text-gold sm:h-10 sm:w-10" />
        </li>
      ))}
    </ul>
  )

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
