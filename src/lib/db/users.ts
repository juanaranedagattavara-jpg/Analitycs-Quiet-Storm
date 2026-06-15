import { randomUUID } from 'node:crypto'
import { getDb } from './client'
import type { UserRow, UserRole } from './types'

export interface CreateUserInput {
  email: string
  passwordHash: string
  name: string
  company: string
  phone?: string
  industry: string
  size: string
  role?: UserRole
}

export function findUserByEmail(email: string): UserRow | null {
  const db = getDb()
  const row = db
    .prepare('SELECT * FROM users WHERE lower(email) = lower(?) LIMIT 1')
    .get(email) as UserRow | undefined
  return row ?? null
}

export function findUserById(id: string): UserRow | null {
  const db = getDb()
  const row = db
    .prepare('SELECT * FROM users WHERE id = ? LIMIT 1')
    .get(id) as UserRow | undefined
  return row ?? null
}

export function createUser(input: CreateUserInput): UserRow {
  const db = getDb()
  const now = new Date().toISOString()
  const id = randomUUID()
  const role: UserRole = input.role ?? 'user'

  db.prepare(
    `INSERT INTO users (id, email, password_hash, name, company, phone, industry, size, role, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.email.toLowerCase().trim(),
    input.passwordHash,
    input.name.trim(),
    input.company.trim(),
    input.phone?.trim() || null,
    input.industry,
    input.size,
    role,
    now,
    now,
  )

  return findUserById(id)!
}

export interface UpdateUserProfile {
  name?: string
  company?: string
  phone?: string | null
  rut?: string | null
  industry?: string
  size?: string
}

export function updateUser(id: string, patch: UpdateUserProfile): UserRow | null {
  const db = getDb()
  const fields: string[] = []
  const values: unknown[] = []

  if (patch.name !== undefined) {
    fields.push('name = ?')
    values.push(patch.name.trim())
  }
  if (patch.company !== undefined) {
    fields.push('company = ?')
    values.push(patch.company.trim())
  }
  if (patch.phone !== undefined) {
    fields.push('phone = ?')
    values.push(patch.phone?.trim() || null)
  }
  if (patch.rut !== undefined) {
    fields.push('rut = ?')
    values.push(patch.rut?.trim() || null)
  }
  if (patch.industry !== undefined) {
    fields.push('industry = ?')
    values.push(patch.industry)
  }
  if (patch.size !== undefined) {
    fields.push('size = ?')
    values.push(patch.size)
  }

  if (fields.length === 0) return findUserById(id)

  fields.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return findUserById(id)
}

export function setUserRole(id: string, role: UserRole): void {
  const db = getDb()
  db.prepare('UPDATE users SET role = ?, updated_at = ? WHERE id = ?').run(
    role,
    new Date().toISOString(),
    id,
  )
}

export function listUsers(): UserRow[] {
  const db = getDb()
  return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as UserRow[]
}

export function countUsers(): number {
  const db = getDb()
  const r = db.prepare('SELECT COUNT(*) as n FROM users').get() as { n: number }
  return r.n
}
