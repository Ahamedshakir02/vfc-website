import { Link, useParams } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Sample from '../components/Sample.jsx'
import Button from '../components/Button.jsx'
import PageHero from '../components/PageHero.jsx'
import EventStatus from '../components/EventStatus.jsx'
import RegistrationForm from '../components/RegistrationForm.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { useContent } from '../lib/content.jsx'
import { eventImage, formatDate, formatFee, isSampleField } from '../lib/format.js'
import { EVENT_STATUS } from '../data/schema.js'

export default function EventPage() {
  const { t, lang } = useLang()
  const { id } = useParams()
  const { getEvent, site } = useContent()
  const event = getEvent(id)

  if (!event) {
    return (
      <PageHero heading="404" lede={t(strings.events.notFound)}>
        <Button to="/events" variant="gold">
          {t(strings.events.allEvents)}
        </Button>
      </PageHero>
    )
  }

  const isOpen = event.status === EVENT_STATUS.open
  // The first step is the same either way; how the fee is paid changes the rest.
  const steps = site.payOnline ? [strings.events.steps[0], ...strings.events.stepsOnline] : strings.events.steps
  const facts = [
    { key: 'startsOn', label: t(strings.events.starts), value: formatDate(event.startsOn, lang) },
    { key: 'venue', label: t(strings.events.venue), value: event.venue },
    { key: 'fee', label: t(strings.events.fee), value: formatFee(event.fee) },
    { key: 'closesOn', label: t(strings.events.closes), value: formatDate(event.closesOn, lang) },
  ]

  return (
    <>
      <PageHero
        heading={t(event.title)}
        image={eventImage(event)}
        before={
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/events" className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline text-white">
              {t(strings.events.allEvents)}
            </Link>
            <EventStatus status={event.status} onDark />
          </div>
        }
      >
        <dl className="flex flex-wrap gap-x-12 gap-y-6">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-sm text-white/75">{fact.label}</dt>
              <dd className="mt-1 font-display text-2xl font-bold">
                <Sample when={!fact.value || isSampleField(event, fact.key)}>
                  {fact.value || t(strings.events.toBeAnnounced)}
                </Sample>
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <Section tone="light">
        <div className="grid gap-14 md:grid-cols-[1fr_1.15fr] md:items-start">
          <Reveal stagger={0.1}>
            <h2 className="text-3xl font-bold">{t(strings.events.about)}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/85">
              <Sample when={Boolean(event.sample)}>{t(event.description)}</Sample>
            </p>

            {isOpen && (
              <>
                <h2 className="mt-14 text-3xl font-bold">{t(strings.events.how)}</h2>
                <ol className="mt-6 flex flex-col gap-3">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-5 rounded-tile border border-brand/15 bg-white p-6">
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 flex-none items-center justify-center rounded-control bg-brand font-display text-xl font-bold text-white"
                      >
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-brand">{t(step.title)}</h3>
                        <p className="mt-1 text-ink/70">{t(step.body)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}

            <div className="mt-10 rounded-tile bg-brand/10 p-6">
              <h3 className="text-xl font-bold text-brand-deep">{t(strings.events.questions)}</h3>
              <p className="mt-1.5 text-ink/85">
                <Sample when={site.contactSample}>
                  {site.contact.phone}, {site.contact.email}
                </Sample>
              </p>
            </div>
          </Reveal>

          {isOpen ? (
            <Reveal>
              <RegistrationForm key={event.id} event={event} />
            </Reveal>
          ) : (
            <Reveal className="rounded-tile border border-brand/15 bg-white p-7 sm:p-9">
              <p className="text-lg font-semibold text-brand-deep">{t(strings.events.notOpen)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/events" variant="brand">
                  {t(strings.events.allEvents)}
                </Button>
                {event.status === EVENT_STATUS.closed && (
                  <Button to="/gallery" variant="outlineDark">
                    {t(strings.events.seePhotos)}
                  </Button>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </Section>
    </>
  )
}
