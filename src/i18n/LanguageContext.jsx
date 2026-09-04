import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'vfc:lang'
const LanguageContext = createContext(null)

function readStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ml') return stored
  } catch {
    // Private mode / blocked storage - fall through to the default.
  }
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Non-fatal - the choice just won't persist.
    }
    document.documentElement.lang = lang
  }, [lang])

  /**
   * Resolve a `{ en, ml }` pair to the active language, with a template
   * fill for strings like "Registration open — {event}".
   * Falls back to English when a Malayalam string is missing.
   */
  const t = useCallback(
    (pair, vars) => {
      if (!pair) return ''
      let out = pair[lang] || pair.en || ''
      if (vars) {
        for (const [key, value] of Object.entries(vars)) {
          out = out.replaceAll(`{${key}}`, value)
        }
      }
      return out
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
