"use client";

import { useState } from "react";
import { updateSettings } from "@/lib/actions/settings";
import SubmitButton from "./SubmitButton";

interface SettingsDefaults {
  projectName: string;
  tagline: string;
  impactPhrase: string;
  bio: string;
  logoUrl?: string | null;
  profileImageUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  whatsappNumber?: string | null;
  youtubeUrl?: string | null;
  contactEmail?: string | null;
}

export default function SettingsForm({ defaultValues }: { defaultValues: SettingsDefaults }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <form
      action={async (formData) => {
        setError("");
        setSuccess(false);
        try {
          await updateSettings(formData);
          setSuccess(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Erro ao salvar configurações.");
        }
      }}
      className="card-metallic flex max-w-2xl flex-col gap-4 rounded-2xl p-5 sm:p-6"
    >
      <h2 className="font-display text-xl tracking-wide text-platinum">Identidade</h2>
      <Field label="Nome do projeto" name="projectName" defaultValue={defaultValues.projectName} required />
      <Field label="Tagline" name="tagline" defaultValue={defaultValues.tagline} placeholder="Dance • Experience • Movement" />
      <Field label="Frase de impacto" name="impactPhrase" defaultValue={defaultValues.impactPhrase} />
      <TextArea label="Bio curta" name="bio" defaultValue={defaultValues.bio} />

      <h2 className="mt-2 font-display text-xl tracking-wide text-platinum">Imagens</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="URL da foto de perfil" name="profileImageUrl" defaultValue={defaultValues.profileImageUrl ?? ""} placeholder="https://..." />
        <Field label="URL do logo" name="logoUrl" defaultValue={defaultValues.logoUrl ?? ""} placeholder="https://..." />
      </div>

      <h2 className="mt-2 font-display text-xl tracking-wide text-platinum">Redes sociais e contato</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Instagram (URL)" name="instagramUrl" defaultValue={defaultValues.instagramUrl ?? ""} placeholder="https://instagram.com/..." />
        <Field label="TikTok (URL)" name="tiktokUrl" defaultValue={defaultValues.tiktokUrl ?? ""} placeholder="https://tiktok.com/@..." />
        <Field label="YouTube (URL)" name="youtubeUrl" defaultValue={defaultValues.youtubeUrl ?? ""} placeholder="https://youtube.com/..." />
        <Field label="WhatsApp (somente números, com DDI)" name="whatsappNumber" defaultValue={defaultValues.whatsappNumber ?? ""} placeholder="5511999999999" />
        <Field label="E-mail de contato" name="contactEmail" type="email" defaultValue={defaultValues.contactEmail ?? ""} />
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}
      {success && <p className="text-sm text-emerald-300">Configurações salvas com sucesso.</p>}

      <SubmitButton label="Salvar configurações" />
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs uppercase tracking-wider text-chrome">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum placeholder:text-silver/30"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs uppercase tracking-wider text-chrome">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum"
      />
    </label>
  );
}
