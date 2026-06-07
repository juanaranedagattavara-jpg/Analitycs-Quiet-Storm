"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";

const defaultItems = [
  {
    q: "¿En qué se diferencia QSA de Datasur?",
    a: "Datasur entrega datos de comercio exterior en bruto. QSA entrega análisis sectorial especializado en productos del mar: contexto por calibre, mercado y empresa. Somos plataforma + metodología de análisis, no solo datos.",
  },
  {
    q: "¿Por qué cobran en UF?",
    a: "Porque QSA está pensada para relaciones de largo plazo en el mercado chileno. UF protege contra inflación y es el estándar B2B en Chile para contratos serios.",
  },
  {
    q: "¿Qué incluye la prueba gratuita?",
    a: "Acceso completo a la plataforma por 1 mes. Sin tarjeta de crédito. Sin compromiso. Si te aporta valor, eliges tu plan y continúas.",
  },
  {
    q: "Soy una empresa chica, ¿esto es para mí?",
    a: "Sí. El Plan Empresa Chica (0,5-1 UF/mes) está diseñado para empresas que necesitan datos de precios e información de mercado para tomar decisiones de temporada.",
  },
  {
    q: "¿Qué productos del mar cubren?",
    a: "Mejillones (carne y media concha), erizos, jaibas, algas y musgos. Además tenemos data tokenizada de vino, frutos secos, carne, leche y madera.",
  },
  {
    q: "¿Cuánto tarda el onboarding?",
    a: "Inmediato. Te registras, accedes a tu plataforma y empiezas a revisar tus reportes y dashboards el mismo día.",
  },
  {
    q: "¿Tienen casos de éxito?",
    a: "Sí. Casos anonimizados disponibles en la plataforma. Con 5 clientes corporativos de hasta 20+ años de relación, la permanencia es nuestra mejor referencia.",
  },
];

type Item = { q: string; a: string };

export function FAQ({ items = defaultItems, title = "Preguntas frecuentes." }: { items?: Item[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 lg:py-32 bg-white">
      <Container size="md">
        <div className="text-center mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
            FAQ
          </p>
          <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-storm-midnight leading-[1.1] tracking-tight">
            {title}
          </h2>
        </div>

        <div className="divide-y divide-storm-foam border-y border-storm-foam">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg lg:text-xl font-medium text-storm-midnight group-hover:text-storm-deep transition-colors">
                    {item.q}
                  </span>
                  <span
                    className={
                      "flex-shrink-0 mt-1 w-8 h-8 rounded-full border border-storm-foam flex items-center justify-center transition-all " +
                      (isOpen
                        ? "bg-storm-midnight border-storm-midnight text-lightning rotate-45"
                        : "text-storm-steel group-hover:border-storm-mist")
                    }
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 1v12M1 7h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={
                    "overflow-hidden transition-all duration-300 " +
                    (isOpen ? "max-h-96 pb-6" : "max-h-0")
                  }
                >
                  <p className="text-storm-steel leading-relaxed max-w-2xl">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
