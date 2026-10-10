/**
 * The app's Firestore database and Storage bucket, each set up once.
 *
 * Reach this through a dynamic `import()`, or from a module that is itself
 * loaded on demand: the public pages must not carry Firestore or Storage.
 */
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'
import { EMULATOR_HOST, EMULATOR_PORTS, app, emulated } from './firebase.js'

// Both are null when Firebase is not configured; callers check before they get here.
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null

if (emulated) {
  connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORTS.firestore)
  connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORTS.storage)
}
