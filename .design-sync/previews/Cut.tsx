import { Cut } from 'vfc-club-website'

// The parent must be `position: relative; overflow: hidden`.
const band = {
  position: 'relative' as const,
  overflow: 'hidden',
  background: 'var(--color-brand)',
  color: '#fff',
  padding: '40px 32px 96px',
  fontFamily: 'var(--font-display)',
  fontSize: 40,
  fontWeight: 800,
}
const note = { padding: '16px 32px 32px', color: 'var(--color-ink)' }

export const BottomEdge = () => (
  <div style={{ background: 'var(--color-sand)' }}>
    <div style={band}>
      Awards
      <Cut />
    </div>
    <div style={note}>The next section starts under the diagonal.</div>
  </div>
)

export const TopEdge = () => (
  <div style={{ background: 'var(--color-sand)' }}>
    <div style={{ ...note, padding: '32px 32px 16px' }}>The section before the closing band.</div>
    <div style={{ ...band, padding: '96px 32px 40px' }}>
      <Cut edge="top" />
      Where sport meets community.
    </div>
  </div>
)

export const AgainstWhite = () => (
  <div style={{ background: '#fff' }}>
    <div style={band}>
      Gallery
      <Cut className="text-white" />
    </div>
    <div style={note}>Pass the colour of the neighbouring section as a text colour class.</div>
  </div>
)
