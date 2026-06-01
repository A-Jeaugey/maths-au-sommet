"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Reveal } from "@/components/Reveal";
import { tones } from "./theme";

type Props = {
  current: number;
  goal: number;
  label?: string;
  currency?: string;
  dark?: boolean;
};

export function FundraiserBlock({ current, goal, label, currency = "€", dark }: Props) {
  const t = tones(dark);
  const reduce = useReducedMotion();
  const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
  return (
    <div className="max-w-prose2">
      <Reveal>
        <p
          className={clsx(
            "flex items-baseline gap-2 font-mono text-5xl font-medium md:text-6xl",
            t.title
          )}
        >
          <AnimatedNumber value={current} />
          <span className={clsx("text-2xl md:text-3xl", t.muted)}>{currency}</span>
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <p className={clsx("mt-2 font-mono text-sm uppercase tracking-wider2", t.muted)}>
          sur {goal.toLocaleString("fr-FR")} {currency} · {pct}%
        </p>
      </Reveal>
      <Reveal delay={0.12}>
        <div
          className={clsx(
            "mt-5 h-3 w-full overflow-hidden rounded-full",
            dark ? "bg-neige/15" : "bg-encre/10"
          )}
        >
          <motion.div
            className="h-full rounded-full bg-soleil"
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </Reveal>
      {label && (
        <Reveal delay={0.16}>
          <p className={clsx("mt-4 text-[17px] leading-relaxed", t.body)}>{label}</p>
        </Reveal>
      )}
    </div>
  );
}
