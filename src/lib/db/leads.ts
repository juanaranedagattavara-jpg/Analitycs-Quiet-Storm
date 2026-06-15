import { randomUUID } from 'node:crypto'
import { getDb } from './client'
import type { LeadRow } from './types'

export interface CreateLeadInput {
  name: string
  email: string
  company: string
  phone?: string | null
  industry?: string | null
  message?: string | null
  source?: string
}

export function createLead(input: CreateLeadInput): LeadRow {
  const db = getDb()
  const id = randomUUID()
  const now = new Date().toISOString()

  db.prepare(
    `INSERT INTO leads (id, name, email, company, phone, industry, message, source, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.name.trim(),
    input.email.toLowerCase().trim(),
    input.company.trim(),
    input.phone?.trim() || null,
    input.industry || null,
    input.message?.trim() || null,
    input.source || 'demo',
    'new',
    now,
  )

  const row = db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as LeadRow
  return row
}

export function listLeads(): LeadRow[] {
  const db = getDb()
  return db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all() as LeadRow[]
}
