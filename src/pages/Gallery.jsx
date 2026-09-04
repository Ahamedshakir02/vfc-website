import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
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

  return (
    <>
      <Section tone="brand" heading={t(strings.gallery.heading)}>
        <p className="max-w-2xl text-lg text-white/80">{t(strings.home.galleryHeading)}</p>
      </Section>

      <Section tone="white">
        <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:grid-cols-4">
          {GALLERY_PLACEHOLDERS.map((photo, i) => (
            <PhotoPlaceholder
              key={photo.id}
              label={photo.caption}
              className={SPANS[i % SPANS.length]}
            />
          ))}
        </div>

        <Todo block>
          [Event photos not handed over yet. The tiles above are empty slots —
          swap in real images and captions, and drop any that aren't needed.]
        </Todo>
      </Section>
    </>
  )
}
