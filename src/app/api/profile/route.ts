import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth/current-user'
import { updateUser } from '@/lib/db/users'
import { toPublicUser } from '@/lib/db/types'
import { logAudit } from '@/lib/db/audit'
import { jsonOk, handleError, getClientIP } from '@/lib/api/respond'

const schema = z.object({
  name: z.string().min(2).max(120).optional(),
  company: z.string().min(2).max(160).optional(),
  phone: z.string().max(40).nullable().optional(),
  rut: z.string().max(20).nullable().optional(),
  industry: z.string().max(40).optional(),
  size: z.string().max(40).optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const me = await requireUser()
    const data = schema.parse(await req.json().catch(() => ({})))
    const updated = updateUser(me.user.id, data)
    if (!updated) return jsonOk({ error: 'Usuario no encontrado' }, { status: 404 })

    logAudit({
      userId: me.user.id,
      action: 'profile.update',
      entity: 'user',
      entityId: me.user.id,
      metadata: data as Record<string, unknown>,
      ip: getClientIP(req),
    })

    return jsonOk({ user: toPublicUser(updated) })
  } catch (err) {
    return handleError(err)
  }
}
