import { randomUUID } from 'node:crypto'
import { getDb, ensureDb } from './client'

export interface AuditLogEntry {
  userId?: string | null
  action: string
  entity?: string | null
  entityId?: string | null
  metadata?: Record<string, unknown> | null
  ip?: string | null
}

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  await ensureDb()
  const sql = getDb()
  await sql`INSERT INTO audit_log (id, user_id, action, entity, entity_id, metadata, ip, created_at)
     VALUES (${randomUUID()}, ${entry.userId ?? null}, ${entry.action}, ${entry.entity ?? null}, ${entry.entityId ?? null}, ${entry.metadata ? JSON.stringify(entry.metadata) : null}, ${entry.ip ?? null}, ${new Date().toISOString()})`
}

export interface AuditRow {
  id: string
  user_id: string | null
  action: string
  entity: string | null
  entity_id: string | null
  metadata: string | null
  ip: string | null
  created_at: string
}

export async function listRecentAudit(limit = 100): Promise<AuditRow[]> {
  await ensureDb()
  const sql = getDb()
  return (await sql`SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ${limit}`) as AuditRow[]
}
