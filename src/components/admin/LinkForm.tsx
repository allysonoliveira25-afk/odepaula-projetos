"use client";

import { useState } from "react";
import { ICON_OPTIONS, getIcon } from "@/lib/icons";
import SubmitButton from "./SubmitButton";

export interface LinkDefaults {
  title?: string;
  url?: string;
  description?: string | null;
  icon?: string;
  order?: number;
  active?: boolean;
}

export default function LinkForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: LinkDefaults;
}) {
  const [icon, setIcon] = useState(defaultValues?.icon ?? "link");
  const [error, setError] = useState("");
  const PreviewIcon = getIcon(icon);

  return (
    <form
      action={async (formData) => {
        setError("");
        try {
          await action(formData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Erro ao salvar. Verifique os campos.");
        }
      }}
      className="card-metallic flex flex-col gap-4 rounded-2xl p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Título" name="title" defaultValue={defaultValues?.title} required />
        <Field label="URL" name="url" placeholder="https://... ou /eventos" defaultValue={defaultValues?.url} required />
      </div>

      <Field
        label="Descrição (opcional)"
        name="description"
        defaultValue={defaultValues?.description ?? ""}
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-xs uppercase tracking-wider text-chrome">Ícone</span>
          <select
            name="icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm capitalize text-platinum"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wider text-chrome">Prévia</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-platinum">
            <PreviewIcon size={20} />
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Ordem de exibição"
          name="order"
          type="number"
          defaultValue={String(defaultValues?.order ?? 0)}
        />
        <label className="flex items-center gap-2.5 pt-6 text-sm text-silver">
          <input
            type="checkbox"
            name="active"
            defaultChecked={defaultValues?.active ?? true}
            className="h-4 w-4 rounded border-white/20 bg-white/5"
          />
          Link ativo (visível no site)
        </label>
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      <SubmitButton label="Salvar link" />
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
