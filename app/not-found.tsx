import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/Blocks";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { serviceList } from "@/data/services";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <PageIntro eyebrow="404" title="We couldn't find that page">
        <p>The page may have moved. Try one of these, or message us on WhatsApp.</p>
      </PageIntro>
      <section className="section">
        <div className="container">
          <ul className="chips" aria-label="Useful pages">
            <li>
              <Link className="chip" href={ROUTES.home}>Home</Link>
            </li>
            {serviceList.map((s) => (
              <li key={s.key}>
                <Link className="chip" href={s.path}>{s.navLabel}</Link>
              </li>
            ))}
            <li>
              <Link className="chip" href={ROUTES.contact}>Contact</Link>
            </li>
          </ul>
          <div style={{ marginTop: 24 }}>
            <WhatsAppButton>Chat on WhatsApp</WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
