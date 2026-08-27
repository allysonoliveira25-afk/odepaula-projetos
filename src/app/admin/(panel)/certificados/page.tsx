import Link from "next/link";
import { PlusCircle, Eye } from "lucide-react";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Certificados" };

export default async function AdminCertificadosPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { issuedAt: "desc" },
    include: { event: { select: { title: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Certificados"
        subtitle={`${certificates.length} certificado(s) emitido(s)`}
        action={
          <Link
            href="/admin/certificados/novo"
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-platinum px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian"
          >
            <PlusCircle size={15} /> Gerar certificado
          </Link>
        }
      />

      <div className="card-metallic overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-chrome">
                <th className="px-4 py-3">Participante</th>
                <th className="px-4 py-3">Curso / Evento</th>
                <th className="px-4 py-3">Chave</th>
                <th className="px-4 py-3">Emitido em</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-platinum">{c.participantName}</td>
                  <td className="px-4 py-3 text-silver/80">{c.event?.title || c.courseName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-chrome">{c.validationKey}</td>
                  <td className="px-4 py-3 text-silver/80">{formatDateShort(c.issuedAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        c.status === "VALID"
                          ? "rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300"
                          : "rounded-full bg-rose-500/15 px-3 py-1 text-xs text-rose-300"
                      }
                    >
                      {c.status === "VALID" ? "Válido" : "Revogado"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/certificados/${c.id}`}
                      className="focus-ring inline-flex items-center gap-1 text-xs text-chrome hover:text-platinum"
                    >
                      <Eye size={13} /> Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {certificates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-silver/60">
                    Nenhum certificado emitido ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
