import { randomUUID } from 'node:crypto'
import { getDb, ensureDb } from './client'
import type { SessionRow } from './types'

export interface CreateSessionInput {
  userId: string
  organizationId: string
  expiresAt: string
  userAgent?: string | null
  ip?: string | null
}

export async function createSession(input: CreateSessionInput): Promise<SessionRow> {
  await ensureDb()
  const sql = getDb()
  const id = randomUUID()
  const now = new Date().toISOString()

  await sql`INSERT INTO sessions (id, user_id, organization_id, expires_at, user_agent, ip, created_at)
     VALUES (${id}, ${input.userId}, ${input.organizationId}, ${input.expiresAt}, ${input.userAgent ?? null}, ${input.ip ?? null}, ${now})`

  return {
    id,
    user_id: input.userId,
    organization_id: input.organizationId,
    expires_at: input.expiresAt,
    user_agent: input.userAgent ?? null,
    ip: input.ip ?? null,
    created_at: now,
  }
}

export async function findSessionById(id: string): Promise<SessionRow | null> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`SELECT * FROM sessions WHERE id = ${id} LIMIT 1`
  return (rows[0] as SessionRow) ?? null
}

export async function deleteSession(id: string): Promise<void> {
  await ensureDb()
  const sql = getDb()
  await sql`DELETE FROM sessions WHERE id = ${id}`
}

export async function deleteSessionsByUser(userId: string): Promise<void> {
  await ensureDb()
  const sql = getDb()
  await sql`DELETE FROM sessions WHERE user_id = ${userId}`
}

export async function cleanExpiredSessions(): Promise<void> {
  await ensureDb()
  const sql = getDb()
  const now = new Date().toISOString()
  await sql`DELETE FROM sessions WHERE expires_at < ${now}`
}

export async function listUserSessions(userId: string): Promise<SessionRow[]> {
  await ensureDb()
  const sql = getDb()
  return (await sql`SELECT * FROM sessions WHERE user_id = ${userId} ORDER BY created_at DESC`) as SessionRow[]
}
