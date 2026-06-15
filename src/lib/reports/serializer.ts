import type { ReportRow } from '@/lib/db/types'

export interface ReportPayload {
  id: string
  title: string
  description: string
  type: ReportRow['type']
  industry: ReportRow['industry']
  month: number
  year: number
  plan: ReportRow['plan']
  tags: string[]
  fileSize?: string
  status: ReportRow['status']
  uploadDate: string
}

function formatSize(bytes: number | null): string | undefined {
  if (!bytes) return undefined
  if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return bytes + ' B'
}

export function serializeReport(row: ReportRow): ReportPayload {
  let tags: string[] = []
  try {
    const parsed = JSON.parse(row.tags || '[]')
    if (Array.isArray(parsed)) tags = parsed.map(String)
  } catch {
    /* ignore */
  }
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    industry: row.industry,
    month: row.month,
    year: row.year,
    plan: row.plan,
    tags,
    fileSize: formatSize(row.file_size),
    status: row.status,
    uploadDate: row.upload_date,
  }
}
