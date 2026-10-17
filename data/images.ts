/**
 * Image catalogue. Files live in /public/images as <key>-640.webp and <key>-1280.webp.
 *
 * These are ORIGINAL SAMPLE ILLUSTRATIONS (see scripts/generate-images.cjs), not photographs
 * of House of Garden projects. To use real photos, export each one at 640px and 1280px wide
 * as WebP with the same file names (or edit this list), then set NEXT_PUBLIC_SAMPLE_IMAGES=false.
 */

export type ImageKey =
  | "hero"
  | "residential"
  | "society"
  | "lawn"
  | "landscaping"
  | "vertical"
  | "balcony"
  | "irrigation"
  | "pots"
  | "makeover"
  | "maintenance"
  | "soil"
  | "frames";

export type SiteImage = {
  key: ImageKey;
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
  /** Short caption / category label. */
  label: string;
};

const make = (key: ImageKey, height: number, alt: string, label: string): SiteImage => ({
  key,
  src: `/images/${key}-1280.webp`,
  srcSet: `/images/${key}-640.webp 640w, /images/${key}-1280.webp 1280w`,
  width: 1280,
  height,
  alt,
  label,
});

export const images: Record<ImageKey, SiteImage> = {
  hero: make(
    "hero",
    1536,
    "Illustration of a terrace garden with tall palms, a snake plant in a terracotta pot and lush green foliage",
    "Terrace garden",
  ),
  residential: make(
    "residential",
    960,
    "Illustration of a bungalow with a striped lawn, a winding stone path, trees and flower beds",
    "Residential garden",
  ),
  society: make(
    "society",
    960,
    "Illustration of apartment buildings with a tree-lined garden path, benches and lamp posts",
    "Society garden",
  ),
  lawn: make(
    "lawn",
    960,
    "Illustration of a striped green lawn with stepping stones, a flower bed and a hedge border",
    "Lawn development",
  ),
  landscaping: make(
    "landscaping",
    960,
    "Illustration of a landscaped garden with a pebble path, boulders, ornamental grasses and trees",
    "Landscaping",
  ),
  vertical: make(
    "vertical",
    1707,
    "Illustration of a living green wall in a wooden frame above a planter box",
    "Vertical green wall",
  ),
  balcony: make(
    "balcony",
    1707,
    "Illustration of a balcony with hanging planters, potted plants and a city skyline behind",
    "Balcony plants",
  ),
  irrigation: make(
    "irrigation",
    960,
    "Illustration of lawn sprinklers and a drip irrigation line beside a planting bed",
    "Irrigation",
  ),
  pots: make(
    "pots",
    960,
    "Illustration of plant pots in different shapes and colours holding snake plants, palms and succulents",
    "Pots & planters",
  ),
  makeover: make(
    "makeover",
    960,
    "Illustration comparing a bare, dry garden before with a lush landscaped garden after",
    "Garden makeover",
  ),
  maintenance: make(
    "maintenance",
    960,
    "Illustration of a wheelbarrow, watering can and pruning shears beside neatly trimmed hedges",
    "Garden maintenance",
  ),
  soil: make(
    "soil",
    960,
    "Illustration of compost, cocopeat blocks, a potting mix bag and a tray of seedlings",
    "Soil, cocopeat & compost",
  ),
  frames: make(
    "frames",
    960,
    "Illustration of wooden wall-mounted frames holding small potted and trailing plants",
    "Hanging plant frames",
  ),
};

/** Gallery order (hero is not repeated here). */
export const galleryKeys: ImageKey[] = [
  "residential",
  "society",
  "lawn",
  "landscaping",
  "vertical",
  "balcony",
  "irrigation",
  "pots",
  "makeover",
  "maintenance",
  "soil",
  "frames",
];

/** Four images shown on the homepage preview. */
export const galleryPreviewKeys: ImageKey[] = ["residential", "vertical", "lawn", "pots"];
