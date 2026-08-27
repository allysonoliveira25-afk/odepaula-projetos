"use client";

import { useState } from "react";
import { Instagram, Mail, MessageCircle, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionHeading } from "./LinksSection";

interface ContactSectionProps {
  whatsappNumber?: string | null;
  instagramUrl?: string | null;
  contactEmail?: string | null;
}

type Status = "idle" | "sending" | "success" | "error";

export default function ContactSection({
  whatsappNumber,
  instagramUrl,
  contactEmail,
}: ContactSectionProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Não foi possível enviar sua mensagem.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro inesperado.");
    }
  }

  return (
    <section id="contato" className="mx-auto max-w-4xl px-5 py-16 sm:py-20">
      <SectionHeading eyebrow="Fale conosco" title="Contato" />

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card-metallic shine-sweep focus-ring flex items-center gap-3 rounded-xl px-5 py-4 text-platinum transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle size={18} className="text-chrome" /> WhatsApp
            </a>
          )}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-metallic shine-sweep focus-ring flex items-center gap-3 rounded-xl px-5 py-4 text-platinum transition-transform hover:-translate-y-0.5"
            >
              <Instagram size={18} className="text-chrome" /> Instagram
            </a>
          )}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="card-metallic shine-sweep focus-ring flex items-center gap-3 rounded-xl px-5 py-4 text-platinum transition-transform hover:-translate-y-0.5"
            >
              <Mail size={18} className="text-chrome" /> {contactEmail}
            </a>
          )}
        </div>

        <form onSubmit={handleSubmit} className="card-metallic flex flex-col gap-3.5 rounded-2xl p-5 sm:p-6">
          {/* honeypot anti-spam — invisível para humanos */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            aria-hidden="true"
          />

          <Field label="Nome" name="name" type="text" required />
          <Field label="E-mail" name="email" type="email" required />
          <Field label="WhatsApp" name="whatsapp" type="tel" />
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-xs uppercase tracking-wider text-chrome">Mensagem</span>
            <textarea
              name="message"
              required
              rows={4}
              className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum placeholder:text-silver/40"
              placeholder="Conte um pouco sobre o que você procura..."
            />
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="focus-ring mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-platinum px-6 py-3 text-xs font-semibold uppercase tracking-wider text-obsidian transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {status === "sending" ? "Enviando..." : (
              <>
                Enviar mensagem <Send size={14} />
              </>
            )}
          </button>

          {status === "success" && (
            <p className="flex items-center gap-1.5 text-sm text-emerald-300">
              <CheckCircle2 size={15} /> Mensagem enviada! Retornaremos em breve.
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-1.5 text-sm text-rose-300">
              <AlertCircle size={15} /> {errorMsg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs uppercase tracking-wider text-chrome">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum placeholder:text-silver/40"
      />
    </label>
  );
}
