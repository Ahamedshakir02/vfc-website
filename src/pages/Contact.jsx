import Section from '../components/Section.jsx'
import Sample from '../components/Sample.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderArt from '../components/PlaceholderArt.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { useContent } from '../lib/content.jsx'

const LINKS = [
  { key: 'mapsUrl' },
  { key: 'instagram', name: 'Instagram' },
  { key: 'facebook', name: 'Facebook' },
  { key: 'whatsapp', name: 'WhatsApp' },
]

const chip = 'inline-flex min-h-11 items-center rounded-control border border-brand/20 px-4 text-sm font-semibold text-brand'

export default function Contact() {
  const { t } = useLang()
  const { site } = useContent()
  const { contact } = site

  const rows = [
    { label: t(strings.contact.address), value: contact.address },
    { label: t(strings.contact.phone), value: contact.phone },
    { label: t(strings.contact.email), value: contact.email },
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
                  <Sample when={site.contactSample}>{row.value}</Sample>
                </dd>
              </div>
            ))}
          </Reveal>

          <Reveal>
            {/* A drawn map, not an embed. The buttons below become links as officers add them at /admin. */}
            <div className="overflow-hidden rounded-tile border border-brand/15">
              <PlaceholderArt scene="map" className="block aspect-[4/3] w-full" />
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {LINKS.map(({ key, name }) => {
                const label = key === 'mapsUrl' ? t(strings.contact.openMap) : name
                if (contact[key]) {
                  return (
                    <li key={key}>
                      <a href={contact[key]} target="_blank" rel="noreferrer" className={`${chip} transition-colors hover:bg-brand hover:text-white`}>
                        {label}
                      </a>
                    </li>
                  )
                }
                // A name with no link behind it is still a placeholder; a map with no link is left out.
                return key === 'mapsUrl' ? null : (
                  <li key={key} className={chip}>
                    <Sample>{label}</Sample>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>

      </Section>
    </>
  )
}
