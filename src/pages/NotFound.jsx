import Button from '../components/Button.jsx'
import PageHero from '../components/PageHero.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { strings } from '../i18n/strings.js'

export default function NotFound() {
  const { t } = useLang()
  return (
    <PageHero heading="404" lede="This page doesn't exist yet.">
      <Button to="/" variant="gold">
        {t(strings.nav.home)}
      </Button>
    </PageHero>
  )
}
