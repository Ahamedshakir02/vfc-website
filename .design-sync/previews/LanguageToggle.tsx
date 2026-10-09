import { LanguageToggle } from 'vfc-club-website'

export const OnLight = () => (
  <div style={{ padding: 24, background: 'var(--color-sand)' }}>
    <LanguageToggle />
  </div>
)

export const OnPurple = () => (
  <div style={{ padding: 24, background: 'var(--color-brand)', borderRadius: 'var(--radius-tile)', display: 'inline-block' }}>
    <LanguageToggle onDark />
  </div>
)
