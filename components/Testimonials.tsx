import { demoTestimonials, testimonials } from "@/data/site";
import { siteConfig } from "@/lib/config";
import { DevNote, SectionHeading } from "./Blocks";
import { IconExternal } from "./Icons";
import { Reveal } from "./Reveal";

/**
 * Reviews section.
 *  - Real, verified testimonials (data/site.ts) are shown when present.
 *  - On preview builds with none, clearly-labelled DEMO cards preview the layout.
 *  - On a live build with none, only the Google Reviews link is shown (or nothing if that is not set).
 * No ratings, review counts or invented names are ever published as genuine.
 */
export function Testimonials() {
  const real = testimonials.slice(0, 4);
  const showDemo = real.length === 0 && siteConfig.showDemoContent;
  const list = real.length > 0 ? real : showDemo ? demoTestimonials : [];
  const google = siteConfig.googleReviewsUrl;

  if (list.length === 0 && !google && siteConfig.isLive) return null;

  return (
    <section className="section" aria-labelledby="reviews-title">
      <div className="container">
        <SectionHeading
          id="reviews-title"
          eyebrow="Reviews"
          title={list.length > 0 ? "What our customers say" : "Customer reviews"}
          text={list.length === 0 ? "Read what customers say about House of Garden on Google." : undefined}
        />

        {showDemo ? (
          <p className="demo-banner" role="note">
            <strong>DEMO:</strong> placeholder testimonials for layout preview only. These are not real customer
            reviews and will not appear on the live site.
          </p>
        ) : null}

        {list.length > 0 ? (
          <ul className="quote-grid">
            {list.map((t, i) => (
              <li key={t.name}>
                <Reveal delay={i * 90} className="reveal-fill">
                  <figure className="quote-card">
                    {showDemo ? <span className="badge-demo">Demo</span> : null}
                    <blockquote>
                      <p>{t.quote}</p>
                    </blockquote>
                    <figcaption>
                      <strong>{t.name}</strong>
                      <span>{t.detail}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="reviews-cta">
          {google ? (
            <a className="btn btn-ghost" href={google} target="_blank" rel="noopener noreferrer">
              <span>Read our reviews on Google</span>
              <IconExternal size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
          {!google ? (
            <DevNote>Add NEXT_PUBLIC_GOOGLE_REVIEWS_URL (your verified Google Business reviews link) to show the Google Reviews button here.</DevNote>
          ) : null}
        </div>
      </div>
    </section>
  );
}
