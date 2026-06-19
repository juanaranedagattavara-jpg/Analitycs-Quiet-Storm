import { requireUser } from '@/lib/auth/current-user'
import { reactivateSubscription } from '@/lib/db/subscriptions'
import { logAudit } from '@/lib/db/audit'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function POST() {
  try {
    const me = await requireUser()
    const sub = await reactivateSubscription(me.organizationId)
    await logAudit({
      userId: me.user.id,
      organizationId: me.organizationId,
      action: 'subscription.reactivate',
      entity: 'subscription',
    })
    return jsonOk({ subscription: sub })
  } catch (err) {
    return handleError(err)
  }
}
