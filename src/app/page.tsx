import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import MetallicBackground from "@/components/site/MetallicBackground";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import LinksSection from "@/components/site/LinksSection";
import EventsSection from "@/components/site/EventsSection";
import ContactSection from "@/components/site/ContactSection";
import Footer from "@/components/site/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, links, events] = await Promise.all([
    getSiteSettings(),
    prisma.linkItem.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.event.findMany({
      where: { status: { in: ["ACTIVE", "SOLD_OUT"] } },
      orderBy: [{ order: "asc" }, { date: "asc" }],
      take: 3,
    }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PerformingGroup",
    name: settings.projectName,
    description: settings.bio,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    image: settings.profileImageUrl || undefined,
    sameAs: [settings.instagramUrl, settings.tiktokUrl, settings.youtubeUrl].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MetallicBackground />
      <Header projectName={settings.projectName} />
      <main>
        <Hero
          projectName={settings.projectName}
          tagline={settings.tagline}
          impactPhrase={settings.impactPhrase}
          bio={settings.bio}
          profileImageUrl={settings.profileImageUrl}
          instagramUrl={settings.instagramUrl}
          tiktokUrl={settings.tiktokUrl}
          whatsappNumber={settings.whatsappNumber}
          youtubeUrl={settings.youtubeUrl}
        />
        <LinksSection
          links={links.map((l) => ({
            id: l.id,
            title: l.title,
            url: l.url,
            description: l.description,
            icon: l.icon,
          }))}
        />
        <EventsSection
          events={events.map((e) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            description: e.description,
            date: e.date,
            time: e.time,
            location: e.location,
            city: e.city,
            imageUrl: e.imageUrl,
            registrationUrl: e.registrationUrl,
            status: e.status,
          }))}
        />
        <ContactSection
          whatsappNumber={settings.whatsappNumber}
          instagramUrl={settings.instagramUrl}
          contactEmail={settings.contactEmail}
        />
      </main>
      <Footer projectName={settings.projectName} />
    </>
  );
}
