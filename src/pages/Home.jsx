import { Link } from 'react-router-dom'
import Section from '../components/Section.jsx'
import Sample from '../components/Sample.jsx'
import Button from '../components/Button.jsx'
import Crest from '../components/Crest.jsx'
import Cut from '../components/Cut.jsx'
import Ball from '../components/Ball.jsx'
import Marquee from '../components/Marquee.jsx'
import PhotoPlaceholder from '../components/PhotoPlaceholder.jsx'
import Words from '../components/motion/Words.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'
import { gsap, EASE, introDelay, prefersReducedMotion, useGsap } from '../lib/motion.js'
import { usePageTitle } from '../lib/usePageTitle.js'
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
          className="ml-auto rounded-control bg-brand-deep px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand"
        >
          {t(strings.actions.registerNow)}
        </Link>
      </div>
    </div>
  )
}

/**
 * The hero is where the boldness is spent: flat brand purple cut off on a
 * diagonal, like a goal line, with a ball resting on it. Scroll and the ball
 * rolls down the line and off the pitch. Click it and it gets kicked.
 */
function Hero() {
  const { t, lang } = useLang()
  const [mark, ...rest] = t(strings.home.heroHeadline).split(' ')

  const ref = useGsap(() => {
    const root = ref.current
    const roll = root.querySelector('.ball-roll')

    // Load: the mark rises letter by letter, the pitch draws in, the ball drops.
    const tl = gsap.timeline({ delay: introDelay(), defaults: { ease: EASE } })
    tl.from('.hero-char', { yPercent: 115, duration: 1.2, stagger: 0.09 })
      .from('.hero-name .word', { yPercent: 115, duration: 1, stagger: 0.05 }, 0.3)
      .from('.hero-tag .word', { yPercent: 115, duration: 1, stagger: 0.05 }, 0.5)
      .from('.hero-fade', { opacity: 0, y: 18, duration: 1, stagger: 0.09 }, 0.75)
      .from('.hero-crest', { opacity: 0, scale: 0.9, duration: 1.5 }, 0.25)
      .from('.pitch-line', { strokeDashoffset: 1, duration: 1.8, ease: 'power2.inOut', stagger: 0.15 }, 0.2)
      .from('.ball-drop', { y: () => -root.offsetHeight, duration: 1.25, ease: 'bounce.out' }, 0.7)

    // Scroll: copy and crest part at different speeds, and the ball rolls
    // down the goal line, turning exactly as far as it travels.
    const scroll = { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.3, invalidateOnRefresh: true }
    const size = () => roll.offsetWidth
    const width = () => root.offsetWidth
    const cut = () => root.querySelector('.ball-track').offsetHeight
    const from = () => width() * (width() < 640 ? 0.68 : 0.8)
    const to = () => -size() * 1.6
    // Height of the diagonal under the ball's centre, measured up from the low corner.
    const lift = (x) => -(cut() * (x + size() / 2)) / width()

    gsap.fromTo(
      roll,
      { x: from, y: () => lift(from()), rotation: 0 },
      {
        x: to,
        y: () => lift(to()),
        rotation: () => (-(from() - to()) / (size() / 2)) * (180 / Math.PI),
        ease: 'none',
        scrollTrigger: scroll,
      },
    )
    gsap.to('.hero-copy', { yPercent: -10, ease: 'none', scrollTrigger: scroll })
    gsap.to('.hero-crest-wrap', { yPercent: 16, ease: 'none', scrollTrigger: scroll })
  }, [lang])

  const kick = (e) => {
    if (prefersReducedMotion()) return
    const ball = e.currentTarget
    if (gsap.isTweening(ball)) return
    gsap
      .timeline()
      .to(ball, { y: -190, duration: 0.42, ease: 'power2.out' })
      .to(ball, { y: 0, duration: 0.95, ease: 'bounce.out' })
      .to(ball, { rotation: '+=540', duration: 1.37, ease: 'power2.out' }, 0)
  }

  return (
    <div ref={ref} className="relative">
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="mx-auto grid min-h-[100svh] max-w-6xl content-center items-center gap-10 px-5 pb-40 pt-28 sm:px-8 md:grid-cols-[1.3fr_1fr] md:pb-44 md:pt-32">
          <div className="hero-copy will-change-transform">
            <h1 className="font-extrabold">
              <span className="block text-[34vw] sm:text-[13rem] md:text-[11rem] lg:text-[17rem] leading-[0.78] tracking-[-0.03em]">
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
            <p className="hero-fade mt-5 max-w-xl leading-relaxed text-white/80 sm:text-lg">
              {t(strings.home.heroSubline)}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <div className="hero-fade">
                <Button to="/about" variant="gold">
                  {t(strings.actions.readMore)}
                </Button>
              </div>
              <div className="hero-fade">
                <Button to="/contact" variant="outlineLight">
                  {t(strings.nav.contact)}
                </Button>
              </div>
            </div>
          </div>

          {/* The crest stands on the centre spot: halfway line through it, circle around it. */}
          <div className="hero-crest-wrap relative hidden justify-self-center will-change-transform md:block">
            <svg
              aria-hidden="true"
              viewBox="0 0 400 400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="pointer-events-none absolute left-1/2 top-1/2 w-[175%] -translate-x-1/2 -translate-y-1/2 overflow-visible text-white/15"
            >
              <line className="pitch-line" x1="200" y1="2" x2="200" y2="1300" pathLength="1" strokeDasharray="1" />
              <circle className="pitch-line" cx="200" cy="200" r="198" pathLength="1" strokeDasharray="1" />
            </svg>
            <img
              src="/logo/vfc-crest-white.png"
              alt=""
              aria-hidden="true"
              className="hero-crest relative w-52 lg:w-60"
            />
          </div>
        </div>
        <Cut />
      </section>

      {/* Sits outside the section, which hides its overflow, so the ball can ride the diagonal edge. */}
      <div className="ball-track pointer-events-none absolute inset-x-0 bottom-0 h-[var(--cut)]">
        {/* With motion off the ball simply rests on the line, three-quarters across. */}
        <div className="ball-roll absolute bottom-0 left-0 h-14 w-14 will-change-transform motion-reduce:bottom-[calc(var(--cut)*0.8)] motion-reduce:left-3/4 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
          <div className="ball-drop h-full w-full">
            <div className="pointer-events-auto h-full w-full cursor-pointer" onClick={kick}>
              <Ball id="hero-ball" className="block h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
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
      <dt className="mt-3 text-sm text-ink/60">{label}</dt>
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

export default function Home() {
  const { t } = useLang()
  usePageTitle()

  // TODO (stage 2): replace with the first `events` doc where status === 'open'.
  const openEvent = null

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

  // Mosaic: each photo slides up into its frame while it settles back to size.
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
      <RegistrationStrip openEvent={openEvent} />

      <Hero />

      <Marquee
        className="py-8 font-display text-5xl font-extrabold text-brand sm:py-12 sm:text-7xl"
        items={[
          t(strings.name.arts),
          t(strings.name.sports),
          t(strings.name.welfare),
          t(strings.home.heroTagline),
        ]}
      />

      {/* Impact — sample figures until the client sends real counts. */}
      <Section id="impact" heading={t(strings.home.impactHeading)}>
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
      </Section>

      {/* Awards shelf — unequal tiles on a shared baseline, like trophies. */}
      <Section
        id="awards-teaser"
        tone="white"
        heading={t(strings.home.awardsHeading)}
        action={
          <Link to="/awards" className="link-grow font-semibold text-brand">
            {t(strings.actions.viewAll)}
          </Link>
        }
      >
        <div ref={shelf}>
          <ul className="flex flex-wrap items-end gap-3 overflow-hidden pb-3">
            {AWARD_PLACEHOLDERS.slice(0, 3).map((award, i) => (
              <li
                key={award.id}
                className="shelf-item group flex-1 rounded-tile border border-brand/15 bg-white px-6 pb-7 transition-colors duration-500 hover:bg-sand"
                // Unequal heights standing on one baseline — a shelf, not a card grid.
                style={{ paddingTop: `${2.5 + i * 1.75}rem`, minWidth: '13rem' }}
              >
                <Crest draw className="h-9 w-9 text-gold transition-transform duration-500 ease-out group-hover:-translate-y-1.5" />
                <p className="mt-5 font-display text-2xl font-bold text-brand/35">
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
      </Section>

      {/* Gallery — asymmetric mosaic, mixed tile sizes. */}
      <Section
        id="gallery-preview"
        heading={t(strings.home.galleryHeading)}
        action={
          <Link to="/gallery" className="link-grow font-semibold text-brand">
            {t(strings.actions.viewAll)}
          </Link>
        }
      >
        <div ref={mosaic} className="grid auto-rows-[8rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-4">
          {GALLERY_PLACEHOLDERS.slice(0, 4).map((photo, i) => (
            <PhotoPlaceholder
              key={photo.id}
              scene={photo.scene}
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
        <Cut edge="top" />
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-44">
          <h2 className="display-xl max-w-4xl font-extrabold">
            <Words text={t(strings.home.heroTagline)} />
          </h2>
          <Reveal className="mt-10 flex flex-wrap gap-3">
            <Button to="/contact" variant="gold">
              {t(strings.contact.heading)}
            </Button>
            <Button to="/about" variant="outlineLight">
              {t(strings.about.heading)}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
