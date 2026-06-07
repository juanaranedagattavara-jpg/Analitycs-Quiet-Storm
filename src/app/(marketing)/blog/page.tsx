import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Blog",
  description: "Análisis de mercado, calibres, mercados destino y tendencias del sector pesquero chileno.",
};

export default function BlogPage() {
  return (
    <section className="bg-storm-paper min-h-[70vh] py-24 lg:py-32">
      <Container size="md" className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-storm-foam font-mono text-xs uppercase tracking-[0.18em] text-storm-mist mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-sunset-storm animate-pulse" />
          Próximamente
        </div>
        <h1 className="font-display text-5xl lg:text-6xl font-medium text-storm-midnight leading-tight mb-6">
          Blog en preparación.
        </h1>
        <p className="text-lg text-storm-steel max-w-xl mx-auto mb-10 leading-relaxed">
          Estamos preparando artículos sobre calibres, mercados destino,
          regulación pesquera y análisis de competidores. Primeras publicaciones
          el día 26 del sprint.
        </p>
        <Link
          href="/demo"
          className="btn-lightning rounded-full h-12 px-7 inline-flex items-center font-semibold"
        >
          Mientras tanto, prueba la plataforma →
        </Link>
      </Container>
    </section>
  );
}
