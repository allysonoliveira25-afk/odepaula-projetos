// ------------------------------------------------------------------
// Rate limiting simples em memória (por processo).
// Suficiente para um único servidor Node. Para múltiplas instâncias
// em produção, substitua por um armazenamento compartilhado (ex.:
// Redis / Upstash) mantendo a mesma interface.
//
// IMPORTANTE: a limpeza dos buckets expirados NÃO pode usar
// `setInterval` no escopo do módulo. Na Cloudflare Workers, o escopo
// global de um Worker roda uma única vez na inicialização, fora de
// qualquer requisição, e temporizadores (setTimeout/setInterval) são
// uma operação proibida nesse escopo — o Worker lança
// "Disallowed operation called within global scope" e o script
// inteiro falha ao carregar (derrubando TODAS as rotas, não só o
// login, já que este módulo é importado por src/lib/auth.ts). Por
// isso a limpeza é feita de forma preguiçosa, dentro da própria
// chamada de rateLimit(), no máximo uma vez por minuto.
// ------------------------------------------------------------------

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

let lastSweepAt = 0;

function sweepExpiredBuckets(now: number) {
  if (now - lastSweepAt < 60_000) return;
  lastSweepAt = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  { limit = 10, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  sweepExpiredBuckets(now);
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { success: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

// Extrai um identificador razoável do cliente a partir dos headers da requisição
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
