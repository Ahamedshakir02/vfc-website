import { PlaceholderArt } from 'vfc-club-website'

const scenes = ['centre', 'stage', 'stripes', 'goal', 'corner', 'together', 'map'] as const
const tile = { borderRadius: 'var(--radius-tile)', overflow: 'hidden' }

export const AllScenes = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 160px)', gap: 12, padding: 16 }}>
    {scenes.map((scene) => (
      <figure key={scene} style={{ margin: 0 }}>
        <div style={{ ...tile, height: 120 }}>
          <PlaceholderArt scene={scene} className="block h-full w-full" />
        </div>
        <figcaption style={{ marginTop: 6, fontSize: 13, color: 'var(--color-ink)' }}>{scene}</figcaption>
      </figure>
    ))}
  </div>
)

export const CropsToItsBox = () => (
  <div style={{ display: 'flex', gap: 12, padding: 16 }}>
    <div style={{ ...tile, width: 300, height: 110 }}>
      <PlaceholderArt scene="goal" className="block h-full w-full" />
    </div>
    <div style={{ ...tile, width: 110, height: 200 }}>
      <PlaceholderArt scene="goal" className="block h-full w-full" />
    </div>
  </div>
)
