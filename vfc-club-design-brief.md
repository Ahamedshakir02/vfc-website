# VFC Arts, Sports & Welfare Club — design brief

Grounded in what this actually is: a Kerala grassroots sports + arts club, running a district football league, with a charity/community angle. Not a SaaS product — avoid SaaS defaults (rounded card grids, soft drop shadows, gradient washes, warm-cream-and-serif "AI generated" look).

The logo itself is a straight football crest — ball, shield, established-year banner. It carries no visual arts/charity signal on its own; that has to come from photography, copy, and the about/impact section. Lean into the crest/badge identity rather than fight it.

## Color (confirmed from the real logo — see spec)
- `#432D84` purple — primary, hero/section backgrounds, primary buttons
- `#2E1F5C` deep purple — hover states, dark accents, used sparingly
- `#C89B3C` gold — the loud accent: CTAs, "registration open" states, award highlights
- `#FAF8F4` warm white — base background
- `#221C3A` ink — text, purple-tinted near-black, not pure black
- `#FFFFFF` white — on purple surfaces

Purple carries the page. Gold is the one loud accent — don't let it and deep purple both fight for attention in the same section.

## Type
- Display/headline (English AND Malayalam): **Baloo Chettan 2** — rounded, warm, energetic. It ships matched Latin and Malayalam letterforms, so bilingual headlines read as one voice instead of two mismatched fonts.
- Body (English AND Malayalam): **Noto Sans** — quiet, legible, real Malayalam coverage.
- One bold display size for hero/section headings. Body text stays restrained — don't compete with the headline.

## Layout
- **Hero** — brand purple background, diagonal-cut bottom edge (like a goal line), not a straight rectangle. This is the one bold visual moment on the page.
- **Registration banner** — a full-width gold strip, scoreboard-style. Not a pill, not a card with a shadow.
- **Awards** — a flat horizontal shelf: unequal-width tiles sitting on a shared baseline, like trophies on a shelf. A crest/shield motif for award icons ties back to the actual logo instead of a generic star or ribbon. Not identical cards.
- **Gallery** — an asymmetric photo mosaic (mixed tile sizes), not a uniform grid. Should read like real event photos, not stock content.
- Left-aligned content throughout — reads like a roster/program, not a centered marketing landing page.

## Principles
- Spend boldness in one place: the diagonal hero and the ball that lives on it. Everything else is quiet and disciplined.
- Corners (revised Oct 2026, at the studio's direction — replaces the earlier hard-square rule): eased, not pill-shaped. A small radius on buttons, chips and the language toggle (`--radius-control`, 0.5rem) and a slightly larger one on tiles and photos (`--radius-tile`, 0.875rem). Still flat: no drop shadows anywhere on the site.
- No eyebrow labels, no arrow-suffixed buttons ("Register →"), no middle-dot meta strings, no all-caps labels.
- Motion (revised Oct 2026 — replaces the earlier "one moment on load at most" rule, at the studio's direction): the site moves, but as one idea rather than a pile of effects. See "Motion" below.
- Structural devices should mean something: the shelf holds trophies, the mosaic holds unposed photos, the strip flashes urgent status. Nothing decorative for its own sake.

## Motion
One concept, "matchday": the football is the only object that travels.
- **Load** — a purple curtain with the crest lifts on the hero's diagonal; the mark rises letter by letter, the centre circle draws in around the crest, and the ball drops onto the goal line.
- **Hero scroll** — the ball rolls down the diagonal and off the pitch, turning exactly as far as it travels. Click it and it gets kicked.
- **Page progress** — a gold touchline along the bottom of the screen, with a small ball rolling along it.
- **Sections** — headings rise word by word and the gold rule draws out; the shelf line draws before the trophies rise onto it; mosaic photos are unveiled bottom-up; the impact blurb fills in as it is read.
- **Navigation** — the same diagonal curtain sweeps across between pages.
- No custom cursor. One was tried and removed; the native pointer stays as it is.

Rules that keep it disciplined:
- One easing family for entrances (`expo.out`); scroll-linked motion is scrubbed, never timed.
- Transforms, opacity and clip-path only. No 3D, no video, no Lottie — the spec still rules those out.
- Scrolling is always the browser's own — no scripted smooth scroll. One was tried and removed because it made the page feel laggy on modest hardware.
- Keep it cheap: no backdrop blur, no clip-path on large moving areas (the diagonal is a drawn wedge), and `will-change` only on the few things that move continuously.
- `prefers-reduced-motion` gets the complete static page: nothing is ever hidden behind an animation that will not play.

## Resolved
Logo's in hand, palette's confirmed (see Color above) — this replaces the earlier placeholder green guess. Everything else in this brief (type pairing, diagonal hero, shelf, mosaic, no rounded-card kit) holds unchanged.
