import { NextRequest } from 'next/server'
import { getPaymentById } from '@/lib/payments/mercadopago'
import { findInvoiceById, markInvoicePaid } from '@/lib/db/invoices'
import { updateSubscription, findSubscriptionByOrgId } from '@/lib/db/subscriptions'
import { findUserById } from '@/lib/db/users'
import { logAudit } from '@/lib/db/audit'
import { jsonOk, handleError } from '@/lib/api/respond'
import { getEmailService, emailTemplates } from '@/lib/email/service'

function addDaysISO(days: number, from = new Date()): string {
  const d = new Date(from)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const queryType = url.searchParams.get('type') || url.searchParams.get('topic')
    const body = (await req.json().catch(() => ({}))) as {
      type?: string
      data?: { id?: string }
      action?: string
    }
    const type = body.type || queryType
    const paymentId = body.data?.id || url.searchParams.get('id') || url.searchParams.get('data.id')

    if (type !== 'payment' || !paymentId) {
      return jsonOk({ ok: true, ignored: true })
    }

    const payment = await getPaymentById(String(paymentId))
    if (!payment) {
      return jsonOk({ ok: true, notFound: true })
    }

    let refData: { userId?: string; invoiceId?: string; plan?: string; cycle?: string } = {}
    try {
      refData = JSON.parse(payment.external_reference || '{}')
    } catch {
      /* ignore */
    }

    if (!refData.invoiceId) return jsonOk({ ok: true, missingRef: true })

    const invoice = await findInvoiceById(refData.invoiceId)
    if (!invoice) return jsonOk({ ok: true, missingInvoice: true })

    if (payment.status === 'approved' && invoice.status !== 'paid') {
      await markInvoicePaid(invoice.id, String(payment.id))
      const subscription = await findSubscriptionByOrgId(invoice.organization_id)
      if (subscription) {
        const renewsAt = addDaysISO(invoice.cycle === 'anual' ? 365 : 30)
        await updateSubscription(invoice.organization_id, {
          plan: invoice.plan,
          cycle: invoice.cycle,
          status: 'active',
          renewsAt,
        })
      }
      await logAudit({
        userId: invoice.user_id,
        organizationId: invoice.organization_id,
        action: 'payment.approved',
        entity: 'invoice',
        entityId: invoice.id,
        metadata: { paymentId: payment.id, amount: payment.transaction_amount },
      })
      const user = invoice.user_id ? await findUserById(invoice.user_id) : null
      if (user) {
        getEmailService()
          .send({
            ...emailTemplates.invoicePaid(invoice.number, invoice.amount_uf, invoice.amount_clp),
            to: user.email,
          })
          .catch(() => undefined)
      }
    }

    return jsonOk({ ok: true })
  } catch (err) {
    return handleError(err)
  }
}
