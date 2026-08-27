import Link from "next/link";

export default function Footer({ projectName }: { projectName: string }) {
  return (
    <footer className="border-t border-white/10 px-5 py-8 text-center">
      <p className="font-display text-lg tracking-wide text-silver">{projectName}</p>
      <p className="mt-1 text-xs text-chrome">
        © {new Date().getFullYear()} {projectName}. Todos os direitos reservados.
      </p>
      <div className="mt-3 flex justify-center gap-5 text-xs text-chrome">
        <Link href="/certificados" className="focus-ring hover:text-platinum">
          Consultar certificado
        </Link>
        <Link href="/admin/login" className="focus-ring hover:text-platinum">
          Área administrativa
        </Link>
      </div>
    </footer>
  );
}
