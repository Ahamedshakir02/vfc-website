/**
 * Everything the admin screens ask of Firebase: who is signed in, whether
 * that account is a club officer, the registrations officers check, and the
 * site content they edit.
 *
 * Only the admin page imports this, and that page is fetched on demand, so
 * none of it (Auth least of all) is downloaded by visitors to the public site.
 */
import { connectAuthEmulator, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { EMULATOR_HOST, EMULATOR_PORTS, app, emulated, isFirebaseConfigured } from './firebase.js'
import { db, storage } from './services.js'
import { refreshContent } from './content.jsx'
import { COLLECTIONS, SITE_SETTINGS } from '../data/schema.js'

/** Without Firebase there is nothing to sign in to; the page says so. */
export const canUseAdmin = isFirebaseConfigured

const auth = app ? getAuth(app) : null
if (emulated) connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${EMULATOR_PORTS.auth}`, { disableWarnings: true })

export const ROLE = {
  officer: 'officer',
  visitor: 'visitor', // signed in, but not on the officers list
  unknown: 'unknown', // the list could not be read, e.g. no connection
}

/**
 * Calls back with `{ user, role }` now and whenever the sign-in changes;
 * `user` is null when nobody is signed in. Returns the function that stops it.
 */
export function watchSession(onChange) {
  let latest = 0

  return onAuthStateChanged(auth, async (user) => {
    const turn = ++latest
    if (!user) {
      onChange({ user: null, role: null })
      return
    }

    let role
    try {
      const entry = await getDoc(doc(db, COLLECTIONS.admins, user.uid))
      role = entry.exists() ? ROLE.officer : ROLE.visitor
    } catch {
      role = ROLE.unknown
    }
    // A slow answer for an account that has since signed out is dropped.
    if (turn === latest) onChange({ user, role })
  })
}

export const signIn = (email, password) => signInWithEmailAndPassword(auth, email.trim(), password)

export const signOutOfficer = () => signOut(auth)

/**
 * Live list of one event's registrations, in the order they arrived, so a new
 * one lands at the end rather than shifting the rows being checked.
 */
export function watchRegistrations(eventId, onRows, onError) {
  const forEvent = query(
    collection(db, COLLECTIONS.registrations),
    where('eventId', '==', eventId),
  )

  return onSnapshot(
    forEvent,
    (snapshot) => {
      const rows = snapshot.docs.map((entry) => {
        const data = entry.data()
        return { ...data, id: entry.id, createdAt: data.createdAt?.toDate() ?? null }
      })
      rows.sort((a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0))
      onRows(rows)
    },
    onError,
  )
}

/** The list updates itself straight away; the promise rejects if the server refuses. */
export const setPaymentStatus = (registrationId, paymentStatus) =>
  updateDoc(doc(db, COLLECTIONS.registrations, registrationId), { paymentStatus })

/** A link to a payment screenshot. The storage rules only hand one to an officer. */
export const getScreenshotUrl = (path) => getDownloadURL(ref(storage, path))

/*
  Site content: events, the gallery, awards and the club's details. Officers
  are the only ones the rules let write any of it. After every change the
  public pages are told to fetch again, so "View the site" shows it at once.
*/

/** Live contents of one collection, oldest first. Returns the function that stops it. */
export function watchList(name, onRows, onError) {
  return onSnapshot(
    collection(db, name),
    (snapshot) => {
      const rows = snapshot.docs.map((entry) => {
        const data = entry.data()
        return { ...data, id: entry.id, createdAt: data.createdAt?.toMillis() ?? Date.now() }
      })
      onRows(rows.sort((a, b) => a.createdAt - b.createdAt))
    },
    onError,
  )
}

/**
 * Saves `data` to one entry. With `isNew` the entry is created (under `id`,
 * or an id of Firestore's choosing) and stamped with the time; otherwise the
 * fields given replace their old values and the rest are left as they were.
 */
export async function saveEntry(name, id, data, isNew) {
  const { createdAt: _kept, id: _id, stored: _stored, ...fields } = data
  const entry = id ? doc(db, name, id) : doc(collection(db, name))
  if (isNew) await setDoc(entry, { ...fields, createdAt: serverTimestamp() })
  else await updateDoc(entry, fields)
  refreshContent()
  return entry.id
}

export async function removeEntry(name, id) {
  await deleteDoc(doc(db, name, id))
  refreshContent()
}

const LONGEST_EDGE = 1600

/**
 * Phone photos run to several megabytes; visitors on mobile data should not
 * pay for that. Redraws the picture no larger than it will ever be shown.
 */
async function shrink(file) {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, LONGEST_EDGE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.84))
    return blob ?? file
  } catch {
    // A format the browser cannot draw: send it as it is and let the rules judge it.
    return file
  }
}

/** Puts a picture in the site's public folder. Resolves with where it is and its address. */
export async function uploadPicture(folder, file) {
  const picture = await shrink(file)
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${picture === file ? 'img' : 'jpg'}`
  const path = `site/${folder}/${name}`
  await uploadBytes(ref(storage, path), picture, { contentType: picture.type || file.type })
  return { path, url: await getDownloadURL(ref(storage, path)) }
}

/** Best effort: a picture that is already gone, or cannot be reached, is not worth an error. */
export const removePicture = (path) => (path ? deleteObject(ref(storage, path)).catch(() => {}) : Promise.resolve())

const siteDoc = () => doc(db, COLLECTIONS.settings, SITE_SETTINGS)

/** What officers have saved of the club's details, or `null` if nothing yet. */
export const loadSite = async () => (await getDoc(siteDoc())).data() ?? null

export async function saveSite(data) {
  await setDoc(siteDoc(), data, { merge: true })
  refreshContent()
}
