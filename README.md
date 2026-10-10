# VFC Arts and Sports Club — website

React + Vite + Tailwind + Firebase. See `vfc-club-website-spec.md` for the full brief
and `vfc-club-website-copy.md` for the source copy.

## Stage status

**Public site.** Home, Events, an event page with its registration form, About,
Awards, Gallery, Contact. Bilingual EN/ML with a language toggle.

**Admin, at `/admin`.** Officers sign in and check registrations: view each
payment screenshot, mark it verified, export the list. English only.

**Not built.** Admin screens for events, awards and the gallery (events still
come from `src/data/events.js`), and online payment.

## Run

```
npm install
npm run dev
npm run build      # outputs to dist/
```

## Motion

GSAP + ScrollTrigger for choreography; scrolling itself is the browser's own,
so the page answers the wheel or finger immediately. Everything is set up in
`src/lib/motion.js` (`useGsap` scopes and cleans up animations and skips them
entirely under `prefers-reduced-motion`) and `src/lib/ScrollSync.jsx`.
The intent behind each moment is in the "Motion" section of
`vfc-club-design-brief.md`.

Logo files in `public/logo/` are cropped derivatives of `logo/VFC Logo-01.png`:
the purple crest, and a white version of the same crest for purple surfaces.
(`logo/VFC Logo-03.png` is a wide wordmark, not a crest, and is not used.)

## Firebase

`.env.example` → copy to `.env.local` and fill from the Firebase console.
`src/lib/firebase.js` initialises the app only and no-ops without config, so the
public pages run fine with no `.env.local`. `src/data/schema.js` documents the
Firestore collections.

Hosting config is in `firebase.json` (SPA rewrite, serves `dist`).

### Registration

The form on an open event's page stays visible but switched off until three
things are set: the Firebase values, `VITE_CLUB_UPI_ID`, and the event's `fee`
in `src/data/events.js`. Nothing is charged through the site: the visitor pays
in their own UPI app, then gives the reference number and a screenshot.

### Admin

In the Firebase console, once:

1. Authentication: enable the Email/Password provider and add a user for each
   officer.
2. Firestore: for each of those users, add an empty document at
   `admins/<their user UID>`. That document is what grants access; a signed-in
   account without one is told so and shown its UID.
3. Deploy the rules: `firebase deploy --only firestore:rules,storage`. The
   Storage rules look officers up in Firestore, so the CLI asks once to allow
   that.

What an officer can and cannot do is enforced by `firestore.rules` and
`storage.rules`, not by the page: officers read registrations and screenshots
and change `paymentStatus`, and nothing else.

### Trying it locally

No Firebase project is needed. With the Firebase CLI and Java installed:

```
npm run emulators                     # Auth, Firestore and Storage on this machine
```

and in `.env.local`:

```
VITE_FIREBASE_EMULATORS=true
VITE_CLUB_UPI_ID=test@upi
```

then `npm run dev`. Give the league a `fee` in `src/data/events.js` to switch
the form on. To sign in at `/admin`, add a user in the emulator UI
(http://127.0.0.1:4000, Authentication) and an empty `admins/<UID>` document
(Firestore). Emulator data is discarded when the emulators stop.
`VITE_FIREBASE_EMULATORS` is ignored by `npm run build`.

## Placeholders

The club has not supplied its numbers, awards, photos or contact details yet,
so the site runs on sample content: invented figures and awards, drawn scenes
in place of photos (`src/components/PlaceholderArt.jsx`), and unusable contact
details. Every sample value renders through `<Sample>`
(`src/components/Sample.jsx`), and the footer shows a "Sample content" notice
while `SAMPLE_CONTENT` is `true` in `src/data/placeholders.js`. Find them with:

```
grep -rn "<Sample" src/
```

Almost all of it lives in one place: `src/data/placeholders.js`.

Still owed by the client: impact numbers, founding story/year/area, award records
and dates, event photos, address/phone/email, social links, society registration
number.

## Before launch

- Native-speaker review of the Malayalam in `src/i18n/strings.js` (AI-drafted).
- Replace every `<Sample>` value with real content, then set `SAMPLE_CONTENT` to `false`.
