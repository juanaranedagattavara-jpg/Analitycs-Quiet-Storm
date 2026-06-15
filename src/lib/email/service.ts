export interface EmailMessage {
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailService {
  send(msg: EmailMessage): Promise<{ id: string }>
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM || 'QSA <noreply@quietstormanalytics.cl>'
}

class ConsoleEmailService implements EmailService {
  async send(msg: EmailMessage): Promise<{ id: string }> {
    const id = `local-${Date.now()}`
    if (process.env.NODE_ENV !== 'test') {
      console.log('[email]', {
        id,
        from: getFromAddress(),
        to: msg.to,
        subject: msg.subject,
        preview: msg.text?.slice(0, 200) || msg.html.replace(/<[^>]+>/g, ' ').slice(0, 200),
      })
    }
    return { id }
  }
}

class ResendEmailService implements EmailService {
  constructor(private apiKey: string) {}

  async send(msg: EmailMessage): Promise<{ id: string }> {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: msg.to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      }),
    })
    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      throw new Error(`Resend error ${res.status}: ${errBody}`)
    }
    const data = (await res.json()) as { id: string }
    return { id: data.id }
  }
}

let cached: EmailService | null = null

export function getEmailService(): EmailService {
  if (cached) return cached
  const key = process.env.RESEND_API_KEY
  cached = key ? new ResendEmailService(key) : new ConsoleEmailService()
  return cached
}

export const emailTemplates = {
  welcome(name: string, planLabel: string): EmailMessage {
    const safeName = name || 'cliente'
    return {
      to: '',
      subject: 'Bienvenido a QSA — tu prueba gratuita comenzó',
      html: `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;color:#0a1f33;line-height:1.6;max-width:560px;margin:0 auto;padding:32px;">
  <h1 style="font-size:24px;margin:0 0 16px;">Bienvenido a Quiet Storm Analytics</h1>
  <p>Hola ${safeName},</p>
  <p>Tu cuenta está lista. Comenzaste tu prueba gratuita de 30 días en el plan <strong>${planLabel}</strong>.</p>
  <p>Durante este mes tendrás acceso a todos los reportes que correspondan a tu plan, sin tarjeta y sin compromiso.</p>
  <p style="margin-top:24px;">
    <a href="${process.env.APP_URL || 'https://quietstormanalytics.cl'}/plataforma" style="background:#f7c948;color:#0a1f33;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Entrar a la plataforma</a>
  </p>
  <p style="color:#5b7a8f;font-size:13px;margin-top:32px;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
</body></html>`,
      text: `Bienvenido a QSA. Tu prueba gratuita de 30 días comenzó en el plan ${planLabel}.`,
    }
  },
  invoicePaid(number: string, amountUF: number, amountCLP: number): EmailMessage {
    return {
      to: '',
      subject: `Comprobante de pago ${number}`,
      html: `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;color:#0a1f33;line-height:1.6;max-width:560px;margin:0 auto;padding:32px;">
  <h1 style="font-size:22px;margin:0 0 16px;">Pago recibido</h1>
  <p>Recibimos tu pago correspondiente a la factura <strong>${number}</strong>.</p>
  <ul>
    <li>Total: <strong>${amountUF} UF</strong> (CLP $${amountCLP.toLocaleString('es-CL')})</li>
  </ul>
  <p>Gracias por seguir con QSA.</p>
</body></html>`,
      text: `Pago recibido. Factura ${number} por ${amountUF} UF.`,
    }
  },
  trialEnding(name: string, daysLeft: number): EmailMessage {
    return {
      to: '',
      subject: `Tu prueba en QSA termina en ${daysLeft} días`,
      html: `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;color:#0a1f33;line-height:1.6;max-width:560px;margin:0 auto;padding:32px;">
  <h1 style="font-size:22px;margin:0 0 16px;">Tu prueba está por terminar</h1>
  <p>Hola ${name || 'cliente'},</p>
  <p>Tu prueba gratuita de QSA termina en <strong>${daysLeft} días</strong>. Para seguir accediendo a los informes, activa tu plan en la sección de cuenta.</p>
  <p style="margin-top:24px;">
    <a href="${process.env.APP_URL || 'https://quietstormanalytics.cl'}/plataforma/cuenta" style="background:#f7c948;color:#0a1f33;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Activar mi plan</a>
  </p>
</body></html>`,
      text: `Tu prueba gratuita termina en ${daysLeft} días.`,
    }
  },
}
