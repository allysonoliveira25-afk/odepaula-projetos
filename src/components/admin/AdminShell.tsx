"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-obsidian text-platinum">
      <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
        <div className="hidden md:block">
          <Sidebar adminName={adminName} />
        </div>

        <div className="flex items-center justify-between border-b border-white/10 bg-graphite/60 px-4 py-3 md:hidden">
          <p className="font-display text-lg tracking-wide">O De Paula Admin</p>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            className="focus-ring rounded-lg border border-white/10 p-2"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 max-w-[80%]">
              <Sidebar adminName={adminName} />
            </div>
          </div>
        )}

        <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
