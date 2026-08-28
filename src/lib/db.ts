import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// ------------------------------------------------------------------
// Prisma Client, usando o driver adapter do node-postgres. Isso evita
// depender do binário nativo (query engine) da Prisma em tempo de
// execução — funciona bem em ambientes serverless/edge (Vercel,
// Cloudflare Workers) e não exige download de binários no build.
//
// Duas coisas importantes sobre COMO a conexão é criada aqui:
//
// 1) A conexão real só é criada na primeira consulta ao banco (via
//    Proxy abaixo), nunca no momento em que este arquivo é importado.
//    O Next.js importa este módulo durante a etapa de build
//    ("Collecting page data") mesmo para rotas que nunca chegam a
//    consultar o banco nesse momento — se a conexão fosse criada aqui
//    no topo do arquivo, o build falharia sempre que a variável
//    DATABASE_URL não estivesse disponível no ambiente de build
//    (que é diferente do ambiente de execução em algumas plataformas,
//    como a Cloudflare).
//
// 2) Fora do modo de desenvolvimento local, o client NÃO é guardado
//    num singleton global para ser reaproveitado entre requisições.
//    Isso é obrigatório na Cloudflare Workers: o runtime proíbe usar,
//    numa requisição nova, uma conexão (socket) que foi aberta durante
//    o atendimento de uma requisição anterior — dá erro em tempo de
//    execução. Cada requisição abre sua própria conexão.
// ------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não definida. Copie .env.example para .env e configure o banco de dados."
    );
  }

  const pool = new Pool({
    connectionString,
    max: process.env.NODE_ENV === "development" ? 10 : 3,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrismaClient(): PrismaClient {
  // Em desenvolvimento local, reaproveita entre recarregamentos a
  // quente (hot reload) do Next.js — não tem o problema de I/O entre
  // requisições que existe no Worker da Cloudflare.
  if (process.env.NODE_ENV === "development") {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    return globalForPrisma.prisma;
  }

  return createPrismaClient();
}

// Proxy "preguiçoso": por fora se comporta exatamente como um
// PrismaClient normal (prisma.event.findMany(), prisma.$transaction(),
// etc.), mas só instancia a conexão de verdade no momento do uso real.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
