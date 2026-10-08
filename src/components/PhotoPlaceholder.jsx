import Todo from './Todo.jsx'

/**
 * Stand-in for the real photography, which hasn't been handed over yet.
 * Square-edged and flat — the brief rules out the rounded-card kit.
 *
 * Pass `ratio` for a fixed shape, or leave it off inside the gallery mosaic,
 * where the grid cell dictates the size.
 */
export default function PhotoPlaceholder({ label, ratio = '', className = '' }) {
  return (
    <div className={`${ratio} ${className} photo h-full min-h-0 overflow-hidden`}>
      <div className="photo-inner hatch flex h-full w-full items-end border border-brand/15 p-3">
        <Todo>{label}</Todo>
      </div>
    </div>
  )
}
