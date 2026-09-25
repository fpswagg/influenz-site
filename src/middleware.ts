import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookieName, isValidSessionToken } from '@/lib/auth/dashboard'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard/login') || pathname.startsWith('/api/dashboard/login')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/dashboard')) {
    const token = request.cookies.get(getSessionCookieName())?.value
    if (!(await isValidSessionToken(token))) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/dashboard/login'
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/api/dashboard/:path*'],
}
