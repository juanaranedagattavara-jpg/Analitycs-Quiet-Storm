import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/current-user'
import { createReport, listReports } from '@/lib/db/reports'
import { saveReportFile } from '@/lib/storage/service'
import { serializeReport } from '@/lib/reports/serializer'
import { jsonOk, handleError, getClientIP } from '@/lib/api/respond'
import { logAudit } from '@/lib/db/audit'
import type { Industry, ReportType } from '@/lib/types'

export async function GET() {
  try {
    await requireAdmin()
    const rows = await listReports()
    return jsonOk({ reports: rows.map(serializeReport) })
  } catch (err) {
    return handleError(err)
  }
}

const metaSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional().default(''),
  type: z.enum(['pdf', 'excel', 'dashboard', 'price-check']),
  industry: z.enum(['mitilicultura', 'erizos-jaibas', 'algas', 'general']),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  plan: z.enum(['pyme', 'profesional', 'enterprise', 'ambos']),
  tags: z.string().optional().default(''),
  status: z.enum(['draft', 'published', 'processing']).default('draft'),
})

const ACCEPTED_EXT = ['pdf', 'xlsx', 'xls', 'csv', 'html', 'htm']
const MAX_BYTES = 50 * 1024 * 1024 // 50 MB

export async function POST(req: NextRequest) {
  try {
    const me = await requireAdmin()
    const form = await req.formData()

    const meta = metaSchema.parse({
      title: form.get('title'),
      description: form.get('description') || '',
      type: form.get('type'),
      industry: form.get('industry'),
      month: form.get('month'),
      year: form.get('year'),
      plan: form.get('plan'),
      tags: form.get('tags') || '',
      status: form.get('status') || 'draft',
    })

    const tagsArr = meta.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    let filePath: string | null = null
    let fileSize: number | null = null
    const file = form.get('file')
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_BYTES) {
        return jsonOk({ error: 'Archivo demasiado grande (máx 50 MB)' }, { status: 413 })
      }
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      if (!ACCEPTED_EXT.includes(ext)) {
        return jsonOk({ error: 'Formato no permitido' }, { status: 415 })
      }
      const saved = await saveReportFile(file)
      filePath = saved.storageKey
      fileSize = saved.size
    }

    const report = await createReport({
      title: meta.title,
      description: meta.description,
      type: meta.type as ReportType,
      industry: meta.industry as Industry,
      month: meta.month,
      year: meta.year,
      plan: meta.plan,
      tags: tagsArr,
      filePath,
      fileSize,
      status: meta.status,
      createdBy: me.user.id,
    })

    await logAudit({
      userId: me.user.id,
      organizationId: me.organizationId,
      action: 'admin.report.create',
      entity: 'report',
      entityId: report.id,
      metadata: { title: report.title, status: report.status },
      ip: getClientIP(req),
    })

    return jsonOk({ report: serializeReport(report) }, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
