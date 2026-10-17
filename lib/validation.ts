import { normalizePhone } from "./whatsapp";

export type EnquiryInput = {
  name: string;
  email: string;
  phone: string;
  purpose: string;
};

export type EnquiryField = keyof EnquiryInput;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const LIMITS = {
  name: 80,
  email: 120,
  purposeMin: 5,
  purposeMax: 600,
} as const;

// Pragmatic check: something@something.tld, no spaces. The mail server is the real validator.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Strip control characters but keep normal text and new lines.
// eslint-disable-next-line no-control-regex
const stripControl = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

export type ValidationResult = {
  ok: boolean;
  errors: EnquiryErrors;
  /** Trimmed, control-character-free values (safe to use even if !ok). */
  clean: EnquiryInput;
};

export function validateEnquiry(input: EnquiryInput): ValidationResult {
  const clean: EnquiryInput = {
    name: stripControl(input.name ?? "").trim(),
    email: stripControl(input.email ?? "").trim(),
    phone: stripControl(input.phone ?? "").trim(),
    purpose: stripControl(input.purpose ?? "").trim(),
  };
  const errors: EnquiryErrors = {};

  if (clean.name.length > LIMITS.name) {
    errors.name = `Please keep your name under ${LIMITS.name} characters.`;
  }

  if (clean.email) {
    if (clean.email.length > LIMITS.email || !EMAIL_RE.test(clean.email)) {
      errors.email = "Enter a valid email address, or leave this blank.";
    }
  }

  if (!clean.phone) {
    errors.phone = "Enter your contact number so we can reach you.";
  } else if (!normalizePhone(clean.phone)) {
    errors.phone = "Enter a valid mobile number, for example 98765 43210 or +91 98765 43210.";
  }

  if (!clean.purpose) {
    errors.purpose = "Tell us briefly what you need help with.";
  } else if (clean.purpose.length < LIMITS.purposeMin) {
    errors.purpose = "Please add a little more detail (at least a few words).";
  } else if (clean.purpose.length > LIMITS.purposeMax) {
    errors.purpose = `Please keep this under ${LIMITS.purposeMax} characters.`;
  }

  return { ok: Object.keys(errors).length === 0, errors, clean };
}

/** Order the fields appear in the form — used to focus the first invalid one. */
export const FIELD_ORDER: EnquiryField[] = ["name", "email", "phone", "purpose"];
