import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { industriasList } from "./industrias.data";

export const metadata: Metadata = {
  title: "Industrias",
  description:
    "Inteligencia de mercado especializada por industria pesquera chilena: mitilicultura, erizos y jaibas, algas y musgos.",
};

export default function IndustriasIndexPage() {
  return (
    <section className="bg-storm-paper py-20 lg:py-28">
      <Container>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
          Industrias
        </p>
        <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-medium text-storm-midnight leading-[1.05] tracking-tight max-w-4xl">
          Inteligencia de mercado{" "}
          <span className="text-sunset-storm">especializada</span> por industria.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-storm-steel leading-relaxed">
          Tres dashboards. Tres industrias del mar chileno. Cada uno construido
          con datos propietarios de +20 años y análisis sectorial profundo.
        </p>

        <div className="mt-16 grid lg:grid-cols-3 gap-6">
          {industriasList.map((ind) => (
            <Link
              key={ind.slug}
              href={`/industrias/${ind.slug}`}
              className="group card-lift bg-white rounded-2xl border border-storm-foam p-8 lg:p-10 flex flex-col"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-lightning bg-storm-midnight rounded-full px-3 py-1.5 inline-block self-start mb-6">
                {ind.badge}
              </div>
              <h2 className="font-display text-3xl font-medium text-storm-midnight mb-3">
                {ind.nombre}
              </h2>
              <p className="text-storm-steel text-[15px] leading-relaxed mb-6 flex-1">
                {ind.hero.subhead}
              </p>
              <div className="pt-6 border-t border-storm-foam">
                <div className="font-mono text-[10px] uppercase tracking-wider text-storm-mist mb-2">
                  Mercados
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ind.mercados.slice(0, 4).map((m) => (
                    <span
                      key={m}
                      className="text-xs text-storm-steel border border-storm-foam rounded px-2 py-0.5"
                    >
                      {m}
                    </span>
                  ))}
                  {ind.mercados.length > 4 && (
                    <span className="text-xs text-storm-mist">
                      +{ind.mercados.length - 4}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-6 text-sm text-storm-midnight font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Ver {ind.badge} →
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
