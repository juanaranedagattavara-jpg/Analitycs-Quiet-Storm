import { NextRequest, NextResponse } from "next/server";

// API route placeholder — Día 7 conecta con Supabase crm_contacts + crm_deals.
// Por ahora, valida payload y loggea. En producción intercepta y guarda en DB.

const REQUIRED = ["nombre", "empresa", "email", "industria"] as const;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  for (const field of REQUIRED) {
    if (!body[field] || typeof body[field] !== "string") {
      return NextResponse.json(
        { error: `Campo requerido: ${field}` },
        { status: 400 }
      );
    }
  }

  // TODO Día 7: insert en Supabase crm_contacts + crear crm_deal etapa "Nuevo lead"
  // TODO Día 28: trigger n8n flow → notif Telegram Juan
  console.log("[demo] new lead:", body);

  return NextResponse.json({ ok: true }, { status: 200 });
}
