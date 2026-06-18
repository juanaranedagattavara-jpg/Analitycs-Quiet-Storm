import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createUser, findUserByEmail, setUserRole } from '@/lib/db/users'
import { createSubscription } from '@/lib/db/subscriptions'
import { createSession } from '@/lib/db/sessions'
import { hashPassword } from '@/lib/auth/password'
import {
  createSessionToken,
  getSessionExpiresAt,
  setSessionCookie,
} from '@/lib/auth/session'
import { handleError, jsonOk, getClientIP } from '@/lib/api/respond'
import { rateLimit } from '@/lib/api/rate-limit'
import { logAudit } from '@/lib/db/audit'
import { getEmailService, emailTemplates } from '@/lib/email/service'
import { toPublicUser } from '@/lib/db/types'
import { PLAN_LABELS, type Plan } from '@/lib/types'

const schema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio').max(120),
  email: z.string().email('Email inválido').max(180),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128),
  company: z.string().min(2, 'La empresa es obligatoria').max(160),
  phone: z.string().max(40).optional().or(z.literal('')),
  industry: z.enum(['mitilicultura', 'erizos-jaibas', 'algas', 'otra']),
  size: z.enum(['pyme', 'profesional', 'enterprise', 'no-se']),
  acceptedTerms: z.literal(true, { message: 'Debes aceptar los términos' }),
})

function planFromSize(size: 'pyme' | 'profesional' | 'enterprise' | 'no-se'): Plan {
  if (size === 'pyme') return 'pyme'
  if (size === 'profesional') return 'profesional'
  return 'enterprise'
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req) ?? 'unknown'
    const rl = rateLimit(`register:${ip}`, { limit: 5, windowMs: 60_000 })
    if (!rl.ok) {
      return jsonOk(
        { error: `Demasiados intentos. Reintenta en ${rl.retryAfter}s.` },
        { status: 429 },
      )
    }

    const body = await req.json().catch(() => ({}))
    const data = schema.parse(body)

    if (await findUserByEmail(data.email)) {
      return jsonOk({ error: 'Ya existe una cuenta con ese email' }, { status: 409 })
    }

    const passwordHash = await hashPassword(data.password)
    const plan = planFromSize(data.size)
    const user = await createUser({
      email: data.email,
      passwordHash,
      name: data.name,
      company: data.company,
      phone: data.phone || undefined,
      industry: data.industry,
      size: data.size,
    })

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
    if (adminEmail && user.email.toLowerCase() === adminEmail) {
      await setUserRole(user.id, 'admin')
      user.role = 'admin'
    }

    await createSubscription({ userId: user.id, plan, trialDays: 30 })

    const expiresAt = getSessionExpiresAt()
    const session = await createSession({
      userId: user.id,
      expiresAt: expiresAt.toISOString(),
      userAgent: req.headers.get('user-agent') ?? null,
      ip,
    })

    const token = await createSessionToken(
      { sid: session.id, uid: user.id, role: user.role },
      expiresAt,
    )
    await setSessionCookie(token, expiresAt)

    await logAudit({
      userId: user.id,
      action: 'user.register',
      entity: 'user',
      entityId: user.id,
      ip,
    })

    const email = getEmailService()
    email
      .send({ ...emailTemplates.welcome(user.name, PLAN_LABELS[plan]), to: user.email })
      .catch(() => undefined)

    return jsonOk({ user: toPublicUser(user) }, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
