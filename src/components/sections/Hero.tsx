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
            Inteligencia de mercado para exportadores del mar chileno
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
      {/* Layer 1: Depth gradient — surface glow fading to abyssal black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0d3050 0%, #0a2844 15%, #082540 30%, #061c34 50%, #04132a 75%, #020b1a 100%)",
        }}
      />

      {/* Layer 2: Surface light — sun filtering through water column */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 40% at 45% -5%, rgba(100,190,255,0.18) 0%, transparent 65%)",
        }}
      />

      {/* Layer 3: Caustic light patterns — rippling surface refraction */}
      <div
        className="absolute inset-0 ocean-caustic"
        style={{
          background:
            "radial-gradient(ellipse 30% 20% at 30% 8%, rgba(140,210,255,0.10) 0%, transparent 70%), " +
            "radial-gradient(ellipse 25% 15% at 65% 5%, rgba(120,200,255,0.08) 0%, transparent 60%), " +
            "radial-gradient(ellipse 20% 12% at 80% 12%, rgba(160,220,255,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Layer 4: God rays — light shafts penetrating the depth */}
      <svg
        className="absolute inset-0 w-full h-full mix-blend-screen"
        preserveAspectRatio="none"
        viewBox="0 0 1600 900"
      >
        <defs>
          <linearGradient id="ray-bright" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8d8ff" stopOpacity="0.40" />
            <stop offset="35%" stopColor="#7cc0f0" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#5aa0d8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#3a80c0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ray-dim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#90c8e8" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#70a8d0" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#5090c0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="ocean-ray" style={{ transformOrigin: "200px 0" }}>
          <polygon points="140,0 240,0 360,900 240,900" fill="url(#ray-bright)" opacity="0.5" />
        </g>
        <g className="ocean-ray-alt" style={{ transformOrigin: "500px 0" }}>
          <polygon points="440,0 540,0 680,900 560,900" fill="url(#ray-dim)" opacity="0.4" />
        </g>
        <g className="ocean-ray" style={{ transformOrigin: "850px 0", animationDelay: "-3s" }}>
          <polygon points="780,0 860,0 980,900 880,900" fill="url(#ray-bright)" opacity="0.35" />
        </g>
        <g className="ocean-ray-alt" style={{ transformOrigin: "1100px 0", animationDelay: "-5s" }}>
          <polygon points="1040,0 1140,0 1260,900 1140,900" fill="url(#ray-dim)" opacity="0.45" />
        </g>
        <g className="ocean-ray" style={{ transformOrigin: "1380px 0", animationDelay: "-7s" }}>
          <polygon points="1320,0 1400,0 1480,900 1380,900" fill="url(#ray-bright)" opacity="0.30" />
        </g>
      </svg>

      {/* Layer 5: Floating particles — plankton and marine snow */}
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
            fill={p.warm ? "#ffe8a0" : "#cfe8ff"}
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

      {/* Layer 6: Bioluminescent spots — deep-sea glow */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1600 900"
      >
        {biolumSpots.map((b, i) => (
          <circle
            key={i}
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill={b.color}
            className="ocean-biolum"
            style={{
              "--bio-r": b.r,
              "--bio-dur": `${b.dur}s`,
              "--bio-delay": `${b.delay}s`,
              opacity: 0.06,
            } as React.CSSProperties}
          />
        ))}
      </svg>

      {/* Layer 7: Horizontal currents — sense of underwater flow */}
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

      {/* Layer 8: Kelp silhouettes — organic depth at the bottom edges */}
      <svg
        className="absolute bottom-0 left-0 w-[300px] h-[400px] opacity-[0.12]"
        viewBox="0 0 300 400"
        preserveAspectRatio="none"
      >
        <path d="M30,400 Q35,320 25,260 Q15,200 30,150 Q40,110 28,60" stroke="#1a4060" strokeWidth="3" fill="none" />
        <path d="M60,400 Q55,340 65,290 Q75,240 60,180 Q50,130 65,80" stroke="#1a4060" strokeWidth="2.5" fill="none" />
        <path d="M90,400 Q95,350 85,300 Q78,260 92,210" stroke="#1a4060" strokeWidth="2" fill="none" />
        <path d="M15,400 Q10,360 18,310 Q25,270 12,220 Q5,180 20,130" stroke="#1a4060" strokeWidth="2" fill="none" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-[250px] h-[350px] opacity-[0.08]"
        viewBox="0 0 250 350"
        preserveAspectRatio="none"
      >
        <path d="M220,350 Q215,280 225,230 Q235,180 218,130 Q210,90 225,50" stroke="#1a4060" strokeWidth="2.5" fill="none" />
        <path d="M190,350 Q195,300 185,250 Q175,200 190,150" stroke="#1a4060" strokeWidth="2" fill="none" />
        <path d="M240,350 Q235,310 242,270 Q248,230 238,180" stroke="#1a4060" strokeWidth="2" fill="none" />
      </svg>

      {/* Layer 9: Warm accent — distant bioluminescent signal */}
      <div
        className="absolute bottom-[-120px] right-[-80px] w-[500px] h-[500px]"
        style={{
          background:
            "radial-gradient(circle, rgba(247,201,72,0.08) 0%, rgba(247,201,72,0.03) 40%, transparent 70%)",
        }}
      />

      {/* Layer 10: Teal mid-depth glow */}
      <div
        className="absolute top-[40%] left-[-100px] w-[600px] h-[400px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(40,160,180,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Layer 11: Vignette — depth framing */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 40% 45%, transparent 30%, rgba(2,11,26,0.55) 100%)",
        }}
      />
    </div>
  );
}

const particles = [
  { x: 120, y: 70, r: 1.8, o: 0.55, warm: false },
  { x: 250, y: 200, r: 1.0, o: 0.35, warm: false },
  { x: 410, y: 120, r: 2.2, o: 0.6, warm: false },
  { x: 560, y: 330, r: 1.2, o: 0.4, warm: true },
  { x: 700, y: 80, r: 1.0, o: 0.35, warm: false },
  { x: 830, y: 260, r: 1.8, o: 0.55, warm: false },
  { x: 960, y: 150, r: 1.4, o: 0.45, warm: false },
  { x: 1110, y: 380, r: 1.0, o: 0.35, warm: true },
  { x: 1240, y: 220, r: 2.0, o: 0.6, warm: false },
  { x: 1380, y: 100, r: 1.5, o: 0.5, warm: false },
  { x: 1490, y: 310, r: 1.2, o: 0.4, warm: false },
  { x: 80, y: 460, r: 1.5, o: 0.45, warm: false },
  { x: 200, y: 580, r: 1.0, o: 0.3, warm: false },
  { x: 370, y: 520, r: 1.8, o: 0.5, warm: true },
  { x: 530, y: 700, r: 1.2, o: 0.4, warm: false },
  { x: 680, y: 610, r: 1.0, o: 0.3, warm: false },
  { x: 820, y: 780, r: 2.0, o: 0.5, warm: false },
  { x: 970, y: 640, r: 1.4, o: 0.4, warm: false },
  { x: 1130, y: 500, r: 1.0, o: 0.3, warm: true },
  { x: 1280, y: 720, r: 1.8, o: 0.5, warm: false },
  { x: 1430, y: 560, r: 1.2, o: 0.4, warm: false },
  { x: 1550, y: 680, r: 1.0, o: 0.35, warm: false },
  { x: 340, y: 420, r: 0.8, o: 0.25, warm: false },
  { x: 1050, y: 290, r: 0.9, o: 0.3, warm: false },
  { x: 480, y: 180, r: 1.1, o: 0.35, warm: false },
  { x: 750, y: 450, r: 0.7, o: 0.25, warm: true },
];

const biolumSpots = [
  { x: 200, y: 650, r: 80, color: "#1ad4c0", dur: 7, delay: 0 },
  { x: 900, y: 750, r: 60, color: "#20b8d8", dur: 9, delay: 2 },
  { x: 1400, y: 600, r: 70, color: "#18c8b0", dur: 8, delay: 4 },
  { x: 500, y: 800, r: 50, color: "#22d0e0", dur: 6, delay: 1 },
  { x: 1100, y: 500, r: 45, color: "#1ac0c0", dur: 10, delay: 3 },
];

const currents = [
  { d: "M0,180 Q300,160 600,190 Q900,220 1200,185 T1600,200", color: "#80c8e8", w: 0.8, o: 0.06, dur: 16, delay: 0 },
  { d: "M0,380 Q400,400 800,370 Q1100,350 1400,390 T1600,380", color: "#70b8d8", w: 0.6, o: 0.05, dur: 20, delay: 3 },
  { d: "M0,560 Q350,540 700,570 Q1050,590 1400,555 T1600,565", color: "#60a8c8", w: 0.7, o: 0.04, dur: 18, delay: 6 },
  { d: "M0,720 Q400,740 800,710 Q1200,690 1600,730", color: "#5098b8", w: 0.5, o: 0.03, dur: 22, delay: 2 },
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
