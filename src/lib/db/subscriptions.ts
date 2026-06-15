import { randomUUID } from 'node:crypto'
import { getDb } from './client'
import type { Plan, BillingCycle, SubscriptionStatus } from '@/lib/types'
import type { SubscriptionRow } from './types'

function addDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export interface CreateSubscriptionInput {
  userId: string
  plan: Plan
  cycle?: BillingCycle
  status?: SubscriptionStatus
  trialDays?: number
}

export function createSubscription(input: CreateSubscriptionInput): SubscriptionRow {
  const db = getDb()
  const now = new Date().toISOString()
  const cycle: BillingCycle = input.cycle ?? 'mensual'
  const status: SubscriptionStatus = input.status ?? 'trial'
  const trialDays = input.trialDays ?? 30
  const id = randomUUID()

  db.prepare(
    `INSERT INTO subscriptions (id, user_id, plan, cycle, status, started_at, renews_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, input.userId, input.plan, cycle, status, now, addDays(now, trialDays), now)

  return findSubscriptionByUserId(input.userId)!
}

export function findSubscriptionByUserId(userId: string): SubscriptionRow | null {
  const db = getDb()
  const row = db
    .prepare('SELECT * FROM subscriptions WHERE user_id = ? LIMIT 1')
    .get(userId) as SubscriptionRow | undefined
  return row ?? null
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

export function updateSubscription(
  userId: string,
  patch: UpdateSubscriptionInput,
): SubscriptionRow | null {
  const db = getDb()
  const fields: string[] = []
  const values: unknown[] = []

  if (patch.plan !== undefined) {
    fields.push('plan = ?')
    values.push(patch.plan)
  }
  if (patch.cycle !== undefined) {
    fields.push('cycle = ?')
    values.push(patch.cycle)
  }
  if (patch.status !== undefined) {
    fields.push('status = ?')
    values.push(patch.status)
  }
  if (patch.renewsAt !== undefined) {
    fields.push('renews_at = ?')
    values.push(patch.renewsAt)
  }
  if (patch.cancelAt !== undefined) {
    fields.push('cancel_at = ?')
    values.push(patch.cancelAt)
  }
  if (patch.mpSubscriptionId !== undefined) {
    fields.push('mp_subscription_id = ?')
    values.push(patch.mpSubscriptionId)
  }
  if (patch.mpCustomerId !== undefined) {
    fields.push('mp_customer_id = ?')
    values.push(patch.mpCustomerId)
  }

  if (fields.length === 0) return findSubscriptionByUserId(userId)

  fields.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(userId)

  db.prepare(`UPDATE subscriptions SET ${fields.join(', ')} WHERE user_id = ?`).run(...values)
  return findSubscriptionByUserId(userId)
}

export function cancelSubscription(userId: string): SubscriptionRow | null {
  const sub = findSubscriptionByUserId(userId)
  if (!sub) return null
  return updateSubscription(userId, {
    status: 'cancelled',
    cancelAt: sub.renews_at,
  })
}

export function reactivateSubscription(userId: string): SubscriptionRow | null {
  return updateSubscription(userId, { status: 'active', cancelAt: null })
}
