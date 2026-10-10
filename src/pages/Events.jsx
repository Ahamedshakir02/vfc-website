import { useState } from 'react'
import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Sample from '../components/Sample.jsx'
import PageHero from '../components/PageHero.jsx'
import EventStatus from '../components/EventStatus.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { EVENTS } from '../data/events.js'
import { EVENT_STATUS } from '../data/schema.js'
import { ILLUSTRATIONS } from '../data/illustrations.js'

const FILTERS = ['all', EVENT_STATUS.open, EVENT_STATUS.upcoming, EVENT_STATUS.closed]

/** Sample events are flagged; the league is real and reads as plain text. */
const Title = ({ event, t }) => (event.sample ? <Sample>{t(event.title)}</Sample> : t(event.title))

/** The open event gets the full-width treatment: it is what the page is for. */
function FeaturedEvent({ event }) {
  const { t } = useLang()
  const facts = [event.startsOn, event.venue, event.closesOn && `${t(strings.events.closes)}: ${event.closesOn}`].filter(Boolean)

  return (
    <Link
      to={`/events/${event.id}`}
      className="group grid overflow-hidden rounded-tile bg-brand text-white md:grid-cols-[1fr_1.7fr]"
    >
      <div className="relative min-h-56 overflow-hidden">
        <img
          src={ILLUSTRATIONS[event.image]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-start gap-3.5 p-7 sm:p-10">
        <EventStatus status={event.status} />
        <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl">
          <Title event={event} t={t} />
        </h2>
        <p className="max-w-xl text-white/85">{t(event.description)}</p>
        <p className="flex flex-wrap gap-x-8 gap-y-1 font-semibold">
          {facts.length ? facts.map((fact) => <span key={fact}>{fact}</span>) : <Sample>{t(strings.events.toBeAnnounced)}</Sample>}
        </p>
        <span className="mt-2 rounded-control bg-gold px-7 py-3.5 text-[0.9375rem] font-semibold text-brand-deep transition-colors duration-300 group-hover:bg-white">
          {t(strings.events.seeEvent)}
        </span>
      </div>
    </Link>
  )
}

function EventRow({ event }) {
  const { t } = useLang()

  return (
    <li>
      <Link
        to={`/events/${event.id}`}
        className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-tile border border-brand/15 bg-white p-5 transition-colors duration-300 hover:bg-sand sm:p-6"
      >
        <img
          src={ILLUSTRATIONS[event.image]}
          alt=""
          loading="lazy"
          className="h-20 w-28 flex-none rounded-control object-cover"
        />
        <div className="min-w-0 flex-1 basis-56">
          <h3 className="text-2xl font-bold text-brand">
            <Title event={event} t={t} />
          </h3>
          <p className="mt-1 text-ink/65">
            <Sample>{event.startsOn ?? t(strings.events.toBeAnnounced)}</Sample>, {t(strings.name[event.category])}
          </p>
        </div>
        <EventStatus status={event.status} />
      </Link>
    </li>
  )
}

export default function Events() {
  const { t } = useLang()
  const [filter, setFilter] = useState('all')

  const shown = EVENTS.filter((event) => filter === 'all' || event.status === filter)
  const open = shown.filter((event) => event.status === EVENT_STATUS.open)
  const upcoming = shown.filter((event) => event.status === EVENT_STATUS.upcoming)
  const closed = shown.filter((event) => event.status === EVENT_STATUS.closed)

  const filterLabel = (id) => (id === 'all' ? t(strings.events.filterAll) : t(strings.status[id]))

  return (
    <>
      <PageHero heading={t(strings.nav.events)} lede={t(strings.events.lede)} image={ILLUSTRATIONS.dancer} />

      <Section tone="light">
        <div role="group" aria-label={t(strings.events.filterLabel)} className="flex flex-wrap gap-2">
          {FILTERS.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={`h-11 rounded-control border px-4 text-sm font-semibold transition-colors duration-200 ${
                filter === id
                  ? 'border-brand bg-brand text-white'
                  : 'border-brand/30 text-brand hover:bg-brand/10'
              }`}
            >
              {filterLabel(id)}
            </button>
          ))}
        </div>

        {/* Re-keyed on the filter so the list re-enters when the choice changes. */}
        <div key={filter} className="mt-8 flex flex-col gap-16">
          {open.length > 0 && (
            <Reveal className="flex flex-col gap-4">
              {open.map((event) => (
                <FeaturedEvent key={event.id} event={event} />
              ))}
            </Reveal>
          )}

          {upcoming.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold">{t(strings.events.comingUp)}</h2>
              <Reveal as="ul" stagger={0.08} className="mt-5 flex flex-col gap-3">
                {upcoming.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </Reveal>
            </div>
          )}

          {closed.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold">{t(strings.events.past)}</h2>
              <Reveal as="ul" stagger={0.08} className="mt-5 flex flex-col gap-3">
                {closed.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </Reveal>
            </div>
          )}

          {shown.length === 0 && <p className="rounded-tile bg-brand/10 p-6 text-brand-deep">{t(strings.events.none)}</p>}
        </div>
      </Section>
    </>
  )
}
