import { randomUUID } from 'node:crypto'
import { getDb } from './client'
import type { SessionRow } from './types'

export interface CreateSessionInput {
  userId: string
  expiresAt: string
  userAgent?: string | null
  ip?: string | null
}

export function createSession(input: CreateSessionInput): SessionRow {
  const db = getDb()
  const id = randomUUID()
  const now = new Date().toISOString()

  db.prepare(
    `INSERT INTO sessions (id, user_id, expires_at, user_agent, ip, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, input.userId, input.expiresAt, input.userAgent ?? null, input.ip ?? null, now)

  return {
    id,
    user_id: input.userId,
    expires_at: input.expiresAt,
    user_agent: input.userAgent ?? null,
    ip: input.ip ?? null,
    created_at: now,
  }
}

export function findSessionById(id: string): SessionRow | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM sessions WHERE id = ? LIMIT 1').get(id) as
    | SessionRow
    | undefined
  return row ?? null
}

export function deleteSession(id: string): void {
  const db = getDb()
  db.prepare('DELETE FROM sessions WHERE id = ?').run(id)
}

export function deleteSessionsByUser(userId: string): void {
  const db = getDb()
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId)
}

export function cleanExpiredSessions(): void {
  const db = getDb()
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(new Date().toISOString())
}

export function listUserSessions(userId: string): SessionRow[] {
  const db = getDb()
  return db
    .prepare('SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId) as SessionRow[]
}
