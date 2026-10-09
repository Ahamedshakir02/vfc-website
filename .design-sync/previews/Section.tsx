import { Section, Button } from 'vfc-club-website'

const body = { margin: 0, maxWidth: 560, fontSize: 18, lineHeight: 1.6 }
const link = { fontWeight: 600, color: 'var(--color-brand)' }

export const HeadingAndAction = () => (
  <Section
    heading="Our awards"
    tone="white"
    action={
      <a href="#awards" className="link-grow" style={link}>
        View all
      </a>
    }
  >
    <p style={body}>Every match, every event, every award is proof of what a community can build together.</p>
  </Section>
)

export const LightTone = () => (
  <Section heading="More than a club">
    <p style={body}>For years, VFC has brought together players, families, and volunteers, on the field and off it.</p>
  </Section>
)

export const BrandTone = () => (
  <Section heading="Where sport meets community." tone="brand">
    <Button to="/contact" variant="gold">
      Get in touch
    </Button>
  </Section>
)

export const DeepTone = () => (
  <Section heading="Moments from our events" tone="deep">
    <p style={body}>The darkest surface, used for the footer and the mobile menu.</p>
  </Section>
)

export const NoHeading = () => (
  <Section tone="white">
    <p style={body}>Without a heading the section is just the content column and its vertical rhythm.</p>
  </Section>
)
