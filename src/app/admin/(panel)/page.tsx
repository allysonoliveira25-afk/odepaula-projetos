import Link from "next/link";
import { prisma } from "@/lib/db";
import { CalendarDays, BadgeCheck, Eye, Link2, PlusCircle } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import PageHeader from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalEvents,
    upcomingEvents,
    totalCertificates,
    certificateViewsAgg,
    activeLinks,
    recentCertificates,
    nextEvents,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { status: "ACTIVE" } }),
    prisma.certificate.count(),
    prisma.certificate.aggregate({ _sum: { viewCount: true } }),
    prisma.linkItem.count({ where: { active: true } }),
    prisma.certificate.findMany({ orderBy: { issuedAt: "desc" }, take: 5 }),
    prisma.event.findMany({
      where: { status: "ACTIVE" },
      orderBy: { date: "asc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Eventos cadastrados", value: totalEvents, icon: CalendarDays },
    { label: "Eventos ativos", value: upcomingEvents, icon: CalendarDays },
    { label: "Certificados emitidos", value: totalCertificates, icon: BadgeCheck },
    { label: "Consultas de certificados", value: certificateViewsAgg._sum.viewCount || 0, icon: Eye },
    { label: "Links ativos", value: activeLinks, icon: Link2 },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Visão geral do O De Paula Program" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card-metallic rounded-xl p-4">
            <s.icon size={18} className="text-chrome" />
            <p className="mt-3 font-display text-3xl text-platinum">{s.value}</p>
            <p className="mt-1 text-xs text-silver/70">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-metallic rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl tracking-wide text-platinum">Próximos eventos</h2>
            <Link href="/admin/eventos/novo" className="focus-ring flex items-center gap-1 text-xs text-chrome hover:text-platinum">
              <PlusCircle size={14} /> Novo
            </Link>
          </div>
          <div className="mt-4 flex flex-col divide-y divide-white/8">
            {nextEvents.length === 0 && <p className="py-4 text-sm text-silver/60">Nenhum evento ativo.</p>}
            {nextEvents.map((e) => (
              <Link
                key={e.id}
                href={`/admin/eventos/${e.id}`}
                className="focus-ring flex items-center justify-between py-3 text-sm hover:text-platinum"
              >
                <span className="truncate text-silver">{e.title}</span>
                <span className="shrink-0 text-xs text-chrome">{formatDateShort(e.date)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card-metallic rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl tracking-wide text-platinum">Certificados recentes</h2>
            <Link href="/admin/certificados/novo" className="focus-ring flex items-center gap-1 text-xs text-chrome hover:text-platinum">
              <PlusCircle size={14} /> Novo
            </Link>
          </div>
          <div className="mt-4 flex flex-col divide-y divide-white/8">
            {recentCertificates.length === 0 && (
              <p className="py-4 text-sm text-silver/60">Nenhum certificado emitido ainda.</p>
            )}
            {recentCertificates.map((c) => (
              <Link
                key={c.id}
                href={`/admin/certificados/${c.id}`}
                className="focus-ring flex items-center justify-between py-3 text-sm hover:text-platinum"
              >
                <span className="truncate text-silver">{c.participantName}</span>
                <span className="shrink-0 text-xs text-chrome">{c.validationKey}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
