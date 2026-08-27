"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getIcon } from "@/lib/icons";

export interface PublicLink {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  icon: string;
}

function trackClick(id: string) {
  try {
    const url = `/api/links/${id}/click`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob());
    } else {
      fetch(url, { method: "POST", keepalive: true });
    }
  } catch {
    // métricas nunca devem impedir a navegação do usuário
  }
}

export default function LinksSection({ links }: { links: PublicLink[] }) {
  if (links.length === 0) return null;

  return (
    <section id="links" className="mx-auto max-w-2xl px-5 py-16 sm:py-20">
      <SectionHeading eyebrow="Conecte-se" title="Links" />

      <div className="mt-8 flex flex-col gap-3.5">
        {links.map((link, i) => {
          const Icon = getIcon(link.icon);
          const external = /^https?:\/\//.test(link.url);
          return (
            <motion.a
              key={link.id}
              href={link.url}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              data-link-id={link.id}
              onClick={() => trackClick(link.id)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.4) }}
              className="card-metallic shine-sweep focus-ring group flex items-center gap-4 rounded-2xl px-5 py-4 shadow-metal transition-all hover:-translate-y-0.5 hover:border-white/20 active:translate-y-0"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/15 to-white/0 text-platinum">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate font-semibold text-platinum">{link.title}</span>
                {link.description && (
                  <span className="block truncate text-xs text-silver/70">{link.description}</span>
                )}
              </span>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-chrome transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      <span className="text-xs uppercase tracking-[0.35em] text-chrome">{eyebrow}</span>
      <h2 className="text-metallic mt-1 font-display text-4xl tracking-wide sm:text-5xl">{title}</h2>
      <div className={`mt-4 h-px w-16 bg-metal-line bg-silver/60 ${align === "center" ? "mx-auto" : ""}`} />
    </motion.div>
  );
}
