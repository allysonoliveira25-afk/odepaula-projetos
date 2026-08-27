import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // Protege o endpoint de login contra força bruta
        const ip =
          (req?.headers as Record<string, string> | undefined)?.["x-forwarded-for"] ?? "unknown";
        const limited = rateLimit(`login:${ip}:${parsed.data.email.toLowerCase()}`, {
          limit: 5,
          windowMs: 5 * 60_000,
        });
        if (!limited.success) {
          throw new Error("Muitas tentativas. Tente novamente em alguns minutos.");
        }

        const admin = await prisma.admin.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!admin) return null;

        const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
        if (!valid) return null;

        await prisma.admin.update({
          where: { id: admin.id },
          data: { lastLoginAt: new Date() },
        });

        await prisma.adminLog.create({
          data: { adminId: admin.id, action: "auth.login", ip },
        });

        return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper para obter a sessão do administrador em Server Components,
// Server Actions e API routes (App Router).
export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
