"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { whatsappMessageForPath } from "@/lib/whatsapp-context";
import { IconClose, IconWhatsApp } from "./Icons";

const TIP_KEY = "hog-wa-tip";
const TIP_DELAY_MS = 4500;
const TIP_VISIBLE_MS = 8000;
/** Size (px) of the bottom-right square the button occupies (button + margin). */
const ZONE_PX = 96;

/**
 * Fixed WhatsApp button shown on every page.
 *  - Official WhatsApp green + glyph, a restrained pulse ring (disabled for reduced motion) and a one-off
 *    welcome tooltip that is shown at most once per browser session.
 *  - It fades out while an element marked `data-wa-avoid` (the enquiry form, call-to-action bands, the
 *    footer CTA) overlaps the bottom-right corner of the screen, so it never covers form controls or buttons.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [tip, setTip] = useState(false);

  const href = buildWhatsAppUrl(siteConfig.whatsappNumber, whatsappMessageForPath(pathname));

  // Hide while a protected element overlaps the bottom-right corner where the button sits.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    let io: IntersectionObserver | null = null;
    const inStrip = new Set<Element>();

    const connect = () => {
      io?.disconnect();
      inStrip.clear();
      const targets = document.querySelectorAll("[data-wa-avoid]");
      if (targets.length === 0) {
        setHidden(false);
        return;
      }
      const top = Math.max(0, window.innerHeight - ZONE_PX);
      const left = Math.max(0, window.innerWidth - ZONE_PX);
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) inStrip.add(e.target);
            else inStrip.delete(e.target);
          }
          setHidden(inStrip.size > 0);
        },
        { rootMargin: `-${top}px 0px 0px -${left}px` },
      );
      targets.forEach((t) => io?.observe(t));
    };

    connect();
    window.addEventListener("resize", connect);
    return () => {
      io?.disconnect();
      window.removeEventListener("resize", connect);
    };
  }, [pathname]);

  // One-off, dismissible welcome tooltip.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(TIP_KEY) === "1";
    } catch {
      /* storage unavailable: treat as not seen, but still only show once per page load */
    }
    if (seen) return;
    const show = window.setTimeout(() => {
      setTip(true);
      try {
        sessionStorage.setItem(TIP_KEY, "1");
      } catch {
        /* ignore */
      }
    }, TIP_DELAY_MS);
    const hide = window.setTimeout(() => setTip(false), TIP_DELAY_MS + TIP_VISIBLE_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (!tip) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTip(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [tip]);

  return (
    <div className="wa-float" data-hidden={hidden} data-tip={tip && !hidden}>
      {tip && !hidden ? (
        <div className="wa-tip">
          <span>Questions about your garden? Message us on WhatsApp.</span>
          <button type="button" className="wa-tip-close" aria-label="Dismiss message" onClick={() => setTip(false)}>
            <IconClose size={14} />
          </button>
        </div>
      ) : null}
      <a
        className="wa-float-btn"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with House of Garden on WhatsApp (opens in a new tab)"
        tabIndex={hidden ? -1 : undefined}
        data-wa-configured={siteConfig.whatsappConfigured ? "true" : "false"}
      >
        <IconWhatsApp size={30} />
      </a>
    </div>
  );
}
