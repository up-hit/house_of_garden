import { services } from "@/data/services";
import { ROUTES, normalizePath } from "./routes";

export const GENERAL_MESSAGE =
  "Hello House of Garden, I'd like to enquire about your gardening and landscaping services in Mumbai.";

const byPath: Record<string, string> = {
  [normalizePath(ROUTES.maintenance)]: services.maintenance.waMessage,
  [normalizePath(ROUTES.landscaping)]: services.landscaping.waMessage,
  [normalizePath(ROUTES.vertical)]: services.vertical.waMessage,
  [normalizePath(ROUTES.plants)]: services.plants.waMessage,
  [normalizePath(ROUTES.gallery)]:
    "Hello House of Garden, I saw your gallery and would like to discuss a garden project in Mumbai.",
};

/** Pre-filled WhatsApp message that matches the page the visitor is on. */
export function whatsappMessageForPath(pathname: string | null | undefined): string {
  return byPath[normalizePath(pathname)] ?? GENERAL_MESSAGE;
}
