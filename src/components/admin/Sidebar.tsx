"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Link2,
  BadgeCheck,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/links", label: "Links", icon: Link2 },
  { href: "/admin/certificados", label: "Certificados", icon: BadgeCheck },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-graphite/60 p-4">
      <div className="mb-6 px-2">
        <p className="font-display text-xl tracking-wide text-platinum">O De Paula</p>
        <p className="text-xs uppercase tracking-widest text-chrome">Painel Administrativo</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white/10 text-platinum"
                  : "text-silver/70 hover:bg-white/5 hover:text-platinum"
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="focus-ring flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-chrome hover:text-platinum"
        >
          <ExternalLink size={14} /> Ver site
        </Link>
        <p className="truncate px-3 pt-3 text-xs text-silver/60">{adminName}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="focus-ring mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10"
        >
          <LogOut size={14} /> Sair
        </button>
      </div>
    </aside>
  );
}
