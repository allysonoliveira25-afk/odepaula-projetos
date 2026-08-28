import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Habilita o suporte a `getCloudflareContext()` durante `next dev`
// (não afeta o build de produção, só o ambiente local).
initOpenNextCloudflareForDev();

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
