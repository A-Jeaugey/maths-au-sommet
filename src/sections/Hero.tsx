"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MountainScene } from "@/components/MountainScene";
import { SITE } from "@/lib/content";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="hero" className="relative min-h-[200vh]">
      {/* Sticky pane: the 3D scene + text stay pinned for one viewport while
          the user scrolls through, driving the camera descent. */}
      <div className="sticky top-0 isolate flex h-[100svh] flex-col justify-end overflow-hidden bg-nuit text-neige grain">
        <MountainScene />

        {/* Bottom fade to anchor the text on top of the 3D scene */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,13,26,0) 0%, rgba(5,13,26,0.35) 30%, rgba(5,13,26,0.75) 70%, rgba(5,13,26,0.95) 100%)",
          }}
        />

        {/* Soft top fade so the chapter label and headline stay readable
            even when the camera frames bright snow in the upper portion */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[35%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,13,26,0.55) 0%, rgba(5,13,26,0) 100%)",
          }}
        />

        <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 pb-16 pt-44 md:gap-10 md:px-10 md:pb-24 md:pt-48">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider2 text-glacier"
          >
            <span className="inline-block h-px w-8 bg-glacier/80" aria-hidden />
            Une cordée. Un sommet. Une année.
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif font-light text-display-xl drop-shadow-[0_2px_24px_rgba(5,13,26,0.6)]"
          >
            Les maths
            <br />
            <span className="italic text-glacier">au</span> sommet.
          </motion.h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid items-end gap-8 md:grid-cols-[1fr_auto] md:gap-12"
          >
            <p className="max-w-prose2 font-serif text-xl leading-snug text-neige/90 md:text-2xl">
              La réussite par le bien-être et le dépassement de soi.
            </p>
            <dl className="grid grid-cols-3 gap-x-6 gap-y-1 border-t border-neige/15 pt-6 font-mono text-[11px] uppercase tracking-wider2 text-neige/60 md:gap-x-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <div>
                <dt className="opacity-70">Lycée</dt>
                <dd className="mt-1 text-neige">Notre-Dame</dd>
              </div>
              <div>
                <dt className="opacity-70">Ville</dt>
                <dd className="mt-1 text-neige">{SITE.city}</dd>
              </div>
              <div>
                <dt className="opacity-70">Promo</dt>
                <dd className="mt-1 text-neige">{SITE.schoolYear}</dd>
              </div>
            </dl>
          </motion.div>

          <motion.a
            href="#projet"
            aria-label="Descendre vers le récit"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            onClick={(e) => {
              const lenis = (
                window as unknown as {
                  __lenis?: {
                    scrollTo: (target: unknown, opts?: unknown) => void;
                  };
                }
              ).__lenis;
              const target = document.getElementById("projet");
              if (lenis?.scrollTo && target) {
                e.preventDefault();
                lenis.scrollTo(target, {
                  duration: 3.2,
                  easing: (t: number) => 1 - Math.pow(1 - t, 2.4),
                });
              }
            }}
            className="group mt-4 inline-flex items-center gap-3 self-start font-mono text-[11px] uppercase tracking-wider2 text-neige/70 transition-colors hover:text-neige"
          >
            <span>Commencer le récit</span>
            <motion.span
              animate={
                reduce
                  ? undefined
                  : {
                      y: [0, 6, 0],
                      transition: { duration: 1.8, repeat: Infinity },
                    }
              }
              className="block"
              aria-hidden
            >
              ↓
            </motion.span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
