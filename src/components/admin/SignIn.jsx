import { useId, useState } from 'react'
import { signIn } from '../../lib/admin.js'

const inputClass = 'h-13 w-full rounded-control border border-ink/40 bg-white px-4 text-base text-ink outline-offset-2'

// Firebase reports why a sign-in failed as a code; say it in plain words.
const REASONS = {
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes, then try again.',
  'auth/network-request-failed': 'No connection. Check the internet and try again.',
  'auth/user-disabled': 'This account has been switched off. Ask the club secretary.',
}
const WRONG_DETAILS = 'That email and password do not match an account.'

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
      setProblem(REASONS[error.code] ?? WRONG_DETAILS)
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
