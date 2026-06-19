import { readSessionFromCookies, readSessionFromRequest } from './session'
import { findUserById } from '@/lib/db/users'
import { findSessionById } from '@/lib/db/sessions'
import { findSubscriptionByOrgId } from '@/lib/db/subscriptions'
import { findOrganizationById } from '@/lib/db/organizations'
import { findMembership } from '@/lib/db/organizations'
import { toPublicUser, toPublicOrganization, type PublicUser, type PublicOrganization, type SubscriptionRow, type OrgMemberRole } from '@/lib/db/types'
import type { NextRequest } from 'next/server'

export interface CurrentUser {
  user: PublicUser
  organization: PublicOrganization
  organizationId: string
  orgRole: OrgMemberRole
  subscription: SubscriptionRow
  sessionId: string
}

async function resolveFromSession(
  payload: { sid: string; uid: string; oid: string } | null,
): Promise<CurrentUser | null> {
  if (!payload) return null

  const session = await findSessionById(payload.sid)
  if (!session) return null

  if (new Date(session.expires_at).getTime() < Date.now()) return null

  const user = await findUserById(payload.uid)
  if (!user) return null

  const org = await findOrganizationById(payload.oid)
  if (!org) return null

  const membership = await findMembership(payload.oid, payload.uid)
  if (!membership) return null

  const subscription = await findSubscriptionByOrgId(payload.oid)
  if (!subscription) return null

  return {
    user: toPublicUser(user),
    organization: toPublicOrganization(org),
    organizationId: org.id,
    orgRole: membership.role,
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
  if (me.user.role !== 'admin' && me.orgRole !== 'owner' && me.orgRole !== 'admin') {
    throw new HttpError(403, 'Acceso restringido')
  }
  return me
}

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}
