/**
 * Events, shaped like the `events` collection in src/data/schema.js.
 *
 * SAMPLE CONTENT, except where a comment says otherwise. The club has not yet
 * supplied dates, venues, fees or its other events, so anything unknown reads
 * "to be announced" (a `null` here) rather than an invented fact, and the two
 * extra events exist only so the list can be judged as it will look. Each
 * sample value renders through <Sample>.
 *
 * This is the stand-in for Firestore: when the admin screens exist, the same
 * shape is read from the `events` collection instead of this file.
 */
import { EVENT_STATUS } from './schema.js'

export const EVENTS = [
  {
    // Real: the event and its copy come from the client's brief and copy deck.
    id: 'district-football-league',
    status: EVENT_STATUS.open,
    category: 'sports',
    image: 'footballer',
    title: { en: 'District Football League', ml: 'ജില്ലാ ഫുട്ബോൾ ലീഗ്' },
    description: {
      en: 'Open to teams from across the district.',
      ml: 'ജില്ലയിലുടനീളമുള്ള ടീമുകൾക്ക് പങ്കെടുക്കാം.',
    },
    // Still owed by the club: eligibility, format, schedule.
    startsOn: null,
    venue: null,
    fee: null,
    closesOn: null,
    // Entry categories for the form. A single open category until the club says otherwise.
    categories: [{ id: 'open', label: { en: 'Open', ml: 'ഓപ്പൺ' } }],
  },
  {
    id: 'badminton-open',
    sample: true,
    status: EVENT_STATUS.upcoming,
    category: 'sports',
    image: 'badminton',
    title: { en: 'Badminton open', ml: 'ബാഡ്മിന്റൺ ഓപ്പൺ' },
    description: { en: 'Sample event. Replace with a real one.', ml: 'മാതൃകാ പരിപാടി. യഥാർത്ഥ പരിപാടി ചേർക്കുക.' },
    startsOn: null,
    venue: null,
    fee: null,
    closesOn: null,
    categories: [],
  },
  {
    id: 'arts-evening',
    sample: true,
    status: EVENT_STATUS.upcoming,
    category: 'arts',
    image: 'drummers',
    title: { en: 'Arts evening', ml: 'കലാസന്ധ്യ' },
    description: { en: 'Sample event. Replace with a real one.', ml: 'മാതൃകാ പരിപാടി. യഥാർത്ഥ പരിപാടി ചേർക്കുക.' },
    startsOn: null,
    venue: null,
    fee: null,
    closesOn: null,
    categories: [],
  },
  {
    id: 'community-welfare-drive',
    sample: true,
    status: EVENT_STATUS.closed,
    category: 'welfare',
    image: 'community',
    title: { en: 'Community welfare drive', ml: 'സാമൂഹിക ക്ഷേമ പരിപാടി' },
    description: { en: 'Sample event. Replace with a real one.', ml: 'മാതൃകാ പരിപാടി. യഥാർത്ഥ പരിപാടി ചേർക്കുക.' },
    startsOn: null,
    venue: null,
    fee: null,
    closesOn: null,
    categories: [],
  },
]

export const getEvent = (id) => EVENTS.find((event) => event.id === id) ?? null

/** The event the site points people at: the first one taking registrations. */
export const getOpenEvent = () => EVENTS.find((event) => event.status === EVENT_STATUS.open) ?? null
