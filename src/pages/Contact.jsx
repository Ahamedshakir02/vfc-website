import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { CONTACT } from '../data/placeholders.js'

export default function Contact() {
  const { t } = useLang()

  const rows = [
    { label: t(strings.contact.address), value: CONTACT.address },
    { label: t(strings.contact.phone), value: CONTACT.phone },
    { label: t(strings.contact.email), value: CONTACT.email },
  ]

  return (
    <>
      <Section tone="brand" heading={t(strings.contact.heading)}>
        <p className="max-w-2xl text-lg text-white/80">{t(strings.home.heroTagline)}</p>
      </Section>

      <Section tone="white">
        <div className="grid gap-10 md:grid-cols-2">
          <dl className="space-y-6">
            {rows.map((row) => (
              <div key={row.label} className="border-b border-brand/10 pb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                  {row.label}
                </dt>
                <dd className="mt-2 text-lg">
                  <Todo>{row.value}</Todo>
                </dd>
              </div>
            ))}
          </dl>

          <div className="rounded-xl border border-brand/10 bg-sand p-6">
            <h3 className="font-bold text-brand">{t(strings.contact.address)}</h3>
            {/* TODO: embed a map once the address and a Maps link are confirmed. */}
            <Todo block>[Map embed — needs the confirmed address / Google Maps link.]</Todo>
            <Todo block>
              [Social links (Instagram / Facebook / WhatsApp) — none supplied yet.]
            </Todo>
          </div>
        </div>

        {/*
          No contact form in v1: the spec's only Firestore write is the event
          registration form, which is stage 2. Phone and email only for now.
        */}
      </Section>
    </>
  )
}
