import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'

export default function About() {
  const { t, lang } = useLang()
  const parts = strings.about.bodyParts

  // The EN and ML sentences put the [area] blank in different positions, so
  // each language gets its own assembly order rather than one shared template.
  const body =
    lang === 'ml' ? (
      <>
        <Todo>{t(parts.area)}</Todo>
        {t(parts.leadB)}
        <Todo>{t(parts.story)}</Todo>
        {t(parts.tail)}
      </>
    ) : (
      <>
        {t(parts.leadA)}
        <Todo>{t(parts.area)}</Todo>
        {t(parts.leadB)}
        <Todo>{t(parts.story)}</Todo>
        {t(parts.tail)}
      </>
    )

  return (
    <>
      <Section tone="brand" heading={t(strings.about.heading)}>
        <p className="max-w-3xl text-lg leading-relaxed text-white/85">
          {t(strings.home.heroSubline)}
        </p>
      </Section>

      <Section tone="white">
        <div className="grid gap-12 md:grid-cols-[1.15fr_1fr] md:items-start">
          <div>
            <p className="text-lg leading-relaxed text-ink/85">{body}</p>

            <div className="mt-10 border-l-2 border-gold bg-sand p-6">
              <h3 className="font-bold text-brand">{t(strings.home.impactHeading)}</h3>
              <p className="mt-3 leading-relaxed text-ink/75">{t(strings.home.impactBlurb)}</p>
            </div>

            <Todo block>
              [Club registration details — registered society/trust number and
              certificate, Palakkad district. Marked TBD in the spec; add here
              once the client provides it.]
            </Todo>
          </div>

          <div className="grid gap-4">
            <PhotoPlaceholder label="TODO: [club / team photo]" ratio="aspect-[4/5]" />
            <PhotoPlaceholder label="TODO: [community or charity activity photo]" ratio="aspect-[4/3]" />
          </div>
        </div>
      </Section>
    </>
  )
}
