import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { AWARD_PLACEHOLDERS, GALLERY_PLACEHOLDERS, IMPACT_STATS } from '../data/placeholders.js'

/**
 * The spec's banner renders only when an event's status is `open`.
 * Stage 1 has no Firestore, so `openEvent` is always null and the banner
 * stays hidden. Stage 2 swaps this for a live events query.
 */
function RegistrationBanner({ openEvent }) {
  const { t } = useLang()
  if (!openEvent) return null

  return (
    <div className="bg-gold text-brand-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <p className="text-sm font-semibold">
          {t(strings.home.registrationBanner, {
            event: openEvent.title,
            date: openEvent.closesOn,
          })}
        </p>
        <Link
          to="/events"
          className="rounded-full bg-brand-deep px-4 py-1.5 text-sm font-semibold text-white"
        >
          {t(strings.actions.registerNow)}
        </Link>
      </div>
    </div>
  )
}

export default function Home() {
  const { t } = useLang()

  // TODO (stage 2): replace with the first `events` doc where status === 'open'.
  const openEvent = null

  return (
    <>
      <RegistrationBanner openEvent={openEvent} />

      {/* Hero — sports energy: bold purple, crest front and centre. */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-deep/60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-gold/20 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-4 inline-block rounded-full border border-gold/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold">
              Est. 2009 · Vellalur
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              {t(strings.home.heroHeadline)}
            </h1>
            <p className="mt-5 text-2xl font-semibold text-gold sm:text-3xl">
              {t(strings.home.heroTagline)}
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {t(strings.home.heroSubline)}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="rounded-full bg-gold px-6 py-3 font-semibold text-brand-deep transition-colors hover:bg-white"
              >
                {t(strings.actions.readMore)}
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t(strings.nav.contact)}
              </Link>
            </div>
          </div>

          <div className="justify-self-center">
            <img
              src="/logo/vfc-logo-white.png"
              alt=""
              aria-hidden="true"
              className="w-56 drop-shadow-2xl sm:w-72"
            />
          </div>
        </div>
      </section>

      {/* Impact — community warmth. Numbers are blanks until the client sends real counts. */}
      <Section id="impact" tone="white" heading={t(strings.home.impactHeading)}>
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <p className="text-lg leading-relaxed text-ink/80">{t(strings.home.impactBlurb)}</p>
          <dl className="grid grid-cols-3 gap-4">
            {IMPACT_STATS.map((stat) => (
              <div
                key={stat.key}
                className="rounded-xl border border-brand/10 bg-sand p-4 text-center"
              >
                <dt className="sr-only">{t(strings.home.impactLabels[stat.key])}</dt>
                <dd className="text-2xl font-bold text-brand">
                  <Todo>{stat.value}</Todo>
                </dd>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink/60">
                  {t(strings.home.impactLabels[stat.key])}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Awards teaser */}
      <Section
        id="awards-teaser"
        heading={t(strings.home.awardsHeading)}
        action={
          <Link to="/awards" className="font-semibold text-brand hover:text-brand-deep">
            {t(strings.actions.viewAll)} →
          </Link>
        }
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AWARD_PLACEHOLDERS.slice(0, 3).map((award) => (
            <li
              key={award.id}
              className="rounded-xl border border-brand/10 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-gold">
                <Todo>{award.year}</Todo>
              </p>
              <h3 className="mt-3 font-bold text-brand">
                <Todo>{award.title}</Todo>
              </h3>
            </li>
          ))}
        </ul>
      </Section>

      {/* Gallery preview */}
      <Section
        id="gallery-preview"
        tone="white"
        heading={t(strings.home.galleryHeading)}
        action={
          <Link to="/gallery" className="font-semibold text-brand hover:text-brand-deep">
            {t(strings.actions.viewAll)} →
          </Link>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_PLACEHOLDERS.slice(0, 6).map((photo) => (
            <PhotoPlaceholder key={photo.id} label={photo.caption} />
          ))}
        </div>
      </Section>
    </>
  )
}
