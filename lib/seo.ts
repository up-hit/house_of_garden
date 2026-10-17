import type { Metadata } from "next";
import { siteConfig, socialLinks } from "./config";
import { normalizePath } from "./routes";

export const SITE_NAME = siteConfig.name;
export const OG_IMAGE = "/og/og-default.jpg";
export const OG_ALT = "House of Garden: gardening and landscaping services in Mumbai";

/** Absolute URL for a path on the verified production domain, or undefined on preview builds. */
export function absoluteUrl(path: string): string | undefined {
  if (!siteConfig.siteUrl) return undefined;
  const p = normalizePath(path);
  return p === "/" ? `${siteConfig.siteUrl}/` : `${siteConfig.siteUrl}${p}/`;
}

type PageMeta = {
  /** Page title WITHOUT the site name (the layout template appends " | House of Garden"). */
  title: string;
  description: string;
  path: string;
  /** Home page uses an absolute title and does not get the template suffix. */
  absoluteTitle?: boolean;
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, absoluteTitle, noindex }: PageMeta): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const live = siteConfig.isLive && !noindex;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    // Canonical URLs only exist once the verified production domain is configured.
    ...(siteConfig.isLive ? { alternates: { canonical: normalizePath(path) === "/" ? "/" : `${normalizePath(path)}/` } } : {}),
    robots: live ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: siteConfig.locale,
      title: fullTitle,
      description,
      ...(siteConfig.isLive ? { url: absoluteUrl(path) } : {}),
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_ALT }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}

/* ───────────── structured data (only when backed by verified, configured details) ───────────── */

type Json = Record<string, unknown>;

/** LocalBusiness, emitted only on a live build that has at least one verified contact detail. */
export function businessJsonLd(): Json | null {
  if (!siteConfig.isLive || !siteConfig.siteUrl) return null;
  const hasContact = Boolean(siteConfig.phoneE164 || siteConfig.email || siteConfig.whatsappConfigured);
  if (!hasContact) return null;

  const data: Json = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.siteUrl}/#business`,
    name: SITE_NAME,
    url: `${siteConfig.siteUrl}/`,
    image: `${siteConfig.siteUrl}${OG_IMAGE}`,
    description: siteConfig.shortDescription,
    areaServed: { "@type": "City", name: "Mumbai" },
  };
  if (siteConfig.phoneE164) data.telephone = `+${siteConfig.phoneE164}`;
  if (siteConfig.email) data.email = siteConfig.email;
  const sameAs = [
    ...socialLinks.map((s) => s.href),
    ...(siteConfig.googleReviewsUrl ? [siteConfig.googleReviewsUrl] : []),
  ];
  if (sameAs.length) data.sameAs = sameAs;
  // No postal address, rating or review count is ever emitted from placeholder data.
  return data;
}

export function serviceJsonLd(opts: { name: string; description: string; path: string }): Json | null {
  const url = absoluteUrl(opts.path);
  if (!url || !siteConfig.siteUrl) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url,
    areaServed: { "@type": "City", name: "Mumbai" },
    provider: { "@id": `${siteConfig.siteUrl}/#business` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json | null {
  if (!siteConfig.isLive) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]): Json | null {
  if (!siteConfig.isLive || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
