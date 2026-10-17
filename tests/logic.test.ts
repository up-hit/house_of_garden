import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

import { galleryKeys, galleryPreviewKeys, images } from "../data/images";
import { serviceList, services } from "../data/services";
import { demoTestimonials, homeFaqs, testimonials } from "../data/site";
import { ALL_PATHS, ROUTES, isActivePath, normalizePath } from "../lib/routes";
import { validateEnquiry } from "../lib/validation";
import { buildEnquiryMessage, buildWhatsAppUrl, normalizePhone, telHref } from "../lib/whatsapp";
import { whatsappMessageForPath } from "../lib/whatsapp-context";

const root = join(__dirname, "..");

describe("normalizePhone", () => {
  const ok: [string, string][] = [
    ["98765 43210", "919876543210"],
    ["9876543210", "919876543210"],
    ["09876543210", "919876543210"],
    ["+91 98765-43210", "919876543210"],
    ["+91 (98765) 43210", "919876543210"],
    ["919876543210", "919876543210"],
    ["0091 9876543210", "919876543210"],
    ["+44 7911 123456", "447911123456"],
    ["+1 (415) 555-0132", "14155550132"],
  ];
  for (const [input, expected] of ok) {
    it(`accepts ${input}`, () => assert.equal(normalizePhone(input), expected));
  }
  const bad = ["", "   ", "abc", "12345", "98765 4321", "5987654321", "+91", "98765x43210", "++919876543210", "91 98765 43210 99999999", "+0123456789"];
  for (const input of bad) {
    it(`rejects "${input}"`, () => assert.equal(normalizePhone(input), null));
  }
});

describe("WhatsApp helpers", () => {
  it("builds an official wa.me click-to-chat URL with an encoded message", () => {
    const url = buildWhatsAppUrl("919876543210", "Hello & welcome\nLine 2 — ok?");
    assert.ok(url.startsWith("https://wa.me/919876543210?text="));
    const text = new URL(url).searchParams.get("text");
    assert.equal(text, "Hello & welcome\nLine 2 — ok?");
    assert.ok(!url.includes(" "), "no raw spaces");
    assert.ok(!url.includes("\n"), "no raw newlines");
  });
  it("strips non-digits from the number and omits an empty message", () => {
    assert.equal(buildWhatsAppUrl("+91 98765-43210"), "https://wa.me/919876543210");
    assert.equal(buildWhatsAppUrl("919876543210", "   "), "https://wa.me/919876543210");
  });
  it("builds the enquiry message with optional fields only when given", () => {
    const full = buildEnquiryMessage({ name: " Asha ", email: "a@b.in", phone: "98765 43210", purpose: "Lawn for my bungalow" });
    assert.match(full, /Hello House of Garden,/);
    assert.match(full, /Lawn for my bungalow/);
    assert.match(full, /Name: Asha/);
    assert.match(full, /Contact number: 98765 43210/);
    assert.match(full, /Email: a@b\.in/);
    const minimal = buildEnquiryMessage({ phone: "98765 43210", purpose: "Maintenance quote" });
    assert.ok(!/Name:/.test(minimal));
    assert.ok(!/Email:/.test(minimal));
  });
  it("builds tel: links only for usable numbers", () => {
    assert.equal(telHref("+91 98765 43210"), "tel:+919876543210");
    assert.equal(telHref("nope"), undefined);
    assert.equal(telHref(undefined), undefined);
  });
  it("picks a page-specific pre-filled message", () => {
    assert.match(whatsappMessageForPath("/vertical-gardens-mumbai/"), /vertical garden/i);
    assert.match(whatsappMessageForPath("/vertical-gardens-mumbai"), /vertical garden/i);
    assert.match(whatsappMessageForPath("/"), /gardening and landscaping/i);
    assert.match(whatsappMessageForPath("/unknown/"), /gardening and landscaping/i);
  });
});

describe("validateEnquiry", () => {
  const good = { name: "", email: "", phone: "98765 43210", purpose: "Monthly garden maintenance" };
  it("accepts only a phone and a purpose (name and email optional)", () => {
    const r = validateEnquiry(good);
    assert.equal(r.ok, true);
    assert.deepEqual(r.errors, {});
  });
  it("requires a contact number", () => {
    const r = validateEnquiry({ ...good, phone: "" });
    assert.equal(r.ok, false);
    assert.match(r.errors.phone ?? "", /contact number/i);
  });
  it("rejects an invalid number", () => {
    const r = validateEnquiry({ ...good, phone: "12345" });
    assert.equal(r.ok, false);
    assert.match(r.errors.phone ?? "", /valid mobile number/i);
  });
  it("requires a purpose of reasonable length", () => {
    assert.match(validateEnquiry({ ...good, purpose: "" }).errors.purpose ?? "", /briefly/i);
    assert.match(validateEnquiry({ ...good, purpose: "hi" }).errors.purpose ?? "", /more detail/i);
    assert.match(validateEnquiry({ ...good, purpose: "x".repeat(601) }).errors.purpose ?? "", /under 600/);
  });
  it("validates email only when provided", () => {
    assert.equal(validateEnquiry({ ...good, email: "" }).ok, true);
    assert.equal(validateEnquiry({ ...good, email: "name@example.in" }).ok, true);
    assert.match(validateEnquiry({ ...good, email: "not-an-email" }).errors.email ?? "", /valid email/i);
    assert.match(validateEnquiry({ ...good, email: "a b@c.in" }).errors.email ?? "", /valid email/i);
  });
  it("trims input and removes control characters", () => {
    const r = validateEnquiry({ name: "  Asha\u0007 ", email: " ", phone: " 98765 43210 ", purpose: "  Lawn\u0000 care  " });
    assert.equal(r.clean.name, "Asha");
    assert.equal(r.clean.purpose, "Lawn care");
    assert.equal(r.clean.phone, "98765 43210");
  });
});

describe("routes", () => {
  it("normalises paths", () => {
    assert.equal(normalizePath("/contact/"), "/contact");
    assert.equal(normalizePath("/contact/?a=1#b"), "/contact");
    assert.equal(normalizePath("/"), "/");
    assert.equal(normalizePath(""), "/");
    assert.equal(normalizePath(null), "/");
    assert.equal(isActivePath("/contact", "/contact/"), true);
    assert.equal(isActivePath("/", "/contact/"), false);
  });
  it("every route has a real page file and ends with a trailing slash", () => {
    for (const path of ALL_PATHS) {
      assert.ok(path === "/" || path.endsWith("/"), `${path} should end with /`);
      const file = path === "/" ? join(root, "app", "page.tsx") : join(root, "app", path.replace(/^\/|\/$/g, ""), "page.tsx");
      assert.ok(existsSync(file), `missing page file for ${path}: ${file}`);
    }
  });
  it("includes the required routes", () => {
    for (const p of ["/", "/garden-maintenance-mumbai/", "/landscaping-mumbai/", "/vertical-gardens-mumbai/", "/plants-pots-soil-mumbai/", "/contact/"]) {
      assert.ok(ALL_PATHS.includes(p), `${p} missing`);
    }
    assert.equal(Object.keys(ROUTES).length, ALL_PATHS.length);
  });
});

describe("content data", () => {
  it("has four service pages with unique, well-formed SEO fields", () => {
    assert.equal(serviceList.length, 4);
    const titles = new Set<string>();
    const descs = new Set<string>();
    const h1s = new Set<string>();
    for (const s of serviceList) {
      const full = `${s.metaTitle} | House of Garden`;
      assert.ok(full.length <= 62, `title too long (${full.length}): ${full}`);
      assert.ok(s.metaDescription.length >= 90 && s.metaDescription.length <= 160, `description length ${s.metaDescription.length} for ${s.key}`);
      assert.match(s.h1, /Mumbai/);
      assert.ok(s.offerings.length >= 5, `${s.key} offerings`);
      assert.ok(s.benefits.length >= 3);
      assert.ok(s.faqs.length >= 3);
      assert.ok(s.related.every((k) => k in services && k !== s.key));
      assert.ok(s.path.startsWith("/") && s.path.endsWith("/"));
      titles.add(s.metaTitle);
      descs.add(s.metaDescription);
      h1s.add(s.h1);
    }
    assert.equal(titles.size, 4);
    assert.equal(descs.size, 4);
    assert.equal(h1s.size, 4);
  });
  it("covers the required service topics", () => {
    const text = JSON.stringify(serviceList).toLowerCase();
    for (const term of [
      "mali", "gardener", "society", "bungalow", "office", "hotel", "landscaping", "lawn", "garden makeover",
      "nursery", "fibre", "plastic", "cocopeat", "compost", "cow dung", "potting mix", "organic bio",
      "self-watering", "green wall", "artificial", "irrigation", "artificial grass", "pebbles", "hanging",
    ]) {
      assert.ok(text.includes(term), `service copy never mentions "${term}"`);
    }
  });
  it("does not make unverifiable claims", () => {
    const text = JSON.stringify([serviceList, homeFaqs]).toLowerCase();
    for (const bad of ["years of experience", "award", "certified", "guarantee", "#1", "best in mumbai", "celebrity", "licensed", "insured", "% off", "free quote", "24/7"]) {
      assert.ok(!text.includes(bad), `copy contains "${bad}"`);
    }
  });
  it("image files exist for every catalogued image, at both widths", () => {
    for (const [key, img] of Object.entries(images)) {
      for (const w of [640, 1280]) {
        assert.ok(existsSync(join(root, "public", "images", `${key}-${w}.webp`)), `missing ${key}-${w}.webp`);
      }
      assert.ok(img.alt.length > 20, `${key} alt text too short`);
      assert.ok(img.srcSet.includes("640w") && img.srcSet.includes("1280w"));
    }
    assert.ok(galleryKeys.length >= 8 && galleryKeys.length <= 12);
    assert.ok(galleryPreviewKeys.length >= 3 && galleryPreviewKeys.length <= 4);
    assert.equal(new Set(galleryKeys).size, galleryKeys.length);
  });
  it("covers the required gallery topics", () => {
    const labels = galleryKeys.map((k) => images[k].label.toLowerCase()).join(" | ");
    for (const t of ["residential", "society", "lawn", "landscaping", "vertical", "balcony", "irrigation", "pots", "makeover"]) {
      assert.ok(labels.includes(t), `gallery missing "${t}"`);
    }
  });
  it("ships no real testimonials by default and demo ones are clearly placeholders", () => {
    assert.equal(testimonials.length, 0);
    assert.ok(demoTestimonials.length >= 3 && demoTestimonials.length <= 4);
    for (const t of demoTestimonials) assert.match(t.name + t.detail, /placeholder|demo/i);
  });
  it("homepage has 3-4 concise FAQs", () => {
    assert.ok(homeFaqs.length >= 3 && homeFaqs.length <= 4);
  });
  it("never ships the demo address or placeholder number outside config.ts", () => {
    for (const file of ["lib/seo.ts", "app/layout.tsx", "app/sitemap.ts", "app/robots.ts"]) {
      const src = readFileSync(join(root, file), "utf8");
      assert.ok(!src.includes("123 Sample Road"), `${file} must not reference the demo address`);
      assert.ok(!src.includes("DEMO_ADDRESS"), `${file} must not reference DEMO_ADDRESS`);
    }
  });
});
