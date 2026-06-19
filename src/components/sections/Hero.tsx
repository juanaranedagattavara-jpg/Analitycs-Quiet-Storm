import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctas } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-storm-midnight text-white">
      <DeepOcean />

      <Container className="relative pt-28 pb-28 lg:pt-44 lg:pb-40 min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-4xl">
          <p className="font-mono text-sm text-storm-fog tracking-[0.12em] uppercase mb-8">
            ¿A qué precio vendió tu competidor el mes pasado?
          </p>

          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[96px] font-medium leading-[0.95] tracking-tight">
            Vemos la tormenta{" "}
            <span className="text-lightning">antes</span>{" "}
            de que llegue a tu mercado.
          </h1>

          <p className="mt-10 text-xl lg:text-2xl text-storm-spray max-w-2xl leading-relaxed font-light">
            Damos a los exportadores claridad sobre precios y mercados —
            para que decidas con datos y no con intuición.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-mono text-storm-fog">
            <span>Más de 20 años de datos</span>
            <span>138 empresas analizadas</span>
            <span>51 productos del mar</span>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            <Link
              href={ctas.trial.href}
              className="group btn-lightning rounded-full h-14 px-10 inline-flex items-center justify-center gap-2 font-semibold text-base"
            >
              1 mes gratis — sin tarjeta
              <ArrowIcon />
            </Link>
            <Link
              href={ctas.platform.href}
              className="rounded-full h-14 px-10 inline-flex items-center justify-center gap-2 font-medium text-white border border-white/15 hover:bg-white/5 hover:border-white/30 transition-colors text-base"
            >
              Ver plataforma
            </Link>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-storm-midnight pointer-events-none z-10" />
    </section>
  );
}

function DeepOcean() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Base: surface light → abyssal dark, vertical depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0f3654 0%, #0a2540 25%, #08192e 55%, #050e1c 100%)",
        }}
      />

      {/* Subtle blue cast from above (sun through water) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(120,200,255,0.12) 0%, transparent 60%)",
        }}
      />

      {/* God rays — light shafts coming down through water */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen"
        preserveAspectRatio="none"
        viewBox="0 0 1600 900"
      >
        <defs>
          <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8d8ff" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#a8d8ff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#a8d8ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="180,0 260,0 380,900 280,900" fill="url(#ray)" />
        <polygon points="520,0 600,0 720,900 620,900" fill="url(#ray)" opacity="0.7" />
        <polygon points="980,0 1080,0 1180,900 1060,900" fill="url(#ray)" opacity="0.5" />
        <polygon points="1340,0 1400,0 1460,900 1380,900" fill="url(#ray)" opacity="0.8" />
      </svg>

      {/* Floating particles — plankton suspended in water column */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        preserveAspectRatio="none"
        viewBox="0 0 1600 900"
      >
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="#cfe8ff"
            opacity={p.o}
          />
        ))}
      </svg>

      {/* Slow horizontal currents — sense of depth & movement */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        preserveAspectRatio="none"
        viewBox="0 0 1600 900"
      >
        <path
          d="M0,200 Q400,180 800,210 T1600,200"
          stroke="#a8d8ff"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0,420 Q400,440 800,410 T1600,430"
          stroke="#a8d8ff"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0,640 Q400,620 800,650 T1600,640"
          stroke="#a8d8ff"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {/* Single warm accent — distant signal in the deep */}
      <div
        className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] opacity-[0.10]"
        style={{
          background:
            "radial-gradient(circle, rgba(247,201,72,1) 0%, transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5,14,28,0.6) 100%)",
        }}
      />
    </div>
  );
}

const particles = [
  { x: 120, y: 80, r: 1.5, o: 0.6 },
  { x: 250, y: 220, r: 1, o: 0.4 },
  { x: 410, y: 130, r: 2, o: 0.7 },
  { x: 560, y: 340, r: 1.2, o: 0.5 },
  { x: 700, y: 90, r: 1, o: 0.4 },
  { x: 830, y: 280, r: 1.8, o: 0.65 },
  { x: 960, y: 160, r: 1.3, o: 0.5 },
  { x: 1110, y: 400, r: 1, o: 0.4 },
  { x: 1240, y: 240, r: 2, o: 0.7 },
  { x: 1380, y: 110, r: 1.4, o: 0.55 },
  { x: 1490, y: 320, r: 1.1, o: 0.45 },
  { x: 90, y: 480, r: 1.5, o: 0.55 },
  { x: 220, y: 600, r: 1, o: 0.4 },
  { x: 380, y: 540, r: 1.7, o: 0.6 },
  { x: 530, y: 720, r: 1.2, o: 0.5 },
  { x: 680, y: 620, r: 1, o: 0.4 },
  { x: 820, y: 800, r: 2, o: 0.65 },
  { x: 970, y: 660, r: 1.3, o: 0.5 },
  { x: 1130, y: 520, r: 1, o: 0.4 },
  { x: 1280, y: 740, r: 1.8, o: 0.6 },
  { x: 1430, y: 580, r: 1.2, o: 0.5 },
  { x: 1550, y: 700, r: 1, o: 0.45 },
];

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="transition-transform duration-200 group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path
        d="M2 8h12m0 0L9 3m5 5l-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
