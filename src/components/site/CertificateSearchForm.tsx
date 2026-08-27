"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function CertificateSearchForm({ initialValue = "" }: { initialValue?: string }) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const key = value.trim().toUpperCase();
    if (!key) return;
    router.push(`/certificados/${encodeURIComponent(key)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="ODP-2026-A7K92X"
        aria-label="Chave do certificado"
        className="focus-ring card-metallic w-full rounded-full px-5 py-3.5 text-center text-sm uppercase tracking-widest text-platinum placeholder:text-silver/30 sm:text-left"
      />
      <button
        type="submit"
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-platinum px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-obsidian transition-transform hover:-translate-y-0.5"
      >
        <Search size={15} /> Consultar Certificado
      </button>
    </form>
  );
}
