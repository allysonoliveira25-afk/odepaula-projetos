"use client";

import { useState } from "react";
import SubmitButton from "./SubmitButton";

export interface EventDefaults {
  title?: string;
  description?: string;
  date?: string; // yyyy-mm-dd
  time?: string | null;
  location?: string;
  city?: string;
  imageUrl?: string | null;
  registrationUrl?: string | null;
  status?: string;
  order?: number;
}

export default function EventForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues?: EventDefaults;
}) {
  const [error, setError] = useState("");

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
      <Field label="Título" name="title" defaultValue={defaultValues?.title} required />
      <TextArea label="Descrição" name="description" defaultValue={defaultValues?.description} required />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Data" name="date" type="date" defaultValue={defaultValues?.date} required />
        <Field label="Horário" name="time" placeholder="19h às 22h" defaultValue={defaultValues?.time ?? ""} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Local" name="location" defaultValue={defaultValues?.location} required />
        <Field label="Cidade" name="city" defaultValue={defaultValues?.city} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="URL da imagem"
          name="imageUrl"
          placeholder="https://..."
          defaultValue={defaultValues?.imageUrl ?? ""}
        />
        <Field
          label="Link de inscrição"
          name="registrationUrl"
          placeholder="https://..."
          defaultValue={defaultValues?.registrationUrl ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-xs uppercase tracking-wider text-chrome">Status</span>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? "ACTIVE"}
            className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum"
          >
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
            <option value="SOLD_OUT">Esgotado</option>
            <option value="FINISHED">Encerrado</option>
          </select>
        </label>
        <Field
          label="Ordem de exibição"
          name="order"
          type="number"
          defaultValue={String(defaultValues?.order ?? 0)}
        />
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      <SubmitButton label="Salvar evento" />
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
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs uppercase tracking-wider text-chrome">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={4}
        className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum"
      />
    </label>
  );
}
