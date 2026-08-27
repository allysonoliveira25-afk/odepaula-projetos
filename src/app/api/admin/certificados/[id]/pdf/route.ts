import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { generateCertificatePdf } from "@/lib/certificate";
import { getSiteSettings } from "@/lib/settings";

// Gera e retorna o PDF do certificado sob demanda. Protegido pelo
// middleware (/api/admin/*) — exige sessão de administrador válida.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const certificate = await prisma.certificate.findUnique({
    where: { id: params.id },
    include: { event: { select: { title: true } } },
  });
  if (!certificate) {
    return NextResponse.json({ error: "Certificado não encontrado." }, { status: 404 });
  }

  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const pdfBytes = await generateCertificatePdf({
    participantName: certificate.participantName,
    courseName: certificate.event?.title || certificate.courseName,
    workload: certificate.workload,
    instructor: certificate.instructor,
    eventDate: certificate.eventDate,
    location: certificate.location,
    certificateNumber: certificate.certificateNumber,
    validationKey: certificate.validationKey,
    issuedAt: certificate.issuedAt,
    projectName: settings.projectName,
    siteUrl,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificado-${certificate.certificateNumber}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
