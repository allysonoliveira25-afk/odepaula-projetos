import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-metal-gradient px-5 text-center">
      <p className="text-metallic font-display text-7xl tracking-wide">404</p>
      <p className="mt-3 text-sm uppercase tracking-[0.3em] text-chrome">Página não encontrada</p>
      <Link
        href="/"
        className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-platinum px-6 py-3 text-xs font-semibold uppercase tracking-wider text-obsidian transition-transform hover:-translate-y-0.5"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
