# design-sync notes for vfc-website

Target: Claude Design project "VFC Club Design System" (`projectId` in `config.json`). First synced 2026-10-09.

## How this repo is set up for syncing

- This is a website, not a component library. A second Vite build exists only for the sync: `npm run build:kit` (config `vite.kit.config.js`, entry `src/kit/index.js`) writes `dist-kit/index.es.js`, `dist-kit/kit.css` and `dist-kit/index.d.ts`. The site never imports from `src/kit`.
- The components are plain JSX, so the types in `src/kit/index.d.ts` are hand-written and copied into `dist-kit/` by the build. **Adding a component or changing a prop means editing that file by hand.**
- `package.json` carries `module` and `types` fields pointing at `dist-kit/` purely so the converter finds the types root.
- `@types/react` is a devDependency only because the converter needs it to resolve prop types; without it prop bodies come out empty (`[DTS_REACT]`).
- Run the converter with `--entry ./dist-kit/index.es.js --node-modules ./node_modules`.

## Provider and previews

- Every card is wrapped in `VfcProvider` with `motion: false` (`cfg.provider`). With motion on, headings and reveals start hidden and animate in, so screenshots would catch them blank or mid-flight.
- `VfcProvider` is excluded from the component list (`componentSrcMap: null`): a card of its own would nest two routers, which react-router rejects. It still ships in the bundle and is documented in `conventions.md`.
- `Route` is re-exported from the kit (PageTransition needs it from the same router instance) and excluded from the component list.
- `Header`, `ScrollProgress` and `PageTransition` use `position: fixed`. Their previews wrap them in a box with `transform: translateZ(0)` so they pin to the card, and the cards are `cardMode: single`.
- Preview glue uses inline styles and CSS variables. The stylesheet is a compiled Tailwind build holding only classes the site uses, so an unfamiliar utility class silently does nothing. Breakpoint-only classes are the trap: `lg:h-24` exists, plain `h-24` does not.
- A Malayalam heading needs `lang="ml"` on an ancestor of the `.display-lg` element, not on the element itself, for the looser line-height rule to apply.

## Playwright

- The machine has Chromium build 1243 cached, which pairs with `playwright@1.63.0` (installed in `.ds-sync/`). A different Playwright version fails with "Executable doesn't exist".

## Known render warns

- `[FONT_REMOTE] "Baloo Chettan 2"`: expected. Fonts load from Google Fonts through an `@import` at the top of `src/kit/kit.css`; nothing is self-hosted.

## Re-sync risks

- **Hand-written types can drift.** `src/kit/index.d.ts` is not checked against the JSX. A renamed or removed prop will keep its old contract until someone edits the file.
- **Sample content is baked into `Footer`.** It renders the placeholder address, phone and email from `src/data/placeholders.js`. When the club supplies real details the Footer card changes and needs a re-sync.
- **The footer year** comes from `new Date()`; the capture harness freezes the clock, so the card shows a fixed year.
- **Fonts are fetched at runtime** from Google Fonts. An offline render falls back to system fonts and looks wrong without any error.
- **Crest images are inlined** into the bundle as base64 from `src/assets/`. Replacing the logo means rebuilding the kit.
- **Not verified here:** motion-on behaviour of any component (all previews run with motion off), the solid scrolled state of `Header`, the open mobile menu, and the curtain animation of `PageTransition`. None can be shown in a static card.
- Shell quirk on this Windows machine: long `cat <<'EOF'` heredocs containing apostrophes fail to parse in Git Bash. Write files with the editor tool instead.
