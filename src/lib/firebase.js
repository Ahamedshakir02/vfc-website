/**
 * Firebase app init only.
 *
 * Stage 1 (this build) is the public shell - nothing here reads or writes
 * Firestore yet. Firestore/Auth/Storage get wired in stage 2 alongside the
 * events page and the registration form.
 *
 * Collections the next stage will use (from the spec):
 *   events, registrations, awards, gallery  - see src/data/schema.js
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
