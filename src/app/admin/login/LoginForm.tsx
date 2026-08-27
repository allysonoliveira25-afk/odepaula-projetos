"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, LogIn } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push(searchParams.get("callbackUrl") || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5">
      <label className="flex flex-col gap-1.5 text-left">
        <span className="text-xs uppercase tracking-wider text-chrome">E-mail</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-left">
        <span className="text-xs uppercase tracking-wider text-chrome">Senha</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="focus-ring rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-platinum"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="focus-ring mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-platinum px-6 py-3 text-xs font-semibold uppercase tracking-wider text-obsidian transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {loading ? "Entrando..." : (
          <>
            Entrar <LogIn size={14} />
          </>
        )}
      </button>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-rose-300">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </form>
  );
}
