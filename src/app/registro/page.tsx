import type { Metadata } from "next"
import { Suspense } from "react"
import { Container } from "@/components/ui/Container"
import { RegistroForm } from "./RegistroForm"

export const metadata: Metadata = {
  title: "Empieza tu prueba gratis · QSA",
  description:
    "Crea tu cuenta y prueba gratis la plataforma QSA durante 1 mes. Sin tarjeta de crédito. Acceso completo.",
}

export default function RegistroPage() {
  return (
    <section className="bg-storm-paper min-h-screen py-20 lg:py-28">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Prueba gratis · 1 mes
            </p>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-storm-midnight leading-[1.05] tracking-tight">
              Acceso completo,{" "}
              <span className="text-lightning">sin tarjeta</span>.
            </h1>
            <p className="mt-6 text-lg text-storm-steel leading-relaxed">
              Crea tu cuenta en 1 minuto. 30 días con todos los dashboards,
              informes e Excel. Si no te sirve, no pagas nada.
            </p>

            <ul className="mt-10 space-y-4">
              {[
                "Acceso a la plataforma completa por 30 días",
                "Dashboards interactivos MUSSEL · SEAFARM · MOSS METRICS",
                "Descarga de informes PDF y Excel reales",
                "Cancela cuando quieras",
                "Sin tarjeta de crédito ni datos bancarios",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-storm-steel">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="flex-shrink-0 mt-0.5 text-lightning"
                  >
                    <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.25" />
                    <path
                      d="M6 10.5l2.5 2.5L14 7.5"
                      stroke="#0a1f33"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[15px] leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl bg-white border border-storm-foam p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-mist mb-2">
                Después del trial
              </p>
              <p className="text-sm text-storm-steel leading-relaxed">
                Elige entre tres planes:{" "}
                <span className="font-semibold text-storm-midnight">Pymes</span>{" "}
                desde <span className="font-mono">1 UF/mes</span>,{" "}
                <span className="font-semibold text-storm-midnight">Profesional</span>{" "}
                desde <span className="font-mono">3 UF/mes</span> o{" "}
                <span className="font-semibold text-storm-midnight">Empresas Medianas y Grandes</span>{" "}
                desde <span className="font-mono">7 UF/mes</span>. Cambias o
                cancelas cuando quieras desde Mi Cuenta.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Suspense fallback={<FormFallback />}>
              <RegistroForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </section>
  )
}

function FormFallback() {
  return (
    <div className="rounded-2xl bg-white border border-storm-foam p-8 lg:p-10 animate-pulse">
      <div className="h-7 w-48 bg-storm-foam rounded mb-8" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-storm-paper rounded-lg" />
        ))}
        <div className="h-14 bg-storm-foam rounded-full mt-4" />
      </div>
    </div>
  )
}
