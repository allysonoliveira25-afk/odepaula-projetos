import { getSiteSettings } from "@/lib/settings";
import PageHeader from "@/components/admin/PageHeader";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Configurações" };

export default async function ConfiguracoesPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <PageHeader title="Configurações" subtitle="Identidade, redes sociais e contato do site" />
      <SettingsForm defaultValues={settings} />
    </div>
  );
}
