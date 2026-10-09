import { Header } from 'vfc-club-website'

// The header is fixed to the viewport. The transform makes this box its
// containing block, so it sits at the top of the frame instead of the page.
const frame = {
  position: 'relative' as const,
  transform: 'translateZ(0)',
  height: 220,
  overflow: 'hidden',
  background: 'var(--color-brand)',
  color: '#fff',
}

export const OverThePurpleHero = () => (
  <div style={frame}>
    <Header />
    <p style={{ margin: 0, padding: '112px 32px 0', fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800 }}>
      About VFC
    </p>
  </div>
)
