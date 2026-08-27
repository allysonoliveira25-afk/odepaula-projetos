"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { linkItemSchema } from "@/lib/validation";
import { logAdminAction } from "@/lib/adminLog";

function normalize(formData: FormData) {
  return {
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description") || null,
    icon: formData.get("icon") || "link",
    order: formData.get("order") || 0,
    active: formData.get("active") === "on",
  };
}

export async function createLink(formData: FormData) {
  const session = await requireAdminSession();
  const parsed = linkItemSchema.parse(normalize(formData));
  const link = await prisma.linkItem.create({
    data: { ...parsed, description: parsed.description || null, active: parsed.active ?? true },
  });
  await logAdminAction(session.user.id, "link.create", link.title);
  revalidatePath("/");
  revalidatePath("/admin/links");
  redirect("/admin/links");
}

export async function updateLink(id: string, formData: FormData) {
  const session = await requireAdminSession();
  const parsed = linkItemSchema.parse(normalize(formData));
  await prisma.linkItem.update({
    where: { id },
    data: { ...parsed, description: parsed.description || null },
  });
  await logAdminAction(session.user.id, "link.update", parsed.title);
  revalidatePath("/");
  revalidatePath("/admin/links");
  redirect("/admin/links");
}

export async function deleteLink(id: string) {
  const session = await requireAdminSession();
  const link = await prisma.linkItem.delete({ where: { id } });
  await logAdminAction(session.user.id, "link.delete", link.title);
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function toggleLinkActive(id: string, active: boolean) {
  const session = await requireAdminSession();
  const link = await prisma.linkItem.update({ where: { id }, data: { active } });
  await logAdminAction(session.user.id, "link.toggle", `${link.title} -> ${active}`);
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function reorderLink(id: string, order: number) {
  const session = await requireAdminSession();
  await prisma.linkItem.update({ where: { id }, data: { order } });
  await logAdminAction(session.user.id, "link.reorder", `${id} -> ${order}`);
  revalidatePath("/");
  revalidatePath("/admin/links");
}
