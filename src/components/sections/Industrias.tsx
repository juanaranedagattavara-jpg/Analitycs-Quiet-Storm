import Link from "next/link";
import { Container } from "@/components/ui/Container";

const industrias = [
  {
    slug: "mitilicultura",
    title: "Mitilicultura",
    badge: "MUSSEL METRICS",
    body:
      "Mejillones carne y media concha. Calibres CA1-CA4. Mercados Europa, LATAM, Asia. Análisis competitivo y participación de mercado.",
    mercados: ["España", "Italia", "Francia", "Rusia", "USA"],
  },
  {
    slug: "erizos-jaibas",
    title: "Erizos y jaibas",
    badge: "SEAFARM METRICS",
    body:
      "Erizos premium para Japón y Corea. Jaibas para mercados internacionales. Calibres EN1-EN4 y análisis sectorial.",
    mercados: ["Japón", "Corea del Sur", "USA"],
  },
  {
    slug: "algas",
    title: "Algas y musgos",
    badge: "MOSS METRICS",
    body:
      "Análisis del mercado de algas y musgos marinos. Tendencias, precios y participación. Productos chilenos al mundo.",
    mercados: ["China", "Japón", "USA", "Europa"],
  },
];

export function Industrias() {
  return (
    <section id="industrias" className="py-24 lg:py-32 bg-storm-midnight text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <Container className="relative">
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-lightning mb-4">
            Por industria
          </p>
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium leading-[1.1] tracking-tight">
            Especializados en las industrias del mar de Chile.
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {industrias.map((ind) => (
            <Link
              key={ind.slug}
              href={`/industrias/${ind.slug}`}
              className="group card-lift relative overflow-hidden rounded-2xl bg-storm-deep border border-white/10 p-8 hover:border-lightning/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lightning">
                  {ind.badge}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-storm-fog transition-all group-hover:text-lightning group-hover:translate-x-1"
                >
                  <path
                    d="M5 10h10m0 0L10 5m5 5l-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="font-display text-3xl font-medium mb-4 leading-tight">
                {ind.title}
              </h3>
              <p className="text-storm-spray leading-relaxed text-[15px] mb-6">
                {ind.body}
              </p>

              <div className="pt-6 border-t border-white/10">
                <div className="font-mono text-[10px] uppercase tracking-wider text-storm-fog mb-2">
                  Mercados
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ind.mercados.map((m) => (
                    <span
                      key={m}
                      className="text-xs text-storm-spray border border-white/10 rounded px-2 py-0.5"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
