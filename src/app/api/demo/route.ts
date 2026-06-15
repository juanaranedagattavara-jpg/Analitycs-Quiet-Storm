import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createLead } from '@/lib/db/leads'
import { jsonOk, handleError, getClientIP } from '@/lib/api/respond'
import { rateLimit } from '@/lib/api/rate-limit'
import { logAudit } from '@/lib/db/audit'

const schema = z.object({
  nombre: z.string().min(2).max(120),
  empresa: z.string().min(2).max(160),
  email: z.string().email(),
  industria: z.string().min(1).max(60),
  telefono: z.string().max(40).optional(),
  mensaje: z.string().max(1000).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req) ?? 'unknown'
    const rl = rateLimit(`demo:${ip}`, { limit: 5, windowMs: 60_000 })
    if (!rl.ok) {
      return jsonOk(
        { error: `Demasiadas solicitudes. Reintenta en ${rl.retryAfter}s.` },
        { status: 429 },
      )
    }

    const body = await req.json().catch(() => ({}))
    const data = schema.parse(body)
    const lead = createLead({
      name: data.nombre,
      email: data.email,
      company: data.empresa,
      phone: data.telefono,
      industry: data.industria,
      message: data.mensaje,
      source: 'demo',
    })

    logAudit({
      action: 'lead.create',
      entity: 'lead',
      entityId: lead.id,
      metadata: { source: 'demo', email: data.email },
      ip,
    })

    return jsonOk({ ok: true, leadId: lead.id }, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
