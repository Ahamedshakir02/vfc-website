import PlaceholderArt from './PlaceholderArt.jsx'
import Sample from './Sample.jsx'

/**
 * Stand-in for the real photography, which hasn't been handed over yet: a
 * drawn scene in the club's colours with a caption tag. Flat, with the same
 * eased corners as every other tile on the site.
 *
 * Pass `ratio` for a fixed shape, or leave it off inside the gallery mosaic,
 * where the grid cell dictates the size.
 */
export default function PhotoPlaceholder({ label, scene, ratio = '', className = '' }) {
  return (
    <figure className={`${ratio} ${className} photo relative h-full min-h-0 overflow-hidden rounded-tile`}>
      {/* Moves as one layer when the mosaic reveals it, so the drawing is not redrawn each frame. */}
      <div className="photo-inner h-full w-full will-change-transform">
        <PlaceholderArt scene={scene} className="block h-full w-full" />
        {label && (
          <figcaption className="absolute bottom-3 left-3 rounded-md bg-sand/95 px-2.5 py-1 text-xs font-semibold text-brand-deep">
            <Sample>{label}</Sample>
          </figcaption>
        )}
      </div>
    </figure>
  )
}
