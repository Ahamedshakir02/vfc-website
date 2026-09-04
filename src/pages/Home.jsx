import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Todo from '../components/Todo.jsx'
import Button from '../components/Button.jsx'
import Crest from '../components/Crest.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { AWARD_PLACEHOLDERS, GALLERY_PLACEHOLDERS, IMPACT_STATS } from '../data/placeholders.js'

/**
 * Full-width gold strip, scoreboard-style — flashes urgent status across the
 * page. Not a pill, not a card.
 *
 * The spec's banner renders only when an event's status is `open`. Stage 1 has
 * no Firestore, so `openEvent` is always null and the strip stays hidden.
 */
function RegistrationStrip({ openEvent }) {
  const { t } = useLang()
  if (!openEvent) return null

  return (
    <div className="bg-gold text-brand-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
        <p className="font-semibold">
          {t(strings.home.registrationBanner, {
            event: openEvent.title,
            date: openEvent.closesOn,
          })}
        </p>
        <Link
          to="/events"
          className="ml-auto bg-brand-deep px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand"
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
      <RegistrationStrip openEvent={openEvent} />

      {/*
        The hero is where all the boldness is spent: flat brand purple cut off
        on a diagonal, like a goal line. Everything below it stays quiet.
      */}
      <section
        className="relative bg-brand text-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4.5rem), 0 100%)' }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-36 pt-20 sm:px-8 sm:pt-28 md:grid-cols-[1.25fr_1fr]">
          <div className="hero-settle">
            <h1 className="text-4xl font-extrabold sm:text-6xl">
              {t(strings.home.heroHeadline)}
            </h1>
            <p className="mt-4 font-display text-2xl font-semibold text-gold sm:text-3xl">
              {t(strings.home.heroTagline)}
            </p>
            <p className="mt-5 max-w-xl leading-relaxed text-white/80 sm:text-lg">
              {t(strings.home.heroSubline)}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/about" variant="gold">
                {t(strings.actions.readMore)}
              </Button>
              <Button to="/contact" variant="outlineLight">
                {t(strings.nav.contact)}
              </Button>
            </div>
          </div>

          <div className="justify-self-center">
            <img
              src="/logo/vfc-logo-white.png"
              alt=""
              aria-hidden="true"
              className="w-52 sm:w-72"
            />
          </div>
        </div>
      </section>

      {/* Impact — numbers stay blank until the client sends real counts. */}
      <Section id="impact" heading={t(strings.home.impactHeading)}>
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-start">
          <p className="text-lg leading-relaxed text-ink/80">{t(strings.home.impactBlurb)}</p>
          <dl className="grid grid-cols-3 gap-px bg-brand/15">
            {IMPACT_STATS.map((stat) => (
              <div key={stat.key} className="bg-sand px-4 py-5">
                <dt className="sr-only">{t(strings.home.impactLabels[stat.key])}</dt>
                <dd className="font-display text-2xl font-bold text-brand">
                  <Todo>{stat.value}</Todo>
                </dd>
                <p className="mt-2 text-sm text-ink/60">
                  {t(strings.home.impactLabels[stat.key])}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Awards shelf — unequal tiles on a shared baseline, like trophies. */}
      <Section
        id="awards-teaser"
        tone="white"
        heading={t(strings.home.awardsHeading)}
        action={
          <Link to="/awards" className="font-semibold text-brand underline-offset-4 hover:underline">
            {t(strings.actions.viewAll)}
          </Link>
        }
      >
        <ul className="flex flex-wrap items-end gap-px bg-brand/15">
          {AWARD_PLACEHOLDERS.slice(0, 3).map((award, i) => (
            <li
              key={award.id}
              className="flex-1 bg-white px-6 pb-6"
              // Unequal heights sitting on one baseline — the shelf, not a card grid.
              style={{ paddingTop: `${2.5 + i * 1.25}rem`, minWidth: '13rem' }}
            >
              <Crest className="h-7 w-7 text-gold" />
              <p className="mt-4 font-semibold text-ink/60">
                <Todo>{award.year}</Todo>
              </p>
              <h3 className="mt-2 font-bold text-brand">
                <Todo>{award.title}</Todo>
              </h3>
            </li>
          ))}
        </ul>
      </Section>

      {/* Gallery — asymmetric mosaic, mixed tile sizes. */}
      <Section
        id="gallery-preview"
        heading={t(strings.home.galleryHeading)}
        action={
          <Link to="/gallery" className="font-semibold text-brand underline-offset-4 hover:underline">
            {t(strings.actions.viewAll)}
          </Link>
        }
      >
        <div className="grid auto-rows-[8rem] grid-cols-2 gap-3 sm:grid-cols-4">
          {GALLERY_PLACEHOLDERS.slice(0, 5).map((photo, i) => (
            <PhotoPlaceholder
              key={photo.id}
              label={photo.caption}
              className={
                // Mixed spans so the mosaic reads as real photos, not a uniform grid.
                ['col-span-2 row-span-2', '', '', 'col-span-2', ''][i]
              }
            />
          ))}
        </div>
      </Section>
    </>
  )
}
