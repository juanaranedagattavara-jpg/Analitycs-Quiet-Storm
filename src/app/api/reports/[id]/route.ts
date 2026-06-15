import { requireUser, HttpError } from '@/lib/auth/current-user'
import { findReportById } from '@/lib/db/reports'
import { serializeReport } from '@/lib/reports/serializer'
import { canAccessReport } from '@/lib/reports/access'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const me = await requireUser()
    const { id } = await ctx.params
    const row = findReportById(id)
    if (!row) throw new HttpError(404, 'Informe no encontrado')
    if (row.status !== 'published' && me.user.role !== 'admin') {
      throw new HttpError(404, 'Informe no encontrado')
    }
    const accessible = canAccessReport(row.plan, me.subscription.plan) || me.user.role === 'admin'
    return jsonOk({ report: { ...serializeReport(row), accessible } })
  } catch (err) {
    return handleError(err)
  }
}
