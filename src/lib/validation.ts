import { z } from "zod";
import { parseDateOnly } from "@/lib/utils";

// ------------------------------------------------------------------
// Schemas de validação (zod) — usados em todas as API routes para
// validar e sanitizar dados de entrada antes de tocar no banco.
// ------------------------------------------------------------------

export const eventStatusEnum = z.enum(["ACTIVE", "INACTIVE", "SOLD_OUT", "FINISHED"]);

// Datas "somente-dia" (vindas de <input type="date">) — ver parseDateOnly
// para o porquê de não usar z.coerce.date() diretamente aqui.
const dateOnly = z
  .string()
  .trim()
  .min(1, "Data obrigatória")
  .regex(/^\d{4}-\d{2}-\d{2}/, "Data em formato inválido")
  .transform(parseDateOnly);

export const eventSchema = z.object({
  title: z.string().trim().min(3, "Título muito curto").max(160),
  description: z.string().trim().min(1, "Descrição obrigatória").max(4000),
  date: dateOnly,
  time: z.string().trim().max(60).optional().nullable(),
  location: z.string().trim().min(1, "Local obrigatório").max(200),
  city: z.string().trim().min(1, "Cidade obrigatória").max(120),
  imageUrl: z.string().trim().url().max(500).optional().nullable().or(z.literal("")),
  registrationUrl: z.string().trim().url().max(500).optional().nullable().or(z.literal("")),
  status: eventStatusEnum.optional(),
  order: z.coerce.number().int().optional(),
});

export const linkItemSchema = z.object({
  title: z.string().trim().min(1, "Título obrigatório").max(120),
  url: z.string().trim().min(1, "URL obrigatória").max(500),
  description: z.string().trim().max(300).optional().nullable().or(z.literal("")),
  icon: z.string().trim().min(1).max(60).default("link"),
  order: z.coerce.number().int().optional(),
  active: z.coerce.boolean().optional(),
});

export const certificateSchema = z.object({
  participantName: z.string().trim().min(3, "Nome muito curto").max(200),
  participantDocument: z.string().trim().max(40).optional().nullable().or(z.literal("")),
  courseName: z.string().trim().min(1, "Curso/evento obrigatório").max(200),
  workload: z.string().trim().min(1, "Carga horária obrigatória").max(60),
  instructor: z.string().trim().min(1, "Instrutor obrigatório").max(200),
  eventDate: dateOnly,
  location: z.string().trim().max(200).optional().nullable().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().nullable().or(z.literal("")),
  eventId: z.string().trim().max(60).optional().nullable().or(z.literal("")),
});

export const certificateRevokeSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(150),
  email: z.string().trim().email("E-mail inválido").max(200),
  whatsapp: z.string().trim().max(30).optional().nullable().or(z.literal("")),
  message: z.string().trim().min(10, "Mensagem muito curta").max(3000),
  // honeypot: campo invisível que humanos não preenchem
  website: z.string().max(0).optional().or(z.literal("")),
});

export const settingsSchema = z.object({
  projectName: z.string().trim().min(1).max(120),
  tagline: z.string().trim().max(160).optional().nullable().or(z.literal("")),
  impactPhrase: z.string().trim().max(200).optional().nullable().or(z.literal("")),
  bio: z.string().trim().max(600).optional().nullable().or(z.literal("")),
  logoUrl: z.string().trim().url().max(500).optional().nullable().or(z.literal("")),
  profileImageUrl: z.string().trim().url().max(500).optional().nullable().or(z.literal("")),
  instagramUrl: z.string().trim().url().max(300).optional().nullable().or(z.literal("")),
  tiktokUrl: z.string().trim().url().max(300).optional().nullable().or(z.literal("")),
  whatsappNumber: z.string().trim().max(30).optional().nullable().or(z.literal("")),
  youtubeUrl: z.string().trim().url().max(300).optional().nullable().or(z.literal("")),
  contactEmail: z.string().trim().email().max(200).optional().nullable().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const validateKeySchema = z.object({
  key: z
    .string()
    .trim()
    .toUpperCase()
    .min(6)
    .max(40)
    .regex(/^[A-Z0-9-]+$/, "Chave em formato inválido"),
});

export type EventInput = z.infer<typeof eventSchema>;
export type LinkItemInput = z.infer<typeof linkItemSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
