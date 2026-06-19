import type { ReportRow } from '@/lib/db/types'
import type { ReportData } from './data-types'

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
  hasFile: boolean
  hasData: boolean
  data?: ReportData
  status: ReportRow['status']
  uploadDate: string
}

function formatSize(bytes: number | null): string | undefined {
  if (!bytes) return undefined
  if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return bytes + ' B'
}

function parseData(raw: string | null): ReportData | undefined {
  if (!raw) return undefined
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed as ReportData
  } catch {
    /* ignore */
  }
  return undefined
}

export interface SerializeOptions {
  includeData?: boolean
}

export function serializeReport(row: ReportRow, opts: SerializeOptions = {}): ReportPayload {
  let tags: string[] = []
  try {
    const parsed = JSON.parse(row.tags || '[]')
    if (Array.isArray(parsed)) tags = parsed.map(String)
  } catch {
    /* ignore */
  }
  const data = parseData(row.data)
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
    hasFile: Boolean(row.file_path),
    hasData: Boolean(data),
    data: opts.includeData ? data : undefined,
    status: row.status,
    uploadDate: row.upload_date,
  }
}
