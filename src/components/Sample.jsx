/**
 * Marks a value as sample content standing in for something the club has not
 * supplied yet.
 *
 * It reads as ordinary text so the design can be judged as it will look, but
 * every use carries `data-sample` and a tooltip, and the footer shows a notice
 * for as long as SAMPLE_CONTENT is on in src/data/placeholders.js.
 * Grep for `<Sample` to find everything still waiting on the client.
 */
export default function Sample({ children }) {
  return (
    <span data-sample="true" title="Sample content — replace with the club's real details">
      {children}
    </span>
  )
}
