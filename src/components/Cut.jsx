/**
 * The diagonal cut — a goal line rather than a straight rectangle edge.
 *
 * Drawn as a wedge of the neighbouring section's colour laid over the edge.
 * Clipping the whole section would look the same, but it makes the browser
 * repaint the entire hero on every frame that something inside it moves.
 * The parent needs `relative overflow-hidden`.
 */
export default function Cut({ edge = 'bottom', className = 'text-sand' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 z-10 h-[var(--cut)] w-full ${
        edge === 'bottom' ? '-bottom-px' : '-top-px'
      } ${className}`}
    >
      <polygon fill="currentColor" points={edge === 'bottom' ? '0,100 100,100 100,0' : '0,0 100,0 0,100'} />
    </svg>
  )
}
