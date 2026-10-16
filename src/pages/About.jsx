import Section from '../components/Section.jsx'
import Sample from '../components/Sample.jsx'
import PageHero from '../components/PageHero.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { gsap, useGsap } from '../lib/motion.js'
import { useContent } from '../lib/content.jsx'

export default function About() {
  const { t, lang } = useLang()
  const { site } = useContent()
  const parts = strings.about.bodyParts

  // The two photos drift at different speeds, so the column has some depth.
  const photos = useGsap(() => {
    gsap.utils.toArray('.drift').forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: i ? 70 : 20 },
        {
          y: i ? -70 : -20,
          ease: 'none',
          scrollTrigger: { trigger: photos.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
  })

  // The EN and ML sentences put the area in different positions, so each
  // language gets its own assembly order rather than one shared template.
  const body =
    lang === 'ml' ? (
      <>
        <Sample>{t(parts.area)}</Sample>
        {t(parts.leadB)}
        <Sample>{t(parts.story)}</Sample>
        {t(parts.tail)}
      </>
    ) : (
      <>
        {t(parts.leadA)}
        <Sample>{t(parts.area)}</Sample>
        {t(parts.leadB)}
        <Sample>{t(parts.story)}</Sample>
        {t(parts.tail)}
      </>
    )

  return (
    <>
      <PageHero heading={t(strings.about.heading)} lede={t(strings.home.heroSubline)} />

      <Section tone="white">
        <div className="grid gap-14 md:grid-cols-[1.15fr_1fr] md:items-start md:gap-16">
          <Reveal stagger={0.12}>
            <p className="text-lg leading-relaxed text-ink/85 sm:text-xl sm:leading-relaxed">{body}</p>

            <div className="mt-12 rounded-r-tile border-l-2 border-gold bg-sand p-6 sm:p-8">
              <h3 className="text-xl font-bold text-brand">{t(strings.home.impactHeading)}</h3>
              <p className="mt-3 leading-relaxed text-ink/75">{t(strings.home.impactBlurb)}</p>
            </div>

            {/* Set by officers under Club details; left out until they do. */}
            {site.registration && (
              <p className="mt-8 text-sm text-ink/65">
                {t(strings.about.registered)} {site.registration}
              </p>
            )}
          </Reveal>

          <div ref={photos} className="grid grid-cols-[1fr_0.8fr] items-start gap-4 md:pt-6">
            <div className="drift">
              <PhotoPlaceholder image="athlete" label={t(strings.name.sports)} ratio="aspect-[4/5]" />
            </div>
            <div className="drift mt-16">
              <PhotoPlaceholder image="community" label={t(strings.name.welfare)} ratio="aspect-[3/4]" />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
