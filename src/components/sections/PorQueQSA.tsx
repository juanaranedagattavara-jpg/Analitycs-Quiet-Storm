import { Container } from "@/components/ui/Container";

const cards = [
  {
    icon: <IconPrice />,
    title: "Claridad inmediata: Price Check",
    body:
      "Sabe a cuánto vendió tu competidor antes de cerrar tu próxima operación. Price Check entrega datos de precio FOB por destino, empresa y producto — el informe que los exportadores chilenos compran primero.",
  },
  {
    icon: <IconStorm />,
    title: "Mercados VUCA: intuición no basta",
    body:
      "Los mercados de exportación son Volátiles, Inciertos, Complejos y Ambiguos. Cuando el precio se mueve y tú no lo viste, ya perdiste. Te entregamos los datos duros para reaccionar rápido y anticipar mejor.",
  },
  {
    icon: <IconLayers />,
    title: "Inteligencia, no solo reportes",
    body:
      "De la crisis de hoy a la estrategia de mañana: dashboards interactivos, ranking de empresas, análisis de calibres y tendencias. Construido sobre 20 años de data granular por producto, destino y empresa.",
  },
  {
    icon: <IconCompass />,
    title: "Insiders de la industria",
    body:
      "+138 empresas y +51 productos del mar bajo análisis permanente. Mejillones, bacalao, erizos, centolla, salmón. Entendemos los spreads, la estacionalidad y las dinámicas de cada mercado de destino.",
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
            Resolvemos la crisis de hoy.
            <br />
            Construimos la{" "}
            <span className="text-sunset-storm">inteligencia de mañana</span>.
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

function IconPrice() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3v4M14 21v4M3 14h4M21 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 16c0 1.1.9 2 2 2h2.5a1.5 1.5 0 000-3h-3a1.5 1.5 0 010-3H15a2 2 0 012 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
