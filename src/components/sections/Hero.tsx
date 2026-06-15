import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctas } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-storm-gradient text-white">
      {/* Ocean/storm background — layered CSS gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: [
            /* Deep ocean radial from bottom-center */
            "radial-gradient(ellipse 120% 60% at 50% 100%, rgba(0,40,70,0.95) 0%, transparent 70%)",
            /* Storm vortex upper-left */
            "radial-gradient(ellipse 80% 80% at 15% 10%, rgba(15,25,60,0.9) 0%, transparent 60%)",
            /* Lightning flash highlight */
            "radial-gradient(circle at 70% 30%, rgba(250,204,21,0.06) 0%, transparent 40%)",
            /* Mid-depth ocean glow */
            "radial-gradient(ellipse 100% 50% at 60% 80%, rgba(0,80,120,0.4) 0%, transparent 60%)",
            /* Storm clouds top layer */
            "radial-gradient(ellipse 150% 40% at 50% -10%, rgba(30,40,70,0.8) 0%, transparent 50%)",
          ].join(", "),
        }}
      />

      {/* Wave pattern overlay — SVG encoded as CSS background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' d='M0,192L48,186.7C96,181,192,171,288,186.7C384,203,480,245,576,245.3C672,245,768,203,864,181.3C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'/%3E%3C/svg%3E")`,
          backgroundSize: "100% 300px",
          backgroundPosition: "bottom",
          backgroundRepeat: "repeat-x",
        }}
      />

      {/* Second wave layer, offset for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' d='M0,128L60,149.3C120,171,240,213,360,213.3C480,213,600,171,720,154.7C840,139,960,149,1080,170.7C1200,192,1320,224,1380,240L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'/%3E%3C/svg%3E")`,
          backgroundSize: "120% 400px",
          backgroundPosition: "bottom -40px center",
          backgroundRepeat: "repeat-x",
        }}
      />

      {/* Decorative grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <Container className="relative pt-24 pb-24 lg:pt-36 lg:pb-32 min-h-[88vh] flex flex-col justify-center">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono uppercase tracking-[0.18em] text-storm-spray mb-10">
            <span className="w-2 h-2 rounded-full bg-lightning animate-pulse" />
            QSA · Plataforma de inteligencia de mercado
          </div>

          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[112px] font-medium leading-[0.98] tracking-tight">
            Vemos la tormenta{" "}
            <span className="text-lightning">antes</span>{" "}
            de que llegue a tu mercado.
          </h1>

          <p className="mt-10 text-xl lg:text-2xl text-storm-spray max-w-3xl leading-relaxed">
            Los mercados son volátiles, inciertos, complejos y ambiguos.
            La intuición no basta: necesitas datos duros, actualizados y accionables.
            Damos a los exportadores claridad inmediata sobre precios — y la
            inteligencia para anticipar el próximo movimiento.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-mono uppercase tracking-wider text-storm-fog">
            <span>+20 años de data</span>
            <span className="text-storm-steel">·</span>
            <span>+138 empresas analizadas</span>
            <span className="text-storm-steel">·</span>
            <span>+51 productos del mar</span>
            <span className="text-storm-steel">·</span>
            <span>Pricing en UF</span>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            <Link
              href={ctas.trial.href}
              className="group btn-lightning rounded-full h-14 px-10 inline-flex items-center justify-center gap-2 font-semibold text-base"
            >
              Obtén claridad ahora — 1 mes gratis
              <ArrowIcon />
            </Link>
            <Link
              href={ctas.platform.href}
              className="rounded-full h-14 px-10 inline-flex items-center justify-center gap-2 font-medium text-white border border-white/20 hover:bg-white/5 hover:border-lightning transition-colors text-base"
            >
              Ver plataforma
            </Link>
          </div>
        </div>
      </Container>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-storm-midnight pointer-events-none" />
    </section>
  );
}

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
