import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctas } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre nosotros — Quiet Storm Analytics",
  description:
    "Consultora chilena de inteligencia de mercado fundada hace más de 20 años. Especializados en exportadores de productos del mar.",
};

export default function SobreNosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-storm-gradient text-white py-20 lg:py-28">
        <Container>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-lightning mb-4">
            Sobre nosotros
          </p>
          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.05] tracking-tight max-w-4xl">
            +20 años analizando los mercados que mueven la pesca chilena.
          </h1>
          <p className="mt-8 max-w-2xl text-lg lg:text-xl text-storm-spray leading-relaxed">
            Quiet Storm Analytics nace de una premisa simple: las decisiones
            comerciales en el sector pesquero merecen análisis riguroso, no
            intuición. Más de dos décadas trabajando con exportadores chilenos lo
            respaldan.
          </p>
        </Container>
      </section>

      {/* Historia */}
      <section className="py-24 lg:py-32 bg-white">
        <Container size="md">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
                Origen
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-medium text-storm-midnight leading-tight">
                De los datos en hojas impresas a la plataforma.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-6 text-storm-steel text-[17px] leading-relaxed">
              <p>
                Todo empezó en los años 90. Como gerente comercial en RIM, el
                fundador compraba datos de comercio exterior a una empresa
                proveedora. La información llegaba en hojas enormes impresas — y
                había que revisarlas para tomar decisiones comerciales.
              </p>
              <p>
                Le gustó el tema de los números. Tras una etapa con fábrica
                propia, decidió que quería un negocio que dependiera de cálculos
                rigurosos, no de la coordinación de muchas personas.
              </p>
              <p>
                El primer cliente fue un exportador de salmón ahumado. El segundo
                y tercero llegaron por referencia. Veinte años después, varios de
                esos clientes originales siguen vigentes.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Filosofía */}
      <section className="py-24 lg:py-32 bg-storm-paper">
        <Container>
          <div className="max-w-3xl mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Filosofía
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight leading-tight">
              Tres principios que guían cada análisis.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Rigor metodológico",
                body: "Formación en biología (U. de Chile) y MBA (Adolfo Ibáñez). Cada conclusión tiene respaldo cuantitativo.",
              },
              {
                num: "02",
                title: "Especialización sectorial",
                body: "Mejillones, erizos, jaibas, algas. Hablamos calibres, FOB por destino, spreads por mercado. No somos generalistas.",
              },
              {
                num: "03",
                title: "Relaciones de largo plazo",
                body: "Tarifas en UF, confidencialidad estricta y clientes corporativos que llevan más de 20 años con nosotros. La permanencia es nuestra medida del éxito.",
              },
            ].map((p) => (
              <div
                key={p.num}
                className="rounded-2xl bg-white p-8 border border-storm-foam card-lift"
              >
                <div className="font-display text-5xl font-medium text-lightning mb-4">
                  {p.num}
                </div>
                <h3 className="font-display text-xl font-medium text-storm-midnight mb-3">
                  {p.title}
                </h3>
                <p className="text-storm-steel leading-relaxed text-[15px]">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stack técnico */}
      <section className="py-24 lg:py-28 bg-white">
        <Container size="md">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Cómo trabajamos
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight leading-tight mb-8">
              Datos rigurosos. Entrega digital. Acceso continuo.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {[
              {
                title: "Fuentes oficiales y propietarias",
                body: "Cruzamos datos del Servicio Nacional de Pesca, Aduanas, ProChile y fuentes internacionales con nuestra base propietaria de +20 años.",
              },
              {
                title: "Modelos estadísticos serios",
                body: "Cada conclusión está respaldada por análisis cuantitativo. Visualizaciones claras, informes ejecutivos y datos para que tu equipo profundice.",
              },
              {
                title: "Plataforma siempre disponible",
                body: "Accedes a tu cuenta desde cualquier dispositivo. Tableros actualizados, informes nuevos y descargas de datos cuando los necesites.",
              },
              {
                title: "Confidencialidad",
                body: "Los datos de cada cliente jamás se cruzan con los de otros. RLS estricto en la plataforma. NDA disponible bajo solicitud.",
              },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-lightning pl-6 py-2">
                <h3 className="font-display text-lg font-medium text-storm-midnight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-storm-steel leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 bg-storm-midnight text-white">
        <Container size="md" className="text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-medium leading-tight mb-6">
            ¿Quieres ver cómo se aplica a tu negocio?
          </h2>
          <p className="text-storm-spray mb-10 max-w-xl mx-auto text-lg">
            Demo personalizada de 15 minutos. Te mostramos casos reales de tu industria.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={ctas.demo.href}
              className="btn-lightning rounded-full h-14 px-8 inline-flex items-center justify-center font-semibold"
            >
              Solicita una demo →
            </Link>
            <Link
              href="/precios"
              className="rounded-full h-14 px-8 inline-flex items-center justify-center font-medium text-white border border-white/20 hover:bg-white/5 hover:border-lightning transition-colors"
            >
              Ver planes y precios
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
