import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctas } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-storm-gradient text-white">
      {/* Decorative grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
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
            Inteligencia de mercado para exportadores chilenos de productos del mar.
            Dashboards interactivos, informes mensuales y datos por calibre, destino y empresa.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-mono uppercase tracking-wider text-storm-fog">
            <span>+20 años de data</span>
            <span className="text-storm-steel">·</span>
            <span>5 clientes corporativos</span>
            <span className="text-storm-steel">·</span>
            <span>Pricing en UF</span>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            <Link
              href={ctas.trial.href}
              className="group btn-lightning rounded-full h-14 px-10 inline-flex items-center justify-center gap-2 font-semibold text-base"
            >
              Prueba gratis por 1 mes
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

