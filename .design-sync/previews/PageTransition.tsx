import { PageTransition, Route, Section } from 'vfc-club-website'

// The curtain is fixed to the viewport and parks itself off screen once the
// page is showing, so what you see here is the route it rendered.
const frame = { position: 'relative' as const, transform: 'translateZ(0)', overflow: 'hidden' }

export const RendersTheCurrentRoute = () => (
  <div style={frame}>
    <PageTransition>
      <Route
        path="/"
        element={
          <Section tone="white" heading="Our awards">
            <p style={{ margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
              PageTransition takes the place of the Routes element from the router. It shows the matching route and
              plays the purple curtain on first load and between pages.
            </p>
          </Section>
        }
      />
      <Route path="*" element={<Section tone="white" heading="Not found" />} />
    </PageTransition>
  </div>
)
