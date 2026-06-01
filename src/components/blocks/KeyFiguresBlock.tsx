import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import type { Figure } from "@/lib/pages";
import { tones } from "./theme";

type Props = {
  figures: Figure[];
  dark?: boolean;
};

// Columns adapt to the number of figures (max 4) and the grid is centred, so
// two figures sit neatly side by side instead of leaving an empty grey block.
const COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};
const MAXW: Record<number, string> = {
  1: "max-w-xs",
  2: "max-w-2xl",
  3: "max-w-4xl",
  4: "max-w-none",
};

export function KeyFiguresBlock({ figures, dark }: Props) {
  const t = tones(dark);
  const actual = Math.max(1, Math.min(4, figures.length));
  const mobile = figures.length < 2 ? "grid-cols-1" : "grid-cols-2";
  return (
    <div className={clsx("mx-auto grid gap-4", mobile, COLS[actual], MAXW[actual])}>
      {figures.map((kf, i) => (
        <Reveal key={i} delay={i * 0.06}>
          <div
            className={clsx(
              "flex h-full flex-col justify-between gap-6 border p-6 md:p-10",
              t.hairline,
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
                <span className={clsx("text-lg md:text-xl", t.muted)}>{kf.suffix.trim()}</span>
              )}
            </p>
            <p className={clsx("text-sm leading-snug", t.cardText)}>{kf.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
