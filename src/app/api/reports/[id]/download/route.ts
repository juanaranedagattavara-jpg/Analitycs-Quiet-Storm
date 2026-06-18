import { NextRequest } from 'next/server'
import { requireUser, HttpError } from '@/lib/auth/current-user'
import { findReportById, recordDownload } from '@/lib/db/reports'
import { canAccessReport } from '@/lib/reports/access'
import { readReportFile, contentTypeFromName } from '@/lib/storage/service'
import { handleError, jsonOk, getClientIP } from '@/lib/api/respond'
import { logAudit } from '@/lib/db/audit'

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const me = await requireUser()
    const { id } = await ctx.params
    const url = new URL(req.url)
    const disposition = url.searchParams.get('disposition') === 'inline' ? 'inline' : 'attachment'
    const report = await findReportById(id)
    if (!report) throw new HttpError(404, 'Informe no encontrado')
    if (report.status !== 'published' && me.user.role !== 'admin') {
      throw new HttpError(404, 'Informe no encontrado')
    }
    if (!canAccessReport(report.plan, me.subscription.plan) && me.user.role !== 'admin') {
      throw new HttpError(403, 'Tu plan no incluye este informe')
    }
    if (!report.file_path) {
      return jsonOk({ error: 'Este informe aún no tiene archivo subido' }, { status: 404 })
    }

    const ip = getClientIP(req)
    await recordDownload(report.id, me.user.id, ip)
    await logAudit({
      userId: me.user.id,
      action: 'report.download',
      entity: 'report',
      entityId: report.id,
      ip,
    })

    // Legacy seed files live in /public/informes/ and were uploaded by the
    // client before storage migration. They use the prefix "legacy:".
    if (report.file_path.startsWith('legacy:')) {
      const publicPath = '/' + report.file_path.replace(/^legacy:/, '')
      return Response.redirect(new URL(publicPath, new URL(req.url).origin).toString(), 302)
    }

    const file = await readReportFile(report.file_path)
    if (!file) throw new HttpError(404, 'Archivo no disponible')

    return new Response(new Uint8Array(file.buffer), {
      status: 200,
      headers: {
        'Content-Type': contentTypeFromName(report.file_path),
        'Content-Length': String(file.size),
        'Content-Disposition': `${disposition}; filename="${encodeURIComponent(report.title)}${report.file_path.match(/\.\w+$/)?.[0] || ''}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (err) {
    return handleError(err)
  }
}
