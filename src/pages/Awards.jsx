import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
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
        {/* Timeline layout — awaiting the real award records and dates. */}
        <ol className="relative space-y-8 border-l-2 border-brand/15 pl-6 sm:pl-8">
          {AWARD_PLACEHOLDERS.map((award) => (
            <li key={award.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.85rem] top-2 h-3 w-3 rounded-full bg-gold ring-4 ring-white sm:-left-[2.35rem]"
              />
              <p className="text-sm font-bold uppercase tracking-wide text-gold">
                <Todo>{award.year}</Todo>
              </p>
              <h3 className="mt-2 text-xl font-bold text-brand">
                <Todo>{award.title}</Todo>
              </h3>
              <p className="mt-2 text-ink/75">
                <Todo>{award.description}</Todo>
              </p>
            </li>
          ))}
        </ol>

        <Todo block>
          [Full award records and dates not handed over yet — the four entries
          above are empty slots, not real awards. Replace the whole list once
          the client sends the record.]
        </Todo>
      </Section>
    </>
  )
}
