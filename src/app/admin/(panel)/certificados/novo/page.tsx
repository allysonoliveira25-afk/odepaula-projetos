import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import CertificateForm from "@/components/admin/CertificateForm";
import { createCertificate } from "@/lib/actions/certificates";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gerar Certificado" };

export default async function NovoCertificadoPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    select: { id: true, title: true },
  });

  return (
    <div>
      <PageHeader title="Gerar certificado" subtitle="Uma chave única de validação será criada automaticamente" />
      <CertificateForm action={createCertificate} events={events} />
    </div>
  );
}
