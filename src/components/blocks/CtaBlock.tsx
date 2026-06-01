import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { tones } from "./theme";

type Props = {
  title: string;
  text?: string;
  buttonLabel: string;
  buttonUrl: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  dark?: boolean;
};

export function CtaBlock({
  title,
  text,
  buttonLabel,
  buttonUrl,
  secondaryLabel,
  secondaryUrl,
  dark,
}: Props) {
  const t = tones(dark);
  const external = /^https?:\/\//.test(buttonUrl);
  return (
    <div className="max-w-prose2">
      <Reveal>
        <h2 className={clsx("font-serif font-light text-display-md", t.title)}>{title}</h2>
      </Reveal>
      {text && (
        <Reveal delay={0.08}>
          <p className={clsx("mt-6 text-[17px] leading-[1.8] md:text-lg", t.body)}>{text}</p>
        </Reveal>
      )}
      <Reveal delay={0.16}>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={buttonUrl}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="group inline-flex items-center justify-between gap-6 rounded-full bg-soleil px-7 py-4 font-mono text-xs uppercase tracking-wider2 text-nuit transition-transform hover:-translate-y-0.5"
          >
            <span>{buttonLabel}</span>
            <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          {secondaryLabel && secondaryUrl && (
            <a
              href={secondaryUrl}
              className={clsx(
                "inline-flex items-center gap-3 px-3 py-4 font-mono text-xs uppercase tracking-wider2 transition-colors",
                dark ? "text-neige/70 hover:text-neige" : "text-encre/70 hover:text-encre"
              )}
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </Reveal>
    </div>
  );
}
