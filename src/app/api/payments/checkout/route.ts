import { NextRequest } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth/current-user'
import { createInvoice } from '@/lib/db/invoices'
import { getUFRate, ufToCLP } from '@/lib/payments/uf-rate'
import {
  createPaymentPreference,
  isMercadoPagoConfigured,
  MercadoPagoUnconfiguredError,
} from '@/lib/payments/mercadopago'
import { getEffectivePrice, type Plan, type BillingCycle } from '@/lib/types'
import { jsonOk, handleError, getClientIP } from '@/lib/api/respond'
import { logAudit } from '@/lib/db/audit'

const schema = z.object({
  plan: z.enum(['pyme', 'profesional', 'enterprise']),
  cycle: z.enum(['mensual', 'anual']),
})

export async function POST(req: NextRequest) {
  try {
    const me = await requireUser()
    const data = schema.parse(await req.json().catch(() => ({})))

    const plan = data.plan as Plan
    const cycle = data.cycle as BillingCycle
    const amountUF = getEffectivePrice(plan, cycle)
    const rate = await getUFRate()
    const amountCLP = ufToCLP(amountUF, rate)

    const invoice = createInvoice({
      userId: me.user.id,
      amountUF,
      amountCLP,
      ufRate: rate,
      plan,
      cycle,
      status: 'pending',
    })

    if (!isMercadoPagoConfigured()) {
      logAudit({
        userId: me.user.id,
        action: 'payment.checkout.unconfigured',
        entity: 'invoice',
        entityId: invoice.id,
        ip: getClientIP(req),
      })
      return jsonOk({
        invoice,
        checkoutUrl: null,
        pendingConfiguration: true,
        message:
          'Pasarela de pago en configuración. La factura quedó pendiente — se completará cuando Mercado Pago esté conectado.',
      })
    }

    try {
      const preference = await createPaymentPreference({
        userId: me.user.id,
        email: me.user.email,
        plan,
        cycle,
        amountCLP,
        amountUF,
        invoiceId: invoice.id,
      })
      logAudit({
        userId: me.user.id,
        action: 'payment.checkout.created',
        entity: 'invoice',
        entityId: invoice.id,
        metadata: { preferenceId: preference.id },
        ip: getClientIP(req),
      })
      const checkoutUrl =
        process.env.NODE_ENV === 'production' ? preference.init_point : preference.sandbox_init_point
      return jsonOk({ invoice, checkoutUrl, preferenceId: preference.id })
    } catch (err) {
      if (err instanceof MercadoPagoUnconfiguredError) {
        return jsonOk({
          invoice,
          checkoutUrl: null,
          pendingConfiguration: true,
          message: err.message,
        })
      }
      throw err
    }
  } catch (err) {
    return handleError(err)
  }
}
