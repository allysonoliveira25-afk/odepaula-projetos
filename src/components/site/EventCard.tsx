"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { getDateParts } from "@/lib/utils";

export interface PublicEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string | Date;
  time?: string | null;
  location: string;
  city: string;
  imageUrl?: string | null;
  registrationUrl?: string | null;
  status: string;
}

export default function EventCard({ event, index = 0 }: { event: PublicEvent; index?: number }) {
  const { day, month, year } = getDateParts(event.date);
  const soldOut = event.status === "SOLD_OUT";
  const finished = event.status === "FINISHED";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.4) }}
      className="card-metallic shine-sweep group overflow-hidden rounded-2xl shadow-metal transition-transform hover:-translate-y-1"
    >
      <Link
        href={`/eventos/${event.slug}`}
        className="focus-ring relative block h-44 w-full overflow-hidden bg-gradient-to-br from-steel to-graphite"
      >
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-3xl tracking-wide text-silver/40">O DE PAULA</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-obsidian/90 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-col items-center rounded-lg border border-white/15 bg-obsidian/70 px-3 py-1.5 text-center backdrop-blur-sm">
          <span className="font-display text-xl leading-none text-platinum">{day}</span>
          <span className="text-[10px] uppercase tracking-wider text-chrome">{month} {year}</span>
        </div>
        {(soldOut || finished) && (
          <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-obsidian/80 px-3 py-1 text-[10px] uppercase tracking-wider text-silver">
            {soldOut ? "Esgotado" : "Encerrado"}
          </span>
        )}
      </Link>

      <div className="p-5">
        <Link href={`/eventos/${event.slug}`} className="focus-ring">
          <h3 className="font-display text-2xl tracking-wide text-platinum hover:text-white">
            {event.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm text-silver/75">{event.description}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-chrome">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {event.location} — {event.city}
          </span>
          {event.time && (
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> {event.time}
            </span>
          )}
        </div>

        {event.registrationUrl && !finished ? (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-5 inline-flex items-center gap-1.5 rounded-full bg-platinum px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian transition-transform hover:-translate-y-0.5"
          >
            Inscrições <ArrowRight size={14} />
          </a>
        ) : (
          <span className="mt-5 inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-xs uppercase tracking-wider text-silver/60">
            {finished ? "Evento encerrado" : soldOut ? "Vagas esgotadas" : "Em breve"}
          </span>
        )}
      </div>
    </motion.article>
  );
}
