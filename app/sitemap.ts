import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { ALL_PATHS } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

// Required so `output: "export"` can write sitemap.xml at build time.
export const dynamic = "force-static";

/**
 * Lists every real page. On preview builds (no NEXT_PUBLIC_SITE_URL) the sitemap is empty,
 * because there is no verified domain to put in it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.isLive) return [];
  return ALL_PATHS.map((path) => ({ url: absoluteUrl(path) as string }));
}
