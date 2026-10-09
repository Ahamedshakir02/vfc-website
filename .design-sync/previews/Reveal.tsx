import { Reveal } from 'vfc-club-website'

const tile = {
  padding: 20,
  border: '1px solid color-mix(in srgb, var(--color-brand) 15%, transparent)',
  borderRadius: 'var(--radius-tile)',
  background: '#fff',
  color: 'var(--color-ink)',
}

// With motion on, the block (or each child) rises in once as it scrolls into view.
export const OneBlock = () => (
  <div style={{ padding: 24, maxWidth: 420 }}>
    <Reveal>
      <div style={tile}>For years, VFC has brought together players, families, and volunteers.</div>
    </Reveal>
  </div>
)

export const StaggeredChildren = () => (
  <div style={{ padding: 24 }}>
    <Reveal stagger={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 150px)', gap: 12 }}>
      <div style={tile}>Members</div>
      <div style={tile}>Events run</div>
      <div style={tile}>Awards won</div>
    </Reveal>
  </div>
)

export const AsAList = () => (
  <div style={{ padding: 24 }}>
    <Reveal
      as="ul"
      stagger={0.08}
      style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8, maxWidth: 320 }}
    >
      <li style={tile}>Address</li>
      <li style={tile}>Phone</li>
      <li style={tile}>Email</li>
    </Reveal>
  </div>
)
