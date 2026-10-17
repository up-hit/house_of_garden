// Runs automatically before `next build` (npm "prebuild" script).
// Prints what is still a placeholder and refuses to build a *live* (indexable)
// site that would send enquiries to a placeholder WhatsApp number.

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Minimal .env loader (same precedence idea as Next: real env vars win).
function loadEnvFiles(root) {
  const mode = process.env.NODE_ENV === "development" ? "development" : "production";
  const files = [`.env.${mode}.local`, ".env.local", `.env.${mode}`, ".env"];
  for (const file of files) {
    const path = resolve(root, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let value = m[2];
      if (/^(".*"|'.*')$/.test(value)) value = value.slice(1, -1);
      else value = value.replace(/\s+#.*$/, "");
      if (process.env[m[1]] === undefined) process.env[m[1]] = value;
    }
  }
}

loadEnvFiles(process.cwd());

const get = (name) => (process.env[name] ?? "").trim();
const siteUrl = get("NEXT_PUBLIC_SITE_URL");
const whatsapp = get("NEXT_PUBLIC_WHATSAPP_NUMBER").replace(/\D/g, "");
const allowPlaceholders = get("NEXT_PUBLIC_ALLOW_PLACEHOLDERS") === "true";
const live = siteUrl !== "";

const errors = [];
const warnings = [];

if (live && !/^https:\/\/[^\s/]+\.[^\s/]+$/i.test(siteUrl.replace(/\/+$/, ""))) {
  errors.push(
    `NEXT_PUBLIC_SITE_URL must be a full https URL such as https://www.example.in (got "${siteUrl}").`,
  );
}

const whatsappValid = /^[1-9]\d{9,14}$/.test(whatsapp);
if (!whatsappValid) {
  const msg =
    "NEXT_PUBLIC_WHATSAPP_NUMBER is missing or invalid (use international format, digits only, e.g. 919876543210).";
  if (live) errors.push(msg);
  else warnings.push(msg + " A non-working placeholder will be used.");
}

const optional = [
  ["NEXT_PUBLIC_PHONE", "phone number (call link hidden)"],
  ["NEXT_PUBLIC_EMAIL", "business email (email link hidden)"],
  ["NEXT_PUBLIC_ADDRESS", "office address (address hidden)"],
  ["NEXT_PUBLIC_INSTAGRAM_URL", "Instagram link (hidden)"],
  ["NEXT_PUBLIC_FACEBOOK_URL", "Facebook link (hidden)"],
  ["NEXT_PUBLIC_GOOGLE_REVIEWS_URL", "Google Reviews button (hidden)"],
  ["NEXT_PUBLIC_FORM_ENDPOINT", "form service (enquiries go to WhatsApp only)"],
];
for (const [name, what] of optional) {
  if (!get(name)) warnings.push(`${name} not set — ${what}.`);
}

if (!live) {
  warnings.push(
    "NEXT_PUBLIC_SITE_URL not set — building a PREVIEW: noindex, robots.txt blocks crawlers, demo content visible.",
  );
}
if (live && get("NEXT_PUBLIC_SAMPLE_IMAGES") !== "false") {
  warnings.push(
    'Live build is still labelling images as "Sample illustration" (NEXT_PUBLIC_SAMPLE_IMAGES is not "false").',
  );
}

console.log("\nHouse of Garden — configuration check");
console.log(`  mode: ${live ? "LIVE (indexable)" : "PREVIEW (noindex)"}`);
for (const w of warnings) console.log(`  ! ${w}`);
for (const e of errors) console.error(`  ✗ ${e}`);

if (errors.length && !allowPlaceholders) {
  console.error(
    "\nBuild stopped: fix the items marked ✗ (or set NEXT_PUBLIC_ALLOW_PLACEHOLDERS=true to override).\n",
  );
  process.exit(1);
}
console.log("");
