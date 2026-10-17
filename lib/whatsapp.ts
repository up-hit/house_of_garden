/**
 * Pure WhatsApp / phone helpers. No environment access here so they can be unit tested.
 * Click-to-chat docs: https://faq.whatsapp.com/5913398998672934
 */

export const DEFAULT_COUNTRY_CODE = "91"; // India

/**
 * Normalise a typed phone number to international digits (no "+", no spaces).
 * Returns null when it cannot plausibly be a phone number.
 *
 * - "98765 43210", "09876543210", "+91 98765-43210", "919876543210" -> "919876543210"
 * - Numbers with an explicit "+" or "00" prefix are accepted as-is (8–15 digits, E.164 limit).
 * - Bare 10-digit numbers must look like an Indian mobile (start with 6–9).
 */
export function normalizePhone(input: string, defaultCountryCode: string = DEFAULT_COUNTRY_CODE): string | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;
  if (!/^\+?[\d\s().-]+$/.test(raw)) return null; // letters / stray symbols / "+" in the middle

  const explicit = raw.startsWith("+");
  let digits = raw.replace(/\D/g, "");
  let international = explicit;
  if (!explicit && digits.startsWith("00")) {
    digits = digits.slice(2);
    international = true;
  }

  if (international) return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;

  const indianMobile = (d: string) => /^[6-9]\d{9}$/.test(d);
  if (digits.length === 10) return indianMobile(digits) ? defaultCountryCode + digits : null;
  if (digits.length === 11 && digits.startsWith("0")) {
    const rest = digits.slice(1);
    return indianMobile(rest) ? defaultCountryCode + rest : null;
  }
  if (digits.length === 12 && digits.startsWith(defaultCountryCode)) {
    return indianMobile(digits.slice(defaultCountryCode.length)) ? digits : null;
  }
  if (digits.length >= 11 && digits.length <= 15 && /^[1-9]/.test(digits)) return digits;
  return null;
}

/** https://wa.me/<digits>?text=<encoded message>. The visitor must still press Send in WhatsApp. */
export function buildWhatsAppUrl(number: string, message?: string): string {
  const digits = (number ?? "").replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message && message.trim() ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export type EnquiryFields = {
  name?: string;
  email?: string;
  phone: string;
  purpose: string;
};

/** Plain-text message that is pre-filled into WhatsApp from the enquiry form. */
export function buildEnquiryMessage(e: EnquiryFields, businessName = "House of Garden"): string {
  const lines = [
    `Hello ${businessName},`,
    "",
    "I'd like to enquire about:",
    e.purpose.trim(),
    "",
  ];
  if (e.name?.trim()) lines.push(`Name: ${e.name.trim()}`);
  lines.push(`Contact number: ${e.phone.trim()}`);
  if (e.email?.trim()) lines.push(`Email: ${e.email.trim()}`);
  lines.push("", "(Sent from the website enquiry form)");
  return lines.join("\n");
}

/** `tel:` href for a displayed phone number, or undefined if it is not a usable number. */
export function telHref(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  const n = normalizePhone(phone);
  return n ? `tel:+${n}` : undefined;
}
