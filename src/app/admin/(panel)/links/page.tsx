import Link from "next/link";
import { PlusCircle, Pencil, GripVertical } from "lucide-react";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmActionButton from "@/components/admin/ConfirmActionButton";
import LinkActiveToggle from "@/components/admin/LinkActiveToggle";
import { deleteLink } from "@/lib/actions/links";
import { getIcon } from "@/lib/icons";

export const dynamic = "force-dynamic";
export const metadata = { title: "Links" };

export default async function AdminLinksPage() {
  const links = await prisma.linkItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Links"
        subtitle={`${links.length} link(s) cadastrado(s) — exibidos na página inicial`}
        action={
          <Link
            href="/admin/links/novo"
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-platinum px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian"
          >
            <PlusCircle size={15} /> Novo link
          </Link>
        }
      />

      <div className="flex flex-col gap-3">
        {links.map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <div
              key={link.id}
              className="card-metallic flex items-center gap-4 rounded-xl px-4 py-3.5"
            >
              <GripVertical size={16} className="shrink-0 text-silver/30" />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-platinum">
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-platinum">{link.title}</p>
                <p className="truncate text-xs text-silver/60">{link.url}</p>
              </div>
              <span className="hidden shrink-0 text-xs text-chrome sm:inline">{link.clicks} cliques</span>
              <LinkActiveToggle id={link.id} active={link.active} />
              <Link
                href={`/admin/links/${link.id}`}
                className="focus-ring flex shrink-0 items-center gap-1 text-xs text-chrome hover:text-platinum"
              >
                <Pencil size={13} /> Editar
              </Link>
              <ConfirmActionButton
                action={deleteLink.bind(null, link.id)}
                confirmMessage="Excluir?"
                variant="danger"
              >
                Excluir
              </ConfirmActionButton>
            </div>
          );
        })}

        {links.length === 0 && (
          <div className="card-metallic rounded-xl px-4 py-8 text-center text-silver/60">
            Nenhum link cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
