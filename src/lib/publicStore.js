/**
 * Reads the site's content for visitors: events, awards, gallery, settings.
 *
 * Uses Firestore's "lite" build (plain requests, no live connection), which is
 * a fraction of the size of the one the admin screens use. Reach this through
 * a dynamic `import()` so the first paint does not wait on it.
 */
import { collection, connectFirestoreEmulator, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore/lite'
import { EMULATOR_HOST, EMULATOR_PORTS, app, emulated } from './firebase.js'
import { COLLECTIONS, SITE_SETTINGS } from '../data/schema.js'

const db = getFirestore(app)
if (emulated) connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORTS.firestore)

const rows = async (name) => {
  const found = await getDocs(collection(db, name))
  return found.docs.map((entry) => {
    const data = entry.data()
    // A plain number, so the content can be kept in localStorage between visits.
    return { ...data, id: entry.id, createdAt: data.createdAt?.toMillis?.() ?? 0 }
  })
}

/** Each list comes back empty when officers have not added anything to it yet. */
export async function fetchContent() {
  const [events, awards, gallery, site] = await Promise.all([
    rows(COLLECTIONS.events),
    rows(COLLECTIONS.awards),
    rows(COLLECTIONS.gallery),
    getDoc(doc(db, COLLECTIONS.settings, SITE_SETTINGS)),
  ])
  return { events, awards, gallery, site: site.exists() ? site.data() : null }
}
