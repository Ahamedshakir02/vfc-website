import type { ReactNode, ReactElement, ElementType, AnchorHTMLAttributes } from 'react'

export interface VfcProviderProps {
  /** Language for every component inside. @default "en" */
  lang?: 'en' | 'ml'
  /** The route treated as current, e.g. "/about". Drives the active link in Header. @default "/" */
  path?: string
  /** Set false for the static page: no entrance or scroll animation, everything in its final place. @default true */
  motion?: boolean
  children?: ReactNode
}
/** Router, language and motion context. Wrap everything built from the kit in this once. */
export declare function VfcProvider(props: VfcProviderProps): ReactElement

export interface BallProps {
  /** The ball has no size of its own. Give it "block h-full w-full" inside a wrapper you size yourself. */
  className?: string
  /** Colour of the panels and outline. @default "var(--color-brand-deep)" */
  panel?: string
  /** Unique per ball on a page; it namespaces the SVG clip path. @default "ball" */
  id?: string
}
/** The flat football from the crest. */
export declare function Ball(props: BallProps): ReactElement

export interface ButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** In-site route. Renders a router link. Use this or `href`. */
  to?: string
  /** External URL. Renders a plain anchor. */
  href?: string
  /** gold: the one loud action. brand: purple on light surfaces. outlineLight: on purple. outlineDark: on light. @default "brand" */
  variant?: 'gold' | 'brand' | 'outlineLight' | 'outlineDark'
  /** sm is for tight spots such as a header bar. @default "md" */
  size?: 'md' | 'sm'
  className?: string
  children?: ReactNode
}
/** Flat button with eased corners. Always a link: pass `to` or `href`. */
export declare function Button(props: ButtonProps): ReactElement

export interface CrestProps {
  /** Size and colour, e.g. "h-10 w-10 text-gold". @default "h-6 w-6" */
  className?: string
  /** Normalises stroke lengths so the outline can be drawn in with an animation. @default false */
  draw?: boolean
}
/** Small shield outline used as the icon for awards and as a divider. */
export declare function Crest(props: CrestProps): ReactElement

export interface CutProps {
  /** Which edge of the parent gets the diagonal. @default "bottom" */
  edge?: 'bottom' | 'top'
  /** Text colour class naming the neighbouring section's colour. @default "text-sand" */
  className?: string
}
/** The diagonal edge of a purple band. The parent needs `relative overflow-hidden`. */
export declare function Cut(props: CutProps): ReactElement

export interface FooterProps {}
/** The site footer: club and contact button, links and details, small print. Takes no props. */
export declare function Footer(props: FooterProps): ReactElement

export interface HeaderProps {}
/** The floating site header with navigation, language toggle and mobile menu. Fixed to the top of the viewport. Takes no props. */
export declare function Header(props: HeaderProps): ReactElement

export interface LanguageToggleProps {
  /** Use on purple surfaces: white lettering and border. @default false */
  onDark?: boolean
}
/** English / Malayalam switch. */
export declare function LanguageToggle(props: LanguageToggleProps): ReactElement

export interface MarqueeProps {
  /** The words that run across, in order. A crest sits between each. */
  items: string[]
  /** Type size, weight and colour, e.g. "py-8 font-display text-5xl font-extrabold text-brand sm:py-12 sm:text-7xl". */
  className?: string
}
/** A running band of words that picks up the speed and direction of the scroll. */
export declare function Marquee(props: MarqueeProps): ReactElement

export interface PageHeroProps {
  /** The page title, set very large. Also becomes the browser tab title. */
  heading: string
  /** One or two sentences under the title. */
  lede?: string
  /** Optional extra content under the lede, usually a Button. */
  children?: ReactNode
}
/** Head of an inner page: purple field, large title, gold rule, diagonal bottom edge. */
export declare function PageHero(props: PageHeroProps): ReactElement

export interface PageTransitionProps {
  /** `<Route>` elements, exactly as you would give to react-router's `<Routes>`. Use the `Route` exported from this kit. */
  children?: ReactNode
}
/** Renders the routes and plays the purple curtain on first load and between pages. */
export declare function PageTransition(props: PageTransitionProps): ReactElement

export interface PhotoPlaceholderProps {
  /** Caption tag shown bottom-left. */
  label?: string
  /** Which drawn scene to show. @default "centre" */
  scene?: 'centre' | 'stage' | 'stripes' | 'goal' | 'corner' | 'together' | 'map'
  /** Aspect ratio class for a fixed shape, e.g. "aspect-[4/5]". Leave off inside a grid that sets the size. */
  ratio?: string
  /** Extra classes, usually grid spans such as "col-span-2 row-span-2". */
  className?: string
}
/** A rounded photo tile holding a drawn scene, standing in for photography. */
export declare function PhotoPlaceholder(props: PhotoPlaceholderProps): ReactElement

export interface PlaceholderArtProps {
  /** Which scene to draw. @default "centre" */
  scene?: 'centre' | 'stage' | 'stripes' | 'goal' | 'corner' | 'together' | 'map'
  /** Size classes. The drawing fills and crops to whatever box this gives it. */
  className?: string
}
/** One of seven flat scenes in the club colours. */
export declare function PlaceholderArt(props: PlaceholderArtProps): ReactElement

export interface SampleProps {
  children?: ReactNode
}
/** Marks a value as sample content. Renders as plain text with a tooltip and `data-sample`. */
export declare function Sample(props: SampleProps): ReactElement

export interface ScrollProgressProps {}
/** Page progress: a gold line along the bottom of the viewport with a ball rolling along it. Takes no props. */
export declare function ScrollProgress(props: ScrollProgressProps): ReactElement

export interface SectionProps {
  /** Anchor id for the section. */
  id?: string
  /** Section title. Rises word by word with a gold rule beneath it. */
  heading?: string
  /** Content placed opposite the heading, usually a "View all" link. */
  action?: ReactNode
  /** Background. light: cream. white. brand: purple. deep: dark purple. @default "light" */
  tone?: 'light' | 'white' | 'brand' | 'deep'
  className?: string
  children?: ReactNode
}
/** A full-width band with the page's content column, vertical rhythm and an optional heading. */
export declare function Section(props: SectionProps): ReactElement

export interface RevealProps {
  /** Element to render. @default "div" */
  as?: ElementType
  /** Seconds between each direct child's entrance. 0 moves the wrapper as one block. @default 0 */
  stagger?: number
  /** Distance in px the content rises from. @default 28 */
  y?: number
  /** Seconds to wait before starting. @default 0 */
  delay?: number
  className?: string
  children?: ReactNode
}
/** Content fades and rises in once as it scrolls into view. */
export declare function Reveal(props: RevealProps): ReactElement

export interface WordsProps {
  /** The sentence to split into words. */
  text: string
  /** Wrap each word in a clipping box, for the rise-from-below reveal. @default true */
  mask?: boolean
}
/** Splits a sentence into `.word` spans so a parent can animate them one by one. Renders plain text otherwise. */
export declare function Words(props: WordsProps): ReactElement

export { Route } from 'react-router-dom'
