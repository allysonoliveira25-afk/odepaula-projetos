export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Gera um slug amigável de URL a partir de um texto (ex: título de evento).
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Gera uma chave de validação única no formato ODP-AAAA-XXXXXX
export function generateValidationKey(year?: number): string {
  const y = year ?? new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem caracteres ambíguos (0,O,1,I)
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ODP-${y}-${code}`;
}

// Gera um número sequencial de certificado (usado como exibição amigável)
export function formatCertificateNumber(sequence: number): string {
  return sequence.toString().padStart(6, "0");
}

// Interpreta uma data "somente-dia" no formato "AAAA-MM-DD" (como a enviada
// por um <input type="date">) como meio-dia UTC. Isso evita um bug clássico
// de fuso horário: se fosse interpretada como meia-noite UTC, ao formatar no
// fuso do site (America/Sao_Paulo, UTC-3) o dia exibido "voltaria" para o
// dia anterior. Meio-dia UTC garante o mesmo dia calendário em qualquer
// fuso razoável de exibição.
export function parseDateOnly(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match) return new Date(value);
  const [, y, m, d] = match;
  return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0));
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
    ...opts,
  }).format(d);
}

// Retorna dia/mês(abreviado)/ano separadamente — útil para selos de data em
// cards (ex.: badge "28 / SET / 2026"). Evita fazer parsing de string sobre
// a saída de formatDateShort (que no formato pt-BR inclui "de" entre as
// partes, ex.: "28 de set. de 2026", e por isso não pode ser dividida
// ingenuamente por espaço).
export function getDateParts(date: Date | string): { day: string; month: string; year: string } {
  const d = typeof date === "string" ? new Date(date) : date;
  const parts = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).formatToParts(d);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: get("day"),
    month: get("month").replace(".", "").toUpperCase(),
    year: get("year"),
  };
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  })
    .format(d)
    .toUpperCase()
    .replace(".", "");
}

// Máscara simples para exibir CPF/documento parcialmente (privacidade)
export function maskDocument(doc?: string | null): string | null {
  if (!doc) return null;
  const digits = doc.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `***.***.${digits.slice(-6, -2)}-${digits.slice(-2)}`.length > 4
    ? `**${digits.slice(-4)}`
    : digits;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
