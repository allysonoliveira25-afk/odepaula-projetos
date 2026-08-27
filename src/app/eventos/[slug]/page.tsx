import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import MetallicBackground from "@/components/site/MetallicBackground";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getEvent(slug: string) {
  return prisma.event.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEvent(params.slug);
  if (!event) return { title: "Evento não encontrado" };

  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      images: event.imageUrl ? [{ url: event.imageUrl }] : undefined,
    },
  };
}

export default async function EventoDetalhePage({ params }: { params: { slug: string } }) {
  const [event, settings] = await Promise.all([getEvent(params.slug), getSiteSettings()]);
  if (!event || event.status === "INACTIVE") notFound();

  const finished = event.status === "FINISHED";
  const soldOut = event.status === "SOLD_OUT";

  return (
    <>
      <MetallicBackground />
      <Header projectName={settings.projectName} />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-32 sm:pt-36">
        <Link
          href="/eventos"
          className="focus-ring inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-chrome hover:text-platinum"
        >
          <ArrowLeft size={14} /> Todos os eventos
        </Link>

        <div className="card-metallic mt-6 overflow-hidden rounded-2xl shadow-metal">
          <div className="relative h-56 w-full bg-gradient-to-br from-steel to-graphite sm:h-72">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                sizes="768px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-4xl tracking-wide text-silver/40">
                  O DE PAULA PROGRAM
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-obsidian/90 to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="text-metallic font-display text-4xl tracking-wide sm:text-5xl">
              {event.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-chrome">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} /> {event.location} — {event.city}
              </span>
              {event.time && (
                <span className="flex items-center gap-1.5">
                  <Clock size={15} /> {event.time}
                </span>
              )}
              <span>{formatDate(event.date)}</span>
            </div>

            <p className="mt-6 whitespace-pre-line leading-relaxed text-silver/85">
              {event.description}
            </p>

            {event.registrationUrl && !finished ? (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-platinum px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-obsidian transition-transform hover:-translate-y-0.5"
              >
                Inscrições <ArrowRight size={15} />
              </a>
            ) : (
              <span className="mt-8 inline-flex items-center rounded-full border border-white/15 px-7 py-3.5 text-xs uppercase tracking-wider text-silver/60">
                {finished ? "Evento encerrado" : soldOut ? "Vagas esgotadas" : "Em breve"}
              </span>
            )}
          </div>
        </div>
      </main>
      <Footer projectName={settings.projectName} />
    </>
  );
}
