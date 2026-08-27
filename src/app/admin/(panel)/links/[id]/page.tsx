import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import LinkForm from "@/components/admin/LinkForm";
import { updateLink } from "@/lib/actions/links";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar Link" };

export default async function EditarLinkPage({ params }: { params: { id: string } }) {
  const link = await prisma.linkItem.findUnique({ where: { id: params.id } });
  if (!link) notFound();

  const updateWithId = updateLink.bind(null, link.id);

  return (
    <div>
      <PageHeader title="Editar link" subtitle={link.title} />
      <LinkForm
        action={updateWithId}
        defaultValues={{
          title: link.title,
          url: link.url,
          description: link.description,
          icon: link.icon,
          order: link.order,
          active: link.active,
        }}
      />
    </div>
  );
}
