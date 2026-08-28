import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login Administrativo",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-metal-gradient px-5">
      <div className="card-metallic w-full max-w-sm rounded-2xl p-8 shadow-metal">
        <p className="text-center font-display text-2xl tracking-wide text-platinum">O De Paula Program</p>
        <p className="mt-1 text-center text-xs uppercase tracking-widest text-chrome">
          Painel Administrativo
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
