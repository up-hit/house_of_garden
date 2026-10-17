import Link from "next/link";
import { getRelated, type Service } from "@/data/services";
import { ROUTES } from "@/lib/routes";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { Breadcrumbs, CtaBand, FaqList, JsonLd, SectionHeading, ServiceCard } from "./Blocks";
import { IconCheck, ServiceIcon } from "./Icons";
import { Media } from "./Media";
import { Reveal } from "./Reveal";
import { WhatsAppButton } from "./WhatsAppButton";

/** Shared layout for the four detailed service pages. Copy lives in data/services.ts. */
export function ServicePage({ service }: { service: Service }) {
  const related = getRelated(service);

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: service.serviceName, description: service.metaDescription, path: service.path })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: ROUTES.home }, { name: service.serviceName, path: service.path }])} />
      <JsonLd data={faqJsonLd(service.faqs)} />

      <section className="page-hero">
        <div className="container page-hero-grid">
          <div className="page-hero-copy">
            <Breadcrumbs items={[{ name: service.navLabel }]} />
            <p className="eyebrow">{service.eyebrow}</p>
            <h1>{service.h1}</h1>
            <p className="lead">{service.intro}</p>
            <div className="hero-actions">
              <WhatsAppButton size="lg" message={service.waMessage}>
                Enquire on WhatsApp
              </WhatsAppButton>
              <Link href={ROUTES.contact} className="btn btn-ghost btn-lg">
                Contact options
              </Link>
            </div>
          </div>
          <Media name={service.image} priority sizes="(min-width: 960px) 520px, 92vw" frameClass="page-hero-media zoom" />
        </div>
      </section>

      <section className="section" aria-labelledby="offer-title">
        <div className="container">
          <SectionHeading id="offer-title" eyebrow="What we offer" title={`${service.navLabel} services`} />
          <ul className="offer-grid">
            {service.offerings.map((o, i) => (
              <li key={o.title}>
                <Reveal delay={(i % 3) * 80} className="reveal-fill">
                  <div className="card offer-card">
                    <span className="offer-icon">
                      <ServiceIcon name={o.icon} size={24} />
                    </span>
                    <h3>{o.title}</h3>
                    <p>{o.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="benefits-title">
        <div className="container split">
          <div>
            <SectionHeading id="benefits-title" eyebrow="What to expect" title="Why people choose this service" />
            <ul className="benefit-list">
              {service.benefits.map((b) => (
                <li key={b.title}>
                  <span className="benefit-check">
                    <IconCheck size={16} />
                  </span>
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="reveal-fill">
            <Media name={service.secondaryImage} sizes="(min-width: 960px) 520px, 92vw" frameClass="split-media zoom" />
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="related-title">
        <div className="container">
          <SectionHeading id="related-title" eyebrow="Related services" title="You may also need" />
          <div className="related-grid">
            {related.map((r) => (
              <ServiceCard key={r.key} service={r} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="faq-title">
        <div className="container narrow">
          <SectionHeading id="faq-title" eyebrow="FAQs" title="Frequently asked questions" />
          <FaqList faqs={service.faqs} />
        </div>
      </section>

      <CtaBand message={service.waMessage} />
    </>
  );
}
