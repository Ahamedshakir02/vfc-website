import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Sample from '../components/Sample.jsx'
import Button from '../components/Button.jsx'
import Crest from '../components/Crest.jsx'
import Cut from '../components/Cut.jsx'
import EventStatus from '../components/EventStatus.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import Words from '../components/motion/Words.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { gsap, EASE, introDelay, useGsap } from '../lib/motion.js'
import { usePageTitle } from '../lib/usePageTitle.js'
import { EVENTS, getOpenEvent } from '../data/events.js'
import { EVENT_STATUS } from '../data/schema.js'
import { ILLUSTRATIONS } from '../data/illustrations.js'
import { AWARD_PLACEHOLDERS, GALLERY_PLACEHOLDERS, IMPACT_STATS } from '../data/placeholders.js'

const PILLARS = [
  { key: 'sports', image: 'runner' },
  { key: 'arts', image: 'dancer' },
  { key: 'welfare', image: 'community' },
]

/**
 * The hero is where the boldness is spent: flat brand purple cut off on a
 * diagonal, the club's mark set huge, and one collage picture tipped slightly
 * off square beside it.
 */
function Hero({ openEvent }) {
  const { t, lang } = useLang()
  const [mark, ...rest] = t(strings.home.heroHeadline).split(' ')

  const ref = useGsap(() => {
    // Load: the mark rises letter by letter, then the picture is set down.
    const tl = gsap.timeline({ delay: introDelay(), defaults: { ease: EASE } })
    tl.from('.hero-char', { yPercent: 115, duration: 1.2, stagger: 0.09 })
      .from('.hero-name .word', { yPercent: 115, duration: 1, stagger: 0.05 }, 0.3)
      .from('.hero-tag .word', { yPercent: 115, duration: 1, stagger: 0.05 }, 0.5)
      .from('.hero-fade', { opacity: 0, y: 18, duration: 1, stagger: 0.09 }, 0.75)
      .from('.hero-art', { opacity: 0, y: 48, rotate: -4, duration: 1.4 }, 0.35)

    // Scroll: copy and picture part at different speeds.
    const scroll = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.3 }
    gsap.to('.hero-copy', { yPercent: -10, ease: 'none', scrollTrigger: scroll })
    gsap.to('.hero-art-drift', { yPercent: 12, ease: 'none', scrollTrigger: scroll })
  }, [lang])

  return (
    <section ref={ref} className="relative overflow-hidden bg-brand text-white">
      <div className="mx-auto grid min-h-[100svh] max-w-6xl content-center items-center gap-12 px-5 pb-36 pt-28 sm:px-8 md:grid-cols-[1.25fr_1fr] md:pb-40 md:pt-32">
        <div className="hero-copy min-w-0 will-change-transform">
          <h1 className="font-extrabold">
            <span className="block text-[34vw] leading-[0.78] tracking-[-0.03em] sm:text-[13rem] md:text-[11rem] lg:text-[17rem]">
              {mark.split('').map((char, i) => (
                <span key={i} className="word-mask">
                  <span className="hero-char word">{char}</span>
                </span>
              ))}
            </span>{' '}
            <span className="hero-name mt-4 block text-2xl leading-tight sm:text-4xl">
              <Words text={rest.join(' ')} />
            </span>
          </h1>
          <p className="hero-tag mt-5 font-display text-xl font-semibold text-gold sm:text-2xl">
            <Words text={t(strings.home.heroTagline)} />
          </p>
          <p className="hero-fade mt-5 max-w-xl leading-relaxed text-white/85 sm:text-lg">
            {t(strings.home.heroSubline)}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <div className="hero-fade">
              {openEvent ? (
                <Button to={`/events/${openEvent.id}`} variant="gold">
                  {t(strings.actions.registerNow)}
                </Button>
              ) : (
                <Button to="/events" variant="gold">
                  {t(strings.events.whatsOn)}
                </Button>
              )}
            </div>
            <div className="hero-fade">
              <Button to="/about" variant="outlineLight">
                {t(strings.about.heading)}
              </Button>
            </div>
          </div>
        </div>

        <div className="hero-art-drift justify-self-center will-change-transform">
          <div className="hero-art">
            <img
              src={ILLUSTRATIONS.athlete}
              alt=""
              width="900"
              height="1117"
              className="aspect-[4/5] w-full max-w-[26rem] rotate-[1.5deg] rounded-tile object-cover"
            />
          </div>
        </div>
      </div>
      <Cut />
    </section>
  )
}

/** A stat counts up from zero the first time it scrolls into view. */
function Stat({ value, suffix = '', label }) {
  const ref = useGsap(() => {
    const count = { n: 0 }
    gsap.to(count, {
      n: value,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
      onUpdate: () => {
        ref.current.textContent = Math.round(count.n).toLocaleString('en-IN')
      },
    })
  }, [value])

  return (
    <div className="flex flex-col-reverse justify-end bg-sand px-4 py-6 sm:px-6 sm:py-8">
      <dt className="mt-3 text-sm text-ink/65">{label}</dt>
      <dd className="font-display text-3xl font-bold text-brand sm:text-5xl">
        <Sample>
          <span ref={ref}>{value.toLocaleString('en-IN')}</span>
          {suffix}
        </Sample>
      </dd>
    </div>
  )
}

/** The blurb fills in word by word as it is scrolled through. */
function ImpactBlurb({ text }) {
  const ref = useGsap(() => {
    gsap.from('.word', {
      opacity: 0.16,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: ref.current, start: 'top 82%', end: 'bottom 55%', scrub: 0.4 },
    })
  }, [text])

  return (
    <p ref={ref} className="font-display text-2xl font-semibold leading-snug text-brand sm:text-4xl sm:leading-tight">
      <Words text={text} mask={false} />
    </p>
  )
}

/** The open event, large; whatever is coming next, beside it. */
function WhatsOn({ openEvent }) {
  const { t } = useLang()
  const upcoming = EVENTS.filter((event) => event.status === EVENT_STATUS.upcoming).slice(0, 2)

  return (
    <Section
      id="whats-on"
      heading={t(strings.events.whatsOn)}
      action={
        <Link to="/events" className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline text-brand">
          {t(strings.events.allEvents)}
        </Link>
      }
    >
      <Reveal stagger={0.1} className="grid gap-4 md:grid-cols-4">
        {openEvent && (
          <Link
            to={`/events/${openEvent.id}`}
            className="group flex flex-col items-start gap-3.5 rounded-tile bg-brand p-6 text-white sm:p-7 md:col-span-2"
          >
            <div className="h-60 w-full overflow-hidden rounded-control">
              <img
                src={ILLUSTRATIONS[openEvent.image]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <EventStatus status={openEvent.status} />
            <h3 className="text-4xl font-extrabold leading-[1.08]">{t(openEvent.title)}</h3>
            <p className="text-white/85">{t(openEvent.description)}</p>
            <span className="link-grow mt-auto pt-2 font-semibold">{t(strings.events.seeEvent)}</span>
          </Link>
        )}

        {upcoming.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="group flex flex-col overflow-hidden rounded-tile border border-brand/15 bg-white transition-colors duration-300 hover:bg-sand"
          >
            <div className="h-40 overflow-hidden">
              <img
                src={ILLUSTRATIONS[event.image]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col items-start gap-2.5 p-6">
              <EventStatus status={event.status} />
              <h3 className="text-2xl font-bold leading-tight text-brand">
                <Sample>{t(event.title)}</Sample>
              </h3>
              <p className="text-ink/65">
                <Sample>{event.startsOn ?? t(strings.events.toBeAnnounced)}</Sample>
              </p>
            </div>
          </Link>
        ))}
      </Reveal>
    </Section>
  )
}

export default function Home() {
  const { t } = useLang()
  usePageTitle()

  // Stands in for the first `events` document whose status is `open`.
  const openEvent = getOpenEvent()

  // Shelf: the baseline draws across, then each trophy rises onto it.
  const shelf = useGsap(() => {
    const tl = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: { trigger: shelf.current, start: 'top 82%', once: true },
    })
    tl.from('.shelf-line', { scaleX: 0, duration: 1.1 })
      .from('.shelf-item', { yPercent: 28, opacity: 0, duration: 1, stagger: 0.1 }, 0.1)
      .from('.shelf-item path, .shelf-item circle', { strokeDashoffset: 1, duration: 1.2, ease: 'power2.inOut' }, 0.35)
  })

  // Mosaic: each picture slides up into its frame while it settles back to size.
  const mosaic = useGsap(() => {
    gsap.from('.photo-inner', {
      yPercent: 101,
      scale: 1.2,
      duration: 1.2,
      ease: EASE,
      stagger: 0.08,
      scrollTrigger: { trigger: mosaic.current, start: 'top 85%', once: true },
    })
  })

  // Closing band: the tagline rises as the band arrives.
  const closing = useGsap(() => {
    gsap.from('.word', {
      yPercent: 115,
      duration: 1.1,
      ease: EASE,
      stagger: 0.07,
      scrollTrigger: { trigger: closing.current, start: 'top 70%', once: true },
    })
  }, [t(strings.home.heroTagline)])

  return (
    <>
      <Hero openEvent={openEvent} />

      <WhatsOn openEvent={openEvent} />

      {/* Impact, then the three things the club's name promises. */}
      <Section id="impact" tone="white" heading={t(strings.home.impactHeading)}>
        <div className="grid gap-12 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-16">
          <ImpactBlurb text={t(strings.home.impactBlurb)} />
          <Reveal as="dl" stagger={0.1} className="grid grid-cols-3 gap-px overflow-hidden rounded-tile border border-brand/15 bg-brand/15">
            {IMPACT_STATS.map((stat) => (
              <Stat
                key={stat.key}
                value={stat.value}
                suffix={stat.suffix}
                label={t(strings.home.impactLabels[stat.key])}
              />
            ))}
          </Reveal>
        </div>

        <Reveal stagger={0.1} className="mt-14 grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.key} className="overflow-hidden rounded-tile border border-brand/15 bg-sand">
              <img
                src={ILLUSTRATIONS[pillar.image]}
                alt=""
                loading="lazy"
                className="h-52 w-full object-cover"
              />
              <div className="p-6 sm:p-7">
                <h3 className="text-2xl font-bold text-brand">{t(strings.name[pillar.key])}</h3>
                <p className="mt-2 text-ink/70">
                  <Sample>{t(strings.pillars[pillar.key])}</Sample>
                </p>
              </div>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* Awards shelf — unequal tiles on a shared baseline, like trophies. */}
      <Section
        id="awards-teaser"
        heading={t(strings.home.awardsHeading)}
        action={
          <Link to="/awards" className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline text-brand">
            {t(strings.actions.viewAll)}
          </Link>
        }
      >
        <div ref={shelf}>
          <ul className="flex flex-wrap items-end gap-3 overflow-hidden pb-3">
            {AWARD_PLACEHOLDERS.slice(0, 3).map((award, i) => (
              <li
                key={award.id}
                className="shelf-item group flex-1 rounded-tile border border-brand/15 bg-white px-6 pb-7 transition-colors duration-500 hover:bg-brand/5"
                // Unequal heights standing on one baseline — a shelf, not a card grid.
                style={{ paddingTop: `${2.5 + i * 1.75}rem`, minWidth: '13rem' }}
              >
                <Crest draw className="h-9 w-9 text-gold transition-transform duration-500 ease-out group-hover:-translate-y-1.5" />
                <p className="mt-5 font-display text-2xl font-bold text-brand/55">
                  <Sample>{award.year}</Sample>
                </p>
                <h3 className="mt-1 text-lg font-bold text-brand">
                  <Sample>{award.title}</Sample>
                </h3>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="shelf-line block h-1 origin-left rounded-full bg-brand" />
        </div>
        <Reveal className="mt-12">
          <img
            src={ILLUSTRATIONS.trophy}
            alt=""
            loading="lazy"
            className="h-60 w-full rounded-tile object-cover object-[center_30%] sm:h-[26rem]"
          />
        </Reveal>
      </Section>

      {/* Gallery — asymmetric mosaic, mixed tile sizes. */}
      <Section
        id="gallery-preview"
        tone="white"
        heading={t(strings.home.galleryHeading)}
        action={
          <Link to="/gallery" className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline text-brand">
            {t(strings.actions.viewAll)}
          </Link>
        }
      >
        <div ref={mosaic} className="grid auto-rows-[8rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-4">
          {GALLERY_PLACEHOLDERS.slice(0, 4).map((photo, i) => (
            <PhotoPlaceholder
              key={photo.id}
              image={photo.image}
              label={t(strings.name[photo.category])}
              className={
                // Mixed spans so the mosaic reads as real photos, not a uniform grid.
                ['col-span-2 row-span-2', '', '', 'col-span-2'][i]
              }
            />
          ))}
        </div>
      </Section>

      {/* Closing band — mirrors the hero's cut, so the page ends the way it began. */}
      <section ref={closing} className="relative -mb-px overflow-hidden bg-brand text-white">
        <Cut edge="top" className="text-white" />
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-44">
          <h2 className="display-xl max-w-4xl font-extrabold">
            <Words text={t(strings.home.heroTagline)} />
          </h2>
          <Reveal className="mt-10 flex flex-wrap gap-3">
            {openEvent && (
              <Button to={`/events/${openEvent.id}`} variant="gold">
                {t(strings.actions.registerNow)}
              </Button>
            )}
            <Button to="/contact" variant={openEvent ? 'outlineLight' : 'gold'}>
              {t(strings.contact.heading)}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
