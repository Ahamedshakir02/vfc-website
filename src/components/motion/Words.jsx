/**
 * Splits a string into words so they can be animated one by one.
 *
 * Words, never characters: splitting Malayalam by character tears conjuncts
 * apart. Real spaces stay between the words, so screen readers and copy-paste
 * see an ordinary sentence.
 *
 * `mask` wraps each word in a clipping box for the rise-from-below reveal.
 */
export default function Words({ text, mask = true }) {
  const words = String(text).split(' ').filter(Boolean)

  return words.map((word, i) => (
    <span key={`${word}-${i}`}>
      {mask ? (
        <span className="word-mask">
          <span className="word">{word}</span>
        </span>
      ) : (
        <span className="word">{word}</span>
      )}
      {i < words.length - 1 ? ' ' : ''}
    </span>
  ))
}
