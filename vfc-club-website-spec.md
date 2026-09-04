# VFC Arts and Sports Club — website v1 spec

## Project
- Paid client project. Client: VFC Arts and Sports Club, a registered society/trust (Palakkad district — exact registration number/certificate TBD, not blocking this build).
- Deadline: 3-day build window (from this planning conversation, roughly Sept 7, 2026).
- Stack: React + Vite + Tailwind CSS + Firebase (Firestore + Auth + Hosting).

## What v1 actually is
- Portfolio/showcase site: Home, About, Awards, Gallery, Contact.
- One event page (District Football League) with a registration form.
- Registration form writes directly to Firestore. No custom admin dashboard yet — registrations are reviewed via the Firebase console.
- Payment is manual: UPI reference number + screenshot upload field on the form. Admin verifies by hand. No payment gateway in v1.
- English + Malayalam — copy for both now drafted (see `vfc-club-website-copy.md`). Ship bilingual if the Malayalam clears a native-speaker check; fall back to English-only if there's no time to review it.
- Deployed on a Firebase Hosting subdomain. No custom domain yet.
- Motion: CSS/SVG only. No video, no Lottie, no 3D.

## Explicitly NOT in v1 (fast-follow only, do not build now)
- Razorpay or any payment gateway integration — blocked on the club finishing bank account setup and KYC. Do not start this until that's confirmed done.
- Admin dashboard / CMS UI for managing events, registrations, awards, gallery.
- Any produced motion/video asset (e.g. a football-kicking animation).
- Custom domain.

## Pages

### Public
- **Home** — hero, a "registration open" banner that only renders when an event's status is `open`, awards teaser, gallery preview, about/impact section, footer.
- **About** — club story, framed as both sports and community/charity.
- **Events** — list of events; the football league event page carries the registration form.
- **Gallery** — past event photos.
- **Awards** — list or timeline.
- **Contact**

### Admin (fast-follow, not v1)
Dashboard, event management, registrations view, awards management, gallery management — all deferred until after v1 ships.

## Data model (Firestore)

```
events
  id, title_en, title_ml, description_en, description_ml,
  date, location, category,
  status (upcoming | open | closed), coverImage, createdAt

registrations
  id, eventId, name, phone, email, category, teamName?,
  paymentRef, paymentScreenshotUrl,
  paymentStatus (pending | verified), createdAt

awards
  id, title_en, title_ml, year, imageUrl, description_en, description_ml

gallery
  id, imageUrl, caption_en, caption_ml, eventId?, category
```

Registrations stay single-language — a name or phone number doesn't need translating. UI strings (nav, buttons, form labels) are static translation pairs, not per-record fields — see `vfc-club-website-copy.md`.

## Visual direction
- Locked palette, extracted directly from the logo file (`VFC_Logo-01.png` — flat single fill, no gradient):
  - Brand purple `#432D84` — primary
  - Brand purple, deep `#2E1F5C` — hover / dark states
  - Gold accent `#C89B3C` — awards, CTAs, highlights
  - Warm background `#FAF8F4`
  - Text `#221C3A` — purple-tinted near-black
  - White `#FFFFFF` — on purple surfaces
- Logo assets: `VFC_Logo-01.png` (purple mark, light backgrounds), `VFC_Logo-03.png` (white mark, dark/colored backgrounds — confirmed against the supplied jersey-style mockup).
- The mark itself is a straight football-club crest — ball, shield, established-year banner, "VFC · Vellalur", est. 2009. No visual arts/charity signal in the logo — that has to come from photography, copy, and the about/impact section, not the mark. Lean into the crest/badge identity rather than fight it.
- Sports energy (motion, bold purple, action shots) plus charity/community warmth (real people, real photos, an impact stat or two) — carried differently across sections, not blended into one flat tone everywhere.

## Content status
- Logo received, palette locked (see Visual direction above). Event photos and award records/dates still not handed over — use placeholders, swap in real assets as they arrive.
- English and Malayalam UI/section copy drafted — see `vfc-club-website-copy.md`. Bracketed placeholders in it still need real facts from the client (history, fees, contact details, exact stats).

## Outstanding — not blocking the build, but needed before or at launch
- Native-speaker review of the Malayalam copy before it goes live.
- Real photos / award records / event dates handover timing, plus the bracketed facts in the copy doc (history, fees, contact details, real stats).
- Bank account + Razorpay onboarding — separate track, entirely decoupled from this launch.
