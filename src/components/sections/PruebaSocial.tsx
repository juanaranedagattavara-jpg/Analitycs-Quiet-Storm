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
              Prueba social
            </span>
          </div>

          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-storm-midnight leading-[1.1] tracking-tight mb-6">
            5 clientes corporativos.
            <br />
            Relaciones de hasta{" "}
            <span className="text-sunset-storm">20+ años</span>.
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-storm-steel leading-relaxed">
            No publicamos sus nombres por confidencialidad. Pero la permanencia
            habla por sí sola: en B2B chileno, nadie paga dos décadas por algo que
            no funciona.
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { num: "20+", label: "Años en operación" },
              { num: "5", label: "Clientes corporativos" },
              { num: "30+", label: "Proyectos entregados" },
              { num: "4", label: "Industrias cubiertas" },
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
        </div>
      </Container>
    </section>
  );
}
