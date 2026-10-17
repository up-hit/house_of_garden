"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { mainNav } from "@/data/site";
import { serviceList } from "@/data/services";
import { siteConfig } from "@/lib/config";
import { isActivePath } from "@/lib/routes";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { whatsappMessageForPath } from "@/lib/whatsapp-context";
import { IconChevronDown, IconClose, IconMenu, IconWhatsApp, ServiceIcon } from "./Icons";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const serviceIconFor = { maintenance: "sprout", landscaping: "tree", vertical: "wall", plants: "pot" } as const;

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const dropWrapRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openedByHover = useRef(false);
  const menuId = useId();
  const dropId = useId();
  const mobileServicesId = useId();

  const waHref = buildWhatsAppUrl(siteConfig.whatsappNumber, whatsappMessageForPath(pathname));
  const onServicePage = serviceList.some((s) => isActivePath(pathname, s.path));

  // Close menus after navigating.
  useEffect(() => {
    setMenuOpen(false);
    setDropOpen(false);
  }, [pathname]);

  // Escape closes menus (and returns focus to the trigger); clicking elsewhere closes the dropdown.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (dropOpen) {
        setDropOpen(false);
        if (dropWrapRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
      }
      if (menuOpen) setMenuOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (dropWrapRef.current && !dropWrapRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [dropOpen, menuOpen]);

  // Leaving the desktop breakpoint with the mobile menu open would leave it stuck open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 961px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="site-header" data-menu-open={menuOpen}>
      <div className="container header-inner">
        <Link href="/" className="brand-link" aria-label="House of Garden, home">
          <Logo />
        </Link>

        <nav className="nav" aria-label="Main">
          <ul className="nav-list">
            {mainNav.map((item) => {
              if ("children" in item) {
                return (
                  <li
                    key={item.label}
                    className="nav-item has-dropdown"
                    ref={dropWrapRef}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") {
                        openedByHover.current = true;
                        setDropOpen(true);
                      }
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === "mouse") {
                        openedByHover.current = false;
                        setDropOpen(false);
                      }
                    }}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDropOpen(false);
                    }}
                  >
                    <button
                      ref={triggerRef}
                      type="button"
                      className="nav-link nav-trigger"
                      aria-expanded={dropOpen}
                      aria-controls={dropId}
                      aria-current={onServicePage ? "true" : undefined}
                      onClick={() => {
                        if (openedByHover.current) {
                          openedByHover.current = false; // first click after a hover-open keeps it open
                          setDropOpen(true);
                        } else {
                          setDropOpen((v) => !v);
                        }
                      }}
                    >
                      {item.label}
                      <IconChevronDown size={16} className="chev" />
                    </button>
                    <ul id={dropId} className="dropdown" data-open={dropOpen}>
                      {serviceList.map((s) => (
                        <li key={s.key}>
                          <Link
                            href={s.path}
                            className="dropdown-link"
                            aria-current={isActivePath(pathname, s.path) ? "page" : undefined}
                          >
                            <span className="dropdown-icon">
                              <ServiceIcon name={serviceIconFor[s.key]} size={20} />
                            </span>
                            <span className="dropdown-text">
                              <span className="dropdown-title">{s.navLabel}</span>
                              <span className="dropdown-sub">{s.cardBlurb}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={item.label} className="nav-item">
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <a
            className="btn btn-wa btn-sm header-wa"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp (opens in a new tab)"
          >
            <IconWhatsApp size={18} />
            <span className="btn-label">WhatsApp</span>
          </a>
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div id={menuId} className="mobile-menu" data-open={menuOpen}>
        <nav className="mobile-menu-scroll" aria-label="Mobile">
          <ul className="mobile-list">
            {mainNav.map((item) => {
              if ("children" in item) {
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      className="mobile-link mobile-trigger"
                      aria-expanded={mobileServicesOpen}
                      aria-controls={mobileServicesId}
                      onClick={() => setMobileServicesOpen((v) => !v)}
                    >
                      {item.label}
                      <IconChevronDown size={18} className="chev" />
                    </button>
                    <ul id={mobileServicesId} className="mobile-sub" data-open={mobileServicesOpen}>
                      <li className="mobile-sub-inner">
                        <ul>
                          {serviceList.map((s) => (
                            <li key={s.key}>
                              <Link
                                href={s.path}
                                className="mobile-sublink"
                                aria-current={isActivePath(pathname, s.path) ? "page" : undefined}
                              >
                                {s.navLabel}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="mobile-link"
                    aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <a className="btn btn-wa btn-lg mobile-wa" href={waHref} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp size={20} />
            <span>Chat on WhatsApp</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
