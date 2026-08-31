"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const SUMMIT = 3429; // altitude de Tête Blanche (m)

/**
 * Écran d'intro au lancement : une altitude qui grimpe de 0 à 3 429 m pendant
 * que la scène 3D se prépare, puis fondu. Se lève quand la 3D émet
 * « hero:ready » (ou au chargement de la page / au bout d'un délai de secours).
 * Ignoré sous prefers-reduced-motion et après le premier affichage de la session.
 */
export function SiteLoader() {
  const [gone, setGone] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [pct, setPct] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("intro-done");
    } catch {
      /* sessionStorage indisponible : on affiche l'intro normalement */
    }
    if (reduce || seen) {
      setGone(true);
      return;
    }

    const started = performance.now();
    const MIN = 900;
    const MAX = 4200;
    let ready = document.readyState === "complete";

    const onReady = () => {
      ready = true;
    };
    window.addEventListener("hero:ready", onReady);
    window.addEventListener("load", onReady);

    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - started;
      const cap = ready || elapsed >= MAX ? 100 : 92;
      setPct((p) => p + (cap - p) * 0.05);

      if (!done.current && elapsed >= MIN && (ready || elapsed >= MAX)) {
        done.current = true;
        setPct(100);
        setHiding(true);
        window.setTimeout(() => {
          setGone(true);
          try {
            sessionStorage.setItem("intro-done", "1");
          } catch {
            /* ignore */
          }
        }, 750);
      }
      if (!done.current) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hero:ready", onReady);
      window.removeEventListener("load", onReady);
    };
  }, []);

  if (gone) return null;
  const alt = Math.round((SUMMIT * pct) / 100);

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-nuit text-neige transition-opacity duration-700 ease-editorial",
        hiding ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative flex flex-col items-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-glacier">
          Les Maths au Sommet
        </p>
        <p className="mt-6 flex items-baseline font-mono text-6xl font-medium tabular-nums md:text-7xl">
          {alt.toLocaleString("fr-FR")}
          <span className="ml-1.5 text-2xl text-neige/40">m</span>
        </p>
        <div className="mt-8 h-px w-48 overflow-hidden bg-neige/15">
          <div className="h-full bg-glacier" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-neige/40">
          Ascension en cours…
        </p>
      </div>
    </div>
  );
}
