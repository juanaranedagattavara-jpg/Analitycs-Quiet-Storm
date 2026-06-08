import type { Metadata } from "next"
import { Container } from "@/components/ui/Container"
import { FAQ } from "@/components/sections/FAQ"
import { PreciosClient } from "./PreciosClient"

export const metadata: Metadata = {
  title: "Precios — Planes en UF para exportadores de productos del mar",
  description:
    "Dos planes en UF con facturación mensual o anual. Empresa Chica desde 1 UF/mes. Empresa Grande desde 7 UF/mes. Prueba gratis 1 mes.",
}

const features = [
  { label: "Acceso plataforma web", chica: true, grande: true },
  { label: "Datos de precios de mercado", chica: true, grande: true },
  { label: "Tendencias de mercado", chica: true, grande: true },
  { label: "Reportes Price Check", chica: true, grande: true },
  { label: "Análisis competitivo", chica: false, grande: true },
  { label: "Participación de mercado", chica: false, grande: true },
  { label: "Desglose por calibre", chica: false, grande: true },
  { label: "Dashboards interactivos (HTML)", chica: false, grande: true },
  { label: "Reportes PDF personalizados", chica: false, grande: "4-5 por cliente" },
  { label: "Archivos Excel detallados", chica: false, grande: true },
  { label: "Múltiples reportes por período", chica: false, grande: true },
  { label: "Prueba gratuita 1 mes", chica: true, grande: true },
]

const faqs = [
  {
    q: "¿Por qué cobran en UF?",
    a: "Porque QSA está diseñada para relaciones de largo plazo. UF ajusta automáticamente por inflación y es el estándar B2B chileno para contratos serios.",
  },
  {
    q: "¿Cuánto es en pesos chilenos?",
    a: "1 UF ~ CLP $38.000 (referencia junio 2026). Plan Empresa Chica: ~$38.000/mes o ~$380.000/año. Plan Empresa Grande: ~$266.000/mes o ~$2.660.000/año.",
  },
  {
    q: "¿Qué diferencia hay entre mensual y anual?",
    a: "Pagando anual ahorras el equivalente a 2 meses: 2 UF/año en Plan Chica y 14 UF/año en Plan Grande. La cobertura y las funcionalidades son idénticas.",
  },
  {
    q: "¿Puedo pagar en USD?",
    a: "Sí. Hacemos la conversión al tipo de cambio del día de facturación.",
  },
  {
    q: "¿La prueba gratis incluye todo?",
    a: "Sí. Acceso completo a la plataforma por 30 días. Sin tarjeta de crédito.",
  },
  {
    q: "¿Puedo cambiar de plan o ciclo de facturación?",
    a: "Sí, en cualquier momento desde Mi Cuenta. Cambio de plan a más grande es inmediato. Downgrade y cambio de ciclo aplican al próximo período.",
  },
  {
    q: "¿Y si quiero cancelar?",
    a: "Cancelación sin penalidades desde Mi Cuenta. Sigues teniendo acceso hasta el fin del ciclo ya pagado.",
  },
  {
    q: "¿Tienen factura electrónica?",
    a: "Sí, factura electrónica chilena. Disponible en Mi Cuenta → Facturas.",
  },
]

export default function PreciosPage() {
  return (
    <>
      <PreciosClient />

      <section className="py-24 lg:py-28 bg-white">
        <Container size="md">
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Comparativa
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight">
              Feature por feature.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-storm-foam">
            <table className="w-full">
              <thead className="bg-storm-paper">
                <tr>
                  <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-4 px-6">
                    Característica
                  </th>
                  <th className="text-center font-mono text-[11px] uppercase tracking-wider text-storm-mist py-4 px-6">
                    Empresa Chica
                  </th>
                  <th className="text-center font-mono text-[11px] uppercase tracking-wider text-storm-midnight bg-lightning/10 py-4 px-6">
                    Empresa Grande
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-storm-foam">
                {features.map((f) => (
                  <tr key={f.label} className="hover:bg-storm-paper/50 transition-colors">
                    <td className="py-4 px-6 text-storm-steel text-sm">{f.label}</td>
                    <td className="py-4 px-6 text-center">
                      <Check value={f.chica} />
                    </td>
                    <td className="py-4 px-6 text-center bg-lightning/[0.04]">
                      <Check value={f.grande} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="py-24 bg-storm-paper">
        <Container>
          <div className="text-center mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Cómo funciona
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight">
              Empieza en 3 pasos.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { n: "1", title: "Regístrate gratis", body: "Crea tu cuenta en menos de 1 minuto. Sin tarjeta. Sin compromiso." },
              { n: "2", title: "Prueba por 30 días", body: "Accede a la plataforma completa. Revisa reportes, dashboards y datos." },
              { n: "3", title: "Elige tu plan", body: "Si te aporta valor, elige Chica o Grande, mensual o anual. Cambias cuando quieras." },
            ].map((s) => (
              <div key={s.n} className="bg-white rounded-2xl p-8 border border-storm-foam">
                <div className="font-display text-6xl text-lightning mb-4">{s.n}</div>
                <h3 className="font-display text-xl font-medium text-storm-midnight mb-3">
                  {s.title}
                </h3>
                <p className="text-storm-steel text-[15px] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FAQ items={faqs} title="Preguntas frecuentes sobre precios." />
    </>
  )
}

function Check({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-lightning inline-block">
        <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.2" />
        <path d="M6 10.5l2.5 2.5L14 7.5" stroke="#0a1f33" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (value === false) return <span className="text-storm-fog">—</span>
  return <span className="font-mono text-xs text-storm-midnight font-medium">{value}</span>
}
