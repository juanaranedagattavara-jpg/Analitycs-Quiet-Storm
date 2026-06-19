import { requireUser } from '@/lib/auth/current-user'
import { listInvoicesByOrg } from '@/lib/db/invoices'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function GET() {
  try {
    const me = await requireUser()
    const invoices = await listInvoicesByOrg(me.organizationId)
    return jsonOk({ invoices })
  } catch (err) {
    return handleError(err)
  }
}
