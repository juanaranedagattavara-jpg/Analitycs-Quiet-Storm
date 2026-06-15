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
            Tres planes adaptados al tamaño de tu empresa.{" "}
            <span className="text-storm-midnight font-medium">
              Prueba gratuita de 1 mes
            </span>{" "}
            sin compromiso.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <PlanCard
            name="Pymes y MicroPymes"
            price="1"
            cadence="UF / mes"
            body="Price Check, Resumen Ejecutivo y Base de Datos Compilada. Para empresas que necesitan datos de precios para fijar los suyos."
            features={[
              "Acceso plataforma web",
              "Price Check",
              "Resumen Ejecutivo",
              "Base de Datos Compilada",
              "Country Index",
            ]}
          />
          <PlanCard
            name="Profesional"
            price="3"
            cadence="UF / mes"
            body="Análisis competitivo, Outliers y Competitive Landscape. Para empresas en crecimiento que necesitan posicionamiento estratégico."
            features={[
              "Todo lo del plan Pyme",
              "Análisis competitivo",
              "Outliers Analysis",
              "Competitive Landscape",
              "Análisis de Calibres",
              "Excel detallados",
            ]}
            featured
          />
          <PlanCard
            name="Empresas Medianas y Grandes"
            price="7"
            cadence="UF / mes"
            body="Inteligencia competitiva completa: rankings, market share, calibres, flujos de bienes y clusters jerárquicos."
            features={[
              "Todo lo del plan Profesional",
              "Ranking de Empresas y Mercados",
              "Market Share completo",
              "Análisis de Tendencias",
              "Flujos de Bienes",
              "Clusters Jerárquicos",
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
            href="/registro"
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
  featured,
}: {
  name: string;
  price: string;
  cadence: string;
  body: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={
        "card-lift rounded-2xl border p-8 lg:p-10 relative " +
        (featured
          ? "bg-storm-midnight text-white border-lightning"
          : "border-storm-foam bg-storm-paper")
      }
    >
      {featured && (
        <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-lightning text-storm-midnight font-mono text-[10px] uppercase tracking-wider font-bold">
          Mejor valor
        </div>
      )}
      <div
        className={
          "font-mono text-[10px] uppercase tracking-[0.18em] " +
          (featured ? "text-lightning" : "text-storm-mist")
        }
      >
        {name}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span
          className={
            "font-display text-6xl lg:text-7xl font-medium " +
            (featured ? "text-white" : "text-storm-midnight")
          }
        >
          {price}
        </span>
        <span
          className={
            "font-mono text-sm " +
            (featured ? "text-storm-spray" : "text-storm-steel")
          }
        >
          {cadence}
        </span>
      </div>
      <p
        className={
          "mt-5 text-[15px] leading-relaxed " +
          (featured ? "text-storm-spray" : "text-storm-steel")
        }
      >
        {body}
      </p>

      <ul className="mt-8 space-y-3">
        {features.map((f) => (
          <li
            key={f}
            className={
              "flex items-start gap-3 text-sm " +
              (featured ? "text-storm-spray" : "text-storm-steel")
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className={
                "flex-shrink-0 mt-0.5 " +
                (featured ? "text-lightning" : "text-storm-midnight")
              }
            >
              <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.2" />
              <path
                d="M5.5 9.5l2.5 2.5L13 7"
                stroke="currentColor"
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
