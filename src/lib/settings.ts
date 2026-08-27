import { prisma } from "@/lib/db";

// Retorna as configurações do site, criando o registro padrão na
// primeira execução caso ainda não exista (garante que a home nunca
// quebre por falta de configuração inicial).
export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  if (settings) return settings;

  return prisma.siteSettings.create({
    data: { id: "main" },
  });
}
