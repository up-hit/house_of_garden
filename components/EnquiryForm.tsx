"use client";

import { usePathname } from "next/navigation";
import { useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { siteConfig } from "@/lib/config";
import {
  FIELD_ORDER,
  LIMITS,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
  type EnquiryInput,
} from "@/lib/validation";
import { buildEnquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { IconCheck, IconWhatsApp } from "./Icons";

type EmailState = "none" | "sending" | "sent" | "failed";
type Result = { waUrl: string; popupBlocked: boolean; email: EmailState };

const EMPTY: EnquiryInput = { name: "", email: "", phone: "", purpose: "" };

/**
 * Enquiry form. On submit it opens WhatsApp with the enquiry pre-filled (the visitor must still press
 * Send there). If NEXT_PUBLIC_FORM_ENDPOINT is configured, the same enquiry is ALSO posted to that form
 * service in the background so it reaches the business email. We only say an email was sent after the
 * service actually answered "ok".
 */
export function EnquiryForm() {
  const pathname = usePathname();
  const uid = useId();
  const [values, setValues] = useState<EnquiryInput>(EMPTY);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [trap, setTrap] = useState(""); // honeypot for bots
  const [result, setResult] = useState<Result | null>(null);

  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    purpose: useRef<HTMLTextAreaElement>(null),
  };

  const id = (f: EnquiryField) => `${uid}-${f}`;
  const errId = (f: EnquiryField) => `${uid}-${f}-error`;
  const hintId = (f: EnquiryField) => `${uid}-${f}-hint`;
  const hasErrors = Object.keys(errors).length > 0;

  const onChange =
    (field: EnquiryField) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { ok, errors: found, clean } = validateEnquiry(values);
    const visible: EnquiryErrors = {};
    for (const f of FIELD_ORDER) if (found[f]) visible[f] = found[f];
    setErrors(visible);

    if (!ok) {
      const first = FIELD_ORDER.find((f) => visible[f]);
      if (first) refs[first].current?.focus();
      return;
    }

    // Bots fill the hidden field. Do nothing, but look like a normal reset so they learn nothing.
    if (trap) {
      setValues(EMPTY);
      return;
    }

    const message = buildEnquiryMessage(clean);
    const waUrl = buildWhatsAppUrl(siteConfig.whatsappNumber, message);

    // Must run synchronously inside the click/submit handler or browsers treat it as a pop-up.
    const win = window.open(waUrl, "_blank");
    if (win) win.opener = null;

    const endpoint = siteConfig.formEndpoint;
    setResult({ waUrl, popupBlocked: !win, email: endpoint ? "sending" : "none" });

    if (endpoint) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 12000);
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: clean.name,
          email: clean.email,
          phone: clean.phone,
          purpose: clean.purpose,
          page: pathname,
          _subject: "New website enquiry: House of Garden",
        }),
        signal: controller.signal,
      })
        .then((r) => setResult((prev) => (prev ? { ...prev, email: r.ok ? "sent" : "failed" } : prev)))
        .catch(() => setResult((prev) => (prev ? { ...prev, email: "failed" } : prev)))
        .finally(() => window.clearTimeout(timer));
    }
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setResult(null);
    window.setTimeout(() => refs.name.current?.focus(), 0);
  }

  if (result) {
    return (
      <div className="form-result" role="status" aria-live="polite">
        <span className="form-result-icon">
          <IconCheck size={22} />
        </span>
        <h3>Almost done: press Send in WhatsApp</h3>
        <p>
          We've opened WhatsApp with your enquiry filled in. <strong>Your message only reaches us once you press Send
          there.</strong>
        </p>
        {result.popupBlocked ? (
          <p className="form-note">Your browser may have blocked the WhatsApp window. Use the button below.</p>
        ) : null}
        <p>
          <a className="btn btn-wa" href={result.waUrl} target="_blank" rel="noopener noreferrer">
            <IconWhatsApp size={20} />
            <span>{result.popupBlocked ? "Open WhatsApp" : "Open WhatsApp again"}</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
        {result.email === "sending" ? <p className="form-note">Sending a copy to our email…</p> : null}
        {result.email === "sent" ? <p className="form-note">A copy of your enquiry was also sent to our team by email.</p> : null}
        {result.email === "failed" ? (
          <p className="form-note">
            We couldn't send the email copy, so please make sure you press Send in WhatsApp.
          </p>
        ) : null}
        {!siteConfig.whatsappConfigured && !siteConfig.isLive ? (
          <p className="dev-note" role="note">
            <strong>Preview note:</strong> NEXT_PUBLIC_WHATSAPP_NUMBER is not set, so this opens a placeholder number.
          </p>
        ) : null}
        <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="form" noValidate onSubmit={onSubmit} aria-label="Enquiry form">
      {hasErrors ? (
        <div className="form-alert" role="alert">
          Please check the highlighted fields and try again.
        </div>
      ) : null}

      <div className={`field${errors.name ? " has-error" : ""}`}>
        <label htmlFor={id("name")}>
          Name <span className="opt">(optional)</span>
        </label>
        <input
          ref={refs.name}
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={LIMITS.name + 20}
          value={values.name}
          onChange={onChange("name")}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? errId("name") : undefined}
        />
        {errors.name ? (
          <p id={errId("name")} className="field-error">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className={`field${errors.email ? " has-error" : ""}`}>
        <label htmlFor={id("email")}>
          Email <span className="opt">(optional)</span>
        </label>
        <input
          ref={refs.email}
          id={id("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={onChange("email")}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? errId("email") : undefined}
        />
        {errors.email ? (
          <p id={errId("email")} className="field-error">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className={`field${errors.phone ? " has-error" : ""}`}>
        <label htmlFor={id("phone")}>
          Contact number <span className="req">(required)</span>
        </label>
        <input
          ref={refs.phone}
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="98765 43210"
          required
          aria-required="true"
          value={values.phone}
          onChange={onChange("phone")}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? `${hintId("phone")} ${errId("phone")}` : hintId("phone")}
        />
        <p id={hintId("phone")} className="field-hint">
          Mobile number we can reach you on, ideally with WhatsApp.
        </p>
        {errors.phone ? (
          <p id={errId("phone")} className="field-error">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <div className={`field${errors.purpose ? " has-error" : ""}`}>
        <label htmlFor={id("purpose")}>
          Purpose of enquiry <span className="req">(required)</span>
        </label>
        <textarea
          ref={refs.purpose}
          id={id("purpose")}
          name="purpose"
          rows={4}
          placeholder="e.g. Monthly maintenance for our society garden in Powai"
          required
          aria-required="true"
          value={values.purpose}
          onChange={onChange("purpose")}
          aria-invalid={errors.purpose ? true : undefined}
          aria-describedby={errors.purpose ? errId("purpose") : undefined}
        />
        {errors.purpose ? (
          <p id={errId("purpose")} className="field-error">
            {errors.purpose}
          </p>
        ) : null}
      </div>

      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it in. */}
      <div className="hp" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>

      <button type="submit" className="btn btn-wa btn-lg form-submit">
        <IconWhatsApp size={20} />
        <span>Send enquiry on WhatsApp</span>
      </button>

      <p className="form-privacy">
        We use your details only to reply to your enquiry. Submitting opens WhatsApp with your message pre-filled;
        nothing is sent to us until you press Send there.
      </p>
    </form>
  );
}
