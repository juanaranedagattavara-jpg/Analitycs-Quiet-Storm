import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function PricingTeaser() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <Container>
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
            Pricing
          </p>
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-storm-midnight leading-[1.1] tracking-tight">
            Pricing transparente en UF.
          </h2>
          <p className="mt-5 text-lg text-storm-steel">
            Todos los planes incluyen acceso a la plataforma web.{" "}
            <span className="text-storm-midnight font-medium">
              Prueba gratuita de 1 mes
            </span>{" "}
            sin compromiso.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <PlanCard
            name="Plan Empresa Grande"
            price="60–80"
            cadence="UF / año"
            body="Análisis competitivo, participación de mercado, desglose por calibre, dashboards interactivos y reportes PDF personalizados (4-5 por cliente)."
            features={[
              "Acceso plataforma web",
              "Dashboards interactivos (3)",
              "Reportes PDF personalizados",
              "Archivos Excel detallados",
              "Price Check incluido",
              "Múltiples reportes por período",
            ]}
          />
          <PlanCard
            name="Plan Empresa Chica"
            price="0,5–1"
            cadence="UF / mes"
            body="Datos de precios, tendencias de mercado y reportes Price Check. Para empresas que necesitan información para tomar decisiones de temporada."
            features={[
              "Acceso plataforma web",
              "Datos de precios de mercado",
              "Tendencias de mercado",
              "Reportes Price Check",
              "Precios históricos por temporada",
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/precios"
            className="text-sm font-medium text-storm-midnight border-b-2 border-lightning hover:gap-3 inline-flex items-center gap-2 transition-all"
          >
            Ver comparativa detallada →
          </Link>
          <span className="hidden sm:inline text-storm-mist">·</span>
          <Link
            href="/demo?intent=trial"
            className="btn-lightning rounded-full h-12 px-7 inline-flex items-center font-semibold"
          >
            Empieza tu prueba gratis
          </Link>
        </div>
      </Container>
    </section>
  );
}

function PlanCard({
  name,
  price,
  cadence,
  body,
  features,
}: {
  name: string;
  price: string;
  cadence: string;
  body: string;
  features: string[];
}) {
  return (
    <div className="card-lift rounded-2xl border border-storm-foam bg-storm-paper p-8 lg:p-10">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-mist">
        {name}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-6xl lg:text-7xl font-medium text-storm-midnight">
          {price}
        </span>
        <span className="font-mono text-sm text-storm-steel">{cadence}</span>
      </div>
      <p className="mt-5 text-[15px] text-storm-steel leading-relaxed">{body}</p>

      <ul className="mt-8 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-storm-steel">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="text-lightning flex-shrink-0 mt-0.5"
            >
              <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.2" />
              <path
                d="M5.5 9.5l2.5 2.5L13 7"
                stroke="#0a1f33"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
