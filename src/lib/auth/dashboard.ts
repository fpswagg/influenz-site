const COOKIE_NAME = 'influenz_dashboard'
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET must be set to a string of at least 16 characters')
  }
  return secret
}

function getDashboardPassword() {
  const password = process.env.DASHBOARD_PASSWORD
  if (!password) {
    throw new Error('DASHBOARD_PASSWORD is not configured')
  }
  return password
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return toHex(signature)
}

export function verifyDashboardPassword(password: string) {
  return timingSafeEqual(password, getDashboardPassword())
}

export async function createSessionToken() {
  const expiresAt = Date.now() + SESSION_MAX_AGE_MS
  const nonce = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer)
  const payload = `${expiresAt}.${nonce}`
  return `${payload}.${await hmac(payload)}`
}

export async function isValidSessionToken(token: string | undefined | null) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [expiresAt, nonce, signature] = parts
  if (!expiresAt || !nonce || !signature) return false
  const expected = await hmac(`${expiresAt}.${nonce}`)
  if (!timingSafeEqual(signature, expected)) return false
  const expiry = Number(expiresAt)
  return Number.isFinite(expiry) && expiry > Date.now()
}

export function getSessionCookieName() {
  return COOKIE_NAME
}

export function getSessionMaxAgeSeconds() {
  return Math.floor(SESSION_MAX_AGE_MS / 1000)
}
