import { requireAdmin } from '@/lib/auth/current-user'
import { listLeads } from '@/lib/db/leads'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function GET() {
  try {
    await requireAdmin()
    return jsonOk({ leads: await listLeads() })
  } catch (err) {
    return handleError(err)
  }
}
