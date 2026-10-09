import { PageHero, Button } from 'vfc-club-website'

export const TitleAndLede = () => (
  <PageHero
    heading="About VFC"
    lede="VFC Arts, Sports & Welfare Club trains athletes, supports local talent, and gives back to the community it calls home."
  />
)

export const WithAction = () => (
  <PageHero heading="Get in touch" lede="Where sport meets community.">
    <Button to="/contact" variant="gold">
      Register now
    </Button>
  </PageHero>
)

export const TitleOnly = () => <PageHero heading="Awards" />
