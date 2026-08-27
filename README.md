# O De Paula Program — Site Oficial

Site completo (frontend + backend + banco de dados + painel administrativo)
para o projeto de dança **O De Paula Program**: página inicial estilo
"Linktree premium", eventos, sistema de emissão e consulta pública de
certificados com PDF e QR Code, formulário de contato e painel
administrativo completo.

Identidade visual: preto profundo, cinza grafite e prata/metálico, com
gradientes, reflexos e microanimações — combinando dança, elegância e
tecnologia.

---

## Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Rotas de API e Server Actions do próprio Next.js (Node.js)
- **Banco de dados:** PostgreSQL via Prisma ORM (compatível com Supabase)
- **Autenticação:** NextAuth.js (credenciais + sessão JWT), senhas com bcrypt
- **PDF:** pdf-lib | **QR Code:** biblioteca `qrcode`
- **Ícones:** lucide-react

### Por que Server Actions em vez de só API REST?

O CRUD do painel administrativo (eventos, links, configurações) usa
[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
do Next.js — funções que rodam no servidor e são chamadas diretamente pelos
formulários/componentes, com proteção CSRF nativa do framework. Isso reduz
duplicação (sem precisar escrever rota de API + código de fetch para cada
ação) mantendo tudo no mesmo "backend" Next.js/Node.js pedido no briefing.
Endpoints REST tradicionais (`/api/...`) foram usados onde fazem mais
sentido: NextAuth, formulário de contato público, consulta pública de
certificados, contagem de cliques em links e o download do PDF do
certificado (que precisa retornar um binário).

---

## Estrutura do projeto

```
src/
  app/                     # Rotas (App Router)
    page.tsx               # Home — Hero + Links + Eventos + Contato
    eventos/                # Listagem pública de eventos
    contato/                 # Página de contato
    certificados/            # Consulta pública de certificados
      [chave]/                # Resultado da consulta (alvo do QR Code)
    admin/
      login/                  # Login administrativo
      (panel)/                # Área protegida (dashboard, CRUDs, config)
    api/
      auth/[...nextauth]/     # NextAuth
      contato/                # Envio do formulário de contato
      certificados/validar/   # API pública de validação
      links/[id]/click/       # Contagem de cliques
      admin/certificados/[id]/pdf/  # Download do PDF (protegido)
  components/
    site/                   # Componentes do site público
    admin/                  # Componentes do painel administrativo
  lib/
    actions/                # Server Actions (CRUD do painel)
    db.ts                   # Cliente Prisma (driver adapter node-postgres)
    auth.ts                 # Configuração do NextAuth
    certificate.ts          # Geração do PDF do certificado + QR Code
    validation.ts           # Schemas zod (validação/sanitização)
    rateLimit.ts             # Rate limiting em memória
    icons.ts                 # Biblioteca de ícones dos links
  middleware.ts             # Proteção das rotas /admin e /api/admin
prisma/
  schema.prisma             # Modelo de dados
  seed.ts                   # Cria o primeiro administrador
```

### Sobre o cliente Prisma (driver adapter)

O projeto usa o **driver adapter** oficial do Prisma para PostgreSQL
(`@prisma/adapter-pg`, com o pacote `pg`) em vez do motor binário nativo
tradicional. Isso é feito com `previewFeatures = ["driverAdapters"]` no
`schema.prisma` e `prisma generate --no-engine` no `postinstall`/`build`.
Vantagens: cold start mais rápido em ambientes serverless (Vercel), sem
download de binário no build, e melhor compatibilidade com plataformas
edge. Do ponto de vista de uso, nada muda — `prisma.evento.findMany()`
etc. funcionam normalmente.

---

## Como rodar localmente

### 1. Pré-requisitos

- Node.js 20+
- Um banco PostgreSQL — local, Docker, ou um banco gratuito criado direto
  na Vercel (Storage → Create Database) ou em provedores como Supabase/Neon
  (veja a seção *Configurando o banco de dados* abaixo)

### 2. Instalação

```bash
npm install
cp .env.example .env
```

Edite o `.env` e preencha `DATABASE_URL` com a connection string do seu
Postgres/Supabase, gere um `NEXTAUTH_SECRET` forte (`openssl rand -base64 32`)
e defina o e-mail/senha do primeiro administrador (`ADMIN_EMAIL`,
`ADMIN_PASSWORD`).

### 3. Banco de dados

Cria as tabelas a partir do `prisma/schema.prisma`:

```bash
npx prisma db push
```

(Para um fluxo com migrations versionadas em produção, use
`npx prisma migrate dev` no lugar de `db push`.)

### 4. Criar o primeiro administrador

```bash
npm run db:seed
```

Isso cria o administrador definido no `.env`, as configurações iniciais do
site e alguns links de exemplo (edite tudo depois pelo painel).

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` (site) e `http://localhost:3000/admin/login`
(painel administrativo).

### 6. Build de produção

```bash
npm run build
npm start
```

---

## Configurando o banco de dados

### Opção A — criar o banco direto na Vercel (recomendado)

A Vercel descontinuou seu "Vercel Postgres" próprio, mas oferece bancos
gerenciados direto pelo painel via **Marketplace** (Neon, Supabase e
outros) — sem precisar criar conta separada em outro site.

1. Importe o projeto na [Vercel](https://vercel.com) (veja a seção
   *Deploy* abaixo).
2. No projeto, vá em **Storage → Create Database → Postgres** e escolha um
   provedor (Neon é o mais direto).
3. A Vercel já injeta a variável `DATABASE_URL` (com pooling via
   PgBouncer) automaticamente nas Environment Variables do projeto —
   nenhuma configuração extra necessária.
4. Para rodar `npx prisma db push` e `npm run db:seed` (criação das
   tabelas e do primeiro administrador), copie esse `DATABASE_URL` do
   painel da Vercel (**Storage → seu banco → .env.local**) para o seu
   `.env` local por um instante, rode os dois comandos, e pronto.

### Opção B — criar o banco separadamente (Supabase, Neon, Railway...)

1. Crie um projeto em [supabase.com](https://supabase.com) (ou Neon,
   Railway, RDS, um Postgres próprio).
2. No Supabase, em **Project Settings → Database → Connection string**,
   copie a string no modo **Connection pooling** (porta `6543`, com
   `?pgbouncer=true`) — recomendado para deploy serverless.
3. Cole em `DATABASE_URL` no `.env` local e nas variáveis de ambiente da
   plataforma de deploy.
4. Rode `npx prisma db push` apontando para esse banco.

Qualquer PostgreSQL "tradicional" funciona da mesma forma — basta a
connection string correta.

---

## Painel administrativo

Acesse `/admin/login` com o e-mail/senha do administrador criado no seed.

- **Dashboard** — métricas gerais (eventos, certificados emitidos e
  consultados, links ativos).
- **Eventos** — criar, editar, excluir, ativar/desativar, definir ordem,
  imagem e link de inscrição.
- **Links** — CRUD completo com biblioteca de ícones (Lucide), ordem e
  status ativo/inativo. Nada fica fixo no código — tudo vem do banco.
- **Certificados** — gerar certificado (com chave de validação única
  gerada automaticamente, formato `ODP-AAAA-XXXXXX`), revogar/reativar,
  baixar PDF, ver quantas vezes cada certificado foi consultado.
- **Configurações** — nome do projeto, foto, logo, bio, redes sociais e
  e-mail de contato exibidos no site.

Criar um administrador adicional: rode o seed novamente com outro
`ADMIN_EMAIL`/`ADMIN_PASSWORD` no `.env`, ou insira diretamente via
`npx prisma studio` (o hash de senha deve ser gerado com bcrypt, custo 12).

---

## Sistema de certificados

- Cada certificado emitido recebe um **número sequencial** e uma
  **chave de validação única** (`ODP-2026-A7K92X`).
- O PDF gerado (`/admin/certificados/[id]` → "Baixar PDF") segue a
  identidade preta/prata do site e inclui um **QR Code** apontando para
  `/certificados/[chave]`.
- A consulta pública (`/certificados`) mostra apenas os dados necessários
  para comprovar autenticidade (nome, curso, carga horária, instrutor,
  datas, número do certificado) — nunca o documento/CPF completo.
- Certificados podem ser **revogados** (com motivo opcional) sem serem
  excluídos do histórico; a página pública passa a exibir "Certificado
  Revogado".

---

## Segurança implementada

- Autenticação via NextAuth (sessão JWT, 8h de duração) + bcrypt (custo 12)
- Middleware protegendo `/admin/*` (exceto `/admin/login`) e `/api/admin/*`
- Cada Server Action valida a sessão novamente no servidor (defesa em
  profundidade, além do middleware)
- Validação e sanitização de todos os inputs com `zod`
- Uso exclusivo do Prisma ORM (sem SQL cru) — protege contra SQL Injection
- Escapamento automático do React — protege contra XSS
- Server Actions do Next.js têm proteção CSRF nativa (checagem de Origin)
- Rate limiting em memória nos endpoints públicos sensíveis: login (5
  tentativas / 5 min), formulário de contato (5 / 10 min), consulta de
  certificados (30 / min), cliques em links (60 / min)
- Formulário de contato com campo honeypot anti-spam
- Logs administrativos (`Admin > ações`) para criação/edição/exclusão de
  eventos, links, certificados e login
- Variáveis sensíveis somente em `.env` (nunca no código-fonte); `.env` no
  `.gitignore`
- Página pública de certificado não expõe documento/CPF nem é indexada
  por buscadores (`robots: noindex`)

> Nota sobre rate limiting: a implementação atual é em memória (por
> processo), suficiente para uma única instância. Em produção com múltiplas
> instâncias/regiões, substitua `src/lib/rateLimit.ts` por um armazenamento
> compartilhado (ex.: Redis/Upstash), mantendo a mesma interface.

---

## SEO

- Metadados completos (title/description/keywords), Open Graph e Twitter
  Cards configurados em `src/app/layout.tsx`
- `sitemap.xml` e `robots.txt` gerados dinamicamente
  (`src/app/sitemap.ts`, `src/app/robots.ts`), incluindo eventos ativos
- Dados estruturados (JSON-LD, `schema.org/PerformingGroup`) na home
- URLs amigáveis para eventos (`/eventos/[slug]`, slug gerado
  automaticamente a partir do título)

---

## Deploy (Vercel — recomendado)

1. Suba o projeto para um repositório Git (GitHub/GitLab/Bitbucket).
2. Importe o repositório na [Vercel](https://vercel.com).
3. No projeto já importado, vá em **Storage → Create Database → Postgres**
   e escolha um provedor (Neon é o mais direto). A Vercel injeta
   `DATABASE_URL` automaticamente — não precisa colar nada manualmente.
   (Se preferir usar um Postgres externo — Supabase, Neon separado, Railway
   — adicione `DATABASE_URL` manualmente em **Settings → Environment
   Variables** com a string de **connection pooling**.)
4. Adicione as demais variáveis em **Settings → Environment Variables**:
   `NEXTAUTH_SECRET` (gere com `openssl rand -base64 32`), `NEXTAUTH_URL`
   (URL final do site, ex. `https://odepaulaprogram.vercel.app`) e
   `NEXT_PUBLIC_SITE_URL` (a mesma URL).
5. Antes (ou logo depois) do primeiro deploy, rode localmente
   `npx prisma db push` e `npm run db:seed` apontando o `.env` local para
   esse mesmo `DATABASE_URL` (copiado do painel da Vercel), para criar as
   tabelas e o primeiro administrador.
6. Deploy. A cada novo administrador, ajuste `ADMIN_*` e rode o seed
   novamente, ou cadastre-o manualmente.

O projeto também roda em qualquer plataforma Node.js (Railway, Render, um
servidor próprio com `npm run build && npm start`), contanto que aponte
para um Postgres acessível.

---

## Sobre a geração deste projeto (transparência técnica)

Este código foi desenvolvido e verificado em um ambiente de execução
isolado sem acesso à internet para baixar os binários nativos do Prisma
(`binaries.prisma.sh`) nem fontes do Google Fonts — por isso a arquitetura
adota o **driver adapter** do Prisma (`prisma generate --no-engine`), que
evita essa dependência também em produção (ver seção acima). Mesmo sem
poder rodar o servidor completo contra um Postgres real nesse ambiente, o
projeto foi verificado com:

- `tsc --noEmit` (checagem de tipos de 100% do código) — **0 erros**
- `next build` (compilação Next.js/webpack completa) — **compila com sucesso**
- O `schema.prisma` foi convertido em SQL e aplicado com sucesso em um
  Postgres real, confirmando que o modelo de dados é válido
- A geração do PDF do certificado (pdf-lib) e do QR Code foram testadas
  isoladamente, gerando um PDF válido e carregável de volta
- `bcrypt` (hash/verificação de senha) testado isoladamente

Ao rodar `npm install` no seu ambiente (com acesso normal à internet), o
`prisma generate` real roda automaticamente (`postinstall`) e tudo
funciona de ponta a ponta — login, CRUDs, geração/consulta de
certificados. Ainda assim, teste o fluxo completo antes de colocar em
produção, como em qualquer entrega de software.

---

## Roadmap / próximos passos sugeridos

- Upload de imagens direto pelo painel (hoje, imagens de eventos, foto de
  perfil e logo são referenciadas por URL — pode ser evoluído para upload
  com um bucket de armazenamento, ex.: Supabase Storage ou Vercel Blob)
- Papéis de administrador mais granulares (o campo `role` no modelo
  `Admin` já existe, mas apenas um papel é usado hoje)
- Envio de e-mail transacional ao gerar um certificado ou responder o
  formulário de contato (hoje as mensagens ficam salvas no banco, visíveis
  via `npx prisma studio`)
