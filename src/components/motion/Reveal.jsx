import { gsap, EASE, useGsap } from '../../lib/motion.js'

/**
 * Content arrives once as it enters the viewport, then stays put.
 *
 * Pass `stagger` to bring the direct children in one after another instead of
 * moving the wrapper as a single block.
 */
export default function Reveal({
  as: Tag = 'div',
  stagger = 0,
  y = 28,
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const ref = useGsap(() => {
    gsap.from(stagger ? ref.current.children : ref.current, {
      y,
      opacity: 0,
      duration: 1,
      ease: EASE,
      stagger,
      delay,
      scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
    })
  })

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
