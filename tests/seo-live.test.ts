import assert from "node:assert/strict";
import { describe, it } from "node:test";

Object.assign(process.env, {
  NEXT_PUBLIC_SITE_URL: "https://www.example-garden.in/",
  NEXT_PUBLIC_WHATSAPP_NUMBER: "+91 98765 43210",
  NEXT_PUBLIC_EMAIL: "hello@example-garden.in",
  NEXT_PUBLIC_PHONE: "+91 98765 43210",
  NEXT_PUBLIC_INSTAGRAM_URL: "https://instagram.com/example",
});
for (const k of ["NEXT_PUBLIC_ADDRESS", "NEXT_PUBLIC_SHOW_DEMO_CONTENT", "NEXT_PUBLIC_GOOGLE_REVIEWS_URL"]) delete process.env[k];

describe("live build (verified domain configured)", () => {
  it("is indexable with canonical URLs on the verified domain", async () => {
    const { siteConfig } = await import("../lib/config");
    const seo = await import("../lib/seo");
    assert.equal(siteConfig.isLive, true);
    assert.equal(siteConfig.siteUrl, "https://www.example-garden.in");
    assert.equal(siteConfig.showDemoContent, false);
    assert.equal(siteConfig.whatsappConfigured, true);
    assert.equal(siteConfig.whatsappNumber, "919876543210");
    const m = seo.pageMetadata({ title: "Contact", description: "Y", path: "/contact" });
    assert.deepEqual(m.robots, { index: true, follow: true });
    assert.equal(m.alternates?.canonical, "/contact/");
    assert.equal(seo.absoluteUrl("/contact"), "https://www.example-garden.in/contact/");
    assert.equal(seo.absoluteUrl("/"), "https://www.example-garden.in/");
  });
  it("home page metadata uses an absolute title and canonical '/'", async () => {
    const seo = await import("../lib/seo");
    const m = seo.pageMetadata({ title: "Home Title | House of Garden", absoluteTitle: true, description: "d", path: "/" });
    assert.deepEqual(m.title, { absolute: "Home Title | House of Garden" });
    assert.equal(m.alternates?.canonical, "/");
  });
  it("emits LocalBusiness JSON-LD without any address, rating or review count", async () => {
    const seo = await import("../lib/seo");
    const biz = seo.businessJsonLd() as Record<string, unknown>;
    assert.ok(biz);
    assert.equal(biz["@type"], "LocalBusiness");
    assert.equal(biz.telephone, "+919876543210");
    assert.equal(biz.email, "hello@example-garden.in");
    assert.deepEqual(biz.sameAs, ["https://instagram.com/example"]);
    const json = JSON.stringify(biz);
    for (const forbidden of ["address", "aggregateRating", "reviewCount", "ratingValue", "Sample Road", "DEMO"]) {
      assert.ok(!json.includes(forbidden), `JSON-LD must not contain ${forbidden}`);
    }
  });
  it("emits breadcrumb, service and FAQ structured data on live builds", async () => {
    const seo = await import("../lib/seo");
    const bc = seo.breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }]) as { itemListElement: { item: string }[] };
    assert.equal(bc.itemListElement[1].item, "https://www.example-garden.in/contact/");
    const faq = seo.faqJsonLd([{ q: "Q?", a: "A." }]) as { mainEntity: unknown[] };
    assert.equal(faq.mainEntity.length, 1);
    const svc = seo.serviceJsonLd({ name: "n", description: "d", path: "/landscaping-mumbai/" }) as { url: string };
    assert.equal(svc.url, "https://www.example-garden.in/landscaping-mumbai/");
  });
  it("sitemap lists every route on the verified domain; robots.txt allows crawling and links the sitemap", async () => {
    const sitemap = (await import("../app/sitemap")).default;
    const robots = (await import("../app/robots")).default;
    const { ALL_PATHS } = await import("../lib/routes");
    const urls = sitemap().map((e) => e.url);
    assert.equal(urls.length, ALL_PATHS.length);
    assert.ok(urls.includes("https://www.example-garden.in/"));
    assert.ok(urls.includes("https://www.example-garden.in/garden-maintenance-mumbai/"));
    assert.ok(urls.every((u) => u.startsWith("https://www.example-garden.in/")));
    assert.deepEqual(robots(), {
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://www.example-garden.in/sitemap.xml",
    });
  });
});
