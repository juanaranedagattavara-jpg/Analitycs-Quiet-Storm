import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctas } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-storm-midnight text-white">
      <DeepOcean />

      <Container className="relative pt-28 pb-28 lg:pt-44 lg:pb-40 min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-4xl">
          <p className="font-mono text-sm text-storm-fog tracking-[0.12em] uppercase mb-8 flex items-center gap-3 flex-wrap">
            <span>Inteligencia de mercado para exportadores del mar chileno</span>
            <span className="hidden sm:inline text-storm-fog/40">·</span>
            <span className="text-lightning">Visual Thinking</span>
          </p>

          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[96px] font-medium leading-[0.95] tracking-tight">
            Vemos la tormenta{" "}
            <span className="text-lightning">antes</span>{" "}
            de que llegue a tu mercado.
          </h1>

          <p className="mt-10 text-xl lg:text-2xl text-storm-spray max-w-2xl leading-relaxed font-light">
            Más de 20 años convirtiendo datos de comercio exterior en
            decisiones comerciales claras — para que negocies con fundamento,
            no con intuición.
          </p>

          <p className="mt-6 max-w-xl text-[15px] text-storm-fog italic font-light leading-relaxed border-l-2 border-lightning/60 pl-4">
            &ldquo;Lo que no se puede medir no se puede mejorar.&rdquo;
            <span className="not-italic font-mono text-[11px] uppercase tracking-[0.2em] text-storm-mist ml-2">
              — Filosofía QSP
            </span>
          </p>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-mono text-storm-fog">
            <span>Más de 20 años de trayectoria</span>
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
      {/* Base: vivid blue depth gradient — bright surface → dark abyss */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a6fa0 0%, #1560a0 8%, #0e4d8a 18%, #0a3e75 30%, #073060 48%, #052450 65%, #031a3a 82%, #020e24 100%)",
        }}
      />

      {/* Bright surface light — intense glow from above (like the qsp.cl photo) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 35% at 55% -8%, rgba(180,230,255,0.55) 0%, rgba(100,190,240,0.25) 30%, transparent 65%)",
        }}
      />

      {/* Secondary surface bloom — left side fill light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 25% at 25% -2%, rgba(140,210,250,0.30) 0%, transparent 55%)",
        }}
      />

      {/* Water surface ripple texture — caustic light patterns */}
      <div
        className="absolute inset-0 ocean-caustic"
        style={{
          background:
            "radial-gradient(ellipse 18% 10% at 40% 4%, rgba(200,235,255,0.25) 0%, transparent 70%), " +
            "radial-gradient(ellipse 22% 12% at 60% 6%, rgba(180,225,255,0.20) 0%, transparent 65%), " +
            "radial-gradient(ellipse 15% 8% at 75% 3%, rgba(190,230,255,0.18) 0%, transparent 60%), " +
            "radial-gradient(ellipse 12% 7% at 20% 7%, rgba(170,220,250,0.15) 0%, transparent 55%), " +
            "radial-gradient(ellipse 25% 14% at 50% 2%, rgba(210,240,255,0.22) 0%, transparent 70%)",
        }}
      />

      {/* God rays — wide, bright shafts of light from surface */}
      <svg
        className="absolute inset-0 w-full h-full mix-blend-screen"
        preserveAspectRatio="none"
        viewBox="0 0 1600 900"
      >
        <defs>
          <linearGradient id="ray-main" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c0e8ff" stopOpacity="0.60" />
            <stop offset="20%" stopColor="#90d0f8" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#60a8e0" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#4090c8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#3080b8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ray-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a0d8f8" stopOpacity="0.40" />
            <stop offset="30%" stopColor="#80c0e8" stopOpacity="0.20" />
            <stop offset="65%" stopColor="#5098c8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#4088b8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ray-wide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d0f0ff" stopOpacity="0.50" />
            <stop offset="15%" stopColor="#a8e0ff" stopOpacity="0.30" />
            <stop offset="45%" stopColor="#70b8e0" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#5098c0" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Central dominant ray */}
        <g className="ocean-ray" style={{ transformOrigin: "800px 0" }}>
          <polygon points="680,0 920,0 1050,900 650,900" fill="url(#ray-wide)" opacity="0.55" />
        </g>
        {/* Left rays */}
        <g className="ocean-ray-alt" style={{ transformOrigin: "250px 0" }}>
          <polygon points="160,0 340,0 500,900 320,900" fill="url(#ray-main)" opacity="0.40" />
        </g>
        <g className="ocean-ray" style={{ transformOrigin: "500px 0", animationDelay: "-4s" }}>
          <polygon points="420,0 580,0 720,900 560,900" fill="url(#ray-soft)" opacity="0.35" />
        </g>
        {/* Right rays */}
        <g className="ocean-ray-alt" style={{ transformOrigin: "1100px 0", animationDelay: "-2s" }}>
          <polygon points="1020,0 1180,0 1320,900 1140,900" fill="url(#ray-main)" opacity="0.38" />
        </g>
        <g className="ocean-ray" style={{ transformOrigin: "1350px 0", animationDelay: "-6s" }}>
          <polygon points="1280,0 1420,0 1520,900 1360,900" fill="url(#ray-soft)" opacity="0.30" />
        </g>
        {/* Diffuse fill rays */}
        <g className="ocean-ray-alt" style={{ transformOrigin: "100px 0", animationDelay: "-8s" }}>
          <polygon points="20,0 180,0 300,900 120,900" fill="url(#ray-soft)" opacity="0.20" />
        </g>
        <g className="ocean-ray" style={{ transformOrigin: "1500px 0", animationDelay: "-5s" }}>
          <polygon points="1440,0 1600,0 1600,900 1500,900" fill="url(#ray-soft)" opacity="0.18" />
        </g>
      </svg>

      {/* Water surface wave texture — undulating line at the very top */}
      <svg
        className="absolute top-0 left-0 w-full h-[120px] opacity-[0.15]"
        preserveAspectRatio="none"
        viewBox="0 0 1600 120"
      >
        <defs>
          <linearGradient id="wave-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0f4ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#80c8f0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,30 Q100,10 200,25 Q350,45 500,20 Q650,0 800,15 Q950,35 1100,10 Q1250,0 1400,20 Q1500,35 1600,15 L1600,0 L0,0 Z"
          fill="url(#wave-fade)"
          className="ocean-current"
          style={{ "--c-dur": "18s", "--c-delay": "0s" } as React.CSSProperties}
        />
        <path
          d="M0,50 Q150,35 300,50 Q450,65 600,40 Q750,20 900,35 Q1050,55 1200,30 Q1350,15 1600,40 L1600,0 L0,0 Z"
          fill="url(#wave-fade)"
          opacity="0.5"
          className="ocean-current"
          style={{ "--c-dur": "22s", "--c-delay": "3s" } as React.CSSProperties}
        />
      </svg>

      {/* Mid-depth ambient glow — saturated blue fill */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 35%, rgba(20,100,180,0.20) 0%, transparent 60%)",
        }}
      />

      {/* Floating particles — marine snow and plankton */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1600 900"
      >
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={p.bright ? "#e0f4ff" : "#a0d0f0"}
            className="ocean-particle"
            style={{
              "--p-opacity": p.o,
              "--p-dur": `${10 + i * 1.3}s`,
              "--p-delay": `${i * 0.7}s`,
              opacity: p.o,
            } as React.CSSProperties}
          />
        ))}
      </svg>

      {/* Horizontal currents — underwater flow lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1600 900"
      >
        {currents.map((c, i) => (
          <path
            key={i}
            d={c.d}
            stroke={c.color}
            strokeWidth={c.w}
            fill="none"
            className="ocean-current"
            style={{
              "--c-dur": `${c.dur}s`,
              "--c-delay": `${c.delay}s`,
              opacity: c.o,
            } as React.CSSProperties}
          />
        ))}
      </svg>

      {/* Deep teal glow — color depth at mid-left */}
      <div
        className="absolute top-[45%] left-[-80px] w-[500px] h-[350px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(15,120,160,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Bottom depth fade to near-black */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(2,14,36,0.40) 50%, rgba(2,10,24,0.70) 100%)",
        }}
      />

      {/* Subtle vignette — darker at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 40%, transparent 35%, rgba(2,10,24,0.45) 100%)",
        }}
      />
    </div>
  );
}

const particles = [
  { x: 120, y: 70, r: 1.8, o: 0.5, bright: true },
  { x: 250, y: 200, r: 1.0, o: 0.3, bright: false },
  { x: 410, y: 120, r: 2.0, o: 0.55, bright: true },
  { x: 560, y: 330, r: 1.2, o: 0.35, bright: false },
  { x: 700, y: 80, r: 1.0, o: 0.4, bright: true },
  { x: 830, y: 260, r: 1.6, o: 0.45, bright: false },
  { x: 960, y: 150, r: 1.3, o: 0.4, bright: true },
  { x: 1110, y: 380, r: 1.0, o: 0.3, bright: false },
  { x: 1240, y: 220, r: 1.8, o: 0.5, bright: false },
  { x: 1380, y: 100, r: 1.4, o: 0.45, bright: true },
  { x: 1490, y: 310, r: 1.1, o: 0.35, bright: false },
  { x: 80, y: 460, r: 1.3, o: 0.3, bright: false },
  { x: 200, y: 580, r: 0.9, o: 0.25, bright: false },
  { x: 370, y: 520, r: 1.5, o: 0.35, bright: false },
  { x: 530, y: 700, r: 1.0, o: 0.25, bright: false },
  { x: 680, y: 610, r: 0.8, o: 0.2, bright: false },
  { x: 820, y: 780, r: 1.5, o: 0.3, bright: false },
  { x: 970, y: 640, r: 1.2, o: 0.25, bright: false },
  { x: 1280, y: 720, r: 1.4, o: 0.3, bright: false },
  { x: 1430, y: 560, r: 1.0, o: 0.25, bright: false },
  { x: 340, y: 420, r: 0.7, o: 0.2, bright: false },
  { x: 1050, y: 290, r: 0.8, o: 0.3, bright: false },
  { x: 480, y: 180, r: 1.0, o: 0.35, bright: true },
];

const currents = [
  { d: "M0,250 Q300,230 600,260 Q900,285 1200,250 T1600,265", color: "#5ab0e0", w: 0.8, o: 0.07, dur: 16, delay: 0 },
  { d: "M0,440 Q400,460 800,430 Q1100,410 1400,450 T1600,440", color: "#4898c8", w: 0.6, o: 0.05, dur: 20, delay: 3 },
  { d: "M0,620 Q350,600 700,630 Q1050,650 1400,615 T1600,625", color: "#3880b0", w: 0.7, o: 0.04, dur: 18, delay: 6 },
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
