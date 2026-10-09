/*
  Flat, brand-coloured scenes that stand in for photography until the club's
  real photos arrive. Drawn rather than downloaded, so there is no stock image
  to license and nothing that could be mistaken for a real event.
*/
const brand = 'var(--color-brand)'
const deep = 'var(--color-brand-deep)'
const gold = 'var(--color-gold)'
const tint = '#e9e4f4'
const line = { fill: 'none', stroke: '#fff', strokeOpacity: 0.3, strokeWidth: 3 }

const SCENES = {
  // Kick-off: halfway line, centre circle, the ball on the spot.
  centre: (
    <>
      <rect width="400" height="300" fill={brand} />
      <g {...line}>
        <line x1="200" y1="-10" x2="200" y2="310" />
        <circle cx="200" cy="150" r="80" />
      </g>
      <circle cx="200" cy="150" r="10" fill={gold} />
    </>
  ),
  // Stage lights: rings opening out from the front of the stage.
  stage: (
    <>
      <rect width="400" height="300" fill={gold} />
      <g fill="none" stroke={deep} strokeWidth="3" strokeOpacity="0.45">
        <circle cx="200" cy="310" r="70" />
        <circle cx="200" cy="310" r="135" />
        <circle cx="200" cy="310" r="200" />
        <circle cx="200" cy="310" r="265" />
      </g>
      <circle cx="200" cy="310" r="26" fill={deep} />
    </>
  ),
  // Club colours: a striped scarf.
  stripes: (
    <>
      <rect width="400" height="300" fill={deep} />
      <g fill={brand}>
        <polygon points="-40,300 60,300 260,0 160,0" />
        <polygon points="160,300 260,300 460,0 360,0" />
      </g>
      <polygon points="92,300 108,300 308,0 292,0" fill={gold} />
    </>
  ),
  // The goal: frame and net.
  goal: (
    <>
      <rect width="400" height="300" fill={tint} />
      <g stroke={brand} strokeOpacity="0.2" strokeWidth="2">
        {[110, 150, 190, 230, 270].map((x) => (
          <line key={x} x1={x} y1="95" x2={x} y2="300" />
        ))}
        {[135, 175, 215, 255].map((y) => (
          <line key={y} x1="70" y1={y} x2="330" y2={y} />
        ))}
      </g>
      <path d="M70 300V95H330V300" fill="none" stroke={brand} strokeWidth="9" strokeLinejoin="round" />
      <circle cx="252" cy="262" r="16" fill={gold} />
    </>
  ),
  // The corner: arc, pole and flag.
  corner: (
    <>
      <rect width="400" height="300" fill={brand} />
      <g {...line}>
        <circle cx="70" cy="250" r="95" />
        <line x1="70" y1="250" x2="420" y2="250" />
      </g>
      <line x1="70" y1="250" x2="70" y2="70" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <polygon points="70,72 168,104 70,136" fill={gold} />
    </>
  ),
  // Hands together: three overlapping rounds.
  together: (
    <>
      <rect width="400" height="300" fill={tint} />
      <circle cx="150" cy="170" r="92" fill={brand} />
      <circle cx="255" cy="170" r="92" fill={deep} fillOpacity="0.85" />
      <circle cx="202" cy="98" r="58" fill={gold} />
    </>
  ),
  // Where to find the club: roads and a pin.
  map: (
    <>
      <rect width="400" height="300" fill={tint} />
      <g fill="none" stroke="#fff" strokeWidth="16" strokeLinecap="round">
        <path d="M-20 210 150 170 250 250 430 200" />
        <path d="M120 -20 150 170 110 330" />
        <path d="M300 -20 250 250" />
      </g>
      <path d="M200 60c-30 0-52 22-52 50 0 38 52 86 52 86s52-48 52-86c0-28-22-50-52-50Z" fill={brand} />
      <circle cx="200" cy="110" r="18" fill={gold} />
    </>
  ),
}

export default function PlaceholderArt({ scene = 'centre', className = '' }) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      {SCENES[scene] ?? SCENES.centre}
    </svg>
  )
}
