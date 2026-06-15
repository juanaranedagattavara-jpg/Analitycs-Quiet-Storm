import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken, getCookieName } from '@/lib/auth/session'

const PROTECTED = ['/plataforma']
const ADMIN_PATHS = ['/plataforma/admin']
const PUBLIC_API_PREFIXES = ['/api/auth/', '/api/demo', '/api/payments/webhook']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const needsAuth = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const isProtectedApi =
    pathname.startsWith('/api/') && !PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))

  if (!needsAuth && !isProtectedApi) return NextResponse.next()

  const token = req.cookies.get(getCookieName())?.value
  const session = token ? await verifySessionToken(token) : null

  if (!session) {
    if (isProtectedApi) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const isAdminPath = ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
  if (isAdminPath && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/plataforma', req.url))
  }

  if (pathname.startsWith('/api/admin/') && session.role !== 'admin') {
    return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/plataforma/:path*', '/api/:path*'],
}
