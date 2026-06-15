import { randomUUID } from 'node:crypto'
import { getDb } from './client'
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

export function createReport(input: CreateReportInput): ReportRow {
  const db = getDb()
  const id = randomUUID()
  const now = new Date().toISOString()
  const status: ReportStatus = input.status ?? 'draft'

  db.prepare(
    `INSERT INTO reports (id, title, description, type, industry, month, year, plan, tags, file_path, file_size, status, upload_date, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.title.trim(),
    input.description.trim(),
    input.type,
    input.industry,
    input.month,
    input.year,
    input.plan,
    JSON.stringify(input.tags),
    input.filePath ?? null,
    input.fileSize ?? null,
    status,
    now.slice(0, 10),
    input.createdBy ?? null,
    now,
    now,
  )

  return findReportById(id)!
}

export function findReportById(id: string): ReportRow | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM reports WHERE id = ? LIMIT 1').get(id) as
    | ReportRow
    | undefined
  return row ?? null
}

export function listReports(opts?: { onlyPublished?: boolean }): ReportRow[] {
  const db = getDb()
  if (opts?.onlyPublished) {
    return db
      .prepare(`SELECT * FROM reports WHERE status = 'published' ORDER BY year DESC, month DESC, upload_date DESC`)
      .all() as ReportRow[]
  }
  return db
    .prepare(`SELECT * FROM reports ORDER BY year DESC, month DESC, upload_date DESC`)
    .all() as ReportRow[]
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

export function updateReport(id: string, patch: UpdateReportInput): ReportRow | null {
  const db = getDb()
  const fields: string[] = []
  const values: unknown[] = []

  if (patch.title !== undefined) {
    fields.push('title = ?')
    values.push(patch.title.trim())
  }
  if (patch.description !== undefined) {
    fields.push('description = ?')
    values.push(patch.description.trim())
  }
  if (patch.type !== undefined) {
    fields.push('type = ?')
    values.push(patch.type)
  }
  if (patch.industry !== undefined) {
    fields.push('industry = ?')
    values.push(patch.industry)
  }
  if (patch.month !== undefined) {
    fields.push('month = ?')
    values.push(patch.month)
  }
  if (patch.year !== undefined) {
    fields.push('year = ?')
    values.push(patch.year)
  }
  if (patch.plan !== undefined) {
    fields.push('plan = ?')
    values.push(patch.plan)
  }
  if (patch.tags !== undefined) {
    fields.push('tags = ?')
    values.push(JSON.stringify(patch.tags))
  }
  if (patch.filePath !== undefined) {
    fields.push('file_path = ?')
    values.push(patch.filePath)
  }
  if (patch.fileSize !== undefined) {
    fields.push('file_size = ?')
    values.push(patch.fileSize)
  }
  if (patch.status !== undefined) {
    fields.push('status = ?')
    values.push(patch.status)
  }

  if (fields.length === 0) return findReportById(id)

  fields.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  db.prepare(`UPDATE reports SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  return findReportById(id)
}

export function deleteReport(id: string): void {
  const db = getDb()
  db.prepare('DELETE FROM reports WHERE id = ?').run(id)
}

export function recordDownload(reportId: string, userId: string, ip?: string | null): void {
  const db = getDb()
  db.prepare(
    `INSERT INTO report_downloads (id, report_id, user_id, downloaded_at, ip)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(randomUUID(), reportId, userId, new Date().toISOString(), ip ?? null)
}

export function countDownloadsByReport(reportId: string): number {
  const db = getDb()
  const r = db
    .prepare('SELECT COUNT(*) as n FROM report_downloads WHERE report_id = ?')
    .get(reportId) as { n: number }
  return r.n
}
