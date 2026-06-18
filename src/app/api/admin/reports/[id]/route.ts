import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin, HttpError } from '@/lib/auth/current-user'
import {
  findReportById,
  updateReport,
  deleteReport as deleteReportRow,
} from '@/lib/db/reports'
import { deleteReportFile } from '@/lib/storage/service'
import { serializeReport } from '@/lib/reports/serializer'
import { jsonOk, handleError, getClientIP } from '@/lib/api/respond'
import { logAudit } from '@/lib/db/audit'

const patchSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(1000).optional(),
  type: z.enum(['pdf', 'excel', 'dashboard', 'price-check']).optional(),
  industry: z.enum(['mitilicultura', 'erizos-jaibas', 'algas', 'general']).optional(),
  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  plan: z.enum(['pyme', 'profesional', 'enterprise', 'ambos']).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'processing']).optional(),
})

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const me = await requireAdmin()
    const { id } = await ctx.params
    const existing = await findReportById(id)
    if (!existing) throw new HttpError(404, 'Informe no encontrado')

    const data = patchSchema.parse(await req.json().catch(() => ({})))
    const updated = await updateReport(id, data)

    await logAudit({
      userId: me.user.id,
      action: 'admin.report.update',
      entity: 'report',
      entityId: id,
      metadata: data as Record<string, unknown>,
      ip: getClientIP(req),
    })

    return jsonOk({ report: updated ? serializeReport(updated) : null })
  } catch (err) {
    return handleError(err)
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const me = await requireAdmin()
    const { id } = await ctx.params
    const existing = await findReportById(id)
    if (!existing) throw new HttpError(404, 'Informe no encontrado')

    if (existing.file_path) await deleteReportFile(existing.file_path)
    await deleteReportRow(id)

    await logAudit({
      userId: me.user.id,
      action: 'admin.report.delete',
      entity: 'report',
      entityId: id,
      metadata: { title: existing.title },
      ip: getClientIP(req),
    })

    return jsonOk({ ok: true })
  } catch (err) {
    return handleError(err)
  }
}
