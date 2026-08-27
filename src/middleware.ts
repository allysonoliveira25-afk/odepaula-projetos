import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// ------------------------------------------------------------------
// Protege toda a área /admin (exceto /admin/login) exigindo uma
// sessão válida de administrador. As rotas de API administrativas
// (/api/admin/*) também passam por aqui.
// ------------------------------------------------------------------
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    pages: { signIn: "/admin/login" },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)", "/api/admin/:path*"],
};
