import { PhotoPlaceholder } from 'vfc-club-website'

export const WithCaption = () => (
  <div style={{ width: 320, padding: 16 }}>
    <PhotoPlaceholder scene="centre" label="Sports" ratio="aspect-[4/5]" />
  </div>
)

export const Scenes = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 180px)', gridAutoRows: '140px', gap: 12, padding: 16 }}>
    <PhotoPlaceholder scene="stage" label="Arts" />
    <PhotoPlaceholder scene="goal" label="Sports" />
    <PhotoPlaceholder scene="together" label="Welfare" />
    <PhotoPlaceholder scene="stripes" label="Sports" />
    <PhotoPlaceholder scene="corner" label="Sports" />
    <PhotoPlaceholder scene="map" />
  </div>
)

export const Mosaic = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 130px)', gridAutoRows: '110px', gap: 12, padding: 16 }}>
    <PhotoPlaceholder scene="centre" label="Sports" className="col-span-2 row-span-2" />
    <PhotoPlaceholder scene="stage" label="Arts" />
    <PhotoPlaceholder scene="goal" label="Sports" />
    <PhotoPlaceholder scene="stripes" label="Sports" className="col-span-2" />
  </div>
)
