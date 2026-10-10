/**
 * Firebase app init only.
 *
 * Firestore, Storage and Auth are loaded where they are used and nowhere
 * else: src/lib/services.js holds the first two for the public form,
 * src/lib/admin.js adds Auth for the officers' screens. The collections are
 * listed in src/data/schema.js.
 */
import { initializeApp, getApps } from 'firebase/app'

const firebaseConfig = {
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
