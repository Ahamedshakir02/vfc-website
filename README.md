# VFC Arts and Sports Club — website

React + Vite + Tailwind + Firebase. See `vfc-club-website-spec.md` for the full brief
and `vfc-club-website-copy.md` for the source copy.

## Stage status

**Stage 1 (this build) — public shell.** Home, About, Awards, Gallery, Contact.
Bilingual EN/ML with a language toggle. All copy is verbatim from the copy doc.
No Firestore reads or writes.

**Stage 2 (next) — not built.** `/events`, the District Football League event page,
and the registration form that writes to Firestore.

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
public shell runs fine with no `.env.local`. `src/data/schema.js` documents the
four Firestore collections from the spec.

Hosting config is in `firebase.json` (SPA rewrite, serves `dist`).

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
