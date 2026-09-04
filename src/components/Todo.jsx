/**
 * Visible placeholder marker.
 *
 * Every bracketed placeholder from vfc-club-website-copy.md renders through
 * this so it is impossible to ship a page with a fake fact still in it.
 * Grep for `<Todo` to find everything still waiting on the client.
 */
export default function Todo({ children, block = false }) {
  const Tag = block ? 'div' : 'span'
  return (
    <Tag
      data-todo="true"
      title="Placeholder — real content needed from the client"
      className={[
        'border border-dashed border-gold bg-gold/10 font-medium text-brand-deep',
        block ? 'block px-4 py-3 text-sm' : 'inline-block px-1.5 py-0.5 text-[0.9em]',
      ].join(' ')}
    >
      <span aria-hidden="true" className="mr-1 select-none text-gold">
        ⚑
      </span>
      {children}
    </Tag>
  )
}
