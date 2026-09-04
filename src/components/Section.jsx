export default function Section({ id, heading, action, tone = 'light', className = '', children }) {
  const tones = {
    light: 'bg-sand text-ink',
    white: 'bg-white text-ink',
    brand: 'bg-brand text-white',
    deep: 'bg-brand-deep text-white',
  }

  return (
    <section id={id} className={`${tones[tone]} ${className}`}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        {(heading || action) && (
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            {heading && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {heading}
                <span
                  aria-hidden="true"
                  className="mt-3 block h-1 w-14 rounded-full bg-gold"
                />
              </h2>
            )}
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
