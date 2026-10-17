import assert from "node:assert/strict";
import { describe, it } from "node:test";

process.env.NEXT_PUBLIC_SITE_URL = "http://insecure.example";

describe("invalid production URL", () => {
  it("a non-https NEXT_PUBLIC_SITE_URL is ignored, so the build stays a noindex preview", async () => {
    const { siteConfig } = await import("../lib/config");
    assert.equal(siteConfig.isLive, false);
    assert.equal(siteConfig.siteUrl, undefined);
  });
});
