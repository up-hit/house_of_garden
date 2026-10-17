import Link from "next/link";
import type { CSSProperties } from "react";
import { FaqList, JsonLd, SectionHeading, ServiceCard } from "@/components/Blocks";
import { IconArrowRight } from "@/components/Icons";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import { Testimonials } from "@/components/Testimonials";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { galleryPreviewKeys, images } from "@/data/images";
import { serviceList } from "@/data/services";
import { confirmedLocalities, homeFaqs, serviceAreaLines } from "@/data/site";
import { siteConfig } from "@/lib/config";
import { ROUTES } from "@/lib/routes";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gardening & Landscaping Services in Mumbai | House of Garden",
  absoluteTitle: true,
  description:
    "Gardening, landscaping, garden maintenance, vertical gardens, irrigation and plant supplies for homes, societies, bungalows, offices and hotels across Mumbai.",
  path: ROUTES.home,
});

const delay = (ms: string) => ({ "--d": ms }) as CSSProperties;

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />

      {/* 1. Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow anim-rise">Mumbai · Maharashtra</p>
            <h1 id="hero-title" className="anim-rise" style={delay("80ms")}>
              Gardening &amp; Landscaping Services Across Mumbai
            </h1>
            <p className="lead anim-rise" style={delay("160ms")}>
              Garden care, landscaping, green walls and plant supplies for homes, societies, offices and hotels, all
              one WhatsApp message away.
            </p>
            <div className="hero-actions anim-rise" style={delay("240ms")}>
              <WhatsAppButton size="lg">Chat on WhatsApp</WhatsAppButton>
              <a href="#services" className="btn btn-ghost btn-lg">
                Explore Services
              </a>
            </div>
            <p className="hero-note anim-rise" style={delay("320ms")}>
              For homes, societies, bungalows, offices and hotels.
            </p>
          </div>
          <div className="hero-media anim-image">
            <Media name="hero" priority sizes="(min-width: 900px) 480px, 92vw" frameClass="zoom" />
          </div>
        </div>
      </section>

      {/* 2. Services overview */}
      <section id="services" className="section section--soft" aria-labelledby="services-title">
        <div className="container">
          <SectionHeading
            id="services-title"
            eyebrow="Our services"
            title="Everything your garden needs"
            text="Four focused services, each with its own page for the full details."
          />
          <div className="services-grid">
            {serviceList.map((s, i) => (
              <Reveal key={s.key} delay={i * 90} className="reveal-fill">
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Gallery preview */}
      <section className="section" aria-labelledby="gallery-title">
        <div className="container">
          <div className="section-head-row">
            <SectionHeading id="gallery-title" eyebrow="Gallery" title="Garden ideas and projects" />
            <Link href={ROUTES.gallery} className="text-link">
              View all projects <IconArrowRight size={18} />
            </Link>
          </div>
          <ul className="gallery-strip">
            {galleryPreviewKeys.map((key, i) => {
              const img = images[key];
              return (
                <li key={key}>
                  <Reveal delay={i * 80}>
                    <Link href={ROUTES.gallery} className="strip-tile" aria-label={`Open gallery: ${img.label}`}>
                      <img
                        src={img.src}
                        srcSet={img.srcSet}
                        sizes="(min-width: 1100px) 270px, 46vw"
                        width={img.width}
                        height={img.height}
                        alt={img.alt}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="strip-cap">{img.label}</span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          {siteConfig.sampleImages ? (
            <p className="gallery-note">
              Sample illustrations for design preview. They are not photographs of completed House of Garden projects.
            </p>
          ) : null}
        </div>
      </section>

      {/* 4. Reviews */}
      <Testimonials />

      {/* 5. Service area + FAQs */}
      <section className="section section--soft" aria-labelledby="area-title">
        <div className="container split">
          <Reveal>
            <div className="area-card">
              <p className="eyebrow">Service area</p>
              <h2 id="area-title">Serving Mumbai</h2>
              <p>
                We look after gardens across Mumbai, from the Western and Central lines to the Harbour line and the
                Eastern suburbs. Not sure we cover your locality? Just ask on WhatsApp.
              </p>
              <ul className="chips" aria-label="Areas of Mumbai we serve">
                {serviceAreaLines.map((a) => (
                  <li key={a} className="chip">
                    {a}
                  </li>
                ))}
                {confirmedLocalities.map((a) => (
                  <li key={a} className="chip">
                    {a}
                  </li>
                ))}
              </ul>
              <WhatsAppButton message="Hello House of Garden, do you serve my area in Mumbai?">
                Check your area
              </WhatsAppButton>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <SectionHeading eyebrow="FAQs" title="Quick answers" />
              <FaqList faqs={homeFaqs} />
            </div>
          </Reveal>
        </div>
      </section>

    </>
  );
}
