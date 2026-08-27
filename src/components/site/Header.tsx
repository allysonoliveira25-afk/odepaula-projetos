"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/eventos", label: "Eventos" },
  { href: "/certificados", label: "Certificados" },
  { href: "/contato", label: "Contato" },
];

export default function Header({ projectName }: { projectName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-obsidian/80 backdrop-blur-md shadow-metal" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="focus-ring flex items-center gap-2.5 rounded" onClick={() => setOpen(false)}>
          <LogoMark />
          <span className="font-display text-xl tracking-wide text-platinum">{projectName}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring group relative text-sm uppercase tracking-[0.15em] text-silver transition-colors hover:text-platinum"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-metal-line bg-platinum transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <button
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="focus-ring rounded-full border border-white/10 p-2.5 text-platinum md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 bg-obsidian/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring rounded-lg px-3 py-3 text-base uppercase tracking-wide text-silver transition-colors hover:bg-white/5 hover:text-platinum"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="headerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4f6fb" />
          <stop offset="45%" stopColor="#9ea3ad" />
          <stop offset="55%" stopColor="#c7cad1" />
          <stop offset="100%" stopColor="#4b4e54" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#111214" />
      <path d="M32 10 L48 32 L32 54 L36 32 Z" fill="url(#headerLogoGrad)" />
      <path d="M32 10 L16 32 L32 54 L28 32 Z" fill="url(#headerLogoGrad)" opacity="0.55" />
    </svg>
  );
}
