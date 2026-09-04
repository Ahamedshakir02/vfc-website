import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { GALLERY_PLACEHOLDERS } from '../data/placeholders.js'

export default function Gallery() {
  const { t } = useLang()

  return (
    <>
      <Section tone="brand" heading={t(strings.gallery.heading)}>
        <p className="max-w-2xl text-lg text-white/80">{t(strings.home.galleryHeading)}</p>
      </Section>

      <Section tone="white">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_PLACEHOLDERS.map((photo) => (
            <figure key={photo.id}>
              <PhotoPlaceholder label={photo.caption} />
              <figcaption className="mt-2 text-sm text-ink/60">
                <Todo>{photo.category}</Todo>
              </figcaption>
            </figure>
          ))}
        </div>

        <Todo block>
          [Event photos not handed over yet. Nine empty slots above — swap in
          real images and captions, and drop any slots that aren't needed.]
        </Todo>
      </Section>
    </>
  )
}
