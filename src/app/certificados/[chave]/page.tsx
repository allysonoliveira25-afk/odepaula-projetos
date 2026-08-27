import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import MetallicBackground from "@/components/site/MetallicBackground";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CertificateSearchForm from "@/components/site/CertificateSearchForm";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, XCircle, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resultado da Consulta",
  robots: { index: false, follow: false },
};

async function getCertificate(rawKey: string) {
  const key = decodeURIComponent(rawKey).trim().toUpperCase();
  const certificate = await prisma.certificate.findUnique({
    where: { validationKey: key },
    include: { event: { select: { title: true } } },
  });

  if (certificate) {
    // Contabiliza a consulta (não bloqueante para a resposta)
    await prisma.certificate.update({
      where: { id: certificate.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return certificate;
}

export default async function CertificateResultPage({ params }: { params: { chave: string } }) {
  const settings = await getSiteSettings();
  const certificate = await getCertificate(params.chave);
  const isValid = certificate?.status === "VALID";
  const isRevoked = certificate?.status === "REVOKED";

  return (
    <>
      <MetallicBackground />
      <Header projectName={settings.projectName} />
      <main className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center px-5 pb-16 pt-32 text-center sm:pt-36">
        {certificate ? (
          <>
            <StatusBadge valid={isValid} revoked={isRevoked} />
            <h1 className="mt-6 font-display text-3xl tracking-wide text-platinum sm:text-4xl">
              {isValid ? "Certificado Válido" : isRevoked ? "Certificado Revogado" : "Certificado Inválido"}
            </h1>

            <div className="card-metallic mt-8 w-full rounded-2xl p-6 text-left shadow-metal sm:p-8">
              <Row label="Participante" value={certificate.participantName} highlight />
              <Row
                label="Curso / Evento"
                value={certificate.event?.title || certificate.courseName}
              />
              <Row label="Carga horária" value={certificate.workload} />
              <Row label="Instrutor(a)" value={certificate.instructor} />
              <Row label="Data" value={formatDate(certificate.eventDate)} />
              <Row label="Número do certificado" value={certificate.certificateNumber} />
              <Row label="Emitido em" value={formatDate(certificate.issuedAt)} />
              {isRevoked && (
                <p className="mt-4 rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                  Este certificado foi revogado{certificate.revokedReason ? `: ${certificate.revokedReason}` : "."}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <StatusBadge valid={false} revoked={false} />
            <h1 className="mt-6 font-display text-3xl tracking-wide text-platinum sm:text-4xl">
              Certificado não encontrado
            </h1>
            <p className="mt-3 max-w-sm text-sm text-silver/70">
              Verifique se a chave foi digitada corretamente. Certificados são identificados no
              formato ODP-AAAA-XXXXXX.
            </p>
          </>
        )}

        <div className="mt-10 w-full max-w-md">
          <CertificateSearchForm />
        </div>
      </main>
      <Footer projectName={settings.projectName} />
    </>
  );
}

function StatusBadge({ valid, revoked }: { valid: boolean; revoked: boolean }) {
  if (valid) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 shadow-glow">
        <CheckCircle2 size={30} />
      </div>
    );
  }
  if (revoked) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-300 shadow-glow">
        <ShieldAlert size={30} />
      </div>
    );
  }
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/10 text-rose-300 shadow-glow">
      <XCircle size={30} />
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 py-3 last:border-0">
      <span className="text-xs uppercase tracking-wider text-chrome">{label}</span>
      <span
        className={
          highlight
            ? "text-right font-display text-lg tracking-wide text-platinum"
            : "text-right text-sm text-silver"
        }
      >
        {value}
      </span>
    </div>
  );
}
