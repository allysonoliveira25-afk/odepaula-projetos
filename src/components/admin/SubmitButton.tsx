"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="focus-ring mt-1 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-platinum px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian transition-transform hover:-translate-y-0.5 disabled:opacity-60"
    >
      {pending ? "Salvando..." : label}
    </button>
  );
}
