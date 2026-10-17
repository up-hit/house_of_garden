"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { images, type ImageKey } from "@/data/images";
import { siteConfig } from "@/lib/config";
import { IconChevronLeft, IconChevronRight, IconClose } from "./Icons";

/** Responsive masonry gallery with an accessible lightbox built on the native <dialog> element. */
export function GalleryGrid({ keys }: { keys: ImageKey[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Keep the native dialog in sync with state.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const open = (i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setIndex(i);
  };
  const close = () => setIndex(null);
  const step = (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + keys.length) % keys.length));

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };
  // A click on the dialog box itself (outside the figure and buttons) is a click on the backdrop.
  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) close();
  };

  const current = index === null ? null : images[keys[index]];

  return (
    <>
      <ul className="masonry">
        {keys.map((key, i) => {
          const img = images[key];
          return (
            <li key={key} className="tile">
              <button type="button" className="tile-btn" onClick={() => open(i)} aria-label={`View larger: ${img.label}`}>
                <img
                  src={img.src}
                  srcSet={img.srcSet}
                  sizes="(min-width: 900px) 33vw, (min-width: 560px) 50vw, 100vw"
                  width={img.width}
                  height={img.height}
                  alt={img.alt}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
                <span className="tile-cap">{img.label}</span>
              </button>
              {siteConfig.sampleImages ? <span className="pill pill-sample">Sample illustration</span> : null}
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Image viewer"
        onClose={() => {
          setIndex(null);
          opener.current?.focus();
        }}
        onKeyDown={onKeyDown}
        onClick={onBackdrop}
      >
        {current ? (
          <div className="lightbox-inner">
            <button type="button" className="lightbox-close" onClick={close} aria-label="Close image viewer">
              <IconClose size={22} />
            </button>
            <button type="button" className="lightbox-nav lightbox-prev" onClick={() => step(-1)} aria-label="Previous image">
              <IconChevronLeft size={26} />
            </button>
            <figure className="lightbox-figure">
              <img src={current.src} srcSet={current.srcSet} sizes="100vw" width={current.width} height={current.height} alt={current.alt} />
              <figcaption>
                <strong>{current.label}</strong>
                {siteConfig.sampleImages ? <span> · Sample illustration, not a photo of a completed project</span> : null}
                <span className="lightbox-count" aria-live="polite">
                  {" "}
                  · {(index ?? 0) + 1} / {keys.length}
                </span>
              </figcaption>
            </figure>
            <button type="button" className="lightbox-nav lightbox-next" onClick={() => step(1)} aria-label="Next image">
              <IconChevronRight size={26} />
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
