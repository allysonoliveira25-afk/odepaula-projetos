import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import MetallicBackground from "@/components/site/MetallicBackground";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CertificateSearchForm from "@/components/site/CertificateSearchForm";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Consulta de Certificados",
  description:
    "Digite a chave de validação do certificado do O De Paula Program para verificar sua autenticidade.",
};

export default async function CertificadosPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <MetallicBackground />
      <Header projectName={settings.projectName} />
      <main className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-5 pb-16 pt-32 text-center sm:pt-36">
        <div className="card-metallic flex h-16 w-16 items-center justify-center rounded-full text-platinum shadow-glow">
          <ShieldCheck size={28} />
        </div>
        <h1 className="text-metallic mt-6 font-display text-4xl tracking-wide sm:text-5xl">
          Consulta de Certificados
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-silver/75">
          Digite a chave de validação do certificado para verificar sua autenticidade junto ao{" "}
          {settings.projectName}.
        </p>

        <CertificateSearchForm />

        <p className="mt-6 text-xs text-chrome">
          A chave de validação está impressa no certificado, no formato{" "}
          <span className="text-silver">ODP-2026-A7K92X</span>.
        </p>
      </main>
      <Footer projectName={settings.projectName} />
    </>
  );
}
