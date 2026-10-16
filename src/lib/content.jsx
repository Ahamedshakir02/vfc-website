/**
 * The site's content, from wherever it currently lives.
 *
 * Officers edit events, the gallery, awards and the club's details at /admin,
 * which saves them in Firestore. Each of those is shown as soon as it exists;
 * until then the site falls back on what is built in (src/data/events.js and
 * src/data/placeholders.js), so it is never empty and runs with no Firebase
 * at all.
 *
 * What was last fetched is kept in localStorage, so a returning visitor sees
 * the page at once and it is brought up to date behind them.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isFirebaseConfigured } from './firebase.js'
import { EVENTS } from '../data/events.js'
import { EVENT_STATUS } from '../data/schema.js'
import { AWARD_PLACEHOLDERS, CONTACT, GALLERY_PLACEHOLDERS, IMPACT_STATS, SAMPLE_CONTENT } from '../data/placeholders.js'

export const BUILT_IN_SITE = {
  contact: CONTACT,
  contactSample: true,
  stats: IMPACT_STATS,
  statsSample: true,
  // Set at build time until an officer saves one from /admin.
  upiId: (import.meta.env.VITE_CLUB_UPI_ID ?? '').trim(),
  payOnline: false,
  sampleNotice: SAMPLE_CONTENT,
  // The society's registration number, shown on the About page once an officer adds it.
  registration: '',
}

const BUILT_IN = { events: EVENTS, awards: AWARD_PLACEHOLDERS, gallery: GALLERY_PLACEHOLDERS, site: BUILT_IN_SITE }

const CACHE_KEY = 'vfc:content:v1'
// A first-time visitor on a bad connection gets the built-in content rather than a purple screen.
const WAIT_MS = 3500

const byDate = (a, b) => (a.startsOn ?? '9999').localeCompare(b.startsOn ?? '9999') || a.createdAt - b.createdAt

/** Lays what Firestore holds over the built-in content, list by list. */
function assemble(stored) {
  if (!stored) return BUILT_IN
  const own = (list) => list.map((entry) => ({ ...entry, stored: true }))

  return {
    events: stored.events.length ? own(stored.events).sort(byDate) : BUILT_IN.events,
    awards: stored.awards.length
      ? own(stored.awards).sort((a, b) => String(b.year).localeCompare(String(a.year)))
      : BUILT_IN.awards,
    gallery: stored.gallery.length ? own(stored.gallery).sort((a, b) => b.createdAt - a.createdAt) : BUILT_IN.gallery,
    site: stored.site
      ? { ...BUILT_IN_SITE, ...stored.site, contact: { ...CONTACT, ...stored.site.contact } }
      : BUILT_IN_SITE,
  }
}

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY))
  } catch {
    return null
  }
}

const ContentContext = createContext(BUILT_IN)

let refetch = () => {}
/** The admin screens call this after a save, so the public pages show it without a reload. */
export const refreshContent = () => refetch()

export function ContentProvider({ children }) {
  const [stored, setStored] = useState(() => (isFirebaseConfigured ? readCache() : null))
  const [ready, setReady] = useState(() => !isFirebaseConfigured || Boolean(stored))

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined
    let live = true

    refetch = () =>
      import('./publicStore.js')
        .then((store) => store.fetchContent())
        .then((found) => {
          if (!live) return
          setStored(found)
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(found))
          } catch {
            // Storage blocked or full: the next visit simply fetches again.
          }
        })
        // Offline or refused: keep showing what we have.
        .catch(() => {})
        .finally(() => live && setReady(true))

    refetch()
    const giveUp = setTimeout(() => live && setReady(true), WAIT_MS)
    return () => {
      live = false
      refetch = () => {}
      clearTimeout(giveUp)
    }
  }, [])

  const content = useMemo(() => assemble(stored), [stored])

  // The purple cover from index.html stays up for the moment this takes.
  return ready ? <ContentContext.Provider value={content}>{children}</ContentContext.Provider> : null
}

/**
 * `{ events, awards, gallery, site, openEvent, getEvent }`. Works outside the
 * provider too (the component kit), where it is the built-in content.
 */
export function useContent() {
  const content = useContext(ContentContext)

  return useMemo(
    () => ({
      ...content,
      // The event the site points people at: the first one taking registrations.
      openEvent: content.events.find((event) => event.status === EVENT_STATUS.open) ?? null,
      getEvent: (id) => content.events.find((event) => event.id === id) ?? null,
    }),
    [content],
  )
}
