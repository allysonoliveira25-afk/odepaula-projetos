"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { eventSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import { logAdminAction } from "@/lib/adminLog";

function normalize(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    time: formData.get("time") || null,
    location: formData.get("location"),
    city: formData.get("city"),
    imageUrl: formData.get("imageUrl") || null,
    registrationUrl: formData.get("registrationUrl") || null,
    status: formData.get("status") || "ACTIVE",
    order: formData.get("order") || 0,
  };
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const baseSlug = slugify(base) || "evento";
  let slug = baseSlug;
  let i = 1;
  // Garante unicidade do slug (usado nas URLs públicas de eventos)
  while (
    await prisma.event.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    i += 1;
    slug = `${baseSlug}-${i}`;
  }
  return slug;
}

export async function createEvent(formData: FormData) {
  const session = await requireAdminSession();
  const parsed = eventSchema.parse(normalize(formData));
  const slug = await uniqueSlug(parsed.title);

  const event = await prisma.event.create({
    data: { ...parsed, slug, imageUrl: parsed.imageUrl || null, registrationUrl: parsed.registrationUrl || null },
  });

  await logAdminAction(session.user.id, "event.create", event.title);
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos");
}

export async function updateEvent(id: string, formData: FormData) {
  const session = await requireAdminSession();
  const parsed = eventSchema.parse(normalize(formData));

  const current = await prisma.event.findUnique({ where: { id } });
  if (!current) throw new Error("Evento não encontrado.");

  const slug = current.title === parsed.title ? current.slug : await uniqueSlug(parsed.title, id);

  await prisma.event.update({
    where: { id },
    data: { ...parsed, slug, imageUrl: parsed.imageUrl || null, registrationUrl: parsed.registrationUrl || null },
  });

  await logAdminAction(session.user.id, "event.update", parsed.title);
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos");
}

export async function deleteEvent(id: string) {
  const session = await requireAdminSession();
  const event = await prisma.event.delete({ where: { id } });
  await logAdminAction(session.user.id, "event.delete", event.title);
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");
}

export async function toggleEventStatus(id: string, status: string) {
  const session = await requireAdminSession();
  const event = await prisma.event.update({ where: { id }, data: { status: status as never } });
  await logAdminAction(session.user.id, "event.status", `${event.title} -> ${status}`);
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");
}

export async function reorderEvent(id: string, order: number) {
  const session = await requireAdminSession();
  await prisma.event.update({ where: { id }, data: { order } });
  await logAdminAction(session.user.id, "event.reorder", `${id} -> ${order}`);
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");
}
