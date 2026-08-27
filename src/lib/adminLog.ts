import { prisma } from "@/lib/db";

// Registra uma ação administrativa para fins de auditoria
// (Admin > logs). Nunca deve lançar erro que interrompa a operação
// principal — falhas de log são silenciosamente ignoradas.
export async function logAdminAction(adminId: string | undefined, action: string, detail?: string) {
  try {
    await prisma.adminLog.create({ data: { adminId, action, detail } });
  } catch {
    // best-effort
  }
}
