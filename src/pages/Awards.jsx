import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
import Crest from '../components/Crest.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { AWARD_PLACEHOLDERS } from '../data/placeholders.js'

export default function Awards() {
  const { t } = useLang()

  return (
    <>
      <Section tone="brand" heading={t(strings.awards.heading)}>
        <p className="max-w-2xl text-lg text-white/80">{t(strings.home.awardsHeading)}</p>
      </Section>

      <Section tone="white">
        {/*
          The shelf: unequal-width tiles sitting on one shared baseline, like
          trophies lined up. Flat, hairline-separated — not a card grid.
        */}
        <ul className="flex flex-wrap items-end gap-px bg-brand/15">
          {AWARD_PLACEHOLDERS.map((award, i) => (
            <li
              key={award.id}
              className="bg-white px-6 pb-7"
              style={{
                // Varied width and height so the shelf reads as a real row of
                // trophies rather than a repeated component.
                flex: `${[3, 2, 4, 3][i % 4]} 1 15rem`,
                paddingTop: `${2.5 + (i % 3) * 1.5}rem`,
              }}
            >
              <Crest className="h-8 w-8 text-gold" />
              <p className="mt-4 font-semibold text-ink/60">
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

        <Todo block>
          [Full award records and dates not handed over yet — the tiles above
          are empty slots, not real awards. Replace the whole list once the
          client sends the record.]
        </Todo>
      </Section>
    </>
  )
}
