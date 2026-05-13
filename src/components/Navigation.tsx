"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { CHAPTERS } from "@/lib/content";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
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
            href="#hero"
            className={clsx(
              "font-serif text-lg leading-none tracking-tight transition-colors",
              scrolled ? "text-encre" : "text-neige"
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
                : "text-neige hover:bg-neige/10"
            )}
          >
            <span className="hidden sm:inline">{open ? "Fermer" : "Sommaire"}</span>
            <span className="relative block h-3 w-5">
              <span
                className={clsx(
                  "absolute inset-x-0 top-0 block h-px transition-transform duration-300 ease-editorial",
                  scrolled ? "bg-encre" : "bg-neige",
                  open && "translate-y-[6px] rotate-45"
                )}
              />
              <span
                className={clsx(
                  "absolute inset-x-0 bottom-0 block h-px transition-transform duration-300 ease-editorial",
                  scrolled ? "bg-encre" : "bg-neige",
                  open && "-translate-y-[6px] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Side rail — chapter dots, desktop only */}
      <nav
        aria-label="Progression dans le récit"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <ul className="flex flex-col gap-3">
          {CHAPTERS.map((c) => {
            const isActive = activeId === c.id;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="group relative flex items-center gap-3"
                  aria-label={`Aller à : ${c.label}`}
                >
                  <span
                    className={clsx(
                      "block h-px transition-all duration-500 ease-editorial",
                      isActive
                        ? "w-10 bg-glacier"
                        : "w-5 bg-encre/30 group-hover:w-7 group-hover:bg-encre/60"
                    )}
                  />
                  <span
                    className={clsx(
                      "font-mono text-[10px] uppercase tracking-wider2 transition-opacity",
                      isActive
                        ? "text-encre opacity-100"
                        : "text-encre/50 opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {c.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

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
                      href={`#${c.id}`}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
