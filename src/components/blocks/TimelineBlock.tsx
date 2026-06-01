import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import type { Step } from "@/lib/pages";
import { tones } from "./theme";

type Props = {
  steps: Step[];
  dark?: boolean;
};

export function TimelineBlock({ steps, dark }: Props) {
  const t = tones(dark);
  return (
    <ol className="relative">
      <span
        aria-hidden
        className={clsx(
          "pointer-events-none absolute left-3 top-1 h-full w-px",
          dark ? "bg-neige/15" : "bg-encre/15"
        )}
      />
      {steps.map((step, i) => (
        <li key={i} className="relative pb-12 pl-12 last:pb-0">
          <Reveal delay={0.02}>
            <span aria-hidden className="absolute left-3 top-1.5 z-10 -translate-x-1/2">
              <span
                className={clsx(
                  "block h-3 w-3 rotate-45 border border-glacier",
                  dark ? "bg-nuit" : "bg-neige"
                )}
              />
            </span>
            {step.date && (
              <p className="flex items-baseline gap-3">
                <span
                  className={clsx(
                    "font-mono text-[11px] uppercase tracking-wider2",
                    t.muted
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={clsx("font-hand text-2xl leading-none -rotate-1", t.body)}>
                  {step.date}
                </span>
              </p>
            )}
            <h3 className={clsx("mt-2 font-serif text-2xl leading-tight md:text-3xl", t.title)}>
              {step.title}
            </h3>
            {step.body && (
              <p
                className={clsx(
                  "mt-3 max-w-prose2 text-base leading-relaxed md:text-[17px]",
                  t.body
                )}
              >
                {step.body}
              </p>
            )}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
