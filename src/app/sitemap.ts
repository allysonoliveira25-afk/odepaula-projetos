import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/eventos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/certificados`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contato`, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const events = await prisma.event.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    });
    const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
      url: `${siteUrl}/eventos/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
    return [...staticRoutes, ...eventRoutes];
  } catch {
    return staticRoutes;
  }
}
