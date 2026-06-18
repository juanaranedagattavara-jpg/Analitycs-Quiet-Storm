import { randomUUID } from 'node:crypto'
import { getDb, ensureDb } from './client'
import type { ReportRow, ReportStatus } from './types'
import type { ReportType, Industry } from '@/lib/types'

export type ReportPlan = 'pyme' | 'profesional' | 'enterprise' | 'ambos'

export interface CreateReportInput {
  title: string
  description: string
  type: ReportType
  industry: Industry
  month: number
  year: number
  plan: ReportPlan
  tags: string[]
  filePath?: string | null
  fileSize?: number | null
  status?: ReportStatus
  createdBy?: string | null
}

export async function createReport(input: CreateReportInput): Promise<ReportRow> {
  await ensureDb()
  const sql = getDb()
  const id = randomUUID()
  const now = new Date().toISOString()
  const status: ReportStatus = input.status ?? 'draft'

  await sql`INSERT INTO reports (id, title, description, type, industry, month, year, plan, tags, file_path, file_size, status, upload_date, created_by, created_at, updated_at)
     VALUES (${id}, ${input.title.trim()}, ${input.description.trim()}, ${input.type}, ${input.industry}, ${input.month}, ${input.year}, ${input.plan}, ${JSON.stringify(input.tags)}, ${input.filePath ?? null}, ${input.fileSize ?? null}, ${status}, ${now.slice(0, 10)}, ${input.createdBy ?? null}, ${now}, ${now})`

  return (await findReportById(id))!
}

export async function findReportById(id: string): Promise<ReportRow | null> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`SELECT * FROM reports WHERE id = ${id} LIMIT 1`
  return (rows[0] as ReportRow) ?? null
}

export async function listReports(opts?: { onlyPublished?: boolean }): Promise<ReportRow[]> {
  await ensureDb()
  const sql = getDb()
  if (opts?.onlyPublished) {
    return (await sql`SELECT * FROM reports WHERE status = 'published' ORDER BY year DESC, month DESC, upload_date DESC`) as ReportRow[]
  }
  return (await sql`SELECT * FROM reports ORDER BY year DESC, month DESC, upload_date DESC`) as ReportRow[]
}

export interface UpdateReportInput {
  title?: string
  description?: string
  type?: ReportType
  industry?: Industry
  month?: number
  year?: number
  plan?: ReportPlan
  tags?: string[]
  filePath?: string | null
  fileSize?: number | null
  status?: ReportStatus
}

export async function updateReport(id: string, patch: UpdateReportInput): Promise<ReportRow | null> {
  await ensureDb()
  const sql = getDb()
  const fields: string[] = []
  const params: unknown[] = []
  let idx = 1

  if (patch.title !== undefined) {
    fields.push(`title = $${idx++}`)
    params.push(patch.title.trim())
  }
  if (patch.description !== undefined) {
    fields.push(`description = $${idx++}`)
    params.push(patch.description.trim())
  }
  if (patch.type !== undefined) {
    fields.push(`type = $${idx++}`)
    params.push(patch.type)
  }
  if (patch.industry !== undefined) {
    fields.push(`industry = $${idx++}`)
    params.push(patch.industry)
  }
  if (patch.month !== undefined) {
    fields.push(`month = $${idx++}`)
    params.push(patch.month)
  }
  if (patch.year !== undefined) {
    fields.push(`year = $${idx++}`)
    params.push(patch.year)
  }
  if (patch.plan !== undefined) {
    fields.push(`plan = $${idx++}`)
    params.push(patch.plan)
  }
  if (patch.tags !== undefined) {
    fields.push(`tags = $${idx++}`)
    params.push(JSON.stringify(patch.tags))
  }
  if (patch.filePath !== undefined) {
    fields.push(`file_path = $${idx++}`)
    params.push(patch.filePath)
  }
  if (patch.fileSize !== undefined) {
    fields.push(`file_size = $${idx++}`)
    params.push(patch.fileSize)
  }
  if (patch.status !== undefined) {
    fields.push(`status = $${idx++}`)
    params.push(patch.status)
  }

  if (fields.length === 0) return findReportById(id)

  fields.push(`updated_at = $${idx++}`)
  params.push(new Date().toISOString())
  params.push(id)

  await sql.query(`UPDATE reports SET ${fields.join(', ')} WHERE id = $${idx}`, params)
  return findReportById(id)
}

export async function deleteReport(id: string): Promise<void> {
  await ensureDb()
  const sql = getDb()
  await sql`DELETE FROM reports WHERE id = ${id}`
}

export async function recordDownload(reportId: string, userId: string, ip?: string | null): Promise<void> {
  await ensureDb()
  const sql = getDb()
  await sql`INSERT INTO report_downloads (id, report_id, user_id, downloaded_at, ip)
     VALUES (${randomUUID()}, ${reportId}, ${userId}, ${new Date().toISOString()}, ${ip ?? null})`
}

export async function countDownloadsByReport(reportId: string): Promise<number> {
  await ensureDb()
  const sql = getDb()
  const rows = await sql`SELECT COUNT(*) as n FROM report_downloads WHERE report_id = ${reportId}`
  return Number((rows[0] as { n: string | number }).n)
}
