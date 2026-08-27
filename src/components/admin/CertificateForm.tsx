"use client";

import { useState } from "react";
import SubmitButton from "./SubmitButton";

export default function CertificateForm({
  action,
  events,
}: {
  action: (formData: FormData) => void;
  events: { id: string; title: string }[];
}) {
  const [error, setError] = useState("");

  return (
    <form
      action={async (formData) => {
        setError("");
        try {
          await action(formData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Erro ao gerar certificado. Verifique os campos.");
        }
      }}
      className="card-metallic flex flex-col gap-4 rounded-2xl p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome completo do participante" name="participantName" required />
        <Field label="CPF ou identificador (opcional)" name="participantDocument" />
      </div>

      <label className="flex flex-col gap-1.5 text-left">
        <span className="text-xs uppercase tracking-wider text-chrome">Evento vinculado (opcional)</span>
        <select
          name="eventId"
          className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum"
          defaultValue=""
        >
          <option value="">Nenhum — informar manualmente abaixo</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </label>

      <Field label="Curso / Workshop / Evento" name="courseName" required placeholder="Ex: Workshop de Dança Urbana" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Carga horária" name="workload" required placeholder="Ex: 8 horas" />
        <Field label="Data" name="eventDate" type="date" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Professor(a) / Instrutor(a)" name="instructor" required />
        <Field label="Local" name="location" placeholder="Ex: São Paulo — SP" />
      </div>

      <label className="flex flex-col gap-1.5 text-left">
        <span className="text-xs uppercase tracking-wider text-chrome">Observações (opcional, uso interno)</span>
        <textarea
          name="notes"
          rows={3}
          className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum"
        />
      </label>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      <SubmitButton label="Gerar certificado" />
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs uppercase tracking-wider text-chrome">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum placeholder:text-silver/30"
      />
    </label>
  );
}
