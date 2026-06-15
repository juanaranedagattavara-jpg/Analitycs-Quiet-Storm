import { getDb } from './client'
import { createReport } from './reports'
import { realReports } from '@/lib/real-reports'

function fileSizeBytes(label: string | undefined): number | null {
  if (!label) return null
  const m = label.trim().match(/^([\d.]+)\s*(KB|MB)$/i)
  if (!m) return null
  const n = parseFloat(m[1])
  const unit = m[2].toUpperCase()
  return Math.round(n * (unit === 'MB' ? 1_048_576 : 1024))
}

function fileNameFromUrl(url: string): string {
  return url.startsWith('/') ? `legacy:${url.slice(1)}` : url
}

let didSeed = false

export function seedRealReportsIfEmpty(): void {
  if (didSeed) return
  didSeed = true

  const db = getDb()
  const { n } = db.prepare('SELECT COUNT(*) as n FROM reports').get() as { n: number }
  if (n > 0) return

  for (const r of realReports) {
    createReport({
      title: r.title,
      description: r.description,
      type: r.type,
      industry: r.industry,
      month: r.month,
      year: r.year,
      plan: r.plan,
      tags: r.tags,
      filePath: fileNameFromUrl(r.file),
      fileSize: fileSizeBytes(r.fileSize),
      status: 'published',
    })
  }
}
