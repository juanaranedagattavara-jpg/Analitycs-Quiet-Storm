import type { Plan, BillingCycle, SubscriptionStatus, Industry, ReportType } from '@/lib/types'

export type UserRole = 'user' | 'admin'
export type OrgMemberRole = 'owner' | 'admin' | 'member'

export interface OrganizationRow {
  id: string
  name: string
  industry: string | null
  size: string | null
  billing_email: string | null
  created_at: string
  updated_at: string
}

export interface MembershipRow {
  id: string
  organization_id: string
  user_id: string
  role: OrgMemberRole
  joined_at: string
}

export interface UserRow {
  id: string
  email: string
  password_hash: string
  name: string
  phone: string | null
  rut: string | null
  role: UserRole
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface PublicUser {
  id: string
  email: string
  name: string
  phone: string | null
  rut: string | null
  role: UserRole
  emailVerifiedAt: string | null
  createdAt: string
}

export interface PublicOrganization {
  id: string
  name: string
  industry: string | null
  size: string | null
  billingEmail: string | null
  createdAt: string
}

export interface SubscriptionRow {
  id: string
  organization_id: string
  plan: Plan
  cycle: BillingCycle
  status: SubscriptionStatus
  started_at: string
  renews_at: string
  cancel_at: string | null
  mp_subscription_id: string | null
  mp_customer_id: string | null
  updated_at: string
}

export interface SessionRow {
  id: string
  user_id: string
  organization_id: string
  expires_at: string
  user_agent: string | null
  ip: string | null
  created_at: string
}

export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'refunded'

export interface InvoiceRow {
  id: string
  organization_id: string
  user_id: string | null
  number: string
  amount_uf: number
  amount_clp: number
  uf_rate: number
  plan: Plan
  cycle: BillingCycle
  status: InvoiceStatus
  mp_payment_id: string | null
  issued_at: string
  paid_at: string | null
  created_at: string
}

export type ReportStatus = 'draft' | 'published' | 'processing'

export interface ReportRow {
  id: string
  title: string
  description: string
  type: ReportType
  industry: Industry
  month: number
  year: number
  plan: 'pyme' | 'profesional' | 'enterprise' | 'ambos'
  tags: string
  file_path: string | null
  file_size: number | null
  status: ReportStatus
  upload_date: string
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface LeadRow {
  id: string
  name: string
  email: string
  company: string
  phone: string | null
  industry: string | null
  message: string | null
  source: string
  status: string
  created_at: string
}

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    rut: row.rut,
    role: row.role,
    emailVerifiedAt: row.email_verified_at,
    createdAt: row.created_at,
  }
}

export function toPublicOrganization(row: OrganizationRow): PublicOrganization {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    size: row.size,
    billingEmail: row.billing_email,
    createdAt: row.created_at,
  }
}
