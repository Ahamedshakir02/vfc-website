import { Crest } from 'vfc-club-website'

const row = { display: 'flex', alignItems: 'center', gap: 24, padding: 24 }

export const Gold = () => (
  <div style={row}>
    <Crest className="h-6 w-6 text-gold" />
    <Crest className="h-10 w-10 text-gold" />
    <div style={{ width: 72, height: 72 }}>
      <Crest className="block h-full w-full text-gold" />
    </div>
  </div>
)

export const BesideAnAward = () => (
  <div style={{ padding: 24, maxWidth: 280 }}>
    <Crest className="h-10 w-10 text-gold" />
    <p
      style={{
        margin: '16px 0 0',
        fontFamily: 'var(--font-display)',
        fontSize: 28,
        fontWeight: 700,
        color: 'color-mix(in srgb, var(--color-brand) 35%, transparent)',
      }}
    >
      2024
    </p>
    <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-brand)' }}>
      District league winners
    </p>
  </div>
)

export const OnPurple = () => (
  <div style={{ ...row, background: 'var(--color-brand)', borderRadius: 'var(--radius-tile)', display: 'inline-flex' }}>
    <Crest className="h-10 w-10 text-white" />
    <Crest className="h-10 w-10 text-gold" />
  </div>
)
