import { Sample } from 'vfc-club-website'

const label = { margin: 0, fontSize: 14, color: 'color-mix(in srgb, var(--color-ink) 55%, transparent)' }
const value = {
  margin: '6px 0 0',
  fontFamily: 'var(--font-display)',
  fontSize: 28,
  fontWeight: 600,
  color: 'var(--color-brand)',
}

// Sample reads as ordinary text; it only adds a tooltip and a data-sample attribute.
export const AroundAContactDetail = () => (
  <div style={{ padding: 24 }}>
    <p style={label}>Phone</p>
    <p style={value}>
      <Sample>+91 00000 00000</Sample>
    </p>
  </div>
)

export const InsideASentence = () => (
  <p style={{ margin: 0, padding: 24, maxWidth: 460, fontSize: 18, lineHeight: 1.6, color: 'var(--color-ink)' }}>
    VFC Arts, Sports & Welfare Club was founded to give the people of <Sample>Vellalur</Sample> a place to play,
    train, and grow.
  </p>
)
