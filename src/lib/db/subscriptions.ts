import { randomUUID } from 'node:crypto'
import { getDb, ensureDb } from './client'
import type { Plan, BillingCycle, SubscriptionStatus } from '@/lib/types'
import type { SubscriptionRow } from './types'

function addDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export interface CreateSubscriptionInput {
  organizationId: string
  plan: Plan
  cycle?: BillingCycle
  status?: SubscriptionStatus
  trialDays?: number
}

export async function createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionRow> {
  await ensureDb()
  const sql = getDb()
  const now = new Date().toISOString()
  const cycle: BillingCycle = input.cycle ?? 'mensual'
  const status: SubscriptionStatus = input.status ?? 'trial'
  const trialDays = input.trialDays ?? 30
  const id = randomUUID()

  await sql`INSERT INTO subscriptions (id, organization_id, plan, cycle, status, started_at, renews_at, updated_at)
     VALUES (${id}, ${input.organizationId}, ${input.plan}, ${cycle}, ${status}, ${now}, ${addDays(now, trialDays)}, ${now})`

  return (await findSubscriptionByOrgId(input.organizationId))!
}

export async function findSubscriptionByOrgId(orgId: string): Promise<SubscriptionRow | null> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`SELECT * FROM subscriptions WHERE organization_id = ${orgId} LIMIT 1`
  return (rows[0] as SubscriptionRow) ?? null
}

export interface UpdateSubscriptionInput {
  plan?: Plan
  cycle?: BillingCycle
  status?: SubscriptionStatus
  renewsAt?: string
  cancelAt?: string | null
  mpSubscriptionId?: string | null
  mpCustomerId?: string | null
}

export async function updateSubscription(
  orgId: string,
  patch: UpdateSubscriptionInput,
): Promise<SubscriptionRow | null> {
  await ensureDb()
  const sql = getDb()
  const fields: string[] = []
  const params: unknown[] = []
  let idx = 1

  if (patch.plan !== undefined) { fields.push(`plan = $${idx++}`); params.push(patch.plan) }
  if (patch.cycle !== undefined) { fields.push(`cycle = $${idx++}`); params.push(patch.cycle) }
  if (patch.status !== undefined) { fields.push(`status = $${idx++}`); params.push(patch.status) }
  if (patch.renewsAt !== undefined) { fields.push(`renews_at = $${idx++}`); params.push(patch.renewsAt) }
  if (patch.cancelAt !== undefined) { fields.push(`cancel_at = $${idx++}`); params.push(patch.cancelAt) }
  if (patch.mpSubscriptionId !== undefined) { fields.push(`mp_subscription_id = $${idx++}`); params.push(patch.mpSubscriptionId) }
  if (patch.mpCustomerId !== undefined) { fields.push(`mp_customer_id = $${idx++}`); params.push(patch.mpCustomerId) }

  if (fields.length === 0) return findSubscriptionByOrgId(orgId)

  fields.push(`updated_at = $${idx++}`)
  params.push(new Date().toISOString())
  params.push(orgId)

  await sql.query(`UPDATE subscriptions SET ${fields.join(', ')} WHERE organization_id = $${idx}`, params)
  return findSubscriptionByOrgId(orgId)
}

export async function cancelSubscription(orgId: string): Promise<SubscriptionRow | null> {
  const sub = await findSubscriptionByOrgId(orgId)
  if (!sub) return null
  return updateSubscription(orgId, {
    status: 'cancelled',
    cancelAt: sub.renews_at,
  })
}

export async function reactivateSubscription(orgId: string): Promise<SubscriptionRow | null> {
  return updateSubscription(orgId, { status: 'active', cancelAt: null })
}
