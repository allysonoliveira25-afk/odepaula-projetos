import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmActionButton from "@/components/admin/ConfirmActionButton";
import EventStatusSelect from "@/components/admin/EventStatusSelect";
import { deleteEvent } from "@/lib/actions/events";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Eventos" };

export default async function AdminEventosPage() {
  const events = await prisma.event.findMany({ orderBy: [{ order: "asc" }, { date: "desc" }] });

  return (
    <div>
      <PageHeader
        title="Eventos"
        subtitle={`${events.length} evento(s) cadastrado(s)`}
        action={
          <Link
            href="/admin/eventos/novo"
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-platinum px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian"
          >
            <PlusCircle size={15} /> Novo evento
          </Link>
        }
      />

      <div className="card-metallic overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-chrome">
                <th className="px-4 py-3">Evento</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Cidade</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-platinum">{event.title}</td>
                  <td className="px-4 py-3 text-silver/80">{formatDateShort(event.date)}</td>
                  <td className="px-4 py-3 text-silver/80">{event.city}</td>
                  <td className="px-4 py-3">
                    <EventStatusSelect id={event.id} status={event.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/eventos/${event.id}`}
                        className="focus-ring flex items-center gap-1 text-xs text-chrome hover:text-platinum"
                      >
                        <Pencil size={13} /> Editar
                      </Link>
                      <ConfirmActionButton
                        action={deleteEvent.bind(null, event.id)}
                        confirmMessage="Excluir evento?"
                        variant="danger"
                      >
                        Excluir
                      </ConfirmActionButton>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-silver/60">
                    Nenhum evento cadastrado ainda.
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
