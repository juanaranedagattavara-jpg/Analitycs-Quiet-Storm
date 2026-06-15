import { randomUUID } from 'node:crypto'
import { getDb } from './client'
import type { InvoiceRow, InvoiceStatus } from './types'
import type { Plan, BillingCycle } from '@/lib/types'

export interface CreateInvoiceInput {
  userId: string
  amountUF: number
  amountCLP: number
  ufRate: number
  plan: Plan
  cycle: BillingCycle
  status?: InvoiceStatus
  mpPaymentId?: string | null
}

function nextInvoiceNumber(): string {
  const db = getDb()
  const r = db.prepare('SELECT COUNT(*) as n FROM invoices').get() as { n: number }
  const seq = (r.n + 1).toString().padStart(6, '0')
  const year = new Date().getFullYear()
  return `QSA-${year}-${seq}`
}

export function createInvoice(input: CreateInvoiceInput): InvoiceRow {
  const db = getDb()
  const now = new Date().toISOString()
  const id = randomUUID()
  const number = nextInvoiceNumber()
  const status: InvoiceStatus = input.status ?? 'pending'

  db.prepare(
    `INSERT INTO invoices (id, user_id, number, amount_uf, amount_clp, uf_rate, plan, cycle, status, mp_payment_id, issued_at, paid_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.userId,
    number,
    input.amountUF,
    input.amountCLP,
    input.ufRate,
    input.plan,
    input.cycle,
    status,
    input.mpPaymentId ?? null,
    now,
    status === 'paid' ? now : null,
    now,
  )

  return findInvoiceById(id)!
}

export function findInvoiceById(id: string): InvoiceRow | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM invoices WHERE id = ? LIMIT 1').get(id) as
    | InvoiceRow
    | undefined
  return row ?? null
}

export function listInvoicesByUser(userId: string): InvoiceRow[] {
  const db = getDb()
  return db
    .prepare('SELECT * FROM invoices WHERE user_id = ? ORDER BY issued_at DESC')
    .all(userId) as InvoiceRow[]
}

export function listAllInvoices(): InvoiceRow[] {
  const db = getDb()
  return db.prepare('SELECT * FROM invoices ORDER BY issued_at DESC').all() as InvoiceRow[]
}

export function markInvoicePaid(id: string, mpPaymentId: string): InvoiceRow | null {
  const db = getDb()
  const now = new Date().toISOString()
  db.prepare(
    `UPDATE invoices SET status = 'paid', paid_at = ?, mp_payment_id = ? WHERE id = ?`,
  ).run(now, mpPaymentId, id)
  return findInvoiceById(id)
}
