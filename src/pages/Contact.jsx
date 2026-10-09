import Section from '../components/Section.jsx'
import Sample from '../components/Sample.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderArt from '../components/PlaceholderArt.jsx'
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
        <div className="grid gap-12 md:grid-cols-2 md:items-start md:gap-16">
          <Reveal as="dl" stagger={0.1}>
            {rows.map((row) => (
              <div key={row.label} className="border-b border-brand/15 py-6 first:pt-0">
                <dt className="text-sm font-semibold text-ink/55">{row.label}</dt>
                <dd className="mt-2 font-display text-2xl font-semibold text-brand sm:text-3xl">
                  <Sample>{row.value}</Sample>
                </dd>
              </div>
            ))}
          </Reveal>

          <Reveal>
            {/*
              TODO: replace the drawn map with a real embed once the address
              and a Google Maps link are confirmed, and turn the social names
              into links once the club supplies its accounts.
            */}
            <div className="overflow-hidden rounded-tile border border-brand/15">
              <PlaceholderArt scene="map" className="block aspect-[4/3] w-full" />
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {CONTACT.socials.map((name) => (
                <li
                  key={name}
                  className="rounded-control border border-brand/20 px-4 py-2 text-sm font-semibold text-brand"
                >
                  <Sample>{name}</Sample>
                </li>
              ))}
            </ul>
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
