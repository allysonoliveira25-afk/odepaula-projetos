import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import MetallicBackground from "@/components/site/MetallicBackground";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import EventCard from "@/components/site/EventCard";
import { SectionHeading } from "@/components/site/LinksSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Confira os próximos workshops, aulas e experiências do O De Paula Program.",
};

export default async function EventosPage() {
  const settings = await getSiteSettings();
  const events = await prisma.event.findMany({
    where: { status: { in: ["ACTIVE", "SOLD_OUT"] } },
    orderBy: [{ order: "asc" }, { date: "asc" }],
  });
  const pastEvents = await prisma.event.findMany({
    where: { status: "FINISHED" },
    orderBy: { date: "desc" },
    take: 6,
  });

  return (
    <>
      <MetallicBackground />
      <Header projectName={settings.projectName} />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:pt-36">
        <SectionHeading eyebrow="Agenda" title="Próximos Eventos" />

        {events.length === 0 ? (
          <p className="mt-10 text-center text-silver/70">
            Nenhum evento aberto no momento. Acompanhe nosso Instagram para novidades.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <EventCard
                key={event.id}
                index={i}
                event={{
                  id: event.id,
                  title: event.title,
                  slug: event.slug,
                  description: event.description,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                  city: event.city,
                  imageUrl: event.imageUrl,
                  registrationUrl: event.registrationUrl,
                  status: event.status,
                }}
              />
            ))}
          </div>
        )}

        {pastEvents.length > 0 && (
          <div className="mt-20">
            <SectionHeading eyebrow="Memória" title="Eventos Anteriores" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event, i) => (
                <EventCard
                  key={event.id}
                  index={i}
                  event={{
                    id: event.id,
                    title: event.title,
                    slug: event.slug,
                    description: event.description,
                    date: event.date,
                    time: event.time,
                    location: event.location,
                    city: event.city,
                    imageUrl: event.imageUrl,
                    registrationUrl: event.registrationUrl,
                    status: event.status,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer projectName={settings.projectName} />
    </>
  );
}
