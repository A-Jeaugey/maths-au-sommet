"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MountainBackdrop } from "@/components/MountainBackdrop";
import { SITE } from "@/lib/content";

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section
      id="hero"
      className="relative grain isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-nuit text-neige"
    >
      <MountainBackdrop variant="hero" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 pb-16 pt-44 md:px-10 md:pb-24 md:pt-48">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-xs uppercase tracking-wider2 text-glacier"
        >
          <span className="mr-3 inline-block h-px w-8 align-middle bg-glacier" />
          Une cordée. Un sommet. Une année.
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-light text-display-xl"
        >
          Les maths
          <br />
          <span className="italic text-glacier">au</span> sommet.
        </motion.h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-end gap-8 md:grid-cols-2"
        >
          <p className="max-w-prose2 font-serif text-xl leading-snug text-neige/85 md:text-2xl">
            La réussite par le bien-être et le dépassement de soi.
          </p>
          <dl className="grid grid-cols-3 gap-4 border-t border-neige/15 pt-6 font-mono text-[11px] uppercase tracking-wider2 text-neige/60 md:justify-self-end md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <dt className="opacity-60">Lycée</dt>
              <dd className="mt-1 text-neige">Notre-Dame</dd>
            </div>
            <div>
              <dt className="opacity-60">Ville</dt>
              <dd className="mt-1 text-neige">{SITE.city}</dd>
            </div>
            <div>
              <dt className="opacity-60">Promo</dt>
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
          className="group mt-6 inline-flex items-center gap-3 self-start font-mono text-[11px] uppercase tracking-wider2 text-neige/70 hover:text-neige"
        >
          <span>Commencer le récit</span>
          <motion.span
            animate={
              reduce
                ? undefined
                : { y: [0, 6, 0], transition: { duration: 1.8, repeat: Infinity } }
            }
            className="block"
            aria-hidden
          >
            ↓
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
