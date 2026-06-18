import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctas } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-storm-midnight text-white">
      {/* Single clean gradient — deep ocean, no noise */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #0d2540 0%, #0a1f33 45%, #071628 100%)",
        }}
      />

      {/* Subtle data-grid: sharp, intentional, not decorative noise */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #f7c948 1px, transparent 1px), linear-gradient(to bottom, #f7c948 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Accent glow — ONE, subtle, bottom-right */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle, rgba(247,201,72,1) 0%, transparent 70%)",
        }}
      />

      <Container className="relative pt-28 pb-28 lg:pt-44 lg:pb-40 min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-4xl">
          {/* Anxiety hook — starts with their reality */}
          <p className="font-mono text-sm text-storm-fog tracking-[0.12em] uppercase mb-8">
            ¿A qué precio vendió tu competidor el mes pasado?
          </p>

          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[96px] font-medium leading-[0.95] tracking-tight">
            Vemos la tormenta{" "}
            <span className="text-lightning">antes</span>{" "}
            de que llegue a tu mercado.
          </h1>

          <p className="mt-10 text-xl lg:text-2xl text-storm-spray max-w-2xl leading-relaxed font-light">
            Damos a los exportadores claridad inmediata sobre precios —
            y la inteligencia para anticipar el próximo movimiento.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-mono text-storm-fog">
            <span>+20 años de datos</span>
            <span>+138 empresas analizadas</span>
            <span>+51 productos del mar</span>
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

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-storm-midnight pointer-events-none" />
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
