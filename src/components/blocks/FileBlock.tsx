import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { tones } from "./theme";

type Props = {
  title?: string;
  file: string;
  description?: string;
  buttonLabel?: string;
  dark?: boolean;
};

export function FileBlock({ title, file, description, buttonLabel = "Télécharger", dark }: Props) {
  const t = tones(dark);
  if (!file) return null;
  return (
    <Reveal>
      <div
        className={clsx(
          "flex flex-col items-start gap-4 border p-6 md:flex-row md:items-center md:justify-between md:gap-8 md:p-8",
          t.hairline,
          t.cardBg
        )}
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl leading-none" aria-hidden>
            📄
          </span>
          <div>
            {title && (
              <p className={clsx("font-serif text-lg md:text-xl", t.cardTitle)}>{title}</p>
            )}
            {description && (
              <p className={clsx("mt-1 text-sm leading-relaxed", t.cardText)}>{description}</p>
            )}
          </div>
        </div>
        <a
          href={file}
          download
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-soleil px-6 py-3 font-mono text-xs uppercase tracking-wider2 text-nuit transition-transform hover:-translate-y-0.5"
        >
          {buttonLabel}
          <span aria-hidden>↓</span>
        </a>
      </div>
    </Reveal>
  );
}
