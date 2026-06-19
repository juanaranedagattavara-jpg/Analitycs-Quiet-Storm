import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export interface SessionPayload {
  sid: string
  uid: string
  oid: string
  role: 'user' | 'admin'
}

function getSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET
  if (!raw || raw.length < 32) {
    throw new Error('AUTH_SECRET must be at least 32 characters long')
  }
  return new TextEncoder().encode(raw)
}

export function getCookieName(): string {
  return process.env.SESSION_COOKIE_NAME || 'qsa_session'
}

export function getSessionDurationDays(): number {
  const raw = process.env.SESSION_DURATION_DAYS
  const n = raw ? parseInt(raw, 10) : 30
  return Number.isFinite(n) && n > 0 ? n : 30
}

export function getSessionExpiresAt(): Date {
  const d = new Date()
  d.setDate(d.getDate() + getSessionDurationDays())
  return d
}

export async function createSessionToken(payload: SessionPayload, expiresAt: Date): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getSecret())
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (
      typeof payload.sid === 'string' &&
      typeof payload.uid === 'string' &&
      typeof payload.oid === 'string' &&
      (payload.role === 'user' || payload.role === 'admin')
    ) {
      return { sid: payload.sid, uid: payload.uid, oid: payload.oid, role: payload.role }
    }
    return null
  } catch {
    return null
  }
}

export async function readSessionFromCookies(): Promise<SessionPayload | null> {
  const store = await cookies()
  const token = store.get(getCookieName())?.value
  if (!token) return null
  return verifySessionToken(token)
}

export function readSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(getCookieName())?.value
  if (!token) return Promise.resolve(null)
  return verifySessionToken(token)
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies()
  store.set(getCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies()
  store.delete(getCookieName())
}
