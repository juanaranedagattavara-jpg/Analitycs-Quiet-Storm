import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/ui/Container"

export const metadata: Metadata = {
  title: "Cuenta creada · QSA",
  description: "Tu prueba gratis está activa. Accede a la plataforma.",
}

export default function ConfirmacionPage() {
  return (
    <section className="bg-storm-paper min-h-screen flex items-center justify-center py-20">
      <Container size="md">
        <div className="bg-white rounded-2xl border border-storm-foam p-8 lg:p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-lightning/20 mx-auto flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="13" stroke="#0a1f33" strokeWidth="1.5" fill="#f7c948" fillOpacity="0.3" />
              <path d="M10 16l4 4 8-8" stroke="#0a1f33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-storm-mist mb-2">
            Prueba gratis activada
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-storm-midnight mb-3">
            ¡Bienvenido a QSA!
          </h1>
          <p className="text-storm-steel leading-relaxed mb-8">
            Tu cuenta está lista. Tienes <span className="font-semibold text-storm-midnight">30 días de acceso completo</span> a
            la plataforma, sin tarjeta de crédito. Te enviamos un email de
            confirmación con todo lo importante.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 text-left mb-8">
            {[
              { k: 'Plan', v: 'Empresa Grande' },
              { k: 'Estado', v: 'Trial activo' },
              { k: 'Vence en', v: '30 días' },
            ].map((c) => (
              <div key={c.k} className="rounded-xl bg-storm-paper p-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-storm-mist mb-1">{c.k}</div>
                <div className="text-sm font-semibold text-storm-midnight">{c.v}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/plataforma"
              className="btn-lightning rounded-full h-12 px-8 inline-flex items-center justify-center font-semibold text-sm"
            >
              Ir a la plataforma →
            </Link>
            <Link
              href="/plataforma/cuenta"
              className="rounded-full h-12 px-8 inline-flex items-center justify-center font-medium text-sm border border-storm-foam text-storm-steel hover:border-storm-spray hover:text-storm-midnight transition-colors"
            >
              Ver Mi Cuenta
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
