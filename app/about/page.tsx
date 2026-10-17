import Link from "next/link";
import { CtaBand, DevNote, JsonLd, PageIntro, SectionHeading } from "@/components/Blocks";
import { ServiceIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { serviceList } from "@/data/services";
import { aboutSteps, confirmedLocalities, serviceAreaLines } from "@/data/site";
import { ROUTES } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us: Gardening & Landscaping in Mumbai",
  description:
    "House of Garden is a gardening and landscaping service provider for homes, societies, bungalows, offices and hotels across Mumbai, Maharashtra.",
  path: ROUTES.about,
});

const iconFor = { maintenance: "sprout", landscaping: "tree", vertical: "wall", plants: "pot" } as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: ROUTES.home }, { name: "About", path: ROUTES.about }])} />
      <PageIntro eyebrow="About us" title="About House of Garden" crumbs={[{ name: "About" }]}>
        <p>
          House of Garden is a gardening and landscaping service provider for Mumbai. We help homeowners, housing
          societies, bungalows, offices and hotels create gardens, keep them healthy, and find the plants, pots and soil
          to do it.
        </p>
      </PageIntro>

      <section className="section" aria-labelledby="what-title">
        <div className="container">
          <SectionHeading id="what-title" eyebrow="What we do" title="Four services, one team" />
          <ul className="about-links">
            {serviceList.map((s, i) => (
              <li key={s.key}>
                <Reveal delay={(i % 2) * 90} className="reveal-fill">
                  <Link href={s.path} className="card offer-card" style={{ textDecoration: "none", color: "inherit" }}>
                    <span className="offer-icon">
                      <ServiceIcon name={iconFor[s.key]} size={24} />
                    </span>
                    <h3>{s.cardTitle}</h3>
                    <p>{s.cardBlurb}</p>
                    <span className="text-link">Learn more</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--soft" aria-labelledby="how-title">
        <div className="container">
          <SectionHeading id="how-title" eyebrow="How it works" title="Simple to get started" />
          <ol className="steps">
            {aboutSteps.map((s, i) => (
              <li key={s.title} className="step">
                <Reveal delay={i * 90}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="where-title">
        <div className="container narrow">
          <SectionHeading id="where-title" eyebrow="Where we work" title="Across Mumbai" />
          <div className="area-card">
            <p>
              We work with homes, societies and businesses across Mumbai, including the Western, Central and Harbour line
              suburbs and the Eastern side. We are a service provider that comes to you; we don't claim an office or branch
              in every locality.
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
          </div>
          <DevNote>
            Add your story, team and any verified credentials on this page once confirmed. Nothing about years of
            experience, awards, certifications or notable clients is stated here on purpose.
          </DevNote>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
