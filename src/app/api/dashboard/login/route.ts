import { NextResponse } from 'next/server'
import {
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAgeSeconds,
  verifyDashboardPassword,
} from '@/lib/auth/dashboard'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const password = String(body.password || '')
    if (!verifyDashboardPassword(password)) {
      return NextResponse.json({ error: 'Mot de passe invalide' }, { status: 401 })
    }

    const token = await createSessionToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: getSessionCookieName(),
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: getSessionMaxAgeSeconds(),
    })
    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Impossible de se connecter' }, { status: 500 })
  }
}
