import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth/current-user'
import { updateSubscription } from '@/lib/db/subscriptions'
import { logAudit } from '@/lib/db/audit'
import { jsonOk, handleError, getClientIP } from '@/lib/api/respond'

const schema = z.object({
  plan: z.enum(['pyme', 'profesional', 'enterprise']).optional(),
  cycle: z.enum(['mensual', 'anual']).optional(),
})

export async function GET() {
  try {
    const me = await requireUser()
    return jsonOk({ subscription: me.subscription })
  } catch (err) {
    return handleError(err)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const me = await requireUser()
    const data = schema.parse(await req.json().catch(() => ({})))
    if (!data.plan && !data.cycle) {
      return jsonOk({ subscription: me.subscription })
    }
    const next = await updateSubscription(me.user.id, {
      plan: data.plan,
      cycle: data.cycle,
    })
    await logAudit({
      userId: me.user.id,
      action: 'subscription.update',
      entity: 'subscription',
      metadata: data,
      ip: getClientIP(req),
    })
    return jsonOk({ subscription: next })
  } catch (err) {
    return handleError(err)
  }
}
