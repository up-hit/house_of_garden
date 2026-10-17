import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

// Required so `output: "export"` can write robots.txt at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Preview/staging builds block all crawlers; only a build with a verified production domain is crawlable.
  if (!siteConfig.isLive || !siteConfig.siteUrl) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
