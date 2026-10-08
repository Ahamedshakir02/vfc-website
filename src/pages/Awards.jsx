import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
import Crest from '../components/Crest.jsx'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { gsap, EASE, useGsap } from '../lib/motion.js'
import { AWARD_PLACEHOLDERS } from '../data/placeholders.js'

export default function Awards() {
  const { t } = useLang()

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
          trophies lined up. Flat, hairline-separated — not a card grid.
        */}
        <div ref={shelf}>
          <ul className="flex flex-wrap items-end overflow-hidden">
            {AWARD_PLACEHOLDERS.map((award, i) => (
              <li
                key={award.id}
                className="shelf-item group border-l border-t border-brand/15 bg-white px-6 pb-8 transition-colors duration-500 last:border-r hover:bg-sand"
                style={{
                  // Varied width and height so the shelf reads as a real row of
                  // trophies rather than a repeated component.
                  flex: `${[3, 2, 4, 3][i % 4]} 1 15rem`,
                  paddingTop: `${2.5 + (i % 3) * 1.75}rem`,
                }}
              >
                <Crest draw className="h-10 w-10 text-gold transition-transform duration-500 ease-out group-hover:-translate-y-1.5" />
                <p className="mt-5 font-semibold text-ink/60">
                  <Todo>{award.year}</Todo>
                </p>
                <h3 className="mt-2 text-xl font-bold text-brand">
                  <Todo>{award.title}</Todo>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  <Todo>{award.description}</Todo>
                </p>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="shelf-line block h-1 origin-left bg-brand" />
        </div>

        <Reveal className="mt-8">
          <Todo block>
            [Full award records and dates not handed over yet — the tiles above
            are empty slots, not real awards. Replace the whole list once the
            client sends the record.]
          </Todo>
        </Reveal>
      </Section>
    </>
  )
}
