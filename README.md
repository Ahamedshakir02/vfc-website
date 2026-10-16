# VFC Arts and Sports Club — website

React + Vite + Tailwind + Firebase. See `vfc-club-website-spec.md` for the full brief
and `vfc-club-website-copy.md` for the source copy.

## Stage status

**Public site.** Home, Events, an event page with its registration form, About,
Awards, Gallery, Contact. Bilingual EN/ML with a language toggle.

**Registration and payment.** The entry fee is paid online through Cashfree
(registered at once), or by UPI with a screenshot an officer checks, or either,
whichever the club switches on.

**Admin, at `/admin`.** Officers sign in to check registrations and to edit
what the site shows: events (dates, fee, photo, who can register), the gallery,
awards, and the club's contact details, figures and payment settings. English
only.

## Try everything, with nothing set up

```
npm install
npm run demo
```

This starts the Firebase emulators and the site together on this machine, with
demo data: an officer account, the events, both ways of paying, and a few
sample registrations. Open the address it prints, register for the league, then
go to `/admin` and press "Fill in the demo account". Online payment shows a
stand-in payment page, so no money can move. Ctrl+C stops it and throws the
demo data away.

It needs the Firebase CLI (`npm install -g firebase-tools`) and Java. The demo
account's details are in `.env.demo`; they exist only inside the emulators.

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
public pages run fine with no `.env.local`, on their built-in content.
`src/data/schema.js` documents the Firestore collections.

### Hosting

The live site is on Firebase Hosting (`firebase.json`: serves `dist`, sends
every address to `index.html` so a link straight to `/admin` or an event page
opens, and caches the hashed files in `assets/` for a year).

The Firebase values are built into the site, so they must be present wherever
it is built: in `.env.local` for a deploy from this computer, or as repository
secrets for the automatic one. Without them `/admin` says "Not set up yet".

- **From this computer:** `firebase login`, `firebase use --add` (pick the
  club's project, once), then `npm run build && firebase deploy --only hosting`.
- **On every merge to master:** `.github/workflows/deploy.yml` builds and
  deploys. It needs repository secrets (GitHub: Settings > Secrets and
  variables > Actions): the six `VITE_FIREBASE_*` values from `.env.example`,
  and `FIREBASE_SERVICE_ACCOUNT`, the whole JSON file from Firebase console >
  Project settings > Service accounts > Generate new private key. Until the service
  account is there, the workflow builds and does not deploy.

Storage and Cloud Functions need the project to be on the Blaze (pay as you
go) plan; Hosting, Auth and Firestore do not.

### Content

Events, gallery photos, awards and the club's details live in Firestore and are
edited at `/admin`. Each list falls back on what is built in
(`src/data/events.js`, `src/data/placeholders.js`) until an officer saves the
first entry to it; from then on only what officers saved is shown. For events,
the admin screen offers to copy the built-in ones in as a starting point.
`src/lib/content.jsx` does the choosing. Uploaded photos are made smaller in
the browser first and go to Storage under `site/`.

### Registration

The form on an open event's page stays visible but switched off until the
Firebase values are set, the event has a fee, and there is a way to pay it.
Both are set at `/admin`: the fee on the event, the ways to pay under Club
details.

- **UPI and a screenshot.** Set the club's UPI ID. The visitor pays in their
  own UPI app, then gives the reference number and a screenshot, and an officer
  marks it verified under Registrations. Nothing is charged through the site.
- **Online, through Cashfree.** Tick "Take payments online". The visitor pays
  on the page and is registered at once. This needs the Cloud Functions
  deployed with the club's Cashfree keys (below).

### Online payment (Cashfree)

The code is in `functions/index.js`: the amount charged is always the event's
fee as stored, and a registration is only written after Cashfree itself reports
the order paid.

1. In the Cashfree merchant dashboard, Developers > API Keys, generate a key
   pair. Use the Test pair first.
2. Copy `functions/.env.example` to `functions/.env` and fill it in.
   `CASHFREE_ENV=sandbox` for test keys, `production` for live ones.
3. `firebase deploy --only functions`.
4. In the Cashfree dashboard, Developers > Webhooks, add the address of the
   `cashfreeWebhook` function (the deploy prints it) for the "payment success"
   event. It registers a payer whose browser closed before the page could.
5. At `/admin`, Club details, tick "Take payments online".

With keys in `functions/.env`, `npm run demo` opens the real Cashfree test
payment page instead of the stand-in. That path, and the webhook, have not been
run against Cashfree yet: no keys were available when this was built. Do a
sandbox payment end to end before going live.

### Admin

In the Firebase console, once:

1. Authentication: enable the Email/Password provider and add a user for each
   officer.
2. Firestore: for each of those users, add an empty document at
   `admins/<their user UID>`. That document is what grants access; a signed-in
   account without one is told so and shown its UID.
3. Deploy the rules: `firebase use --add` (pick the club's project, once),
   then `firebase deploy --only firestore:rules,storage`. The
   Storage rules look officers up in Firestore, so the CLI asks once to allow
   that.

What an officer can and cannot do is enforced by `firestore.rules` and
`storage.rules`, not by the page. Officers read registrations and screenshots,
change a registration's `paymentStatus`, and edit site content and pictures.
Nobody can delete a registration, and no browser can mark one verified as it
is created or touch a payment order.

### Running the pieces by hand

`npm run demo` is these three, in order:

```
npm run emulators                     # Auth, Firestore, Storage, Functions
node scripts/seed-demo.mjs            # demo data, once they are up
npx vite --mode demo                  # the site, pointed at them
```

Emulator data is discarded when the emulators stop; their own screens are at
http://127.0.0.1:4000. `VITE_FIREBASE_EMULATORS` is ignored by `npm run build`.

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

Almost all of it lives in one place: `src/data/placeholders.js`. An entry an
officer saves at `/admin` is real and renders unmarked; contact details and
figures stay marked until the officer ticks that they are real.

Still owed by the client: impact numbers, founding story/year/area, award records
and dates, event photos, address/phone/email, social links, society registration
number. All but the founding story are entered at `/admin` (the registration
number under Club details shows on the About page once filled in).

## Before launch

- Native-speaker review of the Malayalam in `src/i18n/strings.js` (AI-drafted).
- Enter the real content at `/admin`, then untick the sample content notice
  under Club details.
- A Cashfree sandbox payment, end to end, on the deployed functions.
- Add a gallery photo and open a payment screenshot at `/admin` on the deployed
  site, to confirm the Storage rules recognise officers. (In the cloud sandbox
  these were built in, the emulators' officer lookup was blocked by its network
  proxy, so this was not seen working there.)
