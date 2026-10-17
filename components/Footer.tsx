import Link from "next/link";
import { serviceList } from "@/data/services";
import { DEMO_ADDRESS, siteConfig, socialLinks } from "@/lib/config";
import { ROUTES } from "@/lib/routes";
import { Logo } from "./Logo";
import { IconFacebook, IconInstagram, IconMail, IconPhone, IconPin } from "./Icons";
import { WhatsAppButton } from "./WhatsAppButton";

export function Footer() {
  const year = new Date().getFullYear();
  const showDemoAddress = !siteConfig.address && siteConfig.showDemoContent;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta" data-wa-avoid>
          <div>
            <h2 className="footer-cta-title">Plan your garden with House of Garden</h2>
            <p>Send us a message with your location and a few photos of your space.</p>
          </div>
          <WhatsAppButton size="lg">Chat on WhatsApp</WhatsAppButton>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={ROUTES.home} className="brand-link brand-link--footer" aria-label="House of Garden, home">
              <Logo />
            </Link>
            <p>
              Gardening and landscaping services for homes, societies, bungalows, offices and hotels across Mumbai,
              Maharashtra.
            </p>
            {socialLinks.length > 0 ? (
              <ul className="social-list" aria-label="Social media">
                {socialLinks.map((s) => (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={`${s.label} (opens in a new tab)`}>
                      {s.key === "instagram" ? <IconInstagram size={18} /> : <IconFacebook size={18} />}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Services">
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-links">
              {serviceList.map((s) => (
                <li key={s.key}>
                  <Link href={s.path}>{s.navLabel}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links">
              <li><Link href={ROUTES.home}>Home</Link></li>
              <li><Link href={ROUTES.gallery}>Gallery</Link></li>
              <li><Link href={ROUTES.about}>About</Link></li>
              <li><Link href={ROUTES.contact}>Contact</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="footer-heading">Contact</h3>
            <ul className="footer-contact">
              {siteConfig.phoneDisplay ? (
                <li>
                  <IconPhone size={18} />
                  {siteConfig.phoneHref ? <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a> : <span>{siteConfig.phoneDisplay}</span>}
                </li>
              ) : null}
              {siteConfig.email ? (
                <li>
                  <IconMail size={18} />
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </li>
              ) : null}
              {siteConfig.address ? (
                <li>
                  <IconPin size={18} />
                  <span>{siteConfig.address}</span>
                </li>
              ) : null}
              {showDemoAddress ? (
                <li className="demo-address">
                  <IconPin size={18} />
                  <span>{DEMO_ADDRESS}</span>
                </li>
              ) : null}
              <li>
                <IconPin size={18} />
                <span>Serving Mumbai, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} House of Garden. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
