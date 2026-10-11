import Section from '../components/Section.jsx'
import PageHero from '../components/PageHero.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { gsap, EASE, ScrollTrigger, useGsap } from '../lib/motion.js'
import { useContent } from '../lib/content.jsx'

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
  const { gallery } = useContent()

  // Photos slide up into their frames in the batches they scroll into view in.
  const mosaic = useGsap(() => {
    gsap.set('.photo-inner', { yPercent: 101, scale: 1.2 })
    ScrollTrigger.batch('.photo', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(
          batch.map((el) => el.firstElementChild),
          { yPercent: 0, scale: 1, duration: 1.2, ease: EASE, stagger: 0.08 },
        ),
    })
  })

  return (
    <>
      <PageHero heading={t(strings.gallery.heading)} lede={t(strings.home.galleryHeading)} />

      <Section tone="white">
        {/*
          The photos officers add at /admin. Until the first one is added
          these are collage illustrations (see src/data/placeholders.js).
        */}
        <div ref={mosaic} className="grid grid-flow-dense auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:grid-cols-4">
          {gallery.map((photo, i) => (
            <PhotoPlaceholder
              key={photo.id}
              image={photo.image}
              src={photo.imageUrl}
              sample={Boolean(photo.sample)}
              label={t(photo.caption) || t(strings.name[photo.category])}
              className={SPANS[i % SPANS.length]}
            />
          ))}
        </div>
      </Section>
    </>
  )
}
