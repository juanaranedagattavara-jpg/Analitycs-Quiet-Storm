import { randomUUID } from 'node:crypto'
import { getDb, ensureDb } from './client'
import type { OrganizationRow, MembershipRow, OrgMemberRole } from './types'

export interface CreateOrganizationInput {
  name: string
  industry?: string | null
  size?: string | null
  billingEmail?: string | null
}

export async function createOrganization(input: CreateOrganizationInput): Promise<OrganizationRow> {
  await ensureDb()
  const sql = getDb()
  const id = randomUUID()
  const now = new Date().toISOString()

  await sql`INSERT INTO organizations (id, name, industry, size, billing_email, created_at, updated_at)
     VALUES (${id}, ${input.name.trim()}, ${input.industry ?? null}, ${input.size ?? null}, ${input.billingEmail ?? null}, ${now}, ${now})`

  return (await findOrganizationById(id))!
}

export async function findOrganizationById(id: string): Promise<OrganizationRow | null> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`SELECT * FROM organizations WHERE id = ${id} LIMIT 1`
  return (rows[0] as OrganizationRow) ?? null
}

export async function updateOrganization(
  id: string,
  patch: Partial<Pick<OrganizationRow, 'name' | 'industry' | 'size' | 'billing_email'>>,
): Promise<OrganizationRow | null> {
  await ensureDb()
  const sql = getDb()
  const fields: string[] = []
  const params: unknown[] = []
  let idx = 1

  if (patch.name !== undefined) { fields.push(`name = $${idx++}`); params.push(patch.name.trim()) }
  if (patch.industry !== undefined) { fields.push(`industry = $${idx++}`); params.push(patch.industry) }
  if (patch.size !== undefined) { fields.push(`size = $${idx++}`); params.push(patch.size) }
  if (patch.billing_email !== undefined) { fields.push(`billing_email = $${idx++}`); params.push(patch.billing_email) }

  if (fields.length === 0) return findOrganizationById(id)

  fields.push(`updated_at = $${idx++}`)
  params.push(new Date().toISOString())
  params.push(id)

  await sql.query(`UPDATE organizations SET ${fields.join(', ')} WHERE id = $${idx}`, params)
  return findOrganizationById(id)
}

export async function addMember(orgId: string, userId: string, role: OrgMemberRole = 'member'): Promise<MembershipRow> {
  await ensureDb()
  const sql = getDb()
  const id = randomUUID()
  const now = new Date().toISOString()

  await sql`INSERT INTO memberships (id, organization_id, user_id, role, joined_at)
     VALUES (${id}, ${orgId}, ${userId}, ${role}, ${now})`

  return { id, organization_id: orgId, user_id: userId, role, joined_at: now }
}

export async function findMembership(orgId: string, userId: string): Promise<MembershipRow | null> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`SELECT * FROM memberships WHERE organization_id = ${orgId} AND user_id = ${userId} LIMIT 1`
  return (rows[0] as MembershipRow) ?? null
}

export async function findUserPrimaryOrg(userId: string): Promise<{ org: OrganizationRow; membership: MembershipRow } | null> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`
    SELECT o.*, m.id as m_id, m.role as m_role, m.joined_at as m_joined_at
    FROM memberships m
    JOIN organizations o ON o.id = m.organization_id
    WHERE m.user_id = ${userId}
    ORDER BY m.joined_at ASC
    LIMIT 1`
  const row = rows[0] as (OrganizationRow & { m_id: string; m_role: OrgMemberRole; m_joined_at: string }) | undefined
  if (!row) return null
  return {
    org: { id: row.id, name: row.name, industry: row.industry, size: row.size, billing_email: row.billing_email, created_at: row.created_at, updated_at: row.updated_at },
    membership: { id: row.m_id, organization_id: row.id, user_id: userId, role: row.m_role, joined_at: row.m_joined_at },
  }
}

export async function listOrgMembers(orgId: string): Promise<(MembershipRow & { user_email: string; user_name: string })[]> {
  await ensureDb()
  const sql = getDb()
  return (await sql`
    SELECT m.*, u.email as user_email, u.name as user_name
    FROM memberships m
    JOIN users u ON u.id = m.user_id
    WHERE m.organization_id = ${orgId}
    ORDER BY m.joined_at ASC`) as (MembershipRow & { user_email: string; user_name: string })[]
}

export async function removeMember(orgId: string, userId: string): Promise<void> {
  await ensureDb()
  const sql = getDb()
  await sql`DELETE FROM memberships WHERE organization_id = ${orgId} AND user_id = ${userId}`
}

export async function updateMemberRole(orgId: string, userId: string, role: OrgMemberRole): Promise<void> {
  await ensureDb()
  const sql = getDb()
  await sql`UPDATE memberships SET role = ${role} WHERE organization_id = ${orgId} AND user_id = ${userId}`
}
