"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldOff, ShieldCheck, Trash2, Loader2 } from "lucide-react";
import { revokeCertificate, reinstateCertificate, deleteCertificate } from "@/lib/actions/certificates";

export default function CertificateActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const [showRevoke, setShowRevoke] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();

  if (status === "VALID") {
    return (
      <div className="flex flex-col gap-2">
        {showRevoke ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motivo (opcional)"
              className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-platinum"
            />
            <button
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await revokeCertificate(id, reason);
                  router.refresh();
                })
              }
              className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-full bg-rose-500/20 px-4 py-2 text-xs text-rose-200"
            >
              {pending ? <Loader2 size={13} className="animate-spin" /> : "Confirmar revogação"}
            </button>
            <button onClick={() => setShowRevoke(false)} className="focus-ring text-xs text-silver/60">
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowRevoke(true)}
            className="focus-ring inline-flex w-fit items-center gap-1.5 rounded-full border border-rose-400/30 px-4 py-2 text-xs text-rose-300 hover:bg-rose-500/10"
          >
            <ShieldOff size={14} /> Revogar certificado
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        disabled={pending}
        onClick={() => startTransition(async () => {
          await reinstateCertificate(id);
          router.refresh();
        })}
        className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 px-4 py-2 text-xs text-emerald-300 hover:bg-emerald-500/10"
      >
        <ShieldCheck size={14} /> Reativar certificado
      </button>
      <DeleteButton id={id} />
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-xs text-silver/70">Excluir permanentemente?</span>
        <button
          disabled={pending}
          onClick={() => startTransition(async () => {
            await deleteCertificate(id);
            router.push("/admin/certificados");
          })}
          className="focus-ring rounded-full bg-rose-500/20 px-3 py-1.5 text-xs text-rose-200"
        >
          {pending ? <Loader2 size={13} className="animate-spin" /> : "Confirmar"}
        </button>
        <button onClick={() => setConfirming(false)} className="focus-ring text-xs text-silver/60">
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs text-silver/70 hover:text-rose-300"
    >
      <Trash2 size={14} /> Excluir
    </button>
  );
}
