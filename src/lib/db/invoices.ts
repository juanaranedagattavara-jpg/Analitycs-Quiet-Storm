import { randomUUID } from 'node:crypto'
import { getDb, ensureDb } from './client'
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

async function nextInvoiceNumber(): Promise<string> {
  const sql = getDb()
  const rows = await sql`SELECT COUNT(*) as n FROM invoices`
  const n = Number((rows[0] as { n: string | number }).n)
  const seq = (n + 1).toString().padStart(6, '0')
  const year = new Date().getFullYear()
  return `QSA-${year}-${seq}`
}

export async function createInvoice(input: CreateInvoiceInput): Promise<InvoiceRow> {
  await ensureDb()
  const sql = getDb()
  const now = new Date().toISOString()
  const id = randomUUID()
  const number = await nextInvoiceNumber()
  const status: InvoiceStatus = input.status ?? 'pending'

  await sql`INSERT INTO invoices (id, user_id, number, amount_uf, amount_clp, uf_rate, plan, cycle, status, mp_payment_id, issued_at, paid_at, created_at)
     VALUES (${id}, ${input.userId}, ${number}, ${input.amountUF}, ${input.amountCLP}, ${input.ufRate}, ${input.plan}, ${input.cycle}, ${status}, ${input.mpPaymentId ?? null}, ${now}, ${status === 'paid' ? now : null}, ${now})`

  return (await findInvoiceById(id))!
}

export async function findInvoiceById(id: string): Promise<InvoiceRow | null> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`SELECT * FROM invoices WHERE id = ${id} LIMIT 1`
  return (rows[0] as InvoiceRow) ?? null
}

export async function listInvoicesByUser(userId: string): Promise<InvoiceRow[]> {
  await ensureDb()
  const sql = getDb()
  return (await sql`SELECT * FROM invoices WHERE user_id = ${userId} ORDER BY issued_at DESC`) as InvoiceRow[]
}

export async function listAllInvoices(): Promise<InvoiceRow[]> {
  await ensureDb()
  const sql = getDb()
  return (await sql`SELECT * FROM invoices ORDER BY issued_at DESC`) as InvoiceRow[]
}

export async function markInvoicePaid(id: string, mpPaymentId: string): Promise<InvoiceRow | null> {
  await ensureDb()
  const sql = getDb()
  const now = new Date().toISOString()
  await sql`UPDATE invoices SET status = 'paid', paid_at = ${now}, mp_payment_id = ${mpPaymentId} WHERE id = ${id}`
  return findInvoiceById(id)
}
