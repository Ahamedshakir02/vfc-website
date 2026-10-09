import { Marquee } from 'vfc-club-website'

export const ClubWords = () => (
  <div style={{ background: 'var(--color-sand)' }}>
    <Marquee
      className="py-8 font-display text-5xl font-extrabold text-brand sm:py-12 sm:text-7xl"
      items={['Arts', 'Sports', 'Welfare', 'Where sport meets community.']}
    />
  </div>
)

export const OnPurple = () => (
  <div style={{ background: 'var(--color-brand)' }}>
    <Marquee
      className="py-8 font-display text-5xl font-extrabold text-white"
      items={['Registration open', 'District Football League', 'Vellalur']}
    />
  </div>
)
