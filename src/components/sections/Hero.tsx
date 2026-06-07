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

      <Container className="relative pt-20 pb-28 lg:pt-32 lg:pb-40">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.18em] text-storm-spray mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-lightning animate-pulse" />
              Plataforma de inteligencia de mercado
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-medium leading-[1.05] tracking-tight">
              Vemos la tormenta{" "}
              <span className="text-lightning">antes</span>{" "}
              de que llegue a tu mercado.
            </h1>

            <p className="mt-8 text-lg lg:text-xl text-storm-spray max-w-2xl leading-relaxed">
              Plataforma de inteligencia de mercado para exportadores chilenos de
              productos del mar. Dashboards interactivos, reportes personalizados y
              datos por calibre, destino y empresa.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono uppercase tracking-wider text-storm-fog">
              <span>+20 años</span>
              <span className="text-storm-steel">·</span>
              <span>5 clientes corporativos</span>
              <span className="text-storm-steel">·</span>
              <span>Pricing en UF</span>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href={ctas.trial.href}
                className="group btn-lightning rounded-full h-14 px-8 inline-flex items-center justify-center gap-2 font-semibold"
              >
                Prueba gratis por 1 mes
                <ArrowIcon />
              </Link>
              <Link
                href={ctas.demo.href}
                className="rounded-full h-14 px-8 inline-flex items-center justify-center gap-2 font-medium text-white border border-white/20 hover:bg-white/5 hover:border-lightning transition-colors"
              >
                Solicita demo 15 min
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <MockupDashboard />
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

function MockupDashboard() {
  return (
    <div className="relative">
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-lightning/10 blur-3xl rounded-full" aria-hidden="true" />

      <div className="relative rounded-2xl bg-storm-deep border border-white/10 shadow-2xl overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-storm-midnight/60">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
          <div className="ml-3 font-mono text-[10px] text-storm-fog uppercase tracking-wider">
            MUSSEL METRICS · CA2 · Q1 2026
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-3">
            <KPICard label="FOB España" value="4.82" unit="USD/kg" trend="+3.2%" positive />
            <KPICard label="Vol. exportado" value="1,247" unit="ton" trend="+8.1%" positive />
            <KPICard label="Spread Italia" value="0.41" unit="USD" trend="-1.4%" />
          </div>

          {/* Chart placeholder */}
          <div className="rounded-lg bg-storm-midnight/50 p-4 border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-storm-fog">
                Evolución FOB CA2 · 12M
              </span>
              <span className="font-mono text-[10px] text-storm-mist">EUR · ITA · ESP</span>
            </div>
            <svg viewBox="0 0 280 90" className="w-full h-24">
              <defs>
                <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f7c948" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f7c948" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,70 L20,65 L40,68 L60,55 L80,58 L100,45 L120,50 L140,38 L160,42 L180,30 L200,35 L220,25 L240,28 L260,18 L280,22"
                fill="none"
                stroke="#f7c948"
                strokeWidth="2"
              />
              <path
                d="M0,70 L20,65 L40,68 L60,55 L80,58 L100,45 L120,50 L140,38 L160,42 L180,30 L200,35 L220,25 L240,28 L260,18 L280,22 L280,90 L0,90 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M0,75 L20,72 L40,73 L60,68 L80,70 L100,62 L120,65 L140,58 L160,60 L180,52 L200,55 L220,48 L240,50 L260,45 L280,47"
                fill="none"
                stroke="#e8754c"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.7"
              />
              <path
                d="M0,80 L20,78 L40,78 L60,75 L80,76 L100,72 L120,73 L140,70 L160,71 L180,68 L200,69 L220,66 L240,67 L260,64 L280,65"
                fill="none"
                stroke="#b8d0db"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Legend rows */}
          <div className="space-y-2">
            <LegendRow color="#f7c948" label="España (FOB)" value="4.82 USD" change="+3.2%" />
            <LegendRow color="#e8754c" label="Italia (FOB)" value="4.41 USD" change="+1.8%" />
            <LegendRow color="#b8d0db" label="Francia (FOB)" value="3.95 USD" change="-0.4%" />
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 -left-4 rounded-xl bg-white text-storm-midnight px-4 py-3 shadow-xl border border-storm-foam">
        <div className="font-mono text-[10px] uppercase tracking-wider text-storm-mist">
          Actualizado
        </div>
        <div className="font-display text-sm font-semibold">Hace 2 horas</div>
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  unit,
  trend,
  positive,
}: {
  label: string;
  value: string;
  unit: string;
  trend: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-lg bg-storm-navy/60 p-3 border border-white/5">
      <div className="text-[10px] font-mono uppercase tracking-wider text-storm-fog">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-xl font-semibold text-white">{value}</span>
        <span className="font-mono text-[10px] text-storm-mist">{unit}</span>
      </div>
      <div
        className={
          "mt-0.5 font-mono text-[10px] " +
          (positive ? "text-lightning" : "text-sunset-storm")
        }
      >
        {trend}
      </div>
    </div>
  );
}

function LegendRow({
  color,
  label,
  value,
  change,
}: {
  color: string;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: color }}
        />
        <span className="text-storm-spray">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-storm-fog">{value}</span>
        <span className="font-mono text-storm-fog/70">{change}</span>
      </div>
    </div>
  );
}
