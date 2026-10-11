/**
 * `npm run demo`: the whole site working on this machine, with nothing set up.
 *
 * Starts the Firebase emulators (accounts, database, file storage and the
 * payment functions), fills them with demo data, then starts the site pointed
 * at them. Nothing reaches the internet and no money can move. Everything is
 * thrown away when it stops (Ctrl+C).
 *
 * Needs the Firebase CLI (`npm install -g firebase-tools`) and Java.
 */
import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import net from 'node:net'
import { seedDemo } from './seed-demo.mjs'

const root = new URL('..', import.meta.url)
const EMULATOR_PORTS = [9099, 8089, 9199, 5001] // as in firebase.json
const children = []

function run(command, options = {}) {
  // Through the shell, so Windows finds firebase.cmd and npx.cmd.
  const child = spawn(command, { cwd: root, stdio: 'inherit', shell: true, ...options })
  children.push(child)
  return child
}

function stop(code = 0) {
  for (const child of children) {
    if (child.exitCode !== null) continue
    // On Windows the shell's own children outlive it unless the whole tree is taken down.
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
    else child.kill('SIGINT')
  }
  process.exit(code)
}
process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())

const listening = (port) =>
  new Promise((resolve) => {
    const socket = net.connect(port, '127.0.0.1')
    socket.once('connect', () => resolve(socket.destroy() || true))
    socket.once('error', () => resolve(false))
  })

async function untilListening(ports, seconds) {
  for (let waited = 0; waited < seconds; waited += 1) {
    if ((await Promise.all(ports.map(listening))).every(Boolean)) return true
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return false
}

if ((await Promise.all(EMULATOR_PORTS.map(listening))).some(Boolean)) {
  console.error('The Firebase emulators (or something else on their ports) are already running. Stop them, then try again.')
  process.exit(1)
}

if (!existsSync(new URL('functions/node_modules', root))) {
  console.log('Installing what the payment functions need (first run only)…')
  spawnSync('npm install --no-audit --no-fund', { cwd: new URL('functions/', root), stdio: 'inherit', shell: true })
}

const emulators = run('firebase emulators:start --only auth,firestore,storage,functions --project demo-vfc')
emulators.on('exit', (code) => {
  console.error('The Firebase emulators stopped.')
  stop(code ?? 1)
})

if (!(await untilListening(EMULATOR_PORTS, 120))) {
  console.error('The Firebase emulators did not start. Is the Firebase CLI installed, and Java?')
  stop(1)
}

try {
  await seedDemo()
} catch (error) {
  console.error(`The demo data could not be added.\n${error.message}`)
  stop(1)
}

console.log(`
  Demo data is in. Starting the site…

    The site        the address Vite prints below
    Admin           the same address, then /admin  (press "Fill in the demo account")
    Emulator data   http://127.0.0.1:4000

  Ctrl+C stops everything and discards the demo data.
`)

// The mode loads .env.demo; the variable is repeated here so a .env.local cannot switch it off.
const site = run('npx vite --mode demo', { env: { ...process.env, VITE_FIREBASE_EMULATORS: 'true' } })
site.on('exit', (code) => stop(code ?? 0))
