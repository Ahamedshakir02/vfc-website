import Todo from './Todo.jsx'

/**
 * Stand-in for the real photography, which hasn't been handed over yet
 * (spec: "Event photos and award records/dates still not handed over").
 */
export default function PhotoPlaceholder({ label, ratio = 'aspect-[4/3]', className = '' }) {
  return (
    <div
      className={`${ratio} ${className} flex items-center justify-center overflow-hidden rounded-xl border border-brand/15 bg-brand/5 p-4 text-center`}
    >
      <Todo>{label}</Todo>
    </div>
  )
}
