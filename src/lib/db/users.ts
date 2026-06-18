import { randomUUID } from 'node:crypto'
import { getDb, ensureDb } from './client'
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

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`SELECT * FROM users WHERE lower(email) = lower(${email}) LIMIT 1`
  return (rows[0] as UserRow) ?? null
}

export async function findUserById(id: string): Promise<UserRow | null> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
  return (rows[0] as UserRow) ?? null
}

export async function createUser(input: CreateUserInput): Promise<UserRow> {
  await ensureDb()
  const sql = getDb()
  const now = new Date().toISOString()
  const id = randomUUID()
  const role: UserRole = input.role ?? 'user'

  await sql`INSERT INTO users (id, email, password_hash, name, company, phone, industry, size, role, created_at, updated_at)
     VALUES (${id}, ${input.email.toLowerCase().trim()}, ${input.passwordHash}, ${input.name.trim()}, ${input.company.trim()}, ${input.phone?.trim() || null}, ${input.industry}, ${input.size}, ${role}, ${now}, ${now})`

  return (await findUserById(id))!
}

export interface UpdateUserProfile {
  name?: string
  company?: string
  phone?: string | null
  rut?: string | null
  industry?: string
  size?: string
}

export async function updateUser(id: string, patch: UpdateUserProfile): Promise<UserRow | null> {
  await ensureDb()
  const sql = getDb()
  const fields: string[] = []
  const params: unknown[] = []
  let idx = 1

  if (patch.name !== undefined) {
    fields.push(`name = $${idx++}`)
    params.push(patch.name.trim())
  }
  if (patch.company !== undefined) {
    fields.push(`company = $${idx++}`)
    params.push(patch.company.trim())
  }
  if (patch.phone !== undefined) {
    fields.push(`phone = $${idx++}`)
    params.push(patch.phone?.trim() || null)
  }
  if (patch.rut !== undefined) {
    fields.push(`rut = $${idx++}`)
    params.push(patch.rut?.trim() || null)
  }
  if (patch.industry !== undefined) {
    fields.push(`industry = $${idx++}`)
    params.push(patch.industry)
  }
  if (patch.size !== undefined) {
    fields.push(`size = $${idx++}`)
    params.push(patch.size)
  }

  if (fields.length === 0) return findUserById(id)

  fields.push(`updated_at = $${idx++}`)
  params.push(new Date().toISOString())
  params.push(id)

  await sql.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}`, params)
  return findUserById(id)
}

export async function setUserRole(id: string, role: UserRole): Promise<void> {
  await ensureDb()
  const sql = getDb()
  await sql`UPDATE users SET role = ${role}, updated_at = ${new Date().toISOString()} WHERE id = ${id}`
}

export async function listUsers(): Promise<UserRow[]> {
  await ensureDb()
  const sql = getDb()
  return (await sql`SELECT * FROM users ORDER BY created_at DESC`) as UserRow[]
}

export async function countUsers(): Promise<number> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`SELECT COUNT(*) as n FROM users`
  return Number((rows[0] as { n: string | number }).n)
}
