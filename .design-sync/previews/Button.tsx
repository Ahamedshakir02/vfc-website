import { Button } from 'vfc-club-website'

const row = { display: 'flex', flexWrap: 'wrap' as const, gap: 12, alignItems: 'center', padding: 24 }
const purple = { ...row, background: 'var(--color-brand)', borderRadius: 'var(--radius-tile)' }

export const OnLight = () => (
  <div style={row}>
    <Button to="/contact" variant="gold">Get in touch</Button>
    <Button to="/about" variant="brand">Read more</Button>
    <Button to="/awards" variant="outlineDark">View all</Button>
  </div>
)

export const OnPurple = () => (
  <div style={purple}>
    <Button to="/about" variant="gold">Read more</Button>
    <Button to="/contact" variant="outlineLight">Contact</Button>
  </div>
)

export const Sizes = () => (
  <div style={row}>
    <Button to="/contact" variant="gold" size="md">Register now</Button>
    <Button to="/contact" variant="gold" size="sm">Contact</Button>
  </div>
)

export const ExternalLink = () => (
  <div style={row}>
    <Button href="https://example.com" variant="brand" target="_blank" rel="noreferrer">
      Open the fixture list
    </Button>
  </div>
)
