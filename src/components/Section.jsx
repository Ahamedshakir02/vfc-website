import Words from './motion/Words.jsx'
import { gsap, EASE, useGsap } from '../lib/motion.js'

export default function Section({ id, heading, action, tone = 'light', className = '', children }) {
  const tones = {
    light: 'bg-sand text-ink',
    white: 'bg-white text-ink',
    brand: 'bg-brand text-white',
    deep: 'bg-brand-deep text-white',
  }

  // The heading rises word by word, then the gold rule draws out beneath it.
  const head = useGsap(() => {
    if (!head.current) return
    const tl = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: { trigger: head.current, start: 'top 85%', once: true },
    })
    tl.from('.word', { yPercent: 115, duration: 1, stagger: 0.06 })
      .from('.section-rule', { scaleX: 0, duration: 0.9 }, 0.25)
      .from('.section-action', { opacity: 0, duration: 0.8 }, 0.4)
  }, [heading])

  return (
    <section id={id} className={`${tones[tone]} ${className}`}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        {(heading || action) && (
          <div ref={head} className="mb-12 flex flex-wrap items-end justify-between gap-4 sm:mb-16">
            {heading && (
              <h2 className="display-lg font-bold">
                <Words text={heading} />
                <span
                  aria-hidden="true"
                  className="section-rule mt-4 block h-1 w-16 origin-left rounded-full bg-gold"
                />
              </h2>
            )}
            {action && <div className="section-action">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
