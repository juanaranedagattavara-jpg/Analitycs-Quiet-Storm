import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { DemoForm } from "./DemoForm";

export const metadata: Metadata = {
  title: "Solicita una demo — Plataforma QSA",
  description:
    "Demo personalizada de 15 minutos. Te mostramos cómo funciona la plataforma con datos de tu industria.",
};

export default function DemoPage() {
  return (
    <section className="bg-storm-paper min-h-screen py-20 lg:py-28">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: pitch + timeline */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Demo personalizada
            </p>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-storm-midnight leading-[1.05] tracking-tight">
              15 minutos. Tu industria.{" "}
              <span className="text-sunset-storm">Datos reales.</span>
            </h1>
            <p className="mt-6 text-lg text-storm-steel leading-relaxed">
              Te mostramos la plataforma con datos reales de tu industria
              (mejillones, erizos, jaibas o algas). Sin discurso comercial: vemos los
              datos y respondemos tus preguntas.
            </p>

            <ol className="mt-10 space-y-6">
              {[
                {
                  n: "1",
                  title: "Completas el formulario",
                  body: "Nos dices qué industria te interesa y qué necesitas resolver.",
                },
                {
                  n: "2",
                  title: "Confirmación en 24h",
                  body: "Te enviamos un email con 2-3 horarios disponibles esta semana.",
                },
                {
                  n: "3",
                  title: "Demo 15 min",
                  body: "Por Google Meet o Zoom. Vemos datos y casos reales de tu sector.",
                },
                {
                  n: "4",
                  title: "Decides sin presión",
                  body: "Si te aporta valor, activamos tu prueba gratuita de 1 mes. Si no, agradecemos tu tiempo.",
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-storm-midnight text-lightning font-display text-lg font-medium flex items-center justify-center">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-medium text-storm-midnight mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-storm-steel leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <Suspense fallback={<FormFallback />}>
              <DemoForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FormFallback() {
  return (
    <div className="rounded-2xl bg-white border border-storm-foam p-8 lg:p-10 animate-pulse">
      <div className="h-7 w-48 bg-storm-foam rounded mb-8" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-storm-paper rounded-lg" />
        ))}
        <div className="h-24 bg-storm-paper rounded-lg" />
        <div className="h-14 bg-storm-foam rounded-full mt-4" />
      </div>
    </div>
  );
}
