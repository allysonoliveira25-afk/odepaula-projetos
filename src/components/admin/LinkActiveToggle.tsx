"use client";

import { useTransition } from "react";
import { toggleLinkActive } from "@/lib/actions/links";
import { cn } from "@/lib/utils";

export default function LinkActiveToggle({ id, active }: { id: string; active: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleLinkActive(id, !active))}
      className={cn(
        "focus-ring rounded-full px-3 py-1 text-xs transition-colors disabled:opacity-60",
        active ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-silver/60"
      )}
    >
      {active ? "Ativo" : "Inativo"}
    </button>
  );
}
