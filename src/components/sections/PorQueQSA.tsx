import { Container } from "@/components/ui/Container";

const cards = [
  {
    icon: <IconCompass />,
    title: "Insiders de tu industria",
    body:
      "Más de 51 productos del mar y 138 empresas exportadoras bajo análisis. Desde mejillones y bacalao de profundidad hasta erizos, centolla y salmón. Entendemos FOB por destino, spreads por mercado y dinámicas estacionales. +20 años en estas industrias.",
  },
  {
    icon: <IconStorm />,
    title: "Mercados VUCA necesitan datos duros",
    body:
      "Los mercados de exportación son Volátiles, Inciertos, Complejos y Ambiguos. La percepción y el instinto no bastan. Te entregamos las herramientas analíticas y los datos duros para tomar decisiones con confianza.",
  },
  {
    icon: <IconLayers />,
    title: "Dashboards hechos a tu medida",
    body:
      "No es un dashboard genérico. Cada informe se construye con la granularidad que necesitas: producto, destino, empresa, calibre. Reportes PDF, archivos Excel y dashboards HTML interactivos disponibles cuando los necesites.",
  },
  {
    icon: <IconUF />,
    title: "Pricing en UF, pensado para Chile",
    body:
      "Tres planes en UF adaptados a cada tamaño de empresa. Desde Pymes que necesitan Price Check hasta empresas grandes que requieren inteligencia competitiva completa. Sin costos ocultos.",
  },
];

export function PorQueQSA() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <Container>
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
            Por qué QSA
          </p>
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-storm-midnight leading-[1.1] tracking-tight">
            No te entregamos un dashboard genérico. Te entregamos una{" "}
            <span className="text-sunset-storm">ventaja competitiva</span>.
          </h2>
        </div>

        <div className="mt-16 lg:mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="card-lift relative rounded-2xl bg-storm-paper p-7 border border-storm-foam"
            >
              <div className="font-mono text-[10px] text-storm-mist mb-4">
                0{i + 1}
              </div>
              <div className="text-storm-midnight mb-5">{card.icon}</div>
              <h3 className="font-display text-xl font-semibold text-storm-midnight mb-3 leading-tight">
                {card.title}
              </h3>
              <p className="text-sm text-storm-steel leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function IconCompass() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M17.5 10.5L13 13l-2.5 4.5L15 15l2.5-4.5z"
        fill="currentColor"
        opacity="0.4"
      />
      <circle cx="14" cy="14" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconStorm() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M7 14c0-2.5 2-4.5 4.5-4.5.5-2.2 2.3-3.8 4.6-3.8 2.6 0 4.7 2.1 4.7 4.7v.5c1.4.4 2.4 1.6 2.4 3.1 0 1.7-1.4 3.1-3.1 3.1H10.5C8.6 17.1 7 15.5 7 14z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 17l-2 4h2.5l-1.5 4 4-5.5h-2.5L17 17h-2z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4l10 5-10 5L4 9l10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 14l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" />
      <path d="M4 19l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.3" />
    </svg>
  );
}

function IconUF() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="6" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 11h22" stroke="currentColor" strokeWidth="1.5" />
      <text x="14" y="20" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="700" fill="currentColor">
        UF
      </text>
    </svg>
  );
}
