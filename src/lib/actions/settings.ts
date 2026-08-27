"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { settingsSchema } from "@/lib/validation";
import { logAdminAction } from "@/lib/adminLog";

export async function updateSettings(formData: FormData) {
  const session = await requireAdminSession();

  const parsed = settingsSchema.parse({
    projectName: formData.get("projectName"),
    tagline: formData.get("tagline") || null,
    impactPhrase: formData.get("impactPhrase") || null,
    bio: formData.get("bio") || null,
    logoUrl: formData.get("logoUrl") || null,
    profileImageUrl: formData.get("profileImageUrl") || null,
    instagramUrl: formData.get("instagramUrl") || null,
    tiktokUrl: formData.get("tiktokUrl") || null,
    whatsappNumber: formData.get("whatsappNumber") || null,
    youtubeUrl: formData.get("youtubeUrl") || null,
    contactEmail: formData.get("contactEmail") || null,
  });

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {
      ...parsed,
      tagline: parsed.tagline || "",
      impactPhrase: parsed.impactPhrase || "",
      bio: parsed.bio || "",
      logoUrl: parsed.logoUrl || null,
      profileImageUrl: parsed.profileImageUrl || null,
      instagramUrl: parsed.instagramUrl || null,
      tiktokUrl: parsed.tiktokUrl || null,
      whatsappNumber: parsed.whatsappNumber || null,
      youtubeUrl: parsed.youtubeUrl || null,
      contactEmail: parsed.contactEmail || null,
    },
    create: { id: "main", ...parsed },
  });

  await logAdminAction(session.user.id, "settings.update");
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/contato");
  revalidatePath("/admin/configuracoes");
}
