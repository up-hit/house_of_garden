import type { ReactNode } from "react";
import { siteConfig } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { GENERAL_MESSAGE } from "@/lib/whatsapp-context";
import { IconWhatsApp } from "./Icons";

type Props = {
  /** Pre-filled message. The visitor still has to press Send in WhatsApp. */
  message?: string;
  children?: ReactNode;
  size?: "md" | "lg" | "sm";
  className?: string;
};

/** Server-renderable click-to-chat button (the final wa.me URL is in the static HTML). */
export function WhatsAppButton({ message = GENERAL_MESSAGE, children = "Chat on WhatsApp", size = "md", className = "" }: Props) {
  const href = buildWhatsAppUrl(siteConfig.whatsappNumber, message);
  const sizeClass = size === "lg" ? " btn-lg" : size === "sm" ? " btn-sm" : "";
  return (
    <a
      className={`btn btn-wa${sizeClass} ${className}`.trim()}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-wa-configured={siteConfig.whatsappConfigured ? "true" : "false"}
    >
      <IconWhatsApp size={20} />
      <span>{children}</span>
      <span className="sr-only"> (opens WhatsApp in a new tab)</span>
    </a>
  );
}
