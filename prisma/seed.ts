import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

// ------------------------------------------------------------------
// Script de seed: cria o primeiro administrador e as configurações
// iniciais do site. Rode com: npm run db:seed
// Variáveis usadas (definidas no .env): ADMIN_NAME, ADMIN_EMAIL,
// ADMIN_PASSWORD.
// ------------------------------------------------------------------

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const name = process.env.ADMIN_NAME || "Administrador";
  const email = (process.env.ADMIN_EMAIL || "admin@odepaulaprogram.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "TrocarEssaSenha123!";

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD deve ter pelo menos 8 caracteres.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { name, email, passwordHash, role: "admin" },
  });

  console.log(`✔ Administrador pronto: ${admin.email}`);

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      projectName: "O De Paula Program",
      tagline: "Dance • Experience • Movement",
      impactPhrase: "Transformando movimento em experiência.",
      bio: "Projeto de dança contemporânea/urbana — performance, formação e experiências imersivas.",
    },
  });
  console.log("✔ Configurações iniciais do site criadas/verificadas.");

  const linksCount = await prisma.linkItem.count();
  if (linksCount === 0) {
    await prisma.linkItem.createMany({
      data: [
        {
          title: "Instagram",
          url: "https://instagram.com/odepaula.program",
          description: "Acompanhe o dia a dia do projeto",
          icon: "instagram",
          order: 1,
        },
        {
          title: "WhatsApp",
          url: "https://wa.me/5500000000000",
          description: "Fale diretamente conosco",
          icon: "whatsapp",
          order: 2,
        },
        {
          title: "Próximos eventos",
          url: "/eventos",
          description: "Workshops, aulas e experiências",
          icon: "calendar",
          order: 3,
        },
        {
          title: "Consultar certificado",
          url: "/certificados",
          description: "Valide a autenticidade do seu certificado",
          icon: "ticket",
          order: 4,
        },
      ],
    });
    console.log("✔ Links iniciais criados.");
  }

  console.log("\nSeed concluído com sucesso.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
