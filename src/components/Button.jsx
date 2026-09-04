import { Link } from 'react-router-dom'

/**
 * Flat, square-cornered buttons.
 *
 * The brief rules out pill shapes and the rounded-card-with-shadow kit: this
 * is a crest/badge identity, not a SaaS product. So: hard edges, flat fill,
 * no shadow, no arrow suffix.
 */
const variants = {
  // The one loud accent — reserved for the primary action.
  gold: 'bg-gold text-brand-deep hover:bg-brand-deep hover:text-white',
  brand: 'bg-brand text-white hover:bg-brand-deep',
  // For use on purple surfaces.
  outlineLight: 'border border-white/45 text-white hover:bg-white hover:text-brand',
  outlineDark: 'border border-brand/35 text-brand hover:bg-brand hover:text-white',
}

export default function Button({ to, href, variant = 'brand', className = '', children, ...rest }) {
  const classes = [
    'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold',
    'transition-colors duration-150',
    variants[variant],
    className,
  ].join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  )
}
