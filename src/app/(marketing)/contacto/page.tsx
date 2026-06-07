import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Habla con Quiet Storm Analytics. Email, LinkedIn y formulario de contacto.",
};

export default function ContactoPage() {
  return (
    <section className="bg-storm-paper min-h-screen py-20 lg:py-28">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-storm-mist mb-4">
              Contacto
            </p>
            <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-medium text-storm-midnight leading-[1.05] tracking-tight">
              Hablemos.
            </h1>
            <p className="mt-6 text-lg text-storm-steel leading-relaxed max-w-md">
              Para demos, dudas comerciales o información sobre la plataforma.
              Respondemos en menos de 24 horas hábiles.
            </p>

            <div className="mt-10 space-y-6">
              <ContactRow
                label="Email"
                value={site.email}
                href={`mailto:${site.email}`}
              />
              <ContactRow label="Ubicación" value={site.location} />
              <ContactRow
                label="LinkedIn"
                value="Quiet Storm Analytics"
                href={site.linkedin}
                external
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white border border-storm-foam p-8 lg:p-10">
              <h2 className="font-display text-2xl font-medium text-storm-midnight mb-2">
                Envíanos un mensaje
              </h2>
              <p className="text-sm text-storm-steel mb-8">
                ¿Prefieres email directo? Escríbenos a{" "}
                <a href={`mailto:${site.email}`} className="text-storm-midnight underline">
                  {site.email}
                </a>
              </p>

              <form
                action="/api/demo"
                method="POST"
                className="space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="hidden" name="intent" value="contacto" />
                  <input type="hidden" name="industria" value="otra" />
                  <Field label="Nombre" name="nombre" required />
                  <Field label="Empresa" name="empresa" required />
                </div>
                <Field label="Email" name="email" type="email" required />
                <div>
                  <label className="block text-sm font-medium text-storm-midnight mb-2">
                    Mensaje <span className="text-sunset-storm">*</span>
                  </label>
                  <textarea
                    name="mensaje"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-storm-foam bg-storm-paper text-storm-midnight focus:outline-none focus:border-storm-midnight focus:ring-2 focus:ring-lightning/30 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-lightning w-full h-14 rounded-full font-semibold inline-flex items-center justify-center"
                >
                  Enviar mensaje →
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = href ? (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-storm-midnight font-medium hover:text-sunset-storm transition-colors"
    >
      {value}
    </a>
  ) : (
    <span className="text-storm-midnight font-medium">{value}</span>
  );

  return (
    <div className="border-l-2 border-lightning pl-5 py-1">
      <div className="font-mono text-[10px] uppercase tracking-wider text-storm-mist mb-1">
        {label}
      </div>
      <div className="text-lg">{content}</div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-storm-midnight mb-2">
        {label} {required && <span className="text-sunset-storm">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full h-12 px-4 rounded-lg border border-storm-foam bg-storm-paper text-storm-midnight focus:outline-none focus:border-storm-midnight focus:ring-2 focus:ring-lightning/30 transition-all"
      />
    </div>
  );
}
