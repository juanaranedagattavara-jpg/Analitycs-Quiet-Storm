import { NextRequest } from 'next/server'
import { z } from 'zod'
import { findUserByEmail } from '@/lib/db/users'
import { createSession } from '@/lib/db/sessions'
import { verifyPassword } from '@/lib/auth/password'
import {
  createSessionToken,
  getSessionExpiresAt,
  setSessionCookie,
} from '@/lib/auth/session'
import { findSubscriptionByOrgId, createSubscription } from '@/lib/db/subscriptions'
import { findUserPrimaryOrg } from '@/lib/db/organizations'
import { handleError, jsonOk, getClientIP } from '@/lib/api/respond'
import { rateLimit } from '@/lib/api/rate-limit'
import { logAudit } from '@/lib/db/audit'
import { toPublicUser } from '@/lib/db/types'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req) ?? 'unknown'
    const rl = rateLimit(`login:${ip}`, { limit: 10, windowMs: 60_000 })
    if (!rl.ok) {
      return jsonOk(
        { error: `Demasiados intentos. Reintenta en ${rl.retryAfter}s.` },
        { status: 429 },
      )
    }

    const body = await req.json().catch(() => ({}))
    const data = schema.parse(body)

    const user = await findUserByEmail(data.email)
    if (!user) {
      return jsonOk({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const ok = await verifyPassword(data.password, user.password_hash)
    if (!ok) {
      await logAudit({ userId: user.id, action: 'auth.login_failed', ip })
      return jsonOk({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const primaryOrg = await findUserPrimaryOrg(user.id)
    if (!primaryOrg) {
      return jsonOk({ error: 'No se encontró una organización asociada' }, { status: 403 })
    }
    const orgId = primaryOrg.org.id

    if (!await findSubscriptionByOrgId(orgId)) {
      await createSubscription({ organizationId: orgId, plan: 'enterprise', trialDays: 30 })
    }

    const expiresAt = getSessionExpiresAt()
    const session = await createSession({
      userId: user.id,
      organizationId: orgId,
      expiresAt: expiresAt.toISOString(),
      userAgent: req.headers.get('user-agent') ?? null,
      ip,
    })

    const token = await createSessionToken(
      { sid: session.id, uid: user.id, oid: orgId, role: user.role },
      expiresAt,
    )
    await setSessionCookie(token, expiresAt)

    await logAudit({ userId: user.id, organizationId: orgId, action: 'auth.login', ip })

    return jsonOk({ user: toPublicUser(user) })
  } catch (err) {
    return handleError(err)
  }
}
