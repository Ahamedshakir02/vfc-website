/**
 * All UI + section copy, verbatim from vfc-club-website-copy.md.
 *
 * IMPORTANT: The Malayalam is AI-drafted and still needs a native-speaker
 * review before launch (see spec: "Outstanding"). Do not treat it as final.
 *
 * Anything the copy doc left in [brackets] is filled with sample content
 * and rendered through <Sample> - see src/data/placeholders.js.
 *
 * NAME: the club is "VFC Arts, Sports & Welfare Club" per the spec and the
 * design brief. The copy doc still carries the older "Arts and Sports"
 * wording; the newer name wins. The Malayalam form below follows the copy
 * doc's own transliteration pattern and needs the same native-speaker check
 * as the rest of the Malayalam.
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

  // The three words of the club's name, for the running band on the home page.
  // Malayalam forms are lifted from the club name already used in this file.
  name: {
    arts: { en: 'Arts', ml: 'ആർട്സ്' },
    sports: { en: 'Sports', ml: 'സ്പോർട്സ്' },
    welfare: { en: 'Welfare', ml: 'വെൽഫെയർ' },
  },

  actions: {
    registerNow: { en: 'Register now', ml: 'ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യുക' },
    submitRegistration: { en: 'Submit registration', ml: 'രജിസ്ട്രേഷൻ സമർപ്പിക്കുക' },
    readMore: { en: 'Read more', ml: 'കൂടുതൽ വായിക്കുക' },
    viewAll: { en: 'View all', ml: 'എല്ലാം കാണുക' },
    // Keyboard-only skip link. Not in the copy doc, so the Malayalam needs
    // the same native-speaker check as the rest.
    skipToContent: { en: 'Skip to content', ml: 'ഉള്ളടക്കത്തിലേക്ക് പോകുക' },
  },

  status: {
    open: { en: 'Open for registration', ml: 'രജിസ്ട്രേഷന് തുറന്നിരിക്കുന്നു' },
    upcoming: { en: 'Upcoming', ml: 'വരാനിരിക്കുന്നത്' },
    closed: { en: 'Closed', ml: 'അവസാനിച്ചു' },
  },

  home: {
    heroHeadline: {
      // Brand name - deliberately identical in both languages.
      en: 'VFC Arts, Sports & Welfare Club',
      ml: 'VFC Arts, Sports & Welfare Club',
    },
    heroTagline: {
      en: 'Where sport meets community.',
      ml: 'കായികവും സമൂഹവും ഒന്നിക്കുന്നിടം.',
    },
    heroSubline: {
      en: 'VFC Arts, Sports & Welfare Club trains athletes, supports local talent, and gives back to the community it calls home.',
      ml: 'വി.എഫ്.സി ആർട്സ്, സ്പോർട്സ് & വെൽഫെയർ ക്ലബ് കായികതാരങ്ങളെ പരിശീലിപ്പിക്കുകയും, പ്രാദേശിക പ്രതിഭകളെ പിന്തുണയ്ക്കുകയും, സ്വന്തം സമൂഹത്തിന് തിരികെ നൽകുകയും ചെയ്യുന്നു.',
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
    bodyParts: {
      leadA: {
        en: 'VFC Arts, Sports & Welfare Club was founded to give the people of ',
        ml: '',
      },
      // The locality is real (spec: Vellalur, Palakkad), written as on the crest.
      area: { en: 'Vellalur', ml: 'Vellalur' },
      leadB: {
        en: ' a place to play, train, and grow — on the field and in the community. ',
        ml: ' ജനങ്ങൾക്ക് കളിക്കാനും പരിശീലിക്കാനും വളരാനുമുള്ള ഇടം നൽകുന്നതിനായി വി.എഫ്.സി ആർട്സ്, സ്പോർട്സ് & വെൽഫെയർ ക്ലബ് സ്ഥാപിതമായി — കളിക്കളത്തിലും സമൂഹത്തിലും. ',
      },
      // Placeholder for the founding story. The year is real (crest: Estd 2009);
      // the club still owes the story itself.
      story: {
        en: 'The club was established in 2009.',
        ml: '2009-ൽ ക്ലബ് സ്ഥാപിതമായി.',
      },
      tail: {
        en: " Today it's a club known for its sportsmanship, its events, and its commitment to giving back.",
        ml: ' കായികക്ഷമതയ്ക്കും പരിപാടികൾക്കും സമൂഹത്തിന് തിരികെ നൽകാനുള്ള പ്രതിബദ്ധതയ്ക്കും പേരുകേട്ട ക്ലബ്ബാണിത് ഇന്ന്.',
      },
    },
  },

  /*
    Events and registration. Lines marked "copy deck" are verbatim from
    vfc-club-website-copy.md; everything else was written for the build, and
    its Malayalam needs the same native-speaker check as the rest of the file.
  */
  events: {
    // copy deck
    lede: { en: 'Upcoming & past events', ml: 'വരാനിരിക്കുന്നതും കഴിഞ്ഞതുമായ പരിപാടികൾ' },
    whatsOn: { en: "What's on", ml: 'ഇപ്പോൾ നടക്കുന്നത്' },
    allEvents: { en: 'All events', ml: 'എല്ലാ പരിപാടികളും' },
    comingUp: { en: 'Coming up', ml: 'വരാനിരിക്കുന്നവ' },
    past: { en: 'Past events', ml: 'കഴിഞ്ഞ പരിപാടികൾ' },
    filterAll: { en: 'All', ml: 'എല്ലാം' },
    filterLabel: { en: 'Filter events', ml: 'പരിപാടികൾ തിരഞ്ഞെടുക്കുക' },
    seeEvent: { en: 'See the event and register', ml: 'പരിപാടി കാണുക, രജിസ്റ്റർ ചെയ്യുക' },
    seeDetails: { en: 'See the event', ml: 'പരിപാടി കാണുക' },
    none: { en: 'No events in this list right now.', ml: 'ഈ പട്ടികയിൽ ഇപ്പോൾ പരിപാടികളൊന്നുമില്ല.' },
    starts: { en: 'Starts', ml: 'ആരംഭം' },
    venue: { en: 'Venue', ml: 'വേദി' },
    fee: { en: 'Entry fee', ml: 'പ്രവേശന ഫീസ്' },
    closes: { en: 'Registration closes', ml: 'രജിസ്ട്രേഷൻ അവസാനിക്കുന്നത്' },
    toBeAnnounced: { en: 'To be announced', ml: 'പിന്നീട് അറിയിക്കും' },
    about: { en: 'About the event', ml: 'പരിപാടിയെക്കുറിച്ച്' },
    how: { en: 'How registration works', ml: 'രജിസ്ട്രേഷൻ എങ്ങനെ' },
    steps: [
      {
        title: { en: 'Fill in the form', ml: 'ഫോം പൂരിപ്പിക്കുക' },
        body: {
          en: 'Your name, phone number and team. It takes a couple of minutes.',
          ml: 'നിങ്ങളുടെ പേര്, ഫോൺ നമ്പർ, ടീം. കുറച്ച് മിനിറ്റുകൾ മതി.',
        },
      },
      {
        title: { en: 'Pay the entry fee by UPI', ml: 'UPI വഴി പ്രവേശന ഫീസ് അടയ്ക്കുക' },
        body: {
          en: "Send the fee to the club's UPI ID from any UPI app, then note the reference number and take a screenshot.",
          ml: 'ഏതെങ്കിലും UPI ആപ്പിൽ നിന്ന് ക്ലബ്ബിന്റെ UPI ഐഡിയിലേക്ക് ഫീസ് അയയ്ക്കുക; റഫറൻസ് നമ്പർ കുറിച്ചുവെച്ച് സ്ക്രീൻഷോട്ട് എടുക്കുക.',
        },
      },
      {
        title: { en: 'We check it and confirm', ml: 'ഞങ്ങൾ പരിശോധിച്ച് സ്ഥിരീകരിക്കും' },
        body: {
          en: 'A club volunteer checks each payment by hand. You are registered once it is verified.',
          ml: 'ക്ലബ്ബിലെ ഒരു സന്നദ്ധപ്രവർത്തകൻ ഓരോ പേയ്മെന്റും നേരിട്ട് പരിശോധിക്കും. സ്ഥിരീകരിച്ചാൽ നിങ്ങളുടെ രജിസ്ട്രേഷൻ പൂർത്തിയാകും.',
        },
      },
    ],
    notOpen: {
      en: 'Registration for this event is not open.',
      ml: 'ഈ പരിപാടിയുടെ രജിസ്ട്രേഷൻ ഇപ്പോൾ തുറന്നിട്ടില്ല.',
    },
    seePhotos: { en: 'See the photos', ml: 'ചിത്രങ്ങൾ കാണുക' },
    notFound: { en: 'This event could not be found.', ml: 'ഈ പരിപാടി കണ്ടെത്താനായില്ല.' },
    questions: { en: 'Questions?', ml: 'സംശയങ്ങളുണ്ടോ?' },
  },

  form: {
    heading: { en: 'Register', ml: 'രജിസ്റ്റർ ചെയ്യുക' },
    intro: {
      en: 'Every field is needed unless it says optional.',
      ml: '"ഐച്ഛികം" എന്ന് പറയാത്ത എല്ലാ വിവരങ്ങളും ആവശ്യമാണ്.',
    },
    // copy deck: name, phone, email, payment reference, screenshot, confirmation
    name: { en: 'Name', ml: 'പേര്' },
    phone: { en: 'Phone', ml: 'ഫോൺ നമ്പർ' },
    email: { en: 'Email', ml: 'ഇമെയിൽ' },
    optional: { en: '(optional)', ml: '(ഐച്ഛികം)' },
    category: { en: 'Category', ml: 'വിഭാഗം' },
    team: { en: 'Team name', ml: 'ടീമിന്റെ പേര്' },
    payHeading: { en: 'Pay by UPI', ml: 'UPI വഴി പണമടയ്ക്കുക' },
    send: { en: 'Send', ml: 'അയയ്ക്കേണ്ട തുക' },
    toUpi: { en: 'To UPI ID', ml: 'UPI ഐഡി' },
    copy: { en: 'Copy ID', ml: 'ഐഡി പകർത്തുക' },
    copied: { en: 'Copied', ml: 'പകർത്തി' },
    openUpi: { en: 'Open my UPI app', ml: 'UPI ആപ്പ് തുറക്കുക' },
    paymentRef: { en: 'UPI reference number', ml: 'UPI റഫറൻസ് നമ്പർ' },
    paymentRefHelp: {
      en: 'The reference number your UPI app shows after you pay.',
      ml: 'പണമടച്ച ശേഷം UPI ആപ്പ് കാണിക്കുന്ന റഫറൻസ് നമ്പർ.',
    },
    screenshot: { en: 'Payment screenshot', ml: 'പേയ്മെന്റ് സ്ക്രീൻഷോട്ട്' },
    screenshotHelp: { en: 'An image up to 5 MB.', ml: '5 MB വരെയുള്ള ചിത്രം.' },
    note: {
      en: 'Your place is confirmed after the club verifies the payment. Nothing is charged through this site.',
      ml: 'ക്ലബ് പേയ്മെന്റ് പരിശോധിച്ച ശേഷമേ നിങ്ങളുടെ സ്ഥാനം ഉറപ്പാകൂ. ഈ സൈറ്റ് വഴി പണം ഈടാക്കുന്നില്ല.',
    },
    sending: { en: 'Sending…', ml: 'അയയ്ക്കുന്നു…' },
    success: {
      en: "Thanks — we've received your registration. We'll verify your payment and confirm shortly.",
      ml: 'നന്ദി — നിങ്ങളുടെ രജിസ്ട്രേഷൻ ലഭിച്ചു. ഞങ്ങൾ നിങ്ങളുടെ പേയ്മെന്റ് പരിശോധിച്ച് ഉടൻ സ്ഥിരീകരിക്കും.',
    },
    notReady: {
      en: 'Online registration is not switched on yet. To register, contact the club.',
      ml: 'ഓൺലൈൻ രജിസ്ട്രേഷൻ ഇതുവരെ ആരംഭിച്ചിട്ടില്ല. രജിസ്റ്റർ ചെയ്യാൻ ക്ലബ്ബുമായി ബന്ധപ്പെടുക.',
    },
    upiPending: { en: "The club's UPI ID will appear here.", ml: 'ക്ലബ്ബിന്റെ UPI ഐഡി ഇവിടെ കാണിക്കും.' },
    fixErrors: {
      en: 'Some details need fixing. See the messages by each field.',
      ml: 'ചില വിവരങ്ങൾ ശരിയാക്കേണ്ടതുണ്ട്. ഓരോ കോളത്തിനും താഴെയുള്ള സന്ദേശം നോക്കുക.',
    },
    failed: {
      en: 'We could not send your registration. Check your connection and try again.',
      ml: 'രജിസ്ട്രേഷൻ അയയ്ക്കാനായില്ല. ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.',
    },
    errors: {
      required: { en: 'This is needed.', ml: 'ഇത് ആവശ്യമാണ്.' },
      phone: { en: 'Enter a 10-digit mobile number.', ml: '10 അക്ക മൊബൈൽ നമ്പർ നൽകുക.' },
      email: { en: 'Enter a valid email address.', ml: 'ശരിയായ ഇമെയിൽ വിലാസം നൽകുക.' },
      paymentRef: {
        en: 'Enter the reference number from your UPI app, letters and digits only.',
        ml: 'UPI ആപ്പിലെ റഫറൻസ് നമ്പർ നൽകുക; അക്ഷരങ്ങളും അക്കങ്ങളും മാത്രം.',
      },
      screenshotType: { en: 'Choose an image file.', ml: 'ഒരു ചിത്രം തിരഞ്ഞെടുക്കുക.' },
      screenshotSize: { en: 'The image must be under 5 MB.', ml: 'ചിത്രം 5 MB-ൽ താഴെയായിരിക്കണം.' },
    },
  },

  // Sample lines under the three pillars on the home page. Not from the copy
  // deck: the club should say in its own words what it does in each.
  pillars: {
    sports: {
      en: 'Training and teams across the sports the club runs.',
      ml: 'ക്ലബ് നടത്തുന്ന കായിക ഇനങ്ങളിലെ പരിശീലനവും ടീമുകളും.',
    },
    arts: {
      en: 'Programmes and performances that give local talent a stage.',
      ml: 'പ്രാദേശിക പ്രതിഭകൾക്ക് വേദിയൊരുക്കുന്ന പരിപാടികളും അവതരണങ്ങളും.',
    },
    welfare: {
      en: 'Charity and community work in and around Vellalur.',
      ml: 'Vellalur-ലും പരിസരത്തും നടത്തുന്ന ജീവകാരുണ്യ, സാമൂഹിക പ്രവർത്തനങ്ങൾ.',
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
    // Both facts are real: the locality is in the spec, the year is on the crest.
    place: { en: 'Vellalur, Palakkad. Established 2009.', ml: 'Vellalur, Palakkad. സ്ഥാപിതം 2009.' },
    // {year} filled at render time.
    rights: {
      en: '© {year} VFC Arts, Sports & Welfare Club. All rights reserved.',
      ml: '© {year} വി.എഫ്.സി ആർട്സ്, സ്പോർട്സ് & വെൽഫെയർ ക്ലബ്. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
    },
  },
}
