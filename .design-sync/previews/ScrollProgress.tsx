import { ScrollProgress } from 'vfc-club-website'

// Fixed to the bottom of the viewport; the transform pins it to this frame.
// With motion on, the line fills and the ball rolls as the page scrolls.
export const AlongTheBottomEdge = () => (
  <div
    style={{
      position: 'relative',
      transform: 'translateZ(0)',
      height: 140,
      overflow: 'hidden',
      background: '#fff',
      padding: 24,
      color: 'var(--color-ink)',
    }}
  >
    Page content sits above the touchline.
    <ScrollProgress />
  </div>
)
