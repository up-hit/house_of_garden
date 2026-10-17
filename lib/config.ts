import { normalizePhone, telHref } from "./whatsapp";

/**
 * Central site configuration, read from NEXT_PUBLIC_* environment variables at build time.
 * See .env.example. NOTE: Next.js only inlines `process.env.NEXT_PUBLIC_X` when it is written
 * out literally, so every variable below is referenced explicitly.
 */

const clean = (v: string | undefined): string => (v ?? "").trim();
const httpUrl = (v: string | undefined): string | undefined => {
  const s = clean(v);
  return /^https?:\/\/\S+$/i.test(s) ? s : undefined;
};

/** Obviously-not-real number used until the real one is configured. */
export const PLACEHOLDER_WHATSAPP = "910000000000";

/** Shown ONLY on preview builds, never in metadata, structured data or maps. */
export const DEMO_ADDRESS =
  "DEMO ONLY — 123 Sample Road, Andheri East, Mumbai, Maharashtra 400069 — NOT A VERIFIED BUSINESS ADDRESS.";

const rawSiteUrl = clean(process.env.NEXT_PUBLIC_SITE_URL).replace(/\/+$/, "");
const siteUrl = /^https:\/\/[^\s/]+\.[^\s/]+/i.test(rawSiteUrl) ? rawSiteUrl : undefined;

const waDigits = clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).replace(/\D/g, "");
const waConfigured = /^[1-9]\d{9,14}$/.test(waDigits);

const phone = clean(process.env.NEXT_PUBLIC_PHONE) || undefined;
const isLive = siteUrl !== undefined;

export const siteConfig = {
  name: "House of Garden",
  shortDescription:
    "Gardening, landscaping, vertical gardens, irrigation and garden supplies for homes, societies, bungalows, offices and hotels across Mumbai.",
  locale: "en_IN",

  /** Verified production origin, e.g. https://www.example.in — undefined on preview builds. */
  siteUrl,
  /** Live = a production domain is configured. Preview builds are noindex and may show demo content. */
  isLive,

  whatsappNumber: waConfigured ? waDigits : PLACEHOLDER_WHATSAPP,
  whatsappConfigured: waConfigured,

  phoneDisplay: phone,
  phoneHref: telHref(phone),
  phoneE164: phone ? normalizePhone(phone) ?? undefined : undefined,

  email: clean(process.env.NEXT_PUBLIC_EMAIL) || undefined,
  address: clean(process.env.NEXT_PUBLIC_ADDRESS) || undefined,

  instagramUrl: httpUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  facebookUrl: httpUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL),
  googleReviewsUrl: httpUrl(process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL),

  /** Optional background email delivery via an external form service (public endpoint URL only). */
  formEndpoint: httpUrl(process.env.NEXT_PUBLIC_FORM_ENDPOINT),

  /** Images in /public/images are illustrations until replaced with real photos. */
  sampleImages: clean(process.env.NEXT_PUBLIC_SAMPLE_IMAGES).toLowerCase() !== "false",

  /** Demo testimonials / demo address appear on previews (or when forced). Never on a normal live build. */
  showDemoContent: !isLive || clean(process.env.NEXT_PUBLIC_SHOW_DEMO_CONTENT).toLowerCase() === "true",
} as const;

export const socialLinks = [
  siteConfig.instagramUrl ? { label: "Instagram", href: siteConfig.instagramUrl, key: "instagram" as const } : null,
  siteConfig.facebookUrl ? { label: "Facebook", href: siteConfig.facebookUrl, key: "facebook" as const } : null,
].filter((x): x is { label: string; href: string; key: "instagram" | "facebook" } => x !== null);
