import { DevNote, JsonLd, PageIntro } from "@/components/Blocks";
import { EnquiryForm } from "@/components/EnquiryForm";
import { IconExternal, IconFacebook, IconInstagram, IconMail, IconPhone, IconPin } from "@/components/Icons";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { DEMO_ADDRESS, siteConfig, socialLinks } from "@/lib/config";
import { ROUTES } from "@/lib/routes";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact & WhatsApp Enquiries in Mumbai",
  description:
    "Contact House of Garden for gardening, landscaping, vertical gardens and plant supplies in Mumbai. Message us on WhatsApp or send an enquiry.",
  path: ROUTES.contact,
});

export default function ContactPage() {
  const showDemoAddress = !siteConfig.address && siteConfig.showDemoContent;
  const mailto = siteConfig.email
    ? `mailto:${siteConfig.email}?subject=${encodeURIComponent("Enquiry: House of Garden")}&body=${encodeURIComponent(
        "Hello House of Garden,\n\nI'd like to enquire about:\n",
      )}`
    : undefined;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: ROUTES.home }, { name: "Contact", path: ROUTES.contact }])} />
      <PageIntro eyebrow="Contact" title="Contact House of Garden" crumbs={[{ name: "Contact" }]}>
        <p>
          The quickest way to reach us is WhatsApp. Share your location and a few photos of your space and we'll reply with
          the next steps.
        </p>
      </PageIntro>

      <section className="section" aria-label="Contact details and enquiry form">
        <div className="container contact-grid">
          <div className="panel">
            <h2>Get in touch</h2>
            <div className="contact-wa">
              <WhatsAppButton size="lg">Chat on WhatsApp</WhatsAppButton>
            </div>
            <ul className="contact-list">
              {siteConfig.phoneDisplay ? (
                <li>
                  <span className="offer-icon"><IconPhone size={20} /></span>
                  <div>
                    <h3>Phone</h3>
                    {siteConfig.phoneHref ? <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a> : <span>{siteConfig.phoneDisplay}</span>}
                  </div>
                </li>
              ) : null}
              {siteConfig.email ? (
                <li>
                  <span className="offer-icon"><IconMail size={20} /></span>
                  <div>
                    <h3>Email</h3>
                    <a href={mailto}>{siteConfig.email}</a>
                    <small>Opens your email app. Your message is only sent when you press send there.</small>
                  </div>
                </li>
              ) : null}
              {siteConfig.address ? (
                <li>
                  <span className="offer-icon"><IconPin size={20} /></span>
                  <div>
                    <h3>Address</h3>
                    <span>{siteConfig.address}</span>
                  </div>
                </li>
              ) : null}
              {showDemoAddress ? (
                <li>
                  <span className="offer-icon"><IconPin size={20} /></span>
                  <div className="demo-address">
                    <h3>Address (demo)</h3>
                    <span>{DEMO_ADDRESS}</span>
                  </div>
                </li>
              ) : null}
              <li>
                <span className="offer-icon"><IconPin size={20} /></span>
                <div>
                  <h3>Service area</h3>
                  <span>Mumbai, Maharashtra: Western, Central and Harbour line suburbs and the Eastern side.</span>
                </div>
              </li>
              {socialLinks.length > 0 ? (
                <li>
                  <span className="offer-icon">{socialLinks[0].key === "instagram" ? <IconInstagram size={20} /> : <IconFacebook size={20} />}</span>
                  <div>
                    <h3>Social</h3>
                    {socialLinks.map((s) => (
                      <div key={s.key}>
                        <a href={s.href} target="_blank" rel="noopener noreferrer">
                          {s.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </li>
              ) : null}
              {siteConfig.googleReviewsUrl ? (
                <li>
                  <span className="offer-icon"><IconExternal size={20} /></span>
                  <div>
                    <h3>Reviews</h3>
                    <a href={siteConfig.googleReviewsUrl} target="_blank" rel="noopener noreferrer">
                      Read our reviews on Google
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </div>
                </li>
              ) : null}
            </ul>

            {!siteConfig.whatsappConfigured ? (
              <DevNote>NEXT_PUBLIC_WHATSAPP_NUMBER is not set: WhatsApp buttons open a non-working placeholder number.</DevNote>
            ) : null}
            {!siteConfig.phoneDisplay && !siteConfig.email ? (
              <DevNote>Add NEXT_PUBLIC_PHONE, NEXT_PUBLIC_EMAIL and NEXT_PUBLIC_ADDRESS to show them here (see .env.example).</DevNote>
            ) : null}
          </div>

          <div className="panel" data-wa-avoid>
            <h2>Send an enquiry</h2>
            <EnquiryForm />
            {!siteConfig.formEndpoint ? (
              <DevNote>
                No form service is configured (NEXT_PUBLIC_FORM_ENDPOINT), so enquiries go to WhatsApp only. See the README
                section on email delivery.
              </DevNote>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
