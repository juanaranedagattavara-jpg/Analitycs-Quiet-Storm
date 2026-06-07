import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FAQ } from "@/components/sections/FAQ";
import { ctas } from "@/lib/site";

export const metadata: Metadata = {
  title: "Precios — Planes en UF para exportadores de productos del mar",
  description:
    "2 planes en UF: Empresa Grande (60-80 UF/año) y Empresa Chica (0,5-1 UF/mes). Prueba gratis 1 mes.",
};

const features = [
  { label: "Acceso plataforma web", chica: true, grande: true },
  { label: "Datos de precios de mercado", chica: true, grande: true },
  { label: "Tendencias de mercado", chica: true, grande: true },
  { label: "Reportes Price Check", chica: true, grande: true },
  { label: "Análisis competitivo", chica: false, grande: true },
  { label: "Participación de mercado", chica: false, grande: true },
  { label: "Desglose por calibre", chica: false, grande: true },
  { label: "Dashboards interactivos (HTML)", chica: false, grande: true },
  { label: "Reportes PDF personalizados", chica: false, grande: "4-5 por cliente" },
  { label: "Archivos Excel detallados", chica: false, grande: true },
  { label: "Múltiples reportes por período", chica: false, grande: true },
  { label: "Prueba gratuita 1 mes", chica: true, grande: true },
];

const faqs = [
  {
    q: "¿Por qué cobran en UF?",
    a: "Porque QSA está diseñada para relaciones de largo plazo. UF ajusta automáticamente por inflación y es el estándar B2B chileno para contratos serios.",
  },
  {
    q: "¿Cuánto es en pesos chilenos?",
    a: "1 UF ~ CLP $38.000 (referencia junio 2026, consulta el valor diario en sii.cl). Plan Empresa Chica: desde ~$19.000/mes. Plan Empresa Grande: desde ~$2.280.000/año.",
  },
  {
    q: "¿Puedo pagar en USD?",
    a: "Sí. Hacemos la conversión al tipo de cambio del día de facturación.",
  },
  {
    q: "¿La prueba gratis incluye todo?",
    a: "Sí. Acceso completo a la plataforma por 1 mes. Sin restricciones. Sin tarjeta de crédito.",
  },
  {
    q: "¿Hay costos ocultos?",
    a: "No. Lo que ves en esta página es lo que pagas.",
  },
  {
    q: "¿Puedo cambiar de plan?",
    a: "Sí, en cualquier momento. Upgrade inmediato. Downgrade al próximo ciclo.",
  },
  {
    q: "¿Y si quiero cancelar?",
    a: "Cancelación sin penalidades. Sin preguntas.",
  },
  {
    q: "¿Tienen factura electrónica?",
    a: "Sí, factura electrónica chilena.",
  },
];

export default function PreciosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-storm-paper">
        <Container className="pt-20 pb-12 lg:pt-28 lg:pb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
            Precios
          </p>
          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-medium text-storm-midnight leading-[1.05] tracking-tight max-w-4xl">
            Dos planes. Pricing en UF.{" "}
            <span className="text-sunset-storm">Sin sorpresas.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-storm-steel leading-relaxed">
            Un plan para empresas grandes que necesitan inteligencia competitiva
            completa. Otro para empresas chicas que necesitan datos de precios.
            Ambos con acceso a la plataforma web y prueba gratuita de 1 mes.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono uppercase tracking-wider text-storm-mist">
            <span>Pricing en UF</span>
            <span>·</span>
            <span>Plataforma web</span>
            <span>·</span>
            <span>Prueba gratis 1 mes</span>
            <span>·</span>
            <span>Pasarela pago online</span>
          </div>
        </Container>
      </section>

      {/* Plans */}
      <section className="bg-storm-paper pb-16 lg:pb-24">
        <Container>
          <div id="planes" className="grid lg:grid-cols-2 gap-6">
            <PlanCardLarge
              id="plan-grande"
              name="Plan Empresa Grande"
              price="60–80"
              cadence="UF / año"
              description="Para empresas que quieren compararse contra su competencia: precios, volúmenes, participación de mercado y desglose por calibre."
              features={[
                "Acceso completo a la plataforma web QSA",
                "Dashboards interactivos: MUSSEL · SEAFARM · MOSS METRICS",
                "Reportes PDF personalizados (4-5 por cliente)",
                "Análisis competitivo y participación de mercado",
                "Desglose por calibre (CA1-CA4, EN1-EN4, MV1-MV4)",
                "Archivos Excel detallados (producto × destino × empresa × calibre)",
                "Price Check incluido",
                "Múltiples reportes por período",
              ]}
              featured
            />
            <PlanCardLarge
              id="plan-chica"
              name="Plan Empresa Chica"
              price="0,5–1"
              cadence="UF / mes"
              description="Para empresas que necesitan datos de precios. Están por iniciar temporada y necesitan precios históricos para fijar los suyos."
              features={[
                "Acceso a la plataforma web QSA",
                "Datos de precios de mercado actualizados",
                "Tendencias de mercado por producto y destino",
                "Reportes Price Check",
                "Información de precios históricos por temporada",
              ]}
            />
          </div>

          <p className="mt-10 text-center text-sm text-storm-steel">
            <span className="font-medium text-storm-midnight">Prueba gratuita de 1 mes</span> sin
            compromiso. Sin tarjeta de crédito para empezar.
            <br />
            <span className="font-mono text-xs text-storm-mist mt-2 inline-block">
              ¿Qué es UF? Unidad de Fomento — indicador chileno ajustado por inflación. 1 UF ~ CLP $38.000 (junio 2026).
            </span>
          </p>
        </Container>
      </section>

      {/* Comparativa */}
      <section className="py-24 lg:py-28 bg-white">
        <Container size="md">
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Comparativa
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight">
              Feature por feature.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-storm-foam">
            <table className="w-full">
              <thead className="bg-storm-paper">
                <tr>
                  <th className="text-left font-mono text-[11px] uppercase tracking-wider text-storm-mist py-4 px-6">
                    Característica
                  </th>
                  <th className="text-center font-mono text-[11px] uppercase tracking-wider text-storm-mist py-4 px-6">
                    Empresa Chica
                  </th>
                  <th className="text-center font-mono text-[11px] uppercase tracking-wider text-storm-midnight bg-lightning/10 py-4 px-6">
                    Empresa Grande
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-storm-foam">
                {features.map((f) => (
                  <tr key={f.label} className="hover:bg-storm-paper/50 transition-colors">
                    <td className="py-4 px-6 text-storm-steel text-sm">{f.label}</td>
                    <td className="py-4 px-6 text-center">
                      <Check value={f.chica} />
                    </td>
                    <td className="py-4 px-6 text-center bg-lightning/[0.04]">
                      <Check value={f.grande} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Cómo funciona */}
      <section className="py-24 bg-storm-paper">
        <Container>
          <div className="text-center mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Cómo funciona
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-medium text-storm-midnight">
              Empieza en 3 pasos.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                n: "1",
                title: "Regístrate gratis",
                body: "Crea tu cuenta en quietstormanalytics.com. Sin tarjeta. Sin compromiso.",
              },
              {
                n: "2",
                title: "Prueba por 1 mes",
                body: "Accede a la plataforma completa durante 1 mes sin costo. Revisa reportes, dashboards y datos.",
              },
              {
                n: "3",
                title: "Elige tu plan",
                body: "Si te aporta valor, elige Plan Grande o Chica. Paga directamente con la pasarela integrada.",
              },
            ].map((s) => (
              <div key={s.n} className="bg-white rounded-2xl p-8 border border-storm-foam">
                <div className="font-display text-6xl text-lightning mb-4">{s.n}</div>
                <h3 className="font-display text-xl font-medium text-storm-midnight mb-3">
                  {s.title}
                </h3>
                <p className="text-storm-steel text-[15px] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Garantía */}
      <section className="py-20 bg-white">
        <Container size="md">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Prueba gratuita 1 mes",
                body: "Acceso completo sin costo. Si no aporta valor, no pagas nada.",
              },
              {
                title: "Confidencialidad garantizada",
                body: "Tu información nunca se cruza con la de otros clientes.",
              },
              {
                title: "+20 años de experiencia",
                body: "5 clientes corporativos de largo plazo respaldan la calidad del servicio.",
              },
            ].map((g) => (
              <div key={g.title} className="rounded-2xl bg-storm-paper p-6 border border-storm-foam">
                <h4 className="font-display text-lg font-medium text-storm-midnight mb-2">
                  {g.title}
                </h4>
                <p className="text-sm text-storm-steel leading-relaxed">{g.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FAQ items={faqs} title="Preguntas frecuentes sobre precios." />

      {/* CTA Final */}
      <section className="py-24 lg:py-32 bg-storm-midnight text-white">
        <Container size="md" className="text-center">
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
            Empieza gratis.{" "}
            <span className="text-lightning">Decide después.</span>
          </h2>
          <p className="max-w-xl mx-auto text-lg text-storm-spray leading-relaxed mb-10">
            1 mes completo de acceso a la plataforma, sin costo. Revisa tus
            mercados con datos reales y decide si QSA aporta a tus decisiones.
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
              Solicita demo 15 min
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function PlanCardLarge({
  id,
  name,
  price,
  cadence,
  description,
  features,
  featured,
}: {
  id: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      id={id}
      className={
        "scroll-mt-24 rounded-2xl p-8 lg:p-10 relative " +
        (featured
          ? "bg-storm-midnight text-white border-2 border-lightning"
          : "bg-white border-2 border-storm-foam")
      }
    >
      {featured && (
        <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-lightning text-storm-midnight font-mono text-[10px] uppercase tracking-wider font-bold">
          Más completo
        </div>
      )}

      <div
        className={
          "font-mono text-[10px] uppercase tracking-[0.18em] " +
          (featured ? "text-lightning" : "text-storm-mist")
        }
      >
        {name}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span
          className={
            "font-display text-6xl lg:text-7xl font-medium " +
            (featured ? "text-white" : "text-storm-midnight")
          }
        >
          {price}
        </span>
        <span
          className={
            "font-mono text-sm " + (featured ? "text-storm-spray" : "text-storm-steel")
          }
        >
          {cadence}
        </span>
      </div>

      <p
        className={
          "mt-5 text-[15px] leading-relaxed " +
          (featured ? "text-storm-spray" : "text-storm-steel")
        }
      >
        {description}
      </p>

      <ul className="mt-8 space-y-3">
        {features.map((f) => (
          <li
            key={f}
            className={
              "flex items-start gap-3 text-sm " +
              (featured ? "text-storm-spray" : "text-storm-steel")
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className={"flex-shrink-0 mt-0.5 " + (featured ? "text-lightning" : "text-storm-midnight")}
            >
              <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.2" />
              <path
                d="M5.5 9.5l2.5 2.5L13 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link
          href={`/demo?intent=trial&plan=${id}`}
          className={
            "block w-full text-center h-14 rounded-full font-semibold inline-flex items-center justify-center transition-all " +
            (featured
              ? "btn-lightning"
              : "border-2 border-storm-midnight text-storm-midnight hover:bg-storm-midnight hover:text-white")
          }
        >
          Empieza tu prueba gratis →
        </Link>
      </div>
    </div>
  );
}

function Check({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-lightning inline-block">
        <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.2" />
        <path
          d="M6 10.5l2.5 2.5L14 7.5"
          stroke="#0a1f33"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (value === false) {
    return <span className="text-storm-fog">—</span>;
  }
  return (
    <span className="font-mono text-xs text-storm-midnight font-medium">{value}</span>
  );
}
