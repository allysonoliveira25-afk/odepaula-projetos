"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { certificateSchema } from "@/lib/validation";
import { generateValidationKey, formatCertificateNumber } from "@/lib/utils";
import { logAdminAction } from "@/lib/adminLog";

function normalize(formData: FormData) {
  return {
    participantName: formData.get("participantName"),
    participantDocument: formData.get("participantDocument") || null,
    courseName: formData.get("courseName"),
    workload: formData.get("workload"),
    instructor: formData.get("instructor"),
    eventDate: formData.get("eventDate"),
    location: formData.get("location") || null,
    notes: formData.get("notes") || null,
    eventId: formData.get("eventId") || null,
  };
}

async function uniqueValidationKey(): Promise<string> {
  let key = generateValidationKey();
  // Colisão é extremamente improvável (32^6 combinações por ano), mas
  // verificamos mesmo assim antes de persistir.
  while (await prisma.certificate.findUnique({ where: { validationKey: key } })) {
    key = generateValidationKey();
  }
  return key;
}

export async function createCertificate(formData: FormData) {
  const session = await requireAdminSession();
  const parsed = certificateSchema.parse(normalize(formData));

  const [sequence, validationKey] = await Promise.all([
    prisma.certificate.count(),
    uniqueValidationKey(),
  ]);

  const certificate = await prisma.certificate.create({
    data: {
      ...parsed,
      participantDocument: parsed.participantDocument || null,
      location: parsed.location || null,
      notes: parsed.notes || null,
      eventId: parsed.eventId || null,
      certificateNumber: formatCertificateNumber(sequence + 1),
      validationKey,
    },
  });

  await logAdminAction(session.user.id, "certificate.create", certificate.validationKey);
  revalidatePath("/admin/certificados");
  redirect(`/admin/certificados/${certificate.id}`);
}

export async function revokeCertificate(id: string, reason: string) {
  const session = await requireAdminSession();
  const certificate = await prisma.certificate.update({
    where: { id },
    data: { status: "REVOKED", revokedAt: new Date(), revokedReason: reason || null },
  });
  await logAdminAction(session.user.id, "certificate.revoke", certificate.validationKey);
  revalidatePath("/admin/certificados");
  revalidatePath(`/certificados/${certificate.validationKey}`);
}

export async function reinstateCertificate(id: string) {
  const session = await requireAdminSession();
  const certificate = await prisma.certificate.update({
    where: { id },
    data: { status: "VALID", revokedAt: null, revokedReason: null },
  });
  await logAdminAction(session.user.id, "certificate.reinstate", certificate.validationKey);
  revalidatePath("/admin/certificados");
  revalidatePath(`/certificados/${certificate.validationKey}`);
}

export async function deleteCertificate(id: string) {
  const session = await requireAdminSession();
  const certificate = await prisma.certificate.delete({ where: { id } });
  await logAdminAction(session.user.id, "certificate.delete", certificate.validationKey);
  revalidatePath("/admin/certificados");
}
