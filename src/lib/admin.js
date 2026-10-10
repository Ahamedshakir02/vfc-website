/**
 * Everything the admin screens ask of Firebase: who is signed in, whether
 * that account is a club officer, and the registrations officers check.
 *
 * Only the admin page imports this, and that page is fetched on demand, so
 * none of it (Auth least of all) is downloaded by visitors to the public site.
 */
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { app, isFirebaseConfigured } from './firebase.js'
import { db, storage } from './services.js'
import { COLLECTIONS } from '../data/schema.js'

/** Without Firebase there is nothing to sign in to; the page says so. */
export const canUseAdmin = isFirebaseConfigured

const auth = app ? getAuth(app) : null

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
