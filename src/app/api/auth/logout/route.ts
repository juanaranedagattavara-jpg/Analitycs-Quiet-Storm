import { readSessionFromCookies, clearSessionCookie } from '@/lib/auth/session'
import { deleteSession } from '@/lib/db/sessions'
import { logAudit } from '@/lib/db/audit'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function POST() {
  try {
    const session = await readSessionFromCookies()
    if (session) {
      await deleteSession(session.sid)
      await logAudit({ userId: session.uid, organizationId: session.oid, action: 'auth.logout' })
    }
    await clearSessionCookie()
    return jsonOk({ ok: true })
  } catch (err) {
    return handleError(err)
  }
}
