/**
 * Firebase app init only.
 *
 * Everything else is loaded where it is used and nowhere else:
 * src/lib/publicStore.js reads the site's content, src/lib/services.js holds
 * Firestore and Storage for the registration form, src/lib/payments.js calls
 * the payment functions, and src/lib/admin.js adds Auth for the officers'
 * screens. The collections are listed in src/data/schema.js.
 */
import { initializeApp, getApps } from 'firebase/app'

/**
 * `VITE_FIREBASE_EMULATORS=true` runs the dev server against the local
 * Firebase emulators (`npm run emulators`) instead of a real project, so
 * registering and the admin screens can be tried with nothing set up. It is
 * ignored in a production build: a deployed site can never point at them.
 */
export const emulated = import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATORS === 'true'
export const EMULATOR_HOST = '127.0.0.1'
export const EMULATOR_PORTS = { auth: 9099, firestore: 8089, storage: 9199, functions: 5001 } // as in firebase.json

const firebaseConfig = emulated
  ? // A "demo-" project is one the emulators accept without any credentials.
    { apiKey: 'demo', projectId: 'demo-vfc', storageBucket: 'demo-vfc.appspot.com', appId: 'demo' }
  : {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }

export const isFirebaseConfigured = Boolean(firebaseConfig.projectId)

// Guarded so a missing .env.local doesn't crash the public shell in dev.
export const app =
  isFirebaseConfigured && !getApps().length ? initializeApp(firebaseConfig) : getApps()[0] ?? null
