import { randomUUID } from 'node:crypto'
import { getDb } from './client'

export interface AuditLogEntry {
  userId?: string | null
  action: string
  entity?: string | null
  entityId?: string | null
  metadata?: Record<string, unknown> | null
  ip?: string | null
}

export function logAudit(entry: AuditLogEntry): void {
  const db = getDb()
  db.prepare(
    `INSERT INTO audit_log (id, user_id, action, entity, entity_id, metadata, ip, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    randomUUID(),
    entry.userId ?? null,
    entry.action,
    entry.entity ?? null,
    entry.entityId ?? null,
    entry.metadata ? JSON.stringify(entry.metadata) : null,
    entry.ip ?? null,
    new Date().toISOString(),
  )
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

export function listRecentAudit(limit = 100): AuditRow[] {
  const db = getDb()
  return db
    .prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?')
    .all(limit) as AuditRow[]
}
