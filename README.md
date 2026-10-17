# House of Garden — website

Gardening and landscaping services in Mumbai. A fast, accessible, SEO-friendly multi-page site built with
**Next.js 15 (App Router) + React 19 + TypeScript**, exported as **plain static files** and designed for
**Cloudflare Pages**. WhatsApp is the primary call to action on every page.

> **Status: ready to review, not ready to launch.** All business details are placeholders until you supply
> real ones (see [Before you go live](#before-you-go-live)). The site is built so that an un-configured build
> **cannot be indexed by search engines** and never shows invented business facts as real.

---

## 1. Quick start

Requires Node.js 18.18+ (22 recommended; `.nvmrc` is included).

```bash
npm install
npm run dev          # http://localhost:3000 — preview mode (noindex, demo content visible)
npm test             # 50 unit tests (phone/WhatsApp helpers, validation, SEO rules, content rules)
npm run typecheck
npm run build        # runs scripts/check-config.mjs first, then `next build` → ./out
npm run preview      # serves ./out locally (uses `npx serve`)
```

Copy `.env.example` to `.env.local` and fill in values as you get them (all optional for a preview).

## 2. Pages

| Route | Purpose |
|---|---|
| `/` | Concise homepage: hero (exact H1), 4 service cards, 4-image gallery preview, reviews area, service-area + 4 FAQs |
| `/garden-maintenance-mumbai/` | Gardeners / mali, home, society, bungalow, office and hotel garden maintenance |
| `/landscaping-mumbai/` | Landscaping, garden development, lawn development and makeovers |
| `/vertical-gardens-mumbai/` | Real and artificial green walls, irrigation, self-watering systems, hanging frames |
| `/plants-pots-soil-mumbai/` | Nursery plants, fibre/plastic pots, soil, cocopeat, compost, cow dung, potting mix, organic bio inputs |
| `/gallery/` | 12 sample images with an accessible lightbox |
| `/about/` | What we do, how it works, where we work |
| `/contact/` | WhatsApp, contact details, enquiry form |
| `/404` | Custom not-found page (`404.html`) |

Header navigation: Home · Services (dropdown to the four service pages) · Gallery · About · Contact, plus a theme
toggle and a WhatsApp button. There are no hash links standing in for pages.

## 3. Configuration

Everything is configured with environment variables (`NEXT_PUBLIC_*`, compiled into the public site — **never
put passwords, SMTP logins or secret API keys in them**). See `.env.example` for comments.

| Variable | What it does | Needed for launch? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Verified production domain (`https://www.yourdomain.in`, no trailing slash). **Setting it makes the build "live".** | Yes |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business WhatsApp, international format, digits only (e.g. `919876543210`). A live build **fails** without it. | Yes |
| `NEXT_PUBLIC_PHONE` | Phone number for the call link (hidden if empty) | Recommended |
| `NEXT_PUBLIC_EMAIL` | Public business email (mailto link; hidden if empty) | Recommended |
| `NEXT_PUBLIC_ADDRESS` | One-line verified address (hidden if empty) | Only if you have a real one |
| `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL` | Social links in the footer/contact page (hidden if empty) | Optional |
| `NEXT_PUBLIC_GOOGLE_REVIEWS_URL` | Real Google Business reviews link → "Read our reviews on Google" button | Recommended |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Public form-service URL that emails each enquiry (see §7) | Optional |
| `NEXT_PUBLIC_SAMPLE_IMAGES` | Set to `false` once real photos replace the samples (hides "Sample illustration" labels) | Yes, after photo swap |
| `NEXT_PUBLIC_SHOW_DEMO_CONTENT` | Force demo testimonials/address on a live build (leave empty) | No |
| `NEXT_PUBLIC_ALLOW_PLACEHOLDERS` | Emergency override of the pre-build check (**do not use for launch**) | No |

### Preview mode vs live mode

| | **Preview** (no `SITE_URL`) | **Live** (`SITE_URL` = https URL) |
|---|---|---|
| Search engines | `noindex, nofollow` meta; `robots.txt` = `Disallow: /`; empty sitemap | Indexable; `sitemap.xml` with all 8 pages; `robots.txt` points to it |
| Canonical / Open Graph URLs | Not emitted | Emitted from `SITE_URL` |
| Structured data (JSON-LD) | None | `LocalBusiness` (no address, no ratings), `Service`, `BreadcrumbList`, `FAQPage` |
| Demo testimonials / DEMO address | Visible and clearly labelled | Hidden |
| WhatsApp number missing | Placeholder `910000000000` (non-working) + on-page notes | **Build fails** |

This is deliberate: a staging deployment or a half-configured build can never leak demo content into Google.

## 4. Before you go live

1. **WhatsApp number** — set `NEXT_PUBLIC_WHATSAPP_NUMBER`. Open every WhatsApp button once on a phone and confirm the chat opens to the right number.
2. **Domain** — set `NEXT_PUBLIC_SITE_URL` once the production domain is verified.
3. **Contact details** — phone, email, (real) address, Instagram, Facebook, Google Reviews link.
4. **Photos** — replace the sample illustrations (see §6) and set `NEXT_PUBLIC_SAMPLE_IMAGES=false`.
5. **Testimonials** — add only genuine, permitted reviews to `testimonials` in `data/site.ts` (up to 4 show on the homepage). Until then a live site shows just the Google Reviews button. Do not publish ratings or review counts you cannot prove.
6. **Service-area localities** — if you want specific suburb tags, add only places you really serve to `confirmedLocalities` in `data/site.ts`.
7. **About page** — add your story and any *verified* credentials. Nothing about years of experience, awards, certifications or clients is stated on purpose.
8. **Home maintenance wording** — the maintenance page assumes you offer it; edit `data/services.ts` if not.
9. **Email delivery** (optional) — see §7.
10. Run `npm test`, then `npm run build`, and click through the exported site (`npm run preview`).

## 5. WhatsApp behaviour

- Floating button on every page: official WhatsApp green (`#25D366`) + glyph, fixed bottom-right, gentle entrance, a subtle pulse ring and a once-per-session welcome tooltip (dismissible with ✕ or Esc). No bouncing, no fake urgency.
- It **fades out and leaves the tab order** while the enquiry form or a call-to-action band overlaps its corner, so it never covers form fields or buttons.
- All WhatsApp links use the official click-to-chat format `https://wa.me/<number>?text=<message>`, opening in a new tab with `rel="noopener noreferrer"`. Messages are pre-filled and page-specific (e.g. the vertical-gardens page asks about vertical gardens).
- The visitor always has to press **Send** inside WhatsApp; the site can't send a message for them, and says so.
- Animation (pulse, entrance) is turned off for visitors who prefer reduced motion.

## 6. Images

`public/images/` contains 13 **original, code-generated illustrations** (two widths each: `-640.webp`, `-1280.webp`) plus `public/og/og-default.jpg` (social preview). They are placeholders so the layout looks finished — **they are not photos of your work** and are labelled "Sample illustration" until `NEXT_PUBLIC_SAMPLE_IMAGES=false`.

To use real photos: export each as WebP at 640 px and 1280 px wide with the same file name (e.g. `vertical-640.webp`, `vertical-1280.webp`), keep the aspect ratio of the file you replace (landscape 4:3 mostly; the hero is portrait 5:6), and update the alt text in `data/images.ts`. Only use photos you own or are licensed to use. `npm run images:generate` regenerates the samples (needs `sharp`).

## 7. Enquiry form and email delivery

The form collects: name (optional), email (optional), **contact number (required)** and **purpose (required)**, with inline, accessible validation (errors are announced, the first invalid field is focused). A hidden honeypot field silently stops simple bots.

On a valid submit the site **opens WhatsApp with the enquiry pre-filled** and shows "press Send in WhatsApp to deliver it". It never claims the enquiry was received.

**Getting a copy by email (optional).** A static site cannot hold email credentials. Two safe options:

1. **Form service (simplest).** Create a form at a service such as Formspree, verify your business email with them, and set `NEXT_PUBLIC_FORM_ENDPOINT` to the public endpoint URL. The form then also POSTs JSON `{name, email, phone, purpose, page, _subject}` in the background (12 s timeout). The page says the email copy was sent **only after the service answers OK**, and says plainly if it didn't. *Not tested against a real service in this delivery — only against a mocked endpoint. Send yourself a test enquiry after configuring it.*
2. **Your own Cloudflare Pages Function / Worker** that calls an email API using a secret stored in Cloudflare's encrypted variables (never in this repo). Point `NEXT_PUBLIC_FORM_ENDPOINT` at it. Not included here.

The email address on the contact page is a plain `mailto:` link; it only opens the visitor's email app and the page says so.

## 8. SEO

- Unique `<title>` and meta description on every page (≤ 62 / 90–160 characters, enforced by tests); one `<h1>` per page and a logical heading order.
- Natural coverage of Mumbai terms (gardener/mali, garden maintenance, home gardening, landscaping, garden development, lawn, vertical gardens, irrigation, nursery/pots/soil, society/office/bungalow/hotel) in the copy — no keyword lists, no guaranteed-ranking claims.
- Internal links between the service pages, homepage cards and footer; descriptive alt text; `<img>` with explicit sizes (no layout shift); `lang="en-IN"`.
- `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph/Twitter tags and JSON-LD — **live mode only** (see §3). The structured data never includes the demo address, ratings or review counts.
- After launch: add the site to Google Search Console and Google Business Profile, submit `https://<domain>/sitemap.xml`.

## 9. Deploy to Cloudflare Pages

Push the project to GitHub/GitLab, then **Workers & Pages → Create → Pages → Connect to Git** and use:

| Setting | Value |
|---|---|
| Framework preset | `Next.js (Static HTML Export)` (or `None`) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | *(repo root; leave blank)* |
| Environment variable | `NODE_VERSION` = `22` |

Add the `NEXT_PUBLIC_*` variables from §3 under **Settings → Variables and Secrets**:

- **Production** environment: the real values, including `NEXT_PUBLIC_SITE_URL`.
- **Preview** environment: leave `NEXT_PUBLIC_SITE_URL` **empty** so preview deployments stay noindex (the other values may be the same).
- Variables are read at build time, so **redeploy after changing any of them**.

Then add your custom domain under **Custom domains**. `public/_headers` is copied into the output and adds basic security headers, long-term caching for hashed assets, and `X-Robots-Tag: noindex` for the default `*.pages.dev` addresses so only your own domain gets indexed. (If a project needs a different Node version, change `NODE_VERSION`; Next 15 needs ≥ 18.18.)

Direct upload alternative: `npm run build`, then upload the `out` folder (or `npx wrangler pages deploy out`).

Commit the `package-lock.json` that `npm install` creates so Cloudflare installs the exact same versions.

## 10. Project structure

```
app/            routes (one folder per page), layout, globals.css (design system), sitemap.ts, robots.ts, not-found.tsx
components/     Header, Footer, WhatsAppFloat, EnquiryForm, GalleryGrid, ThemeToggle, Testimonials, ServicePage, Blocks…
data/           services.ts (all service-page copy), site.ts (FAQs, testimonials, nav), images.ts (alt text, galleries)
lib/            config.ts (env → settings), seo.ts, whatsapp.ts, validation.ts, routes.ts, theme-script.ts
public/         images/ (WebP samples), og/, _headers
scripts/        check-config.mjs (pre-build), generate-images.cjs
tests/          unit tests (tsx --test)
```

Design notes: forest-green / leaf-green / sage / off-white palette, Fraunces (headings) + Manrope (body) via `next/font`, plain CSS custom properties, no UI framework. Light/dark theme toggle remembers the choice (`localStorage`), follows the system setting until the visitor chooses, and is applied before first paint to avoid a flash. All motion (hero entrance, scroll reveal, hover zoom, menu, theme fade, WhatsApp pulse) is switched off under `prefers-reduced-motion`, and content is fully visible without JavaScript.

## 11. What has and hasn't been verified

Honest status of this delivery:

**Verified in the build environment**
- 50 unit tests pass (`npm test`), covering phone normalisation, WhatsApp URLs, form validation, route/page files, SEO field rules, content rules, and the preview/live/invalid-URL SEO scenarios.
- Every page component was server-rendered to static HTML, hydrated in headless Chromium and exercised in **both** the preview and live configurations (73 browser checks each, all passing): one `<h1>` per page, unique titles/descriptions, all internal links and the `#services` anchor resolve, images load with alt text, **no horizontal overflow at 360/390/768/1024/1440 px**, WhatsApp links/number/messages, floating button on every page (colour, animation, reduced motion, tooltip, hiding over the form/CTA bands), theme default/toggle/persistence, desktop dropdown and mobile menu (keyboard, Esc, outside click), enquiry form (empty/invalid/valid submits, honeypot, WhatsApp window, no false "email sent" claims, mocked form-service success/failure), gallery lightbox, scroll reveal (also with reduced motion and with JavaScript off), preview-vs-live differences (noindex, canonical, JSON-LD, demo content, sitemap, robots).
- A WCAG AA contrast sweep of every text node on every page in light and dark mode (≈2,400 checks) found no failures.
- The TypeScript sources type-check against stand-in React/Next type declarations.

**Not verified — please do on your side**
- **`next build` itself was not run**: the sandbox this was built in could not reach the npm registry, so Next.js could not be installed. The pages were rendered with the same components and an equivalent test harness instead. Run `npm install && npm test && npm run build` first; if it reports a problem, it will most likely be a small type or config detail. `next/font/google` also needs internet access during the build to fetch the fonts (Cloudflare's build has it).
- The `_headers` hostname rules (`*.pages.dev` noindex), Cloudflare deployment, a real form-service integration, and the real WhatsApp number have not been tested because none of them exist yet.
- Lighthouse / Core Web Vitals scores were not measured. The design avoids the usual causes of poor scores (pre-sized WebP images with `srcset`, lazy loading below the fold, no third-party scripts, no layout shift), but measure after deploying.

## 12. Troubleshooting

- **Build stops with "NEXT_PUBLIC_WHATSAPP_NUMBER is missing or invalid"** — you set `NEXT_PUBLIC_SITE_URL` (live build) but no WhatsApp number. Add the number (digits only, with country code).
- **Site isn't appearing in Google** — check `NEXT_PUBLIC_SITE_URL` is set for the *Production* environment, redeploy, then submit the sitemap in Search Console. A `*.pages.dev` address is intentionally noindex.
- **"Sample illustration" / DEMO labels still showing on the live site** — you're viewing a preview build, or `NEXT_PUBLIC_SAMPLE_IMAGES` isn't `false`.
- **WhatsApp opens but the number is wrong** — the variable has spaces, `+` or a missing country code; the build check will flag an invalid value.
- **Pop-up blocked on form submit** — the page shows a "Open WhatsApp" fallback link; browsers only allow the window when it comes straight from the button click.
