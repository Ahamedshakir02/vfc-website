/*
  A flat football drawn to match the crest: a centre panel, five seams, five
  rim panels. Generated rather than hand-plotted so the panels stay regular.
*/
const point = (radius, degrees) => {
  const a = (degrees * Math.PI) / 180
  return `${(50 + radius * Math.cos(a)).toFixed(2)},${(50 + radius * Math.sin(a)).toFixed(2)}`
}

const SPOKES = [-90, -18, 54, 126, 198]
const CENTRE = SPOKES.map((a) => point(17, a)).join(' ')
const RIM = SPOKES.map((a) =>
  [point(35, a), point(43, a - 21), point(56, a - 15), point(56, a + 15), point(43, a + 21)].join(' '),
)

export default function Ball({ className = '', panel = 'var(--color-brand-deep)', id = 'ball' }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle cx="50" cy="50" r="47" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="#fff" />
      <g clipPath={`url(#${id}-clip)`} fill={panel} stroke={panel} strokeLinejoin="round">
        <polygon points={CENTRE} strokeWidth="2" />
        {RIM.map((points) => (
          <polygon key={points} points={points} strokeWidth="2" />
        ))}
        {SPOKES.map((a) => (
          <polyline key={a} points={`${point(17, a)} ${point(35, a)}`} strokeWidth="2.5" fill="none" />
        ))}
      </g>
      <circle cx="50" cy="50" r="47" fill="none" stroke={panel} strokeWidth="2.5" />
    </svg>
  )
}
