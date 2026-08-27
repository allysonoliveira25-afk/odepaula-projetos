"use client";

import { useTransition } from "react";
import { toggleEventStatus } from "@/lib/actions/events";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  SOLD_OUT: "Esgotado",
  FINISHED: "Encerrado",
};

export default function EventStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => toggleEventStatus(id, e.target.value))}
      className="focus-ring rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-silver disabled:opacity-60"
    >
      {Object.entries(STATUS_LABEL).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
