import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FAQ } from "@/components/sections/FAQ";
import { industrias, industriasList } from "../industrias.data";
import { ctas } from "@/lib/site";

export function generateStaticParams() {
  return industriasList.map((ind) => ({ slug: ind.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = industrias[slug];
  if (!ind) return { title: "Industria no encontrada" };
  return {
    title: `${ind.nombre} — Inteligencia de mercado`,
    description: ind.hero.subhead.slice(0, 160),
  };
}

export default async function IndustriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = industrias[slug];
  if (!ind) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-storm-gradient text-white py-20 lg:py-28 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <Container className="relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lightning/15 border border-lightning/30 mb-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lightning font-semibold">
                  {ind.badge}
                </span>
              </div>

              <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-spray mb-4">
                {ind.hero.eyebrow}
              </p>
              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.05] tracking-tight">
                {ind.hero.headline}{" "}
                <span className="text-lightning">{ind.hero.accent}</span>.
              </h1>
              <p className="mt-8 text-lg lg:text-xl text-storm-spray leading-relaxed max-w-2xl">
                {ind.hero.subhead}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  href={ctas.trial.href}
                  className="btn-lightning rounded-full h-14 px-8 inline-flex items-center justify-center font-semibold"
                >
                  Prueba gratis 1 mes →
                </Link>
                <Link
                  href={ctas.demo.href}
                  className="rounded-full h-14 px-8 inline-flex items-center justify-center font-medium text-white border border-white/20 hover:bg-white/5 hover:border-lightning transition-colors"
                >
                  Demo de {ind.badge}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-storm-deep/60 border border-white/10 p-6 backdrop-blur-sm">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-fog mb-4">
                  Mercados destino
                </div>
                <div className="flex flex-wrap gap-2">
                  {ind.mercados.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1.5 rounded-full border border-white/15 text-sm text-storm-spray"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-fog mb-4">
                    Calibres y clasificaciones
                  </div>
                  <ul className="space-y-3">
                    {ind.calibres.map((c) => (
                      <li key={c.code} className="flex items-start gap-3 text-sm">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-lightning/20 text-lightning whitespace-nowrap">
                          {c.code}
                        </span>
                        <span className="text-storm-spray">{c.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Desafíos */}
      <section className="py-24 lg:py-32 bg-white">
        <Container>
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Desafíos del sector
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight leading-tight">
              Lo que enfrentas — y los datos que necesitas para resolverlo.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {ind.desafios.map((d, i) => (
              <div
                key={d.title}
                className="rounded-2xl bg-storm-paper border border-storm-foam p-8 card-lift"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-storm-mist mb-4">
                  Desafío 0{i + 1}
                </div>
                <h3 className="font-display text-xl font-medium text-storm-midnight mb-3 leading-tight">
                  {d.title}
                </h3>
                <p className="text-storm-steel text-[15px] leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Qué incluye */}
      <section className="py-24 lg:py-32 bg-storm-paper">
        <Container size="md">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
                Qué incluye
              </p>
              <h2 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight leading-tight">
                Todo lo que necesitas, en una plataforma.
              </h2>
              <p className="mt-6 text-storm-steel leading-relaxed">
                Acceso completo a {ind.badge} y a todos los reportes específicos
                de {ind.nombre.toLowerCase()}.
              </p>
            </div>

            <div className="lg:col-span-7">
              <ul className="space-y-3">
                {ind.reportes.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-4 bg-white rounded-xl p-5 border border-storm-foam"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      className="text-lightning flex-shrink-0 mt-0.5"
                    >
                      <circle cx="11" cy="11" r="11" fill="currentColor" opacity="0.2" />
                      <path
                        d="M7 11.5l3 3 5-6"
                        stroke="#0a1f33"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-storm-steel">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing strip */}
      <section className="py-16 lg:py-20 bg-storm-midnight text-white">
        <Container size="md">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-storm-deep border border-white/10 p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-spray mb-3">
                Plan Pyme
              </div>
              <div className="font-display text-5xl font-medium mb-2">1 UF</div>
              <div className="font-mono text-xs text-storm-fog mb-6">por mes</div>
              <p className="text-sm text-storm-spray leading-relaxed mb-6">
                Price Check, Resumen Ejecutivo y Base de Datos Compilada. Ideal para iniciar temporada con respaldo de datos.
              </p>
              <Link
                href="/precios#plan-pyme"
                className="text-sm text-lightning hover:underline inline-flex items-center gap-2"
              >
                Ver detalle →
              </Link>
            </div>
            <div className="rounded-2xl bg-storm-deep border border-lightning/30 p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-lightning mb-3">
                Plan Profesional
              </div>
              <div className="font-display text-5xl font-medium mb-2">3 UF</div>
              <div className="font-mono text-xs text-storm-fog mb-6">por mes</div>
              <p className="text-sm text-storm-spray leading-relaxed mb-6">
                Análisis competitivo, outliers y landscape para {ind.badge}.
              </p>
              <Link
                href="/precios#plan-profesional"
                className="text-sm text-lightning hover:underline inline-flex items-center gap-2"
              >
                Ver detalle →
              </Link>
            </div>
            <div className="rounded-2xl bg-storm-deep border border-white/10 p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-spray mb-3">
                Plan Enterprise
              </div>
              <div className="font-display text-5xl font-medium mb-2">7 UF</div>
              <div className="font-mono text-xs text-storm-fog mb-6">por mes</div>
              <p className="text-sm text-storm-spray leading-relaxed mb-6">
                Acceso completo a {ind.badge}: rankings, market share, calibres y flujos de bienes.
              </p>
              <Link
                href="/precios#plan-enterprise"
                className="text-sm text-lightning hover:underline inline-flex items-center gap-2"
              >
                Ver detalle →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <FAQ items={ind.faqs} title={`Preguntas frecuentes — ${ind.nombre}`} />

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-storm-deep text-white">
        <Container size="md" className="text-center">
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
            Datos de {ind.nombre.toLowerCase()}.{" "}
            <span className="text-lightning">Gratis por 1 mes.</span>
          </h2>
          <p className="max-w-xl mx-auto text-lg text-storm-spray leading-relaxed mb-10">
            Activa tu cuenta y accede a {ind.badge} hoy. Sin tarjeta. Sin
            compromiso.
          </p>
          <Link
            href={ctas.trial.href}
            className="btn-lightning rounded-full h-14 px-8 inline-flex items-center justify-center font-semibold"
          >
            Crear cuenta gratis →
          </Link>
        </Container>
      </section>
    </>
  );
}
