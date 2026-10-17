import { ServicePage } from "@/components/ServicePage";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/seo";

const service = services.plants;

export const metadata = pageMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.path,
});

export default function Page() {
  return <ServicePage service={service} />;
}
