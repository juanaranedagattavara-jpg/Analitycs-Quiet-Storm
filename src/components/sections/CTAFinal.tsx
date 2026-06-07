import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctas } from "@/lib/site";

export function CTAFinal() {
  return (
    <section className="py-24 lg:py-32 bg-storm-deep text-white relative overflow-hidden">
      {/* Lightning accent */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10"
        style={{
          background:
            "radial-gradient(circle, #f7c948 0%, transparent 60%)",
        }}
      />

      <Container size="md" className="relative text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-lightning mb-6">
          Empieza hoy
        </p>
        <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
          Prueba gratis por 1 mes.
          <br />
          <span className="text-lightning">Sin compromiso.</span>
        </h2>
        <p className="max-w-xl mx-auto text-lg text-storm-spray leading-relaxed mb-10">
          Regístrate, accede a la plataforma y revisa tu mercado con datos reales.
          Si te aporta valor, elige tu plan. Si no, nos despedimos sin costo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={ctas.trial.href}
            className="btn-lightning rounded-full h-14 px-8 inline-flex items-center justify-center font-semibold"
          >
            Crear cuenta gratis →
          </Link>
          <Link
            href={ctas.demo.href}
            className="rounded-full h-14 px-8 inline-flex items-center justify-center font-medium text-white border border-white/20 hover:bg-white/5 hover:border-lightning transition-colors"
          >
            Hablar con un especialista
          </Link>
        </div>
      </Container>
    </section>
  );
}
