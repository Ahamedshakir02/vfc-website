/**
 * Shield motif for award entries — ties back to the actual club crest rather
 * than reaching for a generic star or ribbon.
 */
export default function Crest({ className = 'h-6 w-6', draw = false }) {
  // `draw` normalises every stroke to length 1 so it can be drawn in on scroll.
  const stroke = draw ? { pathLength: 1, strokeDasharray: 1 } : {}

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.5 4 5.2v6.4c0 4.6 3.2 8.1 8 9.9 4.8-1.8 8-5.3 8-9.9V5.2L12 2.5Z" {...stroke} />
      <circle cx="12" cy="10.4" r="2.6" {...stroke} />
      <path d="M9.4 14.6h5.2" {...stroke} />
    </svg>
  )
}
