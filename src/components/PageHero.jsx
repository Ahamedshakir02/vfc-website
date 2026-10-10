import Cut from './Cut.jsx'
import Words from './motion/Words.jsx'
import { gsap, EASE, introDelay, useGsap } from '../lib/motion.js'
import { usePageTitle } from '../lib/usePageTitle.js'

/**
 * Head of every inner page: the home hero's purple field and diagonal cut,
 * with the page title set as large as it will go.
 *
 * `before` sits above the title (a back link, a status), `children` below the
 * lede, and `image` adds a tilted picture beside the copy.
 */
export default function PageHero({ heading, lede, before, image, children }) {
  usePageTitle(heading)

  const ref = useGsap(() => {
    const tl = gsap.timeline({ delay: introDelay(), defaults: { ease: EASE } })
    tl.from('.word', { yPercent: 115, duration: 1.1, stagger: 0.07 })
      .from('.page-rule', { scaleX: 0, duration: 0.9 }, 0.3)
      .from('.page-fade', { opacity: 0, y: 18, duration: 0.9, stagger: 0.08 }, 0.45)
    if (image) tl.from('.page-art', { opacity: 0, y: 40, rotate: -3, duration: 1.3 }, 0.3)

    // The title drifts up a little slower than the page as it scrolls away.
    gsap.to('.page-copy', {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, [heading])

  return (
    <section ref={ref} className="relative overflow-hidden bg-brand text-white">
      <div
        className={`page-copy mx-auto max-w-6xl px-5 pb-28 pt-32 will-change-transform sm:px-8 sm:pb-40 sm:pt-44 ${
          image ? 'grid items-center gap-12 md:grid-cols-[1.4fr_1fr]' : ''
        }`}
      >
        <div className="min-w-0">
          {before && <div className="page-fade mb-6">{before}</div>}
          <h1 className={`${image ? 'display-hero' : 'display-xl'} font-extrabold`}>
            <Words text={heading} />
          </h1>
          <span aria-hidden="true" className="page-rule mt-6 block h-1 w-20 origin-left rounded-full bg-gold" />
          {lede && (
            <p className="page-fade mt-7 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              {lede}
            </p>
          )}
          {children && <div className="page-fade mt-8">{children}</div>}
        </div>

        {image && (
          <div className="page-art justify-self-center will-change-transform">
            <img
              src={image}
              alt=""
              className="aspect-[4/3] w-full max-w-md rotate-[1.5deg] rounded-tile object-cover"
            />
          </div>
        )}
      </div>
      <Cut />
    </section>
  )
}
