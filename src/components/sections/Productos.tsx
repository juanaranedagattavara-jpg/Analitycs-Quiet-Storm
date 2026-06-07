import Link from "next/link";
import { Container } from "@/components/ui/Container";

const productos = [
  {
    tag: "PDF",
    title: "Reportes personalizados",
    body:
      "Informes a medida con análisis de mercado, participación, precios y tendencias. Listos para tu directorio o equipo comercial.",
    accent: "lightning",
  },
  {
    tag: "XLSX",
    title: "Archivos Excel detallados",
    body:
      "Datos cruzados por producto, destino, empresa y calibre. Granularidad total para tus propios análisis.",
    accent: "sunset",
  },
  {
    tag: "HTML",
    title: "Dashboards interactivos",
    body: "MUSSEL METRICS · SEAFARM METRICS · MOSS METRICS. Visualizaciones actualizadas en tu plataforma.",
    accent: "lightning",
    products: ["MUSSEL METRICS", "SEAFARM METRICS", "MOSS METRICS"],
  },
  {
    tag: "API",
    title: "Price Check",
    body:
      "Reportes de precios de mercado para fijar los tuyos con datos, no con intuición. Ideal al inicio de temporada.",
    accent: "sunset",
  },
];

export function Productos() {
  return (
    <section id="productos" className="py-24 lg:py-32 bg-storm-paper">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Productos
            </p>
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-storm-midnight leading-[1.1] tracking-tight">
              Tus herramientas de inteligencia de mercado.
            </h2>
          </div>
          <Link
            href="/demo"
            className="text-sm font-medium text-storm-midnight border-b-2 border-lightning hover:gap-3 inline-flex items-center gap-2 transition-all"
          >
            Ver demo de la plataforma →
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {productos.map((p) => (
            <article
              key={p.title}
              className="card-lift group relative overflow-hidden rounded-2xl bg-white border border-storm-foam p-8 lg:p-10"
            >
              <div className="flex items-start justify-between mb-6">
                <span
                  className={
                    "inline-flex items-center px-2.5 py-1 rounded-md font-mono text-[10px] uppercase tracking-wider " +
                    (p.accent === "lightning"
                      ? "bg-lightning/20 text-storm-midnight"
                      : "bg-sunset-storm/15 text-sunset-storm")
                  }
                >
                  {p.tag}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="text-storm-mist transition-all group-hover:text-storm-midnight group-hover:translate-x-1"
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
              <h3 className="font-display text-2xl lg:text-3xl font-medium text-storm-midnight leading-tight mb-3">
                {p.title}
              </h3>
              <p className="text-storm-steel leading-relaxed">{p.body}</p>
              {p.products && (
                <div className="mt-6 pt-6 border-t border-storm-foam flex flex-wrap gap-2">
                  {p.products.map((name) => (
                    <span
                      key={name}
                      className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-storm-midnight text-storm-spray"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
