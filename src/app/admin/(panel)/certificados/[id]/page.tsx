import { notFound } from "next/navigation";
import { Download, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import CertificateActions from "@/components/admin/CertificateActions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Detalhes do Certificado" };

export default async function CertificadoDetalhePage({ params }: { params: { id: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { id: params.id },
    include: { event: { select: { title: true } } },
  });
  if (!certificate) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const validationUrl = `${siteUrl}/certificados/${certificate.validationKey}`;

  return (
    <div>
      <PageHeader title="Certificado" subtitle={certificate.validationKey} />

      <div className="card-metallic max-w-2xl rounded-2xl p-6">
        <Row label="Participante" value={certificate.participantName} />
        {certificate.participantDocument && (
          <Row label="Documento" value={certificate.participantDocument} />
        )}
        <Row label="Curso / Evento" value={certificate.event?.title || certificate.courseName} />
        <Row label="Carga horária" value={certificate.workload} />
        <Row label="Instrutor(a)" value={certificate.instructor} />
        <Row label="Data" value={formatDate(certificate.eventDate)} />
        {certificate.location && <Row label="Local" value={certificate.location} />}
        <Row label="Número do certificado" value={certificate.certificateNumber} />
        <Row label="Chave de validação" value={certificate.validationKey} mono />
        <Row label="Emitido em" value={formatDate(certificate.issuedAt)} />
        <Row label="Consultas públicas" value={String(certificate.viewCount)} />
        {certificate.notes && <Row label="Observações" value={certificate.notes} />}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`/api/admin/certificados/${certificate.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-platinum px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian"
          >
            <Download size={14} /> Baixar PDF
          </a>
          <a
            href={validationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs uppercase tracking-wider text-silver hover:text-platinum"
          >
            <ExternalLink size={14} /> Ver página pública
          </a>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <CertificateActions id={certificate.id} status={certificate.status} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 py-2.5 last:border-0">
      <span className="text-xs uppercase tracking-wider text-chrome">{label}</span>
      <span className={mono ? "font-mono text-sm text-platinum" : "text-right text-sm text-silver"}>
        {value}
      </span>
    </div>
  );
}
