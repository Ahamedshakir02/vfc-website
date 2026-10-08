import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/motion/Reveal.jsx'
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
      <PageHero heading={t(strings.contact.heading)} lede={t(strings.home.heroTagline)} />

      <Section tone="white">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal as="dl" stagger={0.1}>
            {rows.map((row) => (
              <div key={row.label} className="border-b border-brand/15 py-6 first:pt-0">
                <dt className="text-sm font-semibold text-ink/55">{row.label}</dt>
                <dd className="mt-2 font-display text-2xl font-semibold text-brand sm:text-3xl">
                  <Todo>{row.value}</Todo>
                </dd>
              </div>
            ))}
          </Reveal>

          <Reveal className="border border-brand/15 bg-sand p-6 sm:p-8" stagger={0.1}>
            <h3 className="text-xl font-bold text-brand">{t(strings.contact.address)}</h3>
            {/* TODO: embed a map once the address and a Maps link are confirmed. */}
            <div className="mt-4">
              <Todo block>[Map embed — needs the confirmed address / Google Maps link.]</Todo>
            </div>
            <div className="mt-3">
              <Todo block>
                [Social links (Instagram / Facebook / WhatsApp) — none supplied yet.]
              </Todo>
            </div>
          </Reveal>
        </div>

        {/*
          No contact form in v1: the spec's only Firestore write is the event
          registration form, which is stage 2. Phone and email only for now.
        */}
      </Section>
    </>
  )
}
