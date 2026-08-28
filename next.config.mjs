import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Habilita o suporte a `getCloudflareContext()` durante `next dev`.
// IMPORTANTE: só pode rodar em desenvolvimento local — em produção
// (`next build`) essa função tenta emular os bindings da Cloudflare
// (como o Hyperdrive) usando uma conexão local, o que quebra o build.
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    // O otimizador de imagens embutido do Next não roda no Workers da
    // Cloudflare; as imagens continuam sendo exibidas normalmente, só
    // sem o redimensionamento automático do Next.
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
