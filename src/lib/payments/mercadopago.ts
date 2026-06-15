import type { Plan, BillingCycle } from '@/lib/types'

const MP_API = 'https://api.mercadopago.com'

function getAccessToken(): string | null {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  return token && !token.startsWith('TEST-replace') ? token : null
}

export function isMercadoPagoConfigured(): boolean {
  return getAccessToken() !== null
}

export interface CreatePreferenceInput {
  userId: string
  email: string
  plan: Plan
  cycle: BillingCycle
  amountCLP: number
  amountUF: number
  invoiceId: string
}

export interface PreferenceResponse {
  id: string
  init_point: string
  sandbox_init_point: string
}

export async function createPaymentPreference(
  input: CreatePreferenceInput,
): Promise<PreferenceResponse> {
  const token = getAccessToken()
  if (!token) {
    throw new MercadoPagoUnconfiguredError()
  }
  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  const body = {
    items: [
      {
        id: `qsa-${input.plan}-${input.cycle}`,
        title: `QSA — Plan ${input.plan} (${input.cycle})`,
        description: `Suscripción ${input.cycle} plan ${input.plan} — ${input.amountUF} UF`,
        quantity: 1,
        unit_price: input.amountCLP,
        currency_id: 'CLP',
      },
    ],
    payer: { email: input.email },
    back_urls: {
      success: `${appUrl}/plataforma/cuenta?payment=success`,
      failure: `${appUrl}/plataforma/cuenta?payment=failure`,
      pending: `${appUrl}/plataforma/cuenta?payment=pending`,
    },
    auto_return: 'approved',
    notification_url: `${appUrl}/api/payments/webhook`,
    external_reference: JSON.stringify({
      userId: input.userId,
      invoiceId: input.invoiceId,
      plan: input.plan,
      cycle: input.cycle,
    }),
  }

  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new Error(`Mercado Pago error ${res.status}: ${errBody}`)
  }

  return (await res.json()) as PreferenceResponse
}

export interface MPPayment {
  id: number
  status: 'approved' | 'rejected' | 'pending' | 'in_process' | 'refunded' | 'cancelled' | 'authorized' | 'charged_back'
  external_reference: string
  transaction_amount: number
  payment_method_id: string
}

export async function getPaymentById(paymentId: string): Promise<MPPayment | null> {
  const token = getAccessToken()
  if (!token) throw new MercadoPagoUnconfiguredError()
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return (await res.json()) as MPPayment
}

export class MercadoPagoUnconfiguredError extends Error {
  constructor() {
    super('Mercado Pago no está configurado todavía. Falta MERCADOPAGO_ACCESS_TOKEN.')
  }
}
