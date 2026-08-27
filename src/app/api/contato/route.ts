import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);

  // Proteção contra spam/abuso: no máximo 5 mensagens a cada 10 minutos por IP
  const limited = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!limited.success) {
    return NextResponse.json(
      { error: "Muitas mensagens enviadas. Tente novamente mais tarde." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Dados inválidos." },
      { status: 400 }
    );
  }

  // Honeypot: campo "website" deve permanecer vazio. Se vier preenchido,
  // finge sucesso para não alertar bots, mas descarta silenciosamente.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp || null,
      message: parsed.data.message,
      ip,
    },
  });

  return NextResponse.json({ ok: true });
}
