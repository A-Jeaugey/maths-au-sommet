"use client";

import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";

// A click-to-zoom image for Markdown content (rich-text / image+text blocks).
// Uses a plain <img> (the source can be any size/host the editor pastes) and
// reuses the site Lightbox so content photos open just like the home gallery.

export function ContentImage({
  src,
  alt,
  title,
  block,
}: {
  src: string;
  alt?: string;
  title?: string;
  block?: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!src) return null;
  const caption = (title || alt || "").trim();
  const lightbox = (
    <Lightbox item={open ? { src, caption } : null} onClose={() => setOpen(false)} />
  );

  if (!block) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          title={title}
          loading="lazy"
          decoding="async"
          onClick={() => setOpen(true)}
          className="inline-block max-w-full cursor-zoom-in rounded-sm align-middle"
        />
        {lightbox}
      </>
    );
  }

  return (
    <figure className="my-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={caption ? `Agrandir : ${caption}` : "Agrandir l'image"}
        className="group block w-full cursor-zoom-in overflow-hidden bg-encre/5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
        />
      </button>
      {caption && (
        <figcaption className="mt-2 font-hand text-lg opacity-60">{caption}</figcaption>
      )}
      {lightbox}
    </figure>
  );
}
