import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Registra um clique em um link público (métrica simples para o painel).
// Não expõe nem exige dados pessoais; falha de forma silenciosa.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const ip = getClientIp(req.headers);
  const limited = rateLimit(`click:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!limited.success) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    await prisma.linkItem.update({
      where: { id: params.id },
      data: { clicks: { increment: 1 } },
    });
  } catch {
    // ignora IDs inexistentes
  }

  return NextResponse.json({ ok: true });
}
