'use client'

import type { Plan, BillingCycle, SubscriptionStatus } from '@/lib/types'
import type { PublicUser, PublicOrganization, OrgMemberRole } from '@/lib/db/types'

export interface ClientSubscription {
  plan: Plan
  cycle: BillingCycle
  status: SubscriptionStatus
  startedAt: string
  renewsAt: string
  cancelAt?: string | null
}

export interface MeResponse {
  user: PublicUser | null
  organization: PublicOrganization | null
  orgRole: OrgMemberRole | null
  subscription: {
    plan: Plan
    cycle: BillingCycle
    status: SubscriptionStatus
    started_at: string
    renews_at: string
    cancel_at: string | null
  } | null
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'same-origin',
  })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    const msg = (data && (data as { error?: string }).error) || `Error ${res.status}`
    throw new ApiError(res.status, msg, data)
  }
  return data as T
}

export class ApiError extends Error {
  status: number
  data: unknown
  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}

export async function fetchMe(): Promise<MeResponse> {
  return jsonFetch<MeResponse>('/api/auth/me')
}

export async function login(email: string, password: string): Promise<{ user: PublicUser }> {
  return jsonFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  company: string
  phone?: string
  industry: 'mitilicultura' | 'erizos-jaibas' | 'algas' | 'otra'
  size: 'pyme' | 'profesional' | 'enterprise' | 'no-se'
  acceptedTerms: true
}

export async function register(payload: RegisterPayload): Promise<{ user: PublicUser }> {
  return jsonFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function logout(): Promise<void> {
  await jsonFetch('/api/auth/logout', { method: 'POST' })
}

export async function patchSubscription(input: {
  plan?: Plan
  cycle?: BillingCycle
}): Promise<{ subscription: ClientSubscription }> {
  return jsonFetch('/api/subscription', { method: 'PATCH', body: JSON.stringify(input) })
}

export async function cancelSubscription(): Promise<{ subscription: ClientSubscription }> {
  return jsonFetch('/api/subscription/cancel', { method: 'POST' })
}

export async function reactivateSubscription(): Promise<{ subscription: ClientSubscription }> {
  return jsonFetch('/api/subscription/reactivate', { method: 'POST' })
}

export interface ProfileUpdate {
  name?: string
  phone?: string | null
  rut?: string | null
}

export interface OrgUpdate {
  name?: string
  billingEmail?: string | null
}

export async function patchProfile(data: ProfileUpdate): Promise<{ user: PublicUser }> {
  return jsonFetch('/api/profile', { method: 'PATCH', body: JSON.stringify(data) })
}

export async function patchOrganization(data: OrgUpdate): Promise<{ organization: PublicOrganization }> {
  return jsonFetch('/api/organization', { method: 'PATCH', body: JSON.stringify(data) })
}
