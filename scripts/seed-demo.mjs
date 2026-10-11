/**
 * Fills the local Firebase emulators with enough to try every part of the
 * site: an officer account, the built-in events (the league given a sample
 * fee so its form is live), both ways of paying switched on, and a few sample
 * registrations to check.
 *
 * Run by `npm run demo`, or on its own (`node scripts/seed-demo.mjs`) while
 * `npm run emulators` is up. It only ever talks to 127.0.0.1, and does nothing
 * if the emulators already hold events.
 */
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { EVENTS } from '../src/data/events.js'

const PROJECT = 'demo-vfc'
const HOST = '127.0.0.1'
const PORTS = { auth: 9099, firestore: 8089, storage: 9199 } // as in firebase.json
const BUCKET = `${PROJECT}.appspot.com`

// "owner" is the emulators' own pass: it skips the security rules.
const asOwner = { Authorization: 'Bearer owner' }
const documents = `http://${HOST}:${PORTS.firestore}/v1/projects/${PROJECT}/databases/(default)/documents`

/** The demo officer's sign-in details live in .env.demo, where the sign-in screen also reads them. */
function demoAccount() {
  const env = Object.fromEntries(
    readFileSync(new URL('../.env.demo', import.meta.url), 'utf8')
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
  )
  return { email: env.VITE_DEMO_ADMIN_EMAIL, password: env.VITE_DEMO_ADMIN_PASSWORD }
}

/** A plain value in the shape Firestore's REST API wants. */
function toValue(value) {
  if (value === null || value === undefined) return { nullValue: null }
  if (value instanceof Date) return { timestampValue: value.toISOString() }
  if (typeof value === 'boolean') return { booleanValue: value }
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }
  if (typeof value === 'string') return { stringValue: value }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toValue) } }
  return { mapValue: { fields: toFields(value) } }
}
const toFields = (data) => Object.fromEntries(Object.entries(data).map(([key, value]) => [key, toValue(value)]))

async function send(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error(`${options?.method ?? 'GET'} ${url}: ${response.status} ${await response.text()}`)
  return response.json()
}

const put = (path, data) =>
  send(`${documents}/${path}`, {
    method: 'PATCH',
    headers: { ...asOwner, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFields(data) }),
  })

async function officerUid({ email, password }) {
  const identity = `http://${HOST}:${PORTS.auth}/identitytoolkit.googleapis.com/v1/accounts`
  const body = JSON.stringify({ email, password, returnSecureToken: true })
  const headers = { 'Content-Type': 'application/json' }

  const made = await fetch(`${identity}:signUp?key=demo`, { method: 'POST', headers, body })
  if (made.ok) return (await made.json()).localId
  // Already there from an earlier run against the same emulators.
  return (await send(`${identity}:signInWithPassword?key=demo`, { method: 'POST', headers, body })).localId
}

/** A drawn stand-in for a UPI app's receipt, so "View screenshot" has something to show. */
const receipt = (name, ref) => `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="520" font-family="sans-serif">
  <rect width="360" height="520" fill="#faf8f4"/>
  <rect width="360" height="96" fill="#432d84"/>
  <text x="24" y="58" fill="#fff" font-size="22" font-weight="700">Sample receipt</text>
  <text x="24" y="150" fill="#221c3a" font-size="40" font-weight="700">&#8377;500</text>
  <text x="24" y="190" fill="#221c3a" font-size="16">Paid to vfc-demo@upi</text>
  <text x="24" y="250" fill="#6b6780" font-size="14">From</text>
  <text x="24" y="274" fill="#221c3a" font-size="18">${name}</text>
  <text x="24" y="324" fill="#6b6780" font-size="14">UPI reference</text>
  <text x="24" y="348" fill="#221c3a" font-size="18">${ref}</text>
  <text x="24" y="480" fill="#c89b3c" font-size="14" font-weight="700">Demo data. Not a real payment.</text>
</svg>`

async function addRegistration(eventId, id, entry) {
  const path = `payment-screenshots/${eventId}/${id}.svg`
  await send(`http://${HOST}:${PORTS.storage}/v0/b/${BUCKET}/o?name=${encodeURIComponent(path)}`, {
    method: 'POST',
    headers: { ...asOwner, 'Content-Type': 'image/svg+xml' },
    body: receipt(entry.name, entry.paymentRef),
  })
  await put(`registrations/${id}`, {
    eventId,
    email: '',
    category: 'open',
    paymentMethod: 'upi',
    paymentScreenshotPath: path,
    ...entry,
  })
}

export async function seedDemo() {
  const existing = await send(`${documents}/events?pageSize=1`, { headers: asOwner })
  if (existing.documents?.length) return false

  const account = demoAccount()
  await put(`admins/${await officerUid(account)}`, {})

  const league = EVENTS.find((event) => !event.sample)
  for (const [i, { id, ...event }] of EVENTS.entries()) {
    await put(`events/${id}`, {
      ...event,
      // The club has not set a fee. This one is invented so the form can be
      // tried, and the site marks it as sample content wherever it shows.
      ...(id === league.id && { fee: 500, sampleFields: ['fee'] }),
      createdAt: new Date(Date.now() - (EVENTS.length - i) * 60_000),
    })
  }

  // Both ways of paying on: UPI to an unusable ID, and the stand-in payment page.
  await put('settings/site', { upiId: 'vfc-demo@upi', payOnline: true })

  const hour = 3_600_000
  const samples = [
    { name: 'Sample Player One', teamName: 'Sample United', phone: '9000000001', paymentRef: 'DEMO00000001', paymentStatus: 'verified', createdAt: new Date(Date.now() - 26 * hour) },
    { name: 'Sample Player Two', teamName: '', phone: '9000000002', paymentRef: 'DEMO00000002', paymentStatus: 'pending', createdAt: new Date(Date.now() - 5 * hour) },
    // The same reference as the one above: the screen flags a payment sent in twice.
    { name: 'Sample Player Three', teamName: 'Sample Rovers', phone: '9000000003', paymentRef: 'DEMO00000002', paymentStatus: 'pending', createdAt: new Date(Date.now() - 2 * hour) },
  ]
  for (const [i, entry] of samples.entries()) await addRegistration(league.id, `demo-registration-${i + 1}`, entry)

  return true
}

// Run directly rather than imported by scripts/demo.mjs.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedDemo().then(
    (seeded) => console.log(seeded ? 'Demo data added to the emulators.' : 'The emulators already hold events; nothing added.'),
    (error) => {
      console.error(`Could not seed the emulators. Are they running (npm run emulators)?\n${error.message}`)
      process.exitCode = 1
    },
  )
}
