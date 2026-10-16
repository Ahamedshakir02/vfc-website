import { useId, useState } from 'react'
import { signIn } from '../../lib/admin.js'
import { emulated } from '../../lib/firebase.js'

const inputClass = 'h-13 w-full rounded-control border border-ink/40 bg-white px-4 text-base text-ink outline-offset-2'

// Firebase reports why a sign-in failed as a code; say it in plain words.
const REASONS = {
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes, then try again.',
  'auth/network-request-failed': 'No connection. Check the internet and try again.',
  'auth/user-disabled': 'This account has been switched off. Ask the club secretary.',
}
const WRONG_DETAILS = 'That email and password do not match an account.'
const WRONG = new Set(['auth/invalid-credential', 'auth/invalid-email', 'auth/user-not-found', 'auth/wrong-password'])

// Anything else means the Firebase project itself is not ready, which no
// password will fix. Say what to change, and keep the code for whoever does it.
const SETUP = {
  'auth/operation-not-allowed': 'Email and password sign-in is switched off for this Firebase project. Turn it on under Authentication, Sign-in method.',
  'auth/configuration-not-found': 'Authentication has not been set up in this Firebase project yet. Open Authentication in the Firebase console and press Get started.',
  'auth/admin-restricted-operation': 'This Firebase project does not allow this kind of sign-in. Check Authentication, Sign-in method.',
  'auth/invalid-api-key': "The site's Firebase API key is wrong. Check VITE_FIREBASE_API_KEY where the site is built, then rebuild.",
}

function reasonFor(code = '') {
  if (WRONG.has(code)) return WRONG_DETAILS
  if (REASONS[code]) return REASONS[code]
  if (SETUP[code]) return SETUP[code]
  if (code.startsWith('auth/api-key-not-valid')) return SETUP['auth/invalid-api-key']
  return `Could not sign in (${code || 'unknown error'}). Check the Firebase project's Authentication settings.`
}

// `npm run demo` makes one officer account in the local emulators, from the
// values in .env.demo. Offered here only while the site runs on the emulators.
const DEMO = emulated && import.meta.env.VITE_DEMO_ADMIN_EMAIL
  ? { email: import.meta.env.VITE_DEMO_ADMIN_EMAIL, password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD ?? '' }
  : null

/** Email and password. Accounts are made in the Firebase console, never here. */
export default function SignIn() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [problem, setProblem] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    if (!email.trim() || !password) {
      setProblem('Enter your email and password.')
      return
    }

    setSending(true)
    setProblem('')
    try {
      // On success the session watcher swaps this screen out.
      await signIn(email, password)
    } catch (error) {
      setProblem(reasonFor(error.code))
      setSending(false)
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
      <div>
        <h1 className="text-4xl font-extrabold text-brand">Sign in</h1>
        <p className="mt-1.5 text-ink/65">For club officers.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-email`} className="text-[0.9375rem] font-semibold">
          Email
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-password`} className="text-[0.9375rem] font-semibold">
          Password
        </label>
        <input
          id={`${id}-password`}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      {problem && (
        <p role="alert" className="font-semibold text-[#a3261c]">
          {problem}
        </p>
      )}

      {DEMO && (
        <div className="rounded-control bg-sand p-4 text-sm text-ink/80">
          <p>Demo mode: this site is running on the local emulators, with one demo officer account.</p>
          <button
            type="button"
            onClick={() => {
              setEmail(DEMO.email)
              setPassword(DEMO.password)
              setProblem('')
            }}
            className="mt-2 font-semibold text-brand underline underline-offset-4"
          >
            Fill in the demo account
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="h-14 rounded-control bg-gold text-base font-semibold text-brand-deep transition-colors hover:bg-brand-deep hover:text-white disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/55"
      >
        {sending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
