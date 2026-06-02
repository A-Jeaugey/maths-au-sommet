"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Lightbox } from "@/components/Lightbox";

// Optimised (next/image) click-to-zoom image used by the gallery and
// image+text blocks. The caller sets the aspect ratio via `className`
// (e.g. "aspect-[4/3]"); the image fills it and opens in the Lightbox.

export function ZoomableImage({
  src,
  alt,
  caption,
  meta,
  sizes,
  className,
}: {
  src: string;
  alt?: string;
  caption?: string;
  meta?: string;
  sizes?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  if (!src) {
    return (
      <div
        className={clsx("relative block w-full bg-encre/10", className)}
        aria-hidden
      />
    );
  }
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={caption ? `Agrandir : ${caption}` : "Agrandir l'image"}
        className={clsx(
          "group relative block w-full cursor-zoom-in overflow-hidden",
          className
        )}
      >
        <Image
          src={src}
          alt={alt ?? caption ?? ""}
          fill
          sizes={sizes ?? "100vw"}
          className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
        />
      </button>
      <Lightbox
        item={open ? { src, caption: caption ?? alt ?? "", meta } : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
