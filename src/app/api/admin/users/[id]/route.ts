import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin, HttpError } from '@/lib/auth/current-user'
import { findUserById, setUserRole, updateUser } from '@/lib/db/users'
import { updateSubscription } from '@/lib/db/subscriptions'
import { findUserPrimaryOrg } from '@/lib/db/organizations'
import { toPublicUser } from '@/lib/db/types'
import { jsonOk, handleError, getClientIP } from '@/lib/api/respond'
import { logAudit } from '@/lib/db/audit'

const patchSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  plan: z.enum(['pyme', 'profesional', 'enterprise']).optional(),
  status: z.enum(['trial', 'active', 'cancelled', 'past_due']).optional(),
  name: z.string().min(2).max(120).optional(),
})

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const me = await requireAdmin()
    const { id } = await ctx.params
    const target = await findUserById(id)
    if (!target) throw new HttpError(404, 'Usuario no encontrado')

    const data = patchSchema.parse(await req.json().catch(() => ({})))

    if (data.role) await setUserRole(id, data.role)
    if (data.name) await updateUser(id, { name: data.name })
    if (data.plan || data.status) {
      const primaryOrg = await findUserPrimaryOrg(id)
      if (primaryOrg) {
        await updateSubscription(primaryOrg.org.id, { plan: data.plan, status: data.status })
      }
    }

    await logAudit({
      userId: me.user.id,
      organizationId: me.organizationId,
      action: 'admin.user.update',
      entity: 'user',
      entityId: id,
      metadata: data as Record<string, unknown>,
      ip: getClientIP(req),
    })

    const updated = (await findUserById(id))!
    return jsonOk({ user: toPublicUser(updated) })
  } catch (err) {
    return handleError(err)
  }
}
