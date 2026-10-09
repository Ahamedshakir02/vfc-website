import { Words } from 'vfc-club-website'

const heading = {
  margin: 0,
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  color: 'var(--color-brand)',
}

// Words renders plain text; it exists so a parent can animate `.word` spans.
export const InAHeadline = () => (
  <div style={{ padding: 24 }}>
    <h2 className="display-lg" style={heading}>
      <Words text="Moments from our events" />
    </h2>
  </div>
)

export const Unmasked = () => (
  <div style={{ padding: 24 }}>
    <p style={{ ...heading, fontSize: 28, fontWeight: 600, lineHeight: 1.3, maxWidth: 520 }}>
      <Words mask={false} text="Every match, every event, every award is proof of what a community can build together." />
    </p>
  </div>
)

// `lang` goes on an ancestor: the looser Malayalam line height keys off it.
export const Malayalam = () => (
  <div lang="ml" style={{ padding: 24 }}>
    <h2 className="display-lg" style={heading}>
      <Words text="കായികവും സമൂഹവും ഒന്നിക്കുന്നിടം." />
    </h2>
  </div>
)
