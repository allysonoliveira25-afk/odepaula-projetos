import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import MetallicBackground from "@/components/site/MetallicBackground";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import ContactSection from "@/components/site/ContactSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com o O De Paula Program pelo WhatsApp, Instagram, e-mail ou formulário.",
};

export default async function ContatoPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <MetallicBackground />
      <Header projectName={settings.projectName} />
      <main className="pb-10 pt-32 sm:pt-36">
        <ContactSection
          whatsappNumber={settings.whatsappNumber}
          instagramUrl={settings.instagramUrl}
          contactEmail={settings.contactEmail}
        />
      </main>
      <Footer projectName={settings.projectName} />
    </>
  );
}
