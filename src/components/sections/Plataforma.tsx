import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctas } from "@/lib/site";

const pasos = [
  {
    n: "01",
    title: "Regístrate",
    body: "Crea tu cuenta en quietstormanalytics.com. Sin tarjeta. Sin compromiso.",
  },
  {
    n: "02",
    title: "Prueba gratis 1 mes",
    body: "Acceso completo a la plataforma. Reportes, dashboards y datos disponibles desde el primer día.",
  },
  {
    n: "03",
    title: "Elige tu plan",
    body: "Empresa Grande o Empresa Chica según tu necesidad. Pago online con pasarela integrada.",
  },
  {
    n: "04",
    title: "Accede a tu inteligencia",
    body: "Reportes, dashboards y datos disponibles 24/7 desde cualquier dispositivo.",
  },
];

export function Plataforma() {
  return (
    <section className="py-24 lg:py-32 bg-storm-paper">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Plataforma
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight leading-[1.1] tracking-tight">
              Tu inteligencia de mercado, siempre disponible.
            </h2>
            <p className="mt-6 text-lg text-storm-steel leading-relaxed">
              Accede desde tu navegador. Sin instalaciones. Sin esperar correos.
              Tus reportes, dashboards y archivos Excel disponibles cuando los
              necesites. Pasarela de pago online integrada.
            </p>
            <div className="mt-8">
              <Link
                href={ctas.trial.href}
                className="btn-lightning rounded-full h-12 px-7 inline-flex items-center font-semibold"
              >
                Crear cuenta gratis →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ol className="space-y-1">
              {pasos.map((paso, i) => (
                <li
                  key={paso.n}
                  className="group flex gap-6 p-6 rounded-xl hover:bg-white transition-colors border-b border-storm-foam last:border-b-0"
                >
                  <div className="font-display text-4xl font-medium text-storm-fog group-hover:text-lightning transition-colors">
                    {paso.n}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-display text-xl font-medium text-storm-midnight mb-2">
                      {paso.title}
                    </h3>
                    <p className="text-storm-steel text-[15px] leading-relaxed">
                      {paso.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
