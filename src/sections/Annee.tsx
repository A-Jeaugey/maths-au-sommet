"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { ContourLines } from "@/components/ContourLines";
import { TIMELINE } from "@/lib/content";

export function Annee() {
  const reduce = useReducedMotion();

  return (
    <section
      id="annee"
      className="relative isolate overflow-hidden bg-neige py-28 text-encre md:py-40"
    >
      <ContourLines variant="flow" className="inset-0 -z-0" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel number="03" label="Une année d'entraînement" />
        </Reveal>

        <div className="mt-12 max-w-3xl md:mt-20">
          <Reveal delay={0.05}>
            <h2 className="font-serif font-light text-display-lg">
              <span className="italic text-glacier">Dix mois.</span> Du premier
              fromage vendu au sommet.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-prose2 text-[17px] leading-[1.8] text-encre/85 md:text-lg">
              La préparation tisse en parallèle deux fils&nbsp;: financer le
              séjour et préparer les corps. Chaque mois, une étape concrète. La
              cordée se construit avant la marche.
            </p>
          </Reveal>
        </div>

        {/* Vertical timeline, alternating */}
        <ol className="relative mt-24 md:mt-32">
          {/* central spine */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-0 h-full w-px bg-encre/15 md:left-1/2 md:-translate-x-1/2"
          />

          {TIMELINE.map((step, i) => {
            const left = i % 2 === 0;
            return (
              <li key={step.title} className="relative pb-16 last:pb-0">
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative grid gap-6 md:grid-cols-2 md:gap-16 ${
                    left ? "" : "md:[&>*:first-child]:order-2"
                  }`}
                >
                  {/* node */}
                  <span
                    aria-hidden
                    className="absolute left-4 top-2 z-10 -translate-x-1/2 md:left-1/2"
                  >
                    <span className="block h-3 w-3 rotate-45 border border-glacier bg-neige" />
                  </span>

                  <div
                    className={`pl-12 md:pl-0 ${
                      left ? "md:pr-16 md:text-right" : "md:pl-16"
                    }`}
                  >
                    <p className="flex items-baseline gap-3 text-encre/70">
                      <span className="font-mono text-[11px] uppercase tracking-wider2 text-encre/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-hand text-2xl leading-none -rotate-1">
                        {step.date}
                      </span>
                    </p>
                    <h3 className="mt-3 font-serif text-2xl leading-tight md:text-3xl">
                      {step.title}
                    </h3>
                  </div>
                  <div
                    className={`pl-12 md:pl-0 ${
                      left ? "md:pl-16" : "md:pr-16 md:text-right"
                    }`}
                  >
                    <p className="max-w-prose2 text-base leading-relaxed text-encre/85 md:text-[17px]">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
