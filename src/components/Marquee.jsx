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

    // One running value eased back to normal speed each frame, instead of
    // spawning a new tween for every scroll event.
    let direction = 1
    let boost = 1
    const ease = () => {
      boost += (1 - boost) * 0.07
      drift.timeScale(direction * boost)
    }

    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      // Only costs anything while the band is actually on screen.
      onToggle: (self) => {
        drift.paused(!self.isActive)
        if (self.isActive) gsap.ticker.add(ease)
        else gsap.ticker.remove(ease)
      },
      onUpdate: (self) => {
        const velocity = self.getVelocity()
        direction = velocity < 0 ? -1 : 1
        boost = Math.max(boost, gsap.utils.clamp(1, 6, 1 + Math.abs(velocity) / 400))
      },
    })

    return () => gsap.ticker.remove(ease)
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
