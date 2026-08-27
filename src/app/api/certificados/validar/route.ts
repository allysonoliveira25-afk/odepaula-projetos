import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateKeySchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Endpoint público de validação de certificados (consumido pela página
// /certificados e disponível para integrações externas). Retorna
// apenas os dados necessários para comprovar autenticidade — nunca
// documentos pessoais completos.
export async function GET(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const limited = rateLimit(`validate:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!limited.success) {
    return NextResponse.json({ error: "Muitas consultas. Aguarde um instante." }, { status: 429 });
  }

  const key = req.nextUrl.searchParams.get("key") || "";
  const parsed = validateKeySchema.safeParse({ key });
  if (!parsed.success) {
    return NextResponse.json({ error: "Chave em formato inválido." }, { status: 400 });
  }

  const certificate = await prisma.certificate.findUnique({
    where: { validationKey: parsed.data.key },
    include: { event: { select: { title: true } } },
  });

  if (!certificate) {
    return NextResponse.json({ found: false, valid: false });
  }

  await prisma.certificate.update({
    where: { id: certificate.id },
    data: { viewCount: { increment: 1 } },
  });

  return NextResponse.json({
    found: true,
    valid: certificate.status === "VALID",
    status: certificate.status,
    participantName: certificate.participantName,
    courseName: certificate.event?.title || certificate.courseName,
    workload: certificate.workload,
    instructor: certificate.instructor,
    eventDate: certificate.eventDate,
    certificateNumber: certificate.certificateNumber,
    issuedAt: certificate.issuedAt,
  });
}
