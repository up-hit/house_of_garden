/** Every real page in the site. Paths include the trailing slash (next.config trailingSlash: true). */
export const ROUTES = {
  home: "/",
  maintenance: "/garden-maintenance-mumbai/",
  landscaping: "/landscaping-mumbai/",
  vertical: "/vertical-gardens-mumbai/",
  plants: "/plants-pots-soil-mumbai/",
  gallery: "/gallery/",
  about: "/about/",
  contact: "/contact/",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** All indexable paths, used by sitemap.xml. */
export const ALL_PATHS: string[] = Object.values(ROUTES);

/** "/contact/?x=1#y" -> "/contact"; "/" stays "/". Used to compare the current URL with nav links. */
export function normalizePath(path: string | null | undefined): string {
  if (!path) return "/";
  let p = path.split("#")[0].split("?")[0];
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
}

export function isActivePath(current: string | null | undefined, href: string): boolean {
  return normalizePath(current) === normalizePath(href);
}
