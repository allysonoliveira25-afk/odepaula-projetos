"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EventCard, { type PublicEvent } from "./EventCard";
import { SectionHeading } from "./LinksSection";

export default function EventsSection({ events }: { events: PublicEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section id="eventos" className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <SectionHeading eyebrow="Agenda" title="Próximos Eventos" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/eventos"
          className="focus-ring inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-silver transition-colors hover:text-platinum"
        >
          Ver todos os eventos <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
