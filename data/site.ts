import { ROUTES } from "@/lib/routes";
import type { Faq } from "./services";

/** Concise FAQs for the homepage (3–4 only; detailed FAQs live on the service pages). */
export const homeFaqs: Faq[] = [
  {
    q: "Which parts of Mumbai do you serve?",
    a: "We serve homes, societies and businesses across Mumbai, including the Western, Central and Harbour line suburbs and the Eastern side. Not sure we cover your locality? Send us a WhatsApp message.",
  },
  {
    q: "What gardening services do you offer?",
    a: "Garden maintenance and gardener (mali) services, landscaping and lawn development, vertical gardens and irrigation, and plants, pots, soil and compost.",
  },
  {
    q: "How do I get a quote or arrange a visit?",
    a: "Message us on WhatsApp or use the enquiry form with your location and a few photos of the space. We'll reply with the next steps.",
  },
  {
    q: "Do you supply plants, pots and soil as well?",
    a: "Yes. We supply plants, fibre and plastic pots, soil, cocopeat, compost, cow dung manure and potting mix. Stock varies, so check availability with us first.",
  },
];

/** Areas described at line level only. We do not claim an office or branch in any locality. */
export const serviceAreaLines = ["Western line", "Central line", "Harbour line", "Eastern suburbs"] as const;

/**
 * Optional: localities you have CONFIRMED you serve. Rendered as small tags under the area statement
 * when not empty. Leave empty until verified.
 */
export const confirmedLocalities: string[] = [];

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
};

/**
 * REAL, verified customer testimonials go here (with the customer's permission).
 * While this list is empty, no testimonial is published on a live site.
 */
export const testimonials: Testimonial[] = [];

/**
 * DEMO placeholders used ONLY to preview the layout on preview builds
 * (or when NEXT_PUBLIC_SHOW_DEMO_CONTENT=true). They are labelled "Demo" in the UI.
 */
export const demoTestimonials: Testimonial[] = [
  {
    quote:
      "Demo review text to preview this layout. Replace with a real, verified customer review before launch.",
    name: "Placeholder name A",
    detail: "Demo · Mumbai",
  },
  {
    quote:
      "Another demo review. This card shows how a slightly longer testimonial wraps across several lines in the design, so you can judge spacing and rhythm.",
    name: "Placeholder name B",
    detail: "Demo · Mumbai",
  },
  {
    quote: "Short demo review for layout preview only.",
    name: "Placeholder name C",
    detail: "Demo · Mumbai",
  },
];

export const mainNav = [
  { label: "Home", href: ROUTES.home },
  { label: "Services", children: true as const },
  { label: "Gallery", href: ROUTES.gallery },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
];

export const aboutSteps = [
  {
    title: "Tell us about your space",
    text: "Message us on WhatsApp with your location, the kind of space and a few photos.",
  },
  {
    title: "We suggest the right approach",
    text: "We come back with options for maintenance, landscaping, green walls or supplies that suit your garden.",
  },
  {
    title: "Agree the plan",
    text: "Once the scope is clear, we agree the plan with you and get started.",
  },
];
