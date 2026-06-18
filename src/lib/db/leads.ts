import { randomUUID } from 'node:crypto'
import { getDb, ensureDb } from './client'
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

export async function createLead(input: CreateLeadInput): Promise<LeadRow> {
  await ensureDb()
  const sql = getDb()
  const id = randomUUID()
  const now = new Date().toISOString()

  await sql`INSERT INTO leads (id, name, email, company, phone, industry, message, source, status, created_at)
     VALUES (${id}, ${input.name.trim()}, ${input.email.toLowerCase().trim()}, ${input.company.trim()}, ${input.phone?.trim() || null}, ${input.industry || null}, ${input.message?.trim() || null}, ${input.source || 'demo'}, ${'new'}, ${now})`

  const rows = await sql`SELECT * FROM leads WHERE id = ${id}`
  return rows[0] as LeadRow
}

export async function listLeads(): Promise<LeadRow[]> {
  await ensureDb()
  const sql = getDb()
  return (await sql`SELECT * FROM leads ORDER BY created_at DESC`) as LeadRow[]
}
