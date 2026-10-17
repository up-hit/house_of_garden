import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/config";
import { ROUTES } from "@/lib/routes";
import type { Faq, Service } from "@/data/services";
import { IconArrowRight } from "./Icons";
import { Media } from "./Media";
import { WhatsAppButton } from "./WhatsAppButton";

/** JSON-LD script tag. Renders nothing when the data is null (e.g. on preview builds). */
export function JsonLd({ data }: { data: Record<string, unknown> | null | undefined }) {
  if (!data) return null;
  // "<" is escaped so a stray "</script>" in the data can never close the tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** Visible only on preview builds: reminders about placeholders that must be replaced before launch. */
export function DevNote({ children }: { children: ReactNode }) {
  if (siteConfig.isLive) return null;
  return (
    <p className="dev-note" role="note">
      <strong>Preview note:</strong> {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  id,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  id?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading${align === "center" ? " is-center" : ""}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id}>{title}</h2>
      {text ? <p className="lead">{text}</p> : null}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href={ROUTES.home}>Home</Link>
        </li>
        {items.map((item) => (
          <li key={item.name}>
            {item.href ? (
              <Link href={item.href}>{item.name}</Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Simple heading block for non-service pages. */
export function PageIntro({
  eyebrow,
  title,
  children,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  crumbs?: { name: string; href?: string }[];
}) {
  return (
    <section className="page-intro">
      <div className="container">
        {crumbs ? <Breadcrumbs items={crumbs} /> : null}
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {children ? <div className="lead">{children}</div> : null}
      </div>
    </section>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="faq">
      {faqs.map((f) => (
        <details key={f.q} className="faq-item">
          <summary>
            <span>{f.q}</span>
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  title = "Ready to talk about your garden?",
  text = "Message us on WhatsApp with your location and a few photos. We'll reply with the next steps.",
  message,
}: {
  title?: string;
  text?: string;
  message?: string;
}) {
  return (
    <section className="cta-section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-band" data-wa-avoid>
          <div>
            <h2 id="cta-title">{title}</h2>
            <p>{text}</p>
          </div>
          <div className="cta-actions">
            <WhatsAppButton size="lg" message={message}>
              Chat on WhatsApp
            </WhatsAppButton>
            <Link className="btn btn-ghost-on-dark btn-lg" href={ROUTES.contact}>
              Contact options
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Service card used on the homepage and in "related services". The whole card is one link. */
export function ServiceCard({ service, priority = false }: { service: Service; priority?: boolean }) {
  return (
    <article className="card service-card">
      <Media
        name={service.image}
        sizes="(min-width: 1100px) 280px, (min-width: 640px) 45vw, 92vw"
        badge={false}
        frameClass="service-card-media zoom"
        priority={priority}
      />
      <div className="service-card-body">
        <h3>
          <Link href={service.path} className="card-link">
            {service.cardTitle}
          </Link>
        </h3>
        <p>{service.cardBlurb}</p>
        <span className="card-more" aria-hidden="true">
          Explore <IconArrowRight size={16} />
        </span>
      </div>
    </article>
  );
}
