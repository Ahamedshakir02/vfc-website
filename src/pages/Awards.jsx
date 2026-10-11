import Section from '../components/Section.jsx'
import Sample from '../components/Sample.jsx'
import Crest from '../components/Crest.jsx'
import PageHero from '../components/PageHero.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { gsap, EASE, useGsap } from '../lib/motion.js'
import { useContent } from '../lib/content.jsx'

export default function Awards() {
  const { t } = useLang()
  const { awards } = useContent()

  // The baseline draws across, then each trophy rises onto it.
  const shelf = useGsap(() => {
    const tl = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: { trigger: shelf.current, start: 'top 85%', once: true },
    })
    tl.from('.shelf-line', { scaleX: 0, duration: 1.1 })
      .from('.shelf-item', { yPercent: 28, opacity: 0, duration: 1, stagger: 0.1 }, 0.1)
      .from('.shelf-item path, .shelf-item circle', { strokeDashoffset: 1, duration: 1.2, ease: 'power2.inOut' }, 0.35)
  })

  return (
    <>
      <PageHero heading={t(strings.awards.heading)} lede={t(strings.home.awardsHeading)} />

      <Section tone="white">
        {/*
          The shelf: unequal-width tiles sitting on one shared baseline, like
          trophies lined up. Flat and hairline-edged — not a card grid.

          The awards officers add at /admin. Until the first one is added
          these are sample entries (see src/data/placeholders.js).
        */}
        <div ref={shelf}>
          <ul className="flex flex-wrap items-end gap-3 overflow-hidden pb-3">
            {awards.map((award, i) => (
              <li
                key={award.id}
                className="shelf-item group rounded-tile border border-brand/15 bg-white px-6 pb-8 transition-colors duration-500 hover:bg-sand"
                style={{
                  // Varied width and height so the shelf reads as a real row of
                  // trophies rather than a repeated component.
                  flex: `${[3, 2, 4, 3][i % 4]} 1 15rem`,
                  paddingTop: `${2.5 + (i % 3) * 1.75}rem`,
                }}
              >
                {award.imageUrl ? (
                  <img src={award.imageUrl} alt="" loading="lazy" className="mb-1 h-36 w-full rounded-control object-cover" />
                ) : (
                  <Crest draw className="h-10 w-10 text-gold transition-transform duration-500 ease-out group-hover:-translate-y-1.5" />
                )}
                <p className="mt-5 font-display text-3xl font-bold text-brand/35">
                  <Sample when={Boolean(award.sample)}>{award.year}</Sample>
                </p>
                <h3 className="mt-1 text-xl font-bold text-brand">
                  <Sample when={Boolean(award.sample)}>{t(award.title)}</Sample>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  <Sample when={Boolean(award.sample)}>{t(award.description)}</Sample>
                </p>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="shelf-line block h-1 origin-left rounded-full bg-brand" />
        </div>
      </Section>
    </>
  )
}
