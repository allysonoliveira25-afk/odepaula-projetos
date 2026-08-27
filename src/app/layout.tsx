import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "O De Paula Program | Dança, Workshops e Experiências",
    template: "%s | O De Paula Program",
  },
  description:
    "O De Paula Program — projeto de dança contemporânea/urbana. Workshops, eventos, experiências imersivas e emissão de certificados oficiais.",
  keywords: [
    "O De Paula Program",
    "dança",
    "dança contemporânea",
    "dança urbana",
    "workshop de dança",
    "certificado de dança",
    "eventos de dança",
  ],
  authors: [{ name: "O De Paula Program" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "O De Paula Program",
    title: "O De Paula Program | Dança, Workshops e Experiências",
    description: "Transformando movimento em experiência. Conheça o projeto, eventos e certificados.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "O De Paula Program" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "O De Paula Program | Dança, Workshops e Experiências",
    description: "Transformando movimento em experiência.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bebas.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-obsidian font-body antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
