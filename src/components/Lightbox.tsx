"use client";

import { useEffect, useRef, useState } from "react";

export type LightboxItem = {
  src: string;
  caption: string;
  meta?: string;
};

type Props = {
  item: LightboxItem | null;
  onClose: () => void;
};

// Plain CSS-driven lightbox — opacity/scale transitions on a fixed overlay.
// Always rendered, visibility + pointer-events flip with the open state.
// `display` snapshots the last item so the image stays visible during the
// exit transition (350 ms) before being torn down.
export function Lightbox({ item, onClose }: Props) {
  const open = !!item;
  const [display, setDisplay] = useState<LightboxItem | null>(null);
  const exitTimer = useRef<number | null>(null);

  useEffect(() => {
    if (item) {
      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
      setDisplay(item);
    } else if (display) {
      exitTimer.current = window.setTimeout(() => {
        setDisplay(null);
        exitTimer.current = null;
      }, 400);
    }
    return () => {
      if (exitTimer.current) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div
      onClick={onClose}
      role={open ? "dialog" : undefined}
      aria-modal={open || undefined}
      aria-hidden={!open}
      aria-label={open ? display?.caption : undefined}
      className={
        "fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-nuit/90 px-4 py-10 backdrop-blur-md transition-opacity duration-300 ease-editorial md:px-10 " +
        (open ? "opacity-100" : "pointer-events-none opacity-0")
      }
    >
      {display && (
        <figure
          onClick={(e) => e.stopPropagation()}
          className={
            "relative flex max-h-full max-w-[min(1280px,94vw)] cursor-auto flex-col items-center gap-4 transition-all duration-500 ease-editorial " +
            (open
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-2 scale-[0.97] opacity-0")
          }
        >
          {/* Wrapper shrinks to the image so the close button sits on its corner */}
          <div className="relative max-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={display.src}
              alt={display.caption}
              decoding="async"
              className="block h-auto max-h-[78vh] w-auto max-w-full rounded-sm object-contain shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer l'aperçu"
              className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border border-neige/30 bg-nuit/80 font-mono text-sm text-neige backdrop-blur-sm transition-colors hover:border-neige hover:bg-nuit md:h-10 md:w-10"
            >
              <span aria-hidden>×</span>
            </button>
          </div>
          <figcaption className="flex max-w-[min(640px,90vw)] flex-col items-center gap-1.5 text-center text-neige">
            <p className="font-serif text-lg leading-snug text-neige/95 md:text-xl">
              {display.caption}
            </p>
            {display.meta && (
              <p className="font-mono text-[11px] uppercase tracking-wider2 text-neige/55">
                {display.meta}
              </p>
            )}
          </figcaption>
        </figure>
      )}
    </div>
  );
}
