import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ctas } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre nosotros — Quiet Storm Analytics",
  description:
    "Consultora chilena de inteligencia de mercado para exportadores de productos del mar. Más de 20 años de trayectoria, desde las hojas impresas hasta la plataforma digital.",
};

export default function SobreNosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-storm-gradient text-white py-20 lg:py-28">
        <Container>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-lightning mb-4">
            Nuestra historia
          </p>
          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.05] tracking-tight max-w-4xl">
            Dos generaciones leyendo el mar{" "}
            <span className="text-lightning">para ti.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg lg:text-xl text-storm-spray leading-relaxed">
            Quiet Storm Analytics nació de una convicción: los exportadores
            chilenos de productos del mar merecen tomar decisiones con datos
            rigurosos, no con intuición. Más de dos décadas de trabajo lo
            respaldan.
          </p>
        </Container>
      </section>

      {/* Misión y Visión */}
      <section className="py-24 lg:py-32 bg-storm-paper">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white p-8 lg:p-10 border border-storm-foam">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-lightning mb-4">
                Misión
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-medium text-storm-midnight leading-tight mb-5">
                Que cada exportador del mar chileno negocie con datos, no con
                supuestos.
              </h2>
              <p className="text-storm-steel text-[17px] leading-relaxed">
                Transformamos datos de comercio exterior en inteligencia
                comercial clara: precios, volúmenes, participación de mercado y
                tendencias. Para que tu equipo sepa a cuánto vendió el mercado,
                quién ganó participación y hacia dónde se mueven los destinos
                — antes de cerrar la próxima operación.
              </p>
            </div>
            <div className="rounded-2xl bg-storm-midnight p-8 lg:p-10 border border-storm-deep text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-lightning mb-4">
                Visión
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-medium leading-tight mb-5">
                Ser el referente en inteligencia de mercado para toda la
                industria pesquera y acuícola de Chile.
              </h2>
              <p className="text-storm-spray text-[17px] leading-relaxed">
                Que cada empresa exportadora — desde la pyme de Chiloé hasta la
                compañía con presencia en 30 mercados — tenga acceso a datos
                confiables, análisis serio y herramientas que antes solo
                existían en industrias con presupuestos mayores.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Historia — el origen */}
      <section className="py-24 lg:py-32 bg-white">
        <Container size="md">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
                Origen
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-medium text-storm-midnight leading-tight">
                De las hojas impresas a la plataforma digital.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-6 text-storm-steel text-[17px] leading-relaxed">
              <p>
                Todo empezó en los años 90. El fundador trabajaba como gerente
                comercial y compraba datos de comercio exterior a un proveedor.
                La información llegaba en hojas enormes, impresas — y había que
                revisarlas línea por línea para tomar decisiones de precio y
                mercado.
              </p>
              <p>
                Le apasionaron los números. Con formación en biología de la
                Universidad de Chile y un MBA en la Adolfo Ibáñez, decidió
                construir un negocio basado en análisis riguroso — donde el
                valor dependiera de los cálculos, no de la escala.
              </p>
              <p>
                El primer cliente fue un exportador de salmón ahumado. El
                segundo y tercero llegaron por referencia. Veinte años después,
                varios de esos clientes originales siguen con nosotros. Esa
                permanencia es nuestro mayor orgullo.
              </p>
              <p>
                Hoy, la segunda generación continúa ese legado: misma rigurosidad,
                misma confidencialidad, pero ahora con una plataforma digital
                que pone esa inteligencia al alcance de más exportadores.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* El nombre */}
      <section className="py-24 lg:py-32 bg-storm-midnight text-white">
        <Container size="md">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-lightning mb-4">
              ¿Por qué Quiet Storm?
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium leading-tight mb-8">
              La tormenta silenciosa.
            </h2>
            <p className="text-storm-spray text-lg lg:text-xl leading-relaxed">
              En el mar, las corrientes más importantes son las que no se ven
              desde la superficie. Los movimientos de precio, los cambios de
              destino, las empresas que ganan o pierden participación — todo eso
              ocurre bajo la línea de flotación. Nosotros lo vemos. Y te lo
              mostramos antes de que esa tormenta silenciosa llegue a tu
              mercado.
            </p>
          </div>
        </Container>
      </section>

      {/* Filosofía */}
      <section className="py-24 lg:py-32 bg-storm-paper">
        <Container>
          <div className="max-w-3xl mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Cómo trabajamos
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
                body: "Cada conclusión tiene respaldo cuantitativo. No entregamos opiniones — entregamos datos procesados con criterio y contexto de industria.",
              },
              {
                num: "02",
                title: "Especialización en el mar",
                body: "Mejillones, erizos, jaibas, algas. Hablamos de calibres, precios FOB por destino, estacionalidad. No somos generalistas — somos de tu industria.",
              },
              {
                num: "03",
                title: "Relaciones de largo plazo",
                body: "Tarifas en UF, confidencialidad estricta y clientes que llevan más de 20 años con nosotros. La permanencia es nuestra mejor carta de presentación.",
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

      {/* Fuentes y método */}
      <section className="py-24 lg:py-28 bg-white">
        <Container size="md">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Nuestras fuentes
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight leading-tight mb-8">
              Datos rigurosos. Entrega digital. Acceso continuo.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {[
              {
                title: "Fuentes oficiales y propietarias",
                body: "Cruzamos datos del Servicio Nacional de Pesca, Aduanas, ProChile y fuentes internacionales con nuestra base propietaria de más de 20 años.",
              },
              {
                title: "Análisis con contexto de industria",
                body: "Cada conclusión está respaldada por datos cuantitativos. Informes ejecutivos y visualizaciones claras para que tu equipo tome decisiones con fundamento.",
              },
              {
                title: "Plataforma siempre disponible",
                body: "Accedes a tu cuenta desde cualquier dispositivo. Tableros actualizados, informes nuevos y datos cuando los necesites — sin depender de un correo.",
              },
              {
                title: "Confidencialidad absoluta",
                body: "Los datos de cada cliente jamás se cruzan con los de otros. Seguridad estricta en la plataforma. Acuerdo de confidencialidad disponible bajo solicitud.",
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
            Demo personalizada de 15 minutos. Te mostramos datos reales de tu industria.
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
