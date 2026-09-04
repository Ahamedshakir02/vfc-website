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

## Firebase

`.env.example` → copy to `.env.local` and fill from the Firebase console.
`src/lib/firebase.js` initialises the app only and no-ops without config, so the
public shell runs fine with no `.env.local`. `src/data/schema.js` documents the
four Firestore collections from the spec.

Hosting config is in `firebase.json` (SPA rewrite, serves `dist`).

## Placeholders

Every bracketed placeholder from the copy doc renders through `<Todo>`
(`src/components/Todo.jsx`) as a gold dashed chip — visible on the page, not
buried in a comment. Find them all with:

```
grep -rn "TODO" src/
```

Most live in one place: `src/data/placeholders.js`.

Still owed by the client: impact numbers, founding story/year/area, award records
and dates, event photos, address/phone/email, social links, society registration
number.

## Before launch

- Native-speaker review of the Malayalam in `src/i18n/strings.js` (AI-drafted).
- Replace every `<Todo>` with real content.
