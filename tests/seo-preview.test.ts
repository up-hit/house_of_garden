import assert from "node:assert/strict";
import { describe, it } from "node:test";

// config.ts reads process.env when first imported, so each environment scenario lives in its own file
// (node --test runs every file in a separate process).
delete process.env.NEXT_PUBLIC_SITE_URL;
delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

describe("preview build (no NEXT_PUBLIC_SITE_URL)", () => {
  it("is noindex, has no canonical, no structured data, and shows demo content", async () => {
    const config = await import("../lib/config");
    const seo = await import("../lib/seo");
    assert.equal(config.siteConfig.isLive, false);
    assert.equal(config.siteConfig.showDemoContent, true);
    assert.equal(config.siteConfig.whatsappConfigured, false);
    assert.equal(config.siteConfig.whatsappNumber, config.PLACEHOLDER_WHATSAPP);
    const m = seo.pageMetadata({ title: "X", description: "Y", path: "/contact/" });
    assert.deepEqual(m.robots, { index: false, follow: false });
    assert.equal(m.alternates, undefined);
    assert.equal(seo.businessJsonLd(), null);
    assert.equal(seo.breadcrumbJsonLd([{ name: "Home", path: "/" }]), null);
    assert.equal(seo.faqJsonLd([{ q: "a", a: "b" }]), null);
    assert.equal(seo.serviceJsonLd({ name: "n", description: "d", path: "/x/" }), null);
    assert.equal(seo.absoluteUrl("/contact/"), undefined);
  });
  it("sitemap is empty and robots.txt blocks everything", async () => {
    const sitemap = (await import("../app/sitemap")).default;
    const robots = (await import("../app/robots")).default;
    assert.deepEqual(sitemap(), []);
    assert.deepEqual(robots(), { rules: { userAgent: "*", disallow: "/" } });
  });
});
