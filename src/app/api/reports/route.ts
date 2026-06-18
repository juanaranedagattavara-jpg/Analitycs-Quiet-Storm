import { requireUser } from '@/lib/auth/current-user'
import { listReports } from '@/lib/db/reports'
import { serializeReport } from '@/lib/reports/serializer'
import { canAccessReport } from '@/lib/reports/access'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function GET() {
  try {
    const me = await requireUser()
    const rows = await listReports({ onlyPublished: me.user.role !== 'admin' })
    const reports = rows.map((row) => {
      const serialized = serializeReport(row)
      return {
        ...serialized,
        accessible: canAccessReport(row.plan, me.subscription.plan),
      }
    })
    return jsonOk({ reports })
  } catch (err) {
    return handleError(err)
  }
}
