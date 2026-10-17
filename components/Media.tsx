import { images, type ImageKey } from "@/data/images";
import { siteConfig } from "@/lib/config";

type PhotoProps = {
  name: ImageKey;
  /** The `sizes` attribute: tells the browser which file to download for the layout. */
  sizes: string;
  /** Above-the-fold image: loads eagerly with high fetch priority. */
  priority?: boolean;
  className?: string;
};

export function Photo({ name, sizes, priority = false, className }: PhotoProps) {
  const img = images[name];
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={sizes}
      width={img.width}
      height={img.height}
      alt={img.alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      {...(priority ? { fetchPriority: "high" as const } : {})}
      className={className}
    />
  );
}

type MediaProps = PhotoProps & {
  /** Show the "Sample illustration" pill (only while the images are samples). */
  badge?: boolean;
  /** Extra class on the wrapper, e.g. aspect-ratio helpers. */
  frameClass?: string;
};

/** Image inside a rounded frame with optional "sample illustration" label. */
export function Media({ badge = true, frameClass = "", ...photo }: MediaProps) {
  return (
    <div className={`media ${frameClass}`.trim()}>
      <Photo {...photo} />
      {badge && siteConfig.sampleImages ? <span className="pill pill-sample">Sample illustration</span> : null}
    </div>
  );
}
