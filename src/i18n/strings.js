/**
 * All UI + section copy, verbatim from vfc-club-website-copy.md.
 *
 * IMPORTANT: The Malayalam is AI-drafted and still needs a native-speaker
 * review before launch (see spec: "Outstanding"). Do not treat it as final.
 *
 * Anything the copy doc left in [brackets] is kept as a TODO_ prefixed value
 * so it renders as a visible placeholder on the page - search for `TODO`.
 */

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ml', label: 'മലയാളം' },
]

export const strings = {
  nav: {
    home: { en: 'Home', ml: 'ഹോം' },
    about: { en: 'About', ml: 'ഞങ്ങളെക്കുറിച്ച്' },
    events: { en: 'Events', ml: 'ഇവന്റുകൾ' },
    gallery: { en: 'Gallery', ml: 'ഗാലറി' },
    awards: { en: 'Awards', ml: 'അവാർഡുകൾ' },
    contact: { en: 'Contact', ml: 'ബന്ധപ്പെടുക' },
  },

  actions: {
    registerNow: { en: 'Register now', ml: 'ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യുക' },
    submitRegistration: { en: 'Submit registration', ml: 'രജിസ്ട്രേഷൻ സമർപ്പിക്കുക' },
    readMore: { en: 'Read more', ml: 'കൂടുതൽ വായിക്കുക' },
    viewAll: { en: 'View all', ml: 'എല്ലാം കാണുക' },
  },

  status: {
    open: { en: 'Open for registration', ml: 'രജിസ്ട്രേഷന് തുറന്നിരിക്കുന്നു' },
    upcoming: { en: 'Upcoming', ml: 'വരാനിരിക്കുന്നത്' },
    closed: { en: 'Closed', ml: 'അവസാനിച്ചു' },
  },

  home: {
    heroHeadline: {
      // Brand name - deliberately identical in both languages.
      en: 'VFC Arts and Sports Club',
      ml: 'VFC Arts and Sports Club',
    },
    heroTagline: {
      en: 'Where sport meets community.',
      ml: 'കായികവും സമൂഹവും ഒന്നിക്കുന്നിടം.',
    },
    heroSubline: {
      en: 'VFC Arts and Sports Club trains athletes, supports local talent, and gives back to the community it calls home.',
      ml: 'വി.എഫ്.സി ആർട്സ് ആൻഡ് സ്പോർട്സ് ക്ലബ് കായികതാരങ്ങളെ പരിശീലിപ്പിക്കുകയും, പ്രാദേശിക പ്രതിഭകളെ പിന്തുണയ്ക്കുകയും, സ്വന്തം സമൂഹത്തിന് തിരികെ നൽകുകയും ചെയ്യുന്നു.',
    },
    // Template - {event} and {date} are filled per event once Firestore is wired.
    registrationBanner: {
      en: 'Registration open — {event}. Closes {date}.',
      ml: 'രജിസ്ട്രേഷൻ തുറന്നിരിക്കുന്നു — {event}. {date}-ന് അവസാനിക്കും.',
    },
    awardsHeading: { en: 'Our awards', ml: 'ഞങ്ങളുടെ അവാർഡുകൾ' },
    galleryHeading: {
      en: 'Moments from our events',
      ml: 'ഞങ്ങളുടെ പരിപാടികളിൽ നിന്നുള്ള നിമിഷങ്ങൾ',
    },
    impactHeading: { en: 'More than a club', ml: 'ഒരു ക്ലബ്ബിനും അപ്പുറം' },
    impactBlurb: {
      en: 'For years, VFC has brought together players, families, and volunteers — on the field and off it. Every match, every event, every award is proof of what a community can build together.',
      ml: 'വർഷങ്ങളായി, വി.എഫ്.സി കളിക്കാരെയും കുടുംബങ്ങളെയും സന്നദ്ധപ്രവർത്തകരെയും ഒരുമിച്ച് കൊണ്ടുവന്നിട്ടുണ്ട് — കളിക്കളത്തിലും അതിനപ്പുറവും. ഓരോ മത്സരവും, ഓരോ പരിപാടിയും, ഓരോ അവാർഡും ഒരു സമൂഹത്തിന് ഒരുമിച്ച് എന്ത് നേടാനാകുമെന്നതിന്റെ തെളിവാണ്.',
    },
    impactLabels: {
      members: { en: 'Members', ml: 'അംഗങ്ങൾ' },
      events: { en: 'Events run', ml: 'നടത്തിയ പരിപാടികൾ' },
      awards: { en: 'Awards won', ml: 'നേടിയ അവാർഡുകൾ' },
    },
  },

  about: {
    heading: { en: 'About VFC', ml: 'വി.എഫ്.സിയെക്കുറിച്ച്' },
    // The [brackets] below are split out into TODO chunks in aboutBodyParts.
    bodyParts: {
      leadA: {
        en: 'VFC Arts and Sports Club was founded to give the people of ',
        ml: '',
      },
      area: { en: 'TODO: [area]', ml: 'TODO: [പ്രദേശം]' },
      leadB: {
        en: ' a place to play, train, and grow — on the field and in the community. ',
        ml: ' ജനങ്ങൾക്ക് കളിക്കാനും പരിശീലിക്കാനും വളരാനുമുള്ള ഇടം നൽകുന്നതിനായി വി.എഫ്.സി ആർട്സ് ആൻഡ് സ്പോർട്സ് ക്ലബ് സ്ഥാപിതമായി — കളിക്കളത്തിലും സമൂഹത്തിലും. ',
      },
      story: {
        en: 'TODO: [Add the real founding story / year / origin here.]',
        ml: 'TODO: [യഥാർത്ഥ ചരിത്രം / വർഷം ഇവിടെ ചേർക്കുക.]',
      },
      tail: {
        en: " Today it's a club known for its sportsmanship, its events, and its commitment to giving back.",
        ml: ' കായികക്ഷമതയ്ക്കും പരിപാടികൾക്കും സമൂഹത്തിന് തിരികെ നൽകാനുള്ള പ്രതിബദ്ധതയ്ക്കും പേരുകേട്ട ക്ലബ്ബാണിത് ഇന്ന്.',
      },
    },
  },

  gallery: { heading: { en: 'Gallery', ml: 'ഗാലറി' } },
  awards: { heading: { en: 'Awards', ml: 'അവാർഡുകൾ' } },

  contact: {
    heading: { en: 'Get in touch', ml: 'ബന്ധപ്പെടുക' },
    address: { en: 'Address', ml: 'വിലാസം' },
    phone: { en: 'Phone', ml: 'ഫോൺ' },
    email: { en: 'Email', ml: 'ഇമെയിൽ' },
  },

  footer: {
    // {year} filled at render time.
    rights: {
      en: '© {year} VFC Arts and Sports Club. All rights reserved.',
      ml: '© {year} വി.എഫ്.സി ആർട്സ് ആൻഡ് സ്പോർട്സ് ക്ലബ്. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
    },
  },
}
