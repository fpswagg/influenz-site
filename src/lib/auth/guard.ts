import { cookies } from 'next/headers'
import { getSessionCookieName, isValidSessionToken } from '@/lib/auth/dashboard'

export async function isDashboardAuthenticated() {
  return isValidSessionToken(cookies().get(getSessionCookieName())?.value)
}

export async function requireDashboardAuth() {
  if (!(await isDashboardAuthenticated())) {
    throw new Error('Unauthorized')
  }
}
