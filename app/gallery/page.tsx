import { CtaBand, JsonLd, PageIntro } from "@/components/Blocks";
import { GalleryGrid } from "@/components/GalleryGrid";
import { galleryKeys } from "@/data/images";
import { siteConfig } from "@/lib/config";
import { ROUTES } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Garden & Landscaping Gallery, Mumbai",
  description:
    "Browse garden ideas: residential and society gardens, lawns, landscaping, vertical green walls, balcony plants, irrigation, pots and garden makeovers in Mumbai.",
  path: ROUTES.gallery,
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: ROUTES.home }, { name: "Gallery", path: ROUTES.gallery }])} />
      <PageIntro eyebrow="Gallery" title="Garden & Landscaping Gallery" crumbs={[{ name: "Gallery" }]}>
        <p>
          Ideas across residential and society gardens, lawns, landscaping, green walls, balconies, irrigation, pots and
          makeovers. Tap any image to view it larger.
        </p>
      </PageIntro>

      <section className="section" aria-label="Gallery images">
        <div className="container">
          {siteConfig.sampleImages ? (
            <p className="demo-banner" role="note">
              <strong>Sample imagery:</strong> these are illustrations used as placeholders, not photographs of completed
              House of Garden projects. Real project photos will replace them.
            </p>
          ) : null}
          <GalleryGrid keys={galleryKeys} />
        </div>
      </section>

      <CtaBand
        title="Have a garden in mind?"
        text="Tell us about your space on WhatsApp and we'll talk through ideas."
        message="Hello House of Garden, I saw your gallery and would like to discuss a garden project in Mumbai."
      />
    </>
  );
}
