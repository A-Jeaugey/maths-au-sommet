"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { tones } from "./theme";

type Props = {
  date: string;
  label?: string;
  expiredText?: string;
  dark?: boolean;
};

function remaining(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms % 86400000) / 3600000),
    m: Math.floor((ms % 3600000) / 60000),
    s: Math.floor((ms % 60000) / 1000),
    done: ms === 0,
  };
}

export function CountdownBlock({
  date,
  label,
  expiredText = "C'est le grand jour !",
  dark,
}: Props) {
  const t = tones(dark);
  const target = new Date(date).getTime();
  const valid = !Number.isNaN(target);
  // Starts null so server and first client render match (no hydration warning);
  // the live values appear right after mount.
  const [tl, setTl] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    if (!valid) return;
    setTl(remaining(target));
    const id = setInterval(() => setTl(remaining(target)), 1000);
    return () => clearInterval(id);
  }, [target, valid]);

  if (!valid) return null;

  const cells = tl
    ? [
        { v: tl.d, l: "jours" },
        { v: tl.h, l: "heures" },
        { v: tl.m, l: "min" },
        { v: tl.s, l: "sec" },
      ]
    : [];

  return (
    <div className="max-w-prose2">
      {label && (
        <Reveal>
          <p className={clsx("mb-6 font-serif text-2xl font-light md:text-3xl", t.title)}>
            {label}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        {tl?.done ? (
          <p className={clsx("font-serif text-3xl font-light md:text-4xl", t.title)}>
            {expiredText}
          </p>
        ) : (
          <div className="flex flex-wrap gap-3 md:gap-4">
            {cells.map((c) => (
              <div
                key={c.l}
                className={clsx(
                  "flex min-w-[76px] flex-col items-center border px-4 py-3 md:min-w-[96px] md:px-6 md:py-4",
                  t.hairline,
                  t.cardBg
                )}
              >
                <span
                  className={clsx(
                    "font-mono text-3xl font-medium tabular-nums md:text-5xl",
                    t.title
                  )}
                >
                  {String(c.v).padStart(2, "0")}
                </span>
                <span
                  className={clsx(
                    "mt-1 font-mono text-[10px] uppercase tracking-wider2",
                    t.muted
                  )}
                >
                  {c.l}
                </span>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
