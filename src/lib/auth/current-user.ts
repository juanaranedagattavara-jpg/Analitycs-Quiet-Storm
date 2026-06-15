import { readSessionFromCookies, readSessionFromRequest } from './session'
import { findUserById } from '@/lib/db/users'
import { findSessionById } from '@/lib/db/sessions'
import { findSubscriptionByUserId } from '@/lib/db/subscriptions'
import { toPublicUser, type PublicUser, type SubscriptionRow } from '@/lib/db/types'
import type { NextRequest } from 'next/server'

export interface CurrentUser {
  user: PublicUser
  subscription: SubscriptionRow
  sessionId: string
}

async function resolveFromSession(
  payload: { sid: string; uid: string } | null,
): Promise<CurrentUser | null> {
  if (!payload) return null

  const session = findSessionById(payload.sid)
  if (!session) return null

  if (new Date(session.expires_at).getTime() < Date.now()) return null

  const user = findUserById(payload.uid)
  if (!user) return null

  const subscription = findSubscriptionByUserId(user.id)
  if (!subscription) return null

  return {
    user: toPublicUser(user),
    subscription,
    sessionId: session.id,
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const payload = await readSessionFromCookies()
  return resolveFromSession(payload)
}

export async function getCurrentUserFromRequest(req: NextRequest): Promise<CurrentUser | null> {
  const payload = await readSessionFromRequest(req)
  return resolveFromSession(payload)
}

export async function requireUser(): Promise<CurrentUser> {
  const me = await getCurrentUser()
  if (!me) throw new HttpError(401, 'No autenticado')
  return me
}

export async function requireAdmin(): Promise<CurrentUser> {
  const me = await requireUser()
  if (me.user.role !== 'admin') throw new HttpError(403, 'Acceso restringido')
  return me
}

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}
