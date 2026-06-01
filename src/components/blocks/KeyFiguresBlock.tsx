import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import type { Figure } from "@/lib/pages";
import { tones } from "./theme";

type Props = {
  figures: Figure[];
  dark?: boolean;
};

export function KeyFiguresBlock({ figures, dark }: Props) {
  const t = tones(dark);
  return (
    <div
      className={clsx(
        "grid grid-cols-2 gap-px overflow-hidden border-y md:grid-cols-4",
        t.gridBg,
        t.hairline
      )}
    >
      {figures.map((kf, i) => (
        <Reveal key={i} delay={i * 0.06}>
          <div
            className={clsx(
              "flex h-full flex-col justify-between gap-6 p-6 md:p-10",
              t.cardBg
            )}
          >
            <p className={clsx("font-mono text-[10px] uppercase tracking-wider2", t.muted)}>
              {String(i + 1).padStart(2, "0")}
            </p>
            <p
              className={clsx(
                "flex items-baseline gap-2 font-mono text-4xl font-medium md:text-5xl",
                t.title
              )}
            >
              <span className="tabular-nums">
                <AnimatedNumber value={kf.value} />
              </span>
              {kf.suffix && (
                <span className={clsx("text-lg md:text-xl", t.muted)}>
                  {kf.suffix.trim()}
                </span>
              )}
            </p>
            <p className={clsx("text-sm leading-snug", t.cardText)}>{kf.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
