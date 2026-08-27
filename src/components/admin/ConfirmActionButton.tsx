"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConfirmActionButton({
  action,
  confirmMessage,
  children,
  className,
  variant = "default",
}: {
  action: () => Promise<void> | void;
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "danger";
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-xs text-silver/70">{confirmMessage}</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(async () => {
            await action();
            setConfirming(false);
          })}
          className="focus-ring rounded-full bg-rose-500/20 px-2.5 py-1 text-xs text-rose-200 hover:bg-rose-500/30"
        >
          {pending ? <Loader2 size={12} className="animate-spin" /> : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="focus-ring rounded-full px-2.5 py-1 text-xs text-silver/60 hover:text-platinum"
        >
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={cn(
        "focus-ring text-xs",
        variant === "danger" ? "text-rose-300 hover:text-rose-200" : "text-chrome hover:text-platinum",
        className
      )}
    >
      {children}
    </button>
  );
}
