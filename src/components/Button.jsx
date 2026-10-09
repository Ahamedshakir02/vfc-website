import { Link } from 'react-router-dom'
import { gsap, MOTION_OK } from '../lib/motion.js'

/**
 * Flat buttons with eased corners.
 *
 * The brief rules out pill shapes and the card-with-shadow kit: this is a
 * crest/badge identity, not a SaaS product. So: a small corner radius, flat
 * fill, no shadow, no arrow suffix. On hover the second colour rises from the
 * bottom edge, and with a mouse the button leans toward the pointer.
 */
const variants = {
  // The one loud accent — reserved for the primary action.
  gold: 'bg-gold text-brand-deep before:bg-white',
  brand: 'bg-brand text-white before:bg-brand-deep',
  // For use on purple surfaces.
  outlineLight: 'border border-white/45 text-white before:bg-white hover:text-brand',
  outlineDark: 'border border-brand/35 text-brand before:bg-brand hover:text-white',
}

const canLean = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  window.matchMedia(MOTION_OK).matches

function lean(e) {
  if (!canLean()) return
  const el = e.currentTarget
  const box = el.getBoundingClientRect()
  gsap.to(el, {
    x: (e.clientX - (box.left + box.width / 2)) * 0.25,
    y: (e.clientY - (box.top + box.height / 2)) * 0.35,
    duration: 0.4,
    ease: 'power3.out',
  })
}

function settle(e) {
  gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' })
}

// `sm` is for tight spots such as the header bar.
const sizes = {
  md: 'px-7 py-3.5',
  sm: 'px-4 py-2',
}

export default function Button({ to, href, variant = 'brand', size = 'md', className = '', children, ...rest }) {
  const classes = [
    'relative isolate inline-flex items-center justify-center overflow-hidden rounded-control text-sm font-semibold',
    sizes[size],
    'transition-colors duration-300',
    "before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:content-['']",
    'before:transition-transform before:duration-300 before:ease-out hover:before:scale-y-100',
    variants[variant],
    className,
  ].join(' ')

  const props = { className: classes, onPointerMove: lean, onPointerLeave: settle, ...rest }

  if (to) {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
