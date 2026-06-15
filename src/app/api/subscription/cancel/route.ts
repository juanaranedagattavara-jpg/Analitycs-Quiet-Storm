import { requireUser } from '@/lib/auth/current-user'
import { cancelSubscription } from '@/lib/db/subscriptions'
import { logAudit } from '@/lib/db/audit'
import { jsonOk, handleError } from '@/lib/api/respond'

export async function POST() {
  try {
    const me = await requireUser()
    const sub = cancelSubscription(me.user.id)
    logAudit({
      userId: me.user.id,
      action: 'subscription.cancel',
      entity: 'subscription',
    })
    return jsonOk({ subscription: sub })
  } catch (err) {
    return handleError(err)
  }
}
