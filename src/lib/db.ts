import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// ------------------------------------------------------------------
// Prisma Client singleton, usando o driver adapter do node-postgres.
// Isso evita depender do binário nativo (query engine) da Prisma em
// tempo de execução — funciona bem em ambientes serverless/edge
// (Vercel) e não exige download de binários no build.
// ------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não definida. Copie .env.example para .env e configure o banco de dados."
    );
  }

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      max: 10,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
