import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Segmentos() {
  return (
    <section className="py-24 lg:py-32 bg-storm-paper">
      <Container>
        <div className="max-w-2xl mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
            Propuesta de valor
          </p>
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-storm-midnight leading-[1.1] tracking-tight">
            Dos necesidades. Dos planes.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <SegmentCard
            tag="Empresa grande"
            quote='"Quiero compararme contra mi competencia."'
            body="Precios, volúmenes, participación de mercado, calibres. Todo cruzado por empresa y destino. Para presentar a directorio, tomar decisiones estratégicas y anticipar movimientos."
            plan="Plan Empresa Grande"
            price="60–80 UF / año"
            href="/precios#plan-grande"
            featured
          />
          <SegmentCard
            tag="Empresa chica"
            quote='"Necesito datos de precios para fijar los míos."'
            body="Empieza temporada, necesitas saber a cuánto se ha vendido históricamente tu producto en cada mercado. Price Check y tendencias para definir tu precio con respaldo."
            plan="Plan Empresa Chica"
            price="0,5–1 UF / mes"
            href="/precios#plan-chica"
          />
        </div>
      </Container>
    </section>
  );
}

function SegmentCard({
  tag,
  quote,
  body,
  plan,
  price,
  href,
  featured,
}: {
  tag: string;
  quote: string;
  body: string;
  plan: string;
  price: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <div
      className={
        "card-lift relative rounded-2xl p-8 lg:p-10 border " +
        (featured
          ? "bg-storm-midnight text-white border-storm-midnight"
          : "bg-white border-storm-foam")
      }
    >
      <span
        className={
          "font-mono text-[10px] uppercase tracking-[0.18em] " +
          (featured ? "text-lightning" : "text-storm-mist")
        }
      >
        {tag}
      </span>

      <p
        className={
          "mt-5 font-display text-2xl lg:text-3xl font-medium leading-snug " +
          (featured ? "text-white" : "text-storm-midnight")
        }
      >
        {quote}
      </p>

      <p
        className={
          "mt-5 text-[15px] leading-relaxed " +
          (featured ? "text-storm-spray" : "text-storm-steel")
        }
      >
        {body}
      </p>

      <div
        className={
          "mt-8 pt-6 border-t flex items-center justify-between " +
          (featured ? "border-white/10" : "border-storm-foam")
        }
      >
        <div>
          <div
            className={
              "text-sm font-medium " +
              (featured ? "text-white" : "text-storm-midnight")
            }
          >
            {plan}
          </div>
          <div
            className={
              "font-mono text-xs mt-1 " +
              (featured ? "text-lightning" : "text-sunset-storm")
            }
          >
            {price}
          </div>
        </div>
        <Link
          href={href}
          className={
            "text-sm font-medium inline-flex items-center gap-2 hover:gap-3 transition-all " +
            (featured ? "text-lightning" : "text-storm-midnight")
          }
        >
          Ver detalle →
        </Link>
      </div>
    </div>
  );
}
