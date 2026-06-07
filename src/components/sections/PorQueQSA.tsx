import { Container } from "@/components/ui/Container";

const cards = [
  {
    icon: <IconCompass />,
    title: "Insiders de tu industria",
    body:
      "Mejillones, erizos, jaibas, algas. Hablamos calibres CA1-CA4, EN1-EN4, MV1-MV4. Entendemos FOB por destino, spreads por mercado y dinámicas estacionales. +20 años en estas industrias.",
  },
  {
    icon: <IconLayers />,
    title: "Plataforma web con acceso directo",
    body:
      "Ingresa a tu cuenta desde cualquier dispositivo. Reportes PDF, archivos Excel (producto × destino × empresa × calibre) y dashboards HTML interactivos. Todo disponible cuando lo necesites.",
  },
  {
    icon: <IconUF />,
    title: "Pricing en UF, pensado para Chile",
    body:
      "Dos planes simples en UF. Sin costos ocultos. Ajustado a la realidad económica chilena y a relaciones de largo plazo. Estándar B2B chileno.",
  },
  {
    icon: <IconMicroscope />,
    title: "Metodología rigurosa",
    body:
      "Fundada por un biólogo (U. de Chile) con MBA (Adolfo Ibáñez) que trabaja con Python y R. Los análisis tienen respaldo metodológico, no son intuiciones.",
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

function IconMicroscope() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M11 4l5 2-1 3-5-2 1-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M13 10c2 1 3 3 2 5s-3 3-5 2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M8 19l4-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="5" y="19" width="14" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 22v2M15 22v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
