import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// ------------------------------------------------------------------
// Prisma Client singleton, usando o driver adapter do node-postgres.
// Isso evita depender do binário nativo (query engine) da Prisma em
// tempo de execução — funciona bem em ambientes serverless/edge
// (Vercel, Cloudflare Workers) e não exige download de binários no
// build.
//
// IMPORTANTE: a conexão real só é criada na primeira consulta ao
// banco (via Proxy abaixo), nunca no momento em que este arquivo é
// importado. Next.js importa este módulo durante a etapa de build
// ("Collecting page data") mesmo para rotas que nunca chegam a
// consultar o banco nesse momento — se a conexão fosse criada aqui
// no topo do arquivo, o build falharia sempre que a variável
// DATABASE_URL não estivesse disponível no ambiente de build
// (que é diferente do ambiente de execução em algumas plataformas,
// como a Cloudflare).
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

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Proxy "preguiçoso": por fora se comporta exatamente como um
// PrismaClient normal (prisma.event.findMany(), prisma.$transaction(),
// etc.), mas só instancia a conexão de verdade no primeiro uso real.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client as object, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
