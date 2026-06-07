"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type FormState = "idle" | "submitting" | "success" | "error";

export function DemoForm() {
  const params = useSearchParams();
  const intent = params.get("intent");
  const plan = params.get("plan");

  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, intent, plan }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Error al enviar el formulario");
      }
      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl bg-white border border-storm-foam p-10 lg:p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-lightning/20 mx-auto flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-storm-midnight">
            <path
              d="M8 16l5 5 11-12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="font-display text-3xl font-medium text-storm-midnight mb-3">
          Recibimos tu solicitud.
        </h2>
        <p className="text-storm-steel leading-relaxed max-w-md mx-auto">
          Te enviaremos un email en menos de 24 horas con 2-3 horarios
          disponibles esta semana. Mientras tanto, revisa tu bandeja de spam por
          si acaso.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white border border-storm-foam p-8 lg:p-10 space-y-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-storm-foam">
        <h2 className="font-display text-2xl font-medium text-storm-midnight">
          {intent === "trial" ? "Activa tu prueba gratis" : "Solicita tu demo"}
        </h2>
        {plan && (
          <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-lightning/20 text-storm-midnight">
            {plan.replace("plan-", "Plan ")}
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nombre completo" name="nombre" required placeholder="Tu nombre" />
        <Field label="Empresa" name="empresa" required placeholder="Razón social" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Email corporativo"
          name="email"
          type="email"
          required
          placeholder="tunombre@empresa.cl"
        />
        <Field label="Teléfono" name="telefono" type="tel" placeholder="+56 9 ..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-storm-midnight mb-2">
          Industria de interés <span className="text-sunset-storm">*</span>
        </label>
        <select
          name="industria"
          required
          defaultValue=""
          className="w-full h-12 px-4 rounded-lg border border-storm-foam bg-storm-paper text-storm-midnight focus:outline-none focus:border-storm-midnight focus:ring-2 focus:ring-lightning/30 transition-all"
        >
          <option value="" disabled>
            Selecciona tu industria
          </option>
          <option value="mitilicultura">Mitilicultura (mejillones)</option>
          <option value="erizos-jaibas">Erizos y jaibas</option>
          <option value="algas">Algas y musgos</option>
          <option value="otra">Otra (especificar abajo)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-storm-midnight mb-2">
          ¿Qué necesitas resolver? <span className="text-storm-mist font-normal">(opcional)</span>
        </label>
        <textarea
          name="mensaje"
          rows={4}
          placeholder="Ej: comparar mis precios FOB vs competencia para mercado España..."
          className="w-full px-4 py-3 rounded-lg border border-storm-foam bg-storm-paper text-storm-midnight placeholder:text-storm-fog focus:outline-none focus:border-storm-midnight focus:ring-2 focus:ring-lightning/30 transition-all resize-none"
        />
      </div>

      {state === "error" && error && (
        <div className="rounded-lg bg-sunset-storm/10 border border-sunset-storm/30 px-4 py-3 text-sm text-sunset-storm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-lightning w-full h-14 rounded-full font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
      >
        {state === "submitting" ? "Enviando..." : "Solicitar demo →"}
      </button>

      <p className="text-xs text-storm-mist text-center">
        Tus datos se usan solo para coordinar la demo. Nunca los compartimos con terceros.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full h-12 px-4 rounded-lg border border-storm-foam bg-storm-paper text-storm-midnight placeholder:text-storm-fog focus:outline-none focus:border-storm-midnight focus:ring-2 focus:ring-lightning/30 transition-all"
      />
    </div>
  );
}
