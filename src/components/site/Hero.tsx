"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Youtube, MessageCircle, Music2, ChevronDown } from "lucide-react";

interface HeroProps {
  projectName: string;
  tagline: string;
  impactPhrase: string;
  bio: string;
  profileImageUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  whatsappNumber?: string | null;
  youtubeUrl?: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero({
  projectName,
  tagline,
  impactPhrase,
  bio,
  profileImageUrl,
  instagramUrl,
  tiktokUrl,
  whatsappNumber,
  youtubeUrl,
}: HeroProps) {
  const socials = [
    instagramUrl && { href: instagramUrl, icon: Instagram, label: "Instagram" },
    tiktokUrl && { href: tiktokUrl, icon: Music2, label: "TikTok" },
    whatsappNumber && {
      href: `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`,
      icon: MessageCircle,
      label: "WhatsApp",
    },
    youtubeUrl && { href: youtubeUrl, icon: Youtube, label: "YouTube" },
  ].filter(Boolean) as { href: string; icon: typeof Instagram; label: string }[];

  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-5 pb-16 pt-28 text-center sm:pt-32">
      <motion.div
        initial="hidden"
        animate="show"
        custom={0}
        variants={fadeUp}
        className="relative"
      >
        <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-silver/40 shadow-glow sm:h-40 sm:w-40">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={projectName}
              fill
              sizes="160px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-steel to-graphite font-display text-4xl text-platinum">
              ODP
            </div>
          )}
        </div>
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="show"
        custom={0.12}
        variants={fadeUp}
        className="text-metallic mt-7 font-display text-5xl leading-none tracking-wide sm:text-7xl"
      >
        {projectName}
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="show"
        custom={0.22}
        variants={fadeUp}
        className="mt-3 text-sm uppercase tracking-[0.35em] text-chrome sm:text-base"
      >
        {tagline}
      </motion.p>

      <motion.p
        initial="hidden"
        animate="show"
        custom={0.32}
        variants={fadeUp}
        className="mt-6 max-w-xl font-display text-2xl italic text-platinum/90 sm:text-3xl"
      >
        &ldquo;{impactPhrase}&rdquo;
      </motion.p>

      {bio && (
        <motion.p
          initial="hidden"
          animate="show"
          custom={0.4}
          variants={fadeUp}
          className="mt-4 max-w-md text-sm leading-relaxed text-silver/80"
        >
          {bio}
        </motion.p>
      )}

      {socials.length > 0 && (
        <motion.div
          initial="hidden"
          animate="show"
          custom={0.5}
          variants={fadeUp}
          className="mt-8 flex items-center gap-3"
        >
          {socials.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="card-metallic focus-ring shine-sweep flex h-11 w-11 items-center justify-center rounded-full text-platinum transition-transform hover:-translate-y-0.5"
            >
              <Icon size={18} />
            </a>
          ))}
        </motion.div>
      )}

      <motion.a
        href="#links"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="focus-ring absolute bottom-6 flex flex-col items-center gap-1 text-chrome"
        aria-label="Rolar para os links"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Explorar</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </motion.a>
    </section>
  );
}
