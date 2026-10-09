import { Ball } from 'vfc-club-website'

// The ball has no size of its own: it fills whatever box it is given.
const box = (size: number) => ({ width: size, height: size })

export const OnLight = () => (
  <div style={{ ...box(120), margin: 24 }}>
    <Ball id="ball-light" className="block h-full w-full" />
  </div>
)

export const OnPurple = () => (
  <div style={{ background: 'var(--color-brand)', padding: 32, borderRadius: 'var(--radius-tile)', display: 'inline-block' }}>
    <div style={box(120)}>
      <Ball id="ball-purple" className="block h-full w-full" />
    </div>
  </div>
)

export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, padding: 24 }}>
    {[22, 56, 96].map((size) => (
      <div key={size} style={box(size)}>
        <Ball id={`ball-${size}`} className="block h-full w-full" />
      </div>
    ))}
  </div>
)

export const GoldPanels = () => (
  <div style={{ ...box(120), margin: 24 }}>
    <Ball id="ball-gold" panel="var(--color-gold)" className="block h-full w-full" />
  </div>
)
