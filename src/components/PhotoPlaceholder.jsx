import PlaceholderArt from './PlaceholderArt.jsx'
import Sample from './Sample.jsx'
import { ILLUSTRATIONS } from '../data/illustrations.js'

/**
 * A picture tile, flat, with the same eased corners as every other tile on
 * the site. It holds a photo the club uploaded (`src`); until there is one,
 * one of the collage illustrations (`image`) or a drawn scene (`scene`).
 * `sample` marks the caption as placeholder text; it is on unless told otherwise.
 *
 * Pass `ratio` for a fixed shape, or leave it off inside the gallery mosaic,
 * where the grid cell dictates the size.
 */
export default function PhotoPlaceholder({ label, image, src, scene, sample = true, ratio = '', className = '' }) {
  return (
    <figure className={`${ratio} ${className} photo relative h-full min-h-0 overflow-hidden rounded-tile`}>
      {/* Moves as one layer when the mosaic reveals it, so the picture is not redrawn each frame. */}
      <div className="photo-inner h-full w-full will-change-transform">
        {src || image ? (
          <img
            src={src || ILLUSTRATIONS[image]}
            alt=""
            // Not lazy: the mosaic slides tiles in from outside their frame,
            // where a lazy image would never be asked to load.
            decoding="async"
            className="block h-full w-full object-cover"
          />
        ) : (
          <PlaceholderArt scene={scene} className="block h-full w-full" />
        )}
        {label && (
          <figcaption className="absolute bottom-3 left-3 rounded-md bg-sand/95 px-2.5 py-1 text-xs font-semibold text-brand-deep">
            <Sample when={sample}>{label}</Sample>
          </figcaption>
        )}
      </div>
    </figure>
  )
}
