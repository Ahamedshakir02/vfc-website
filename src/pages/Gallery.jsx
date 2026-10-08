import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
import PageHero from '../components/PageHero.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { gsap, EASE, ScrollTrigger, useGsap } from '../lib/motion.js'
import { GALLERY_PLACEHOLDERS } from '../data/placeholders.js'

/*
  Mosaic spans — mixed tile sizes so the wall reads like real event photos
  rather than a uniform stock grid. Cycled over however many photos land.
*/
const SPANS = [
  'col-span-2 row-span-2',
  '',
  '',
  'col-span-2',
  '',
  'row-span-2',
  'col-span-2',
  '',
  '',
]

export default function Gallery() {
  const { t } = useLang()

  // Photos are unveiled bottom-up in the batches they scroll into view in.
  const mosaic = useGsap(() => {
    gsap.set('.photo', { clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.set('.photo-inner', { scale: 1.25 })
    ScrollTrigger.batch('.photo', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut', stagger: 0.08 })
        gsap.to(
          batch.map((el) => el.firstElementChild),
          { scale: 1, duration: 1.6, ease: EASE, stagger: 0.08 },
        )
      },
    })
  })

  return (
    <>
      <PageHero heading={t(strings.gallery.heading)} lede={t(strings.home.galleryHeading)} />

      <Section tone="white">
        <div ref={mosaic} className="grid grid-flow-dense auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:grid-cols-4">
          {GALLERY_PLACEHOLDERS.map((photo, i) => (
            <PhotoPlaceholder
              key={photo.id}
              label={photo.caption}
              className={SPANS[i % SPANS.length]}
            />
          ))}
        </div>

        <Reveal className="mt-8">
          <Todo block>
            [Event photos not handed over yet. The tiles above are empty slots —
            swap in real images and captions, and drop any that aren't needed.]
          </Todo>
        </Reveal>
      </Section>
    </>
  )
}
