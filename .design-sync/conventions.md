# Building with the VFC club kit

These are the real components of the VFC Arts, Sports & Welfare Club website: a grassroots football and arts club in Kerala. The look is flat brand purple with one gold accent, softly rounded corners, no shadows, no gradients, left-aligned content, and a diagonal edge where a purple band ends.

## Wrap everything in `VfcProvider`

`VfcProvider` supplies the router and the language. Without it `Header`, `Footer`, `Button` (with `to`), `LanguageToggle` and `PageTransition` throw. Use exactly one, at the top; never nest a second one or another router inside it.

```jsx
const { VfcProvider, Header, PageHero, Section, Button, Footer } = window.VFC;

<VfcProvider lang="en" path="/about" motion={false}>
  <Header />
  <PageHero heading="About VFC" lede="Where sport meets community." />
  <Section heading="Our awards" tone="white">…</Section>
  <Footer />
</VfcProvider>
```

- `lang`: `"en"` or `"ml"` (Malayalam). `Header`, `Footer` and `LanguageToggle` translate themselves; text you pass in is shown as given.
- `path`: the route treated as current, which sets the highlighted link in `Header`.
- `motion`: `true` plays entrance and scroll animation. Pass `false` for a static mock-up, otherwise headings and reveals start hidden until they animate in.

## Styling: tokens and inline styles, not new utility classes

The stylesheet is a compiled Tailwind build that contains only the classes the site itself uses. A utility class you invent will usually not exist and will silently do nothing. For your own layout, write inline styles using the tokens:

| Token | Value | Use |
|---|---|---|
| `var(--color-brand)` | `#432d84` | purple: bands, headings on light, primary fill |
| `var(--color-brand-deep)` | `#2e1f5c` | dark purple: footer, darkest surface |
| `var(--color-gold)` | `#c89b3c` | the single accent: one primary action, rules, icons |
| `var(--color-sand)` | `#faf8f4` | page background |
| `var(--color-ink)` | `#221c3a` | body text |
| `var(--font-display)` | Baloo Chettan 2 | headings, numbers |
| `var(--font-sans)` | Noto Sans | body |
| `var(--radius-control)` | `0.5rem` | buttons, chips, inputs |
| `var(--radius-tile)` | `0.875rem` | tiles, photos, panels |
| `var(--cut)` | `2.75rem`, `4.5rem` from 640px | depth of the diagonal |

Classes that do exist and are safe to pass in `className` props:

- Type: `display-xl` (page title), `display-lg` (section title), `font-display`, `link-grow` (text link with an underline that grows on hover)
- Colour: `text-brand`, `text-gold`, `text-white`, `text-sand`, `text-ink`, `bg-brand`, `bg-brand-deep`, `bg-sand`, `bg-white`
- Shape: `rounded-control`, `rounded-tile`, `hatch` (quiet diagonal hatch fill)
- Sizing: `block`, `h-full`, `w-full`, `h-6 w-6`, `h-10 w-10`, `col-span-2`, `row-span-2`

## Things that are easy to get wrong

- `Ball`, `PlaceholderArt` and `Crest` have no size of their own. Put `Ball` and `PlaceholderArt` in a wrapper you size with inline styles and give them `className="block h-full w-full"`. Give every `Ball` on a page a different `id`.
- `Cut` draws the diagonal as a wedge in the neighbouring section's colour. Its parent must be `position: relative; overflow: hidden`, and `className` names that neighbour: `text-sand` (default) or `text-white`.
- `Header` and `ScrollProgress` are `position: fixed` to the viewport. Inside a frame, give the frame `transform: translateZ(0)` so they pin to it.
- `Button` is always a link: pass `to` for an in-site route or `href` for an external URL. Use `variant="gold"` once per view; `outlineLight` only on purple, `outlineDark` and `brand` on light surfaces.
- `Section` supplies the content column (max width, side padding) and vertical rhythm. Put page content inside a `Section` instead of building your own container. `tone` is `light`, `white`, `brand` or `deep`.
- `PhotoPlaceholder` stands in for photography with a drawn scene: `centre`, `stage`, `stripes`, `goal`, `corner`, `together`, `map`.
- Wrap any invented fact (numbers, award names, contact details) in `Sample` so it is marked as sample content.

## Where the truth lives

Read `styles.css` and `_ds_bundle.css` for the tokens and classes, and `components/<group>/<Name>/<Name>.prompt.md` plus `<Name>.d.ts` for each component's props before using it.

## A page section, the idiomatic way

```jsx
const { Section, PhotoPlaceholder, Button, Sample } = window.VFC;

<Section heading="Moments from our events" tone="light">
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '11rem', gap: 12 }}>
    <PhotoPlaceholder scene="centre" label="Sports" className="col-span-2 row-span-2" />
    <PhotoPlaceholder scene="stage" label="Arts" />
    <PhotoPlaceholder scene="goal" label="Sports" />
    <PhotoPlaceholder scene="stripes" label="Sports" className="col-span-2" />
  </div>
  <p style={{ margin: '32px 0 0', fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-brand)' }}>
    <Sample>45+</Sample> events run
  </p>
  <div style={{ marginTop: 24 }}>
    <Button to="/gallery" variant="brand">View all</Button>
  </div>
</Section>
```
