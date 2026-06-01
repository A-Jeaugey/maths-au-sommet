import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import type { Card } from "@/lib/pages";
import { tones } from "./theme";

type Props = {
  title?: string;
  columns?: number;
  cards: Card[];
  dark?: boolean;
};

const COLS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export function CardGridBlock({ title, columns = 3, cards, dark }: Props) {
  const t = tones(dark);
  const cols = COLS[columns] ?? COLS[3];
  return (
    <div>
      {title && (
        <Reveal>
          <h2 className={clsx("mb-10 font-serif font-light text-display-md", t.title)}>
            {title}
          </h2>
        </Reveal>
      )}
      <div
        className={clsx(
          "grid grid-cols-1 gap-px overflow-hidden border-y sm:grid-cols-2",
          cols,
          t.gridBg,
          t.hairline
        )}
      >
        {cards.map((card, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div
              className={clsx(
                "flex h-full flex-col gap-4 p-6 md:p-8",
                t.cardBg
              )}
            >
              {card.icon && (
                <span className="text-3xl leading-none" aria-hidden>
                  {card.icon}
                </span>
              )}
              <p className={clsx("font-serif text-lg leading-tight md:text-xl", t.cardTitle)}>
                {card.title}
              </p>
              {card.text && (
                <p className={clsx("text-sm leading-relaxed", t.cardText)}>{card.text}</p>
              )}
              {card.linkUrl && (
                <a
                  href={card.linkUrl}
                  className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-[10px] uppercase tracking-wider2 text-glacier transition-transform hover:translate-x-0.5"
                >
                  {card.linkLabel ?? "En savoir plus"}
                  <span aria-hidden>→</span>
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
