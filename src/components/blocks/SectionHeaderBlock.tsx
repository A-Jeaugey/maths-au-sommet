import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { tones } from "./theme";

type Props = {
  label?: string;
  title: string;
  highlight?: string;
  intro?: string;
  dark?: boolean;
};

export function SectionHeaderBlock({ label, title, highlight, intro, dark }: Props) {
  const t = tones(dark);
  return (
    <div>
      {label && (
        <Reveal>
          <p
            className={clsx(
              "flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider2",
              t.overline
            )}
          >
            <span className={clsx("block h-px w-8", t.rule)} aria-hidden />
            {label}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className={clsx("mt-6 font-serif font-light text-display-lg", t.title)}>
          {title}
          {highlight && <span className="italic text-glacier"> {highlight}</span>}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p
            className={clsx(
              "mt-8 max-w-prose2 text-[17px] leading-[1.8] md:text-lg",
              t.body
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
