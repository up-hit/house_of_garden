import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/Blocks";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/lib/config";
import { businessJsonLd, SITE_NAME } from "@/lib/seo";
import { themeInitScript } from "@/lib/theme-script";

// Fonts are downloaded at build time and self-hosted by Next.js (no runtime request to Google).
const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl ?? "http://localhost:3000"),
  title: {
    default: `Gardening & Landscaping Services in Mumbai | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: siteConfig.shortDescription,
  applicationName: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  // Preview builds (no NEXT_PUBLIC_SITE_URL) must never be indexed.
  robots: siteConfig.isLive ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1712" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <JsonLd data={businessJsonLd()} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
