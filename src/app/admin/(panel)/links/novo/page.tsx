import PageHeader from "@/components/admin/PageHeader";
import LinkForm from "@/components/admin/LinkForm";
import { createLink } from "@/lib/actions/links";

export const metadata = { title: "Novo Link" };

export default function NovoLinkPage() {
  return (
    <div>
      <PageHeader title="Novo link" subtitle="Adicione um link à página inicial" />
      <LinkForm action={createLink} />
    </div>
  );
}
