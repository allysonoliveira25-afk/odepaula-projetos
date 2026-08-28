import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// ------------------------------------------------------------------
// Prisma Client, usando o driver adapter do node-postgres. Isso evita
// depender do binário nativo (query engine) da Prisma em tempo de
// execução — funciona bem em ambientes serverless/edge (Vercel,
// Cloudflare Workers) e não exige download de binários no build.
//
// Coisas importantes sobre COMO a conexão é criada aqui:
//
// 1) A conexão real só é criada na primeira consulta ao banco (via
//    Proxy abaixo), nunca no momento em que este arquivo é importado.
//    O Next.js importa este módulo durante a etapa de build
//    ("Collecting page data") mesmo para rotas que nunca chegam a
//    consultar o banco nesse momento — se a conexão fosse criada aqui
//    no topo do arquivo, o build falharia sempre que a string de
//    conexão não estivesse disponível no ambiente de build.
//
// 2) Na Cloudflare Workers, a conexão passa pelo Hyperdrive (binding
//    "HYPERDRIVE" configurado no wrangler.jsonc) em vez de conectar
//    direto no Postgres. O Worker não lida bem com socket bruto de
//    Postgres indo direto pra internet; o Hyperdrive resolve isso
//    (e de quebra faz pooling/cache). Em qualquer outra plataforma
//    (ex: Vercel) ou em desenvolvimento local, usa DATABASE_URL
//    normalmente.
//
// 3) Fora do modo de desenvolvimento local, o client NÃO é guardado
//    num singleton global para ser reaproveitado entre requisições —
//    a Cloudflare Workers proíbe reaproveitar, numa requisição nova,
//    uma conexão aberta durante o atendimento de uma requisição
//    anterior. Cada requisição abre sua própria conexão (barato
//    quando passa pelo Hyperdrive, que já mantém o pool de verdade).
// ------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

type HyperdriveEnv = { HYPERDRIVE?: { connectionString?: string } };

function resolveConnectionString(): string {
  try {
    const ctx = getCloudflareContext();
    const env = ctx?.env as HyperdriveEnv | undefined;
    if (env?.HYPERDRIVE?.connectionString) {
      return env.HYPERDRIVE.connectionString;
    }
  } catch {
    // Não está rodando dentro do runtime da Cloudflare (build, ou
    // hospedado em outra plataforma) — cai no DATABASE_URL abaixo.
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não definida. Copie .env.example para .env e configure o banco de dados."
    );
  }
  return connectionString;
}

function createPrismaClient(): PrismaClient {
  const connectionString = resolveConnectionString();

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

// Nomes reais que existem num PrismaClient gerado a partir do nosso
// schema.prisma (os "delegates" de cada model, em camelCase, mais os
// métodos utilitários que começam com "$"). Qualquer outra propriedade
// lida no objeto `prisma` (ex: "toJSON", "then", símbolos internos)
// NÃO é uma consulta de verdade — normalmente é alguma sondagem
// genérica feita pelo próprio React/Next.js ao tentar serializar
// dados (por exemplo, ao montar a resposta ou ao registrar um erro).
// Se deixássemos essas sondagens também criarem uma conexão nova com
// o banco, o erro de verdade ficava escondido atrás de um crash
// secundário na hora de serializar. Por isso o Proxy abaixo só reage
// a esta lista.
const PRISMA_DELEGATE_KEYS = new Set<string>([
  "admin",
  "adminLog",
  "event",
  "linkItem",
  "certificate",
  "contactMessage",
  "siteSettings",
  "$transaction",
  "$connect",
  "$disconnect",
  "$queryRaw",
  "$queryRawUnsafe",
  "$executeRaw",
  "$executeRawUnsafe",
  "$extends",
  "$use",
  "$on",
]);

// Proxy "preguiçoso": por fora se comporta exatamente como um
// PrismaClient normal (prisma.event.findMany(), prisma.$transaction(),
// etc.), mas só instancia a conexão de verdade no momento do uso real.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (typeof prop !== "string" || !PRISMA_DELEGATE_KEYS.has(prop)) {
      return undefined;
    }
    const client = getPrismaClient();
    const value = (client as unknown as Record<string, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
