import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireAdmin, HttpError } from '@/lib/auth/current-user'
import { findUserById, setUserRole, updateUser } from '@/lib/db/users'
import { updateSubscription } from '@/lib/db/subscriptions'
import { toPublicUser } from '@/lib/db/types'
import { jsonOk, handleError, getClientIP } from '@/lib/api/respond'
import { logAudit } from '@/lib/db/audit'

const patchSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  plan: z.enum(['pyme', 'profesional', 'enterprise']).optional(),
  status: z.enum(['trial', 'active', 'cancelled', 'past_due']).optional(),
  name: z.string().min(2).max(120).optional(),
  company: z.string().min(2).max(160).optional(),
})

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const me = await requireAdmin()
    const { id } = await ctx.params
    const target = findUserById(id)
    if (!target) throw new HttpError(404, 'Usuario no encontrado')

    const data = patchSchema.parse(await req.json().catch(() => ({})))

    if (data.role) setUserRole(id, data.role)
    if (data.name || data.company) updateUser(id, { name: data.name, company: data.company })
    if (data.plan || data.status) {
      updateSubscription(id, { plan: data.plan, status: data.status })
    }

    logAudit({
      userId: me.user.id,
      action: 'admin.user.update',
      entity: 'user',
      entityId: id,
      metadata: data as Record<string, unknown>,
      ip: getClientIP(req),
    })

    const updated = findUserById(id)!
    return jsonOk({ user: toPublicUser(updated) })
  } catch (err) {
    return handleError(err)
  }
}
