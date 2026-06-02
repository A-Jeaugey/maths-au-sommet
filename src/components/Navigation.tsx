"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { CHAPTERS } from "@/lib/content";

type NavProps = {
  /** Prefix for in-page anchors: "" on the home page, "/" on sub-pages so the
   *  table of contents jumps back to the home sections. */
  basePath?: string;
  /** Custom pages built in the admin, listed under the chapters. */
  pages?: { slug: string; title: string }[];
  /** Whether the top of the page is dark (dark hero / dark theme). When false
   *  (a light page at the top), the header uses dark text so it stays visible. */
  dark?: boolean;
};

export function Navigation({ basePath = "", pages = [], dark = true }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const homeHref = basePath ? "/" : "#hero";
  const topText = dark ? "text-neige" : "text-encre";
  const topBar = dark ? "bg-neige" : "bg-encre";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-editorial",
          scrolled
            ? "bg-neige/85 backdrop-blur-md py-3 border-b border-encre/5"
            : "bg-transparent py-6"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10">
          <a
            href={homeHref}
            className={clsx(
              "font-serif text-lg leading-none tracking-tight transition-colors",
              scrolled ? "text-encre" : topText
            )}
          >
            Les Maths au Sommet
          </a>

          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={clsx(
              "group flex items-center gap-3 rounded-full px-4 py-2 text-xs uppercase tracking-wider2 transition-colors",
              scrolled
                ? "text-encre hover:bg-encre/5"
                : dark
                ? "text-neige hover:bg-neige/10"
                : "text-encre hover:bg-encre/5"
            )}
          >
            <span className="hidden sm:inline">{open ? "Fermer" : "Sommaire"}</span>
            <span className="relative block h-3 w-5">
              <span
                className={clsx(
                  "absolute inset-x-0 top-0 block h-px transition-transform duration-300 ease-editorial",
                  scrolled ? "bg-encre" : topBar,
                  open && "translate-y-[6px] rotate-45"
                )}
              />
              <span
                className={clsx(
                  "absolute inset-x-0 bottom-0 block h-px transition-transform duration-300 ease-editorial",
                  scrolled ? "bg-encre" : topBar,
                  open && "-translate-y-[6px] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-nuit text-neige"
          >
            <div className="grain absolute inset-0" aria-hidden />
            <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6 md:px-10">
              <p className="mb-12 font-mono text-xs uppercase tracking-wider2 text-glacier">
                Sommaire
              </p>
              <ul className="space-y-3 md:space-y-5">
                {CHAPTERS.map((c, i) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a
                      href={`${basePath}#${c.id}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-6 font-serif text-3xl tracking-tight text-neige transition-colors hover:text-glacier md:text-5xl"
                    >
                      <span className="font-mono text-xs uppercase tracking-wider2 text-glacier/70">
                        {c.number}
                      </span>
                      <span className="border-b border-transparent transition-colors group-hover:border-glacier">
                        {c.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              {pages.length > 0 && (
                <div className="mt-12 border-t border-neige/10 pt-8">
                  <p className="mb-5 font-mono text-xs uppercase tracking-wider2 text-glacier">
                    Pages
                  </p>
                  <ul className="flex flex-wrap gap-x-8 gap-y-3">
                    {pages.map((p) => (
                      <li key={p.slug}>
                        <a
                          href={`/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="font-serif text-2xl leading-tight text-neige/90 transition-colors hover:text-glacier md:text-3xl"
                        >
                          {p.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
