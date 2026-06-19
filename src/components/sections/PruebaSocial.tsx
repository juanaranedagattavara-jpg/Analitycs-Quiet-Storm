import { Container } from "@/components/ui/Container";

export function PruebaSocial() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <Container size="md">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-storm-foam mb-8">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-sunset-storm">
              <path
                d="M8 1l2.2 4.5L15 6.2l-3.5 3.4.8 4.8L8 12.1l-4.3 2.3.8-4.8L1 6.2l4.8-.7L8 1z"
                fill="currentColor"
              />
            </svg>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-storm-steel">
              Trayectoria
            </span>
          </div>

          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-storm-midnight leading-[1.1] tracking-tight mb-6">
            Clientes que llegaron{" "}
            <span className="text-sunset-storm">hace 20 años</span>
            <br />
            siguen con nosotros hoy.
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-storm-steel leading-relaxed">
            Nadie renueva por dos décadas algo que no aporta valor. Empezamos
            con un exportador de salmón ahumado. Hoy cubrimos toda la industria
            pesquera de exportación. Varios de esos primeros clientes siguen
            vigentes — y eso es nuestro mejor argumento.
          </p>

          <blockquote className="mt-10 max-w-xl mx-auto border-l-2 border-lightning pl-6 text-left">
            <p className="font-display text-xl text-storm-midnight italic leading-snug">
              "PriceCheck nos mostró lo que no habíamos visto.
              Desde entonces lo usamos antes de cada temporada."
            </p>
            <cite className="mt-3 block font-mono text-xs text-storm-mist not-italic uppercase tracking-wider">
              Exportador, Bacalao de profundidad — Chile
            </cite>
          </blockquote>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { num: "20+", label: "Años en operación" },
              { num: "138", label: "Empresas analizadas" },
              { num: "51", label: "Productos del mar" },
              { num: "16", label: "Mercados de destino" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border-l-2 border-lightning pl-4 text-left"
              >
                <div className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight">
                  {stat.num}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-storm-mist mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-mist mb-6">
              Industrias que cubrimos
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Mejillones', 'Bacalao de profundidad', 'Erizos', 'Centolla',
                'Salmón', 'Jaibas', 'Choritos', 'Langostino',
                'Algas', 'Jibia', 'Merluza', 'Trucha',
              ].map((product) => (
                <span
                  key={product}
                  className="px-4 py-2 rounded-full bg-storm-paper border border-storm-foam text-sm text-storm-steel font-medium"
                >
                  {product}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
