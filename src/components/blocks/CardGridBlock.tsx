import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import type { Card } from "@/lib/pages";
import { tones } from "./theme";
import { normalizeUrl, isExternalUrl } from "@/lib/url";

type Props = {
  title?: string;
  columns?: number;
  cards: Card[];
  dark?: boolean;
};

// The chosen column count is a maximum: the grid never renders empty cells.
// Actual columns = min(chosen, number of cards), and the grid is centred, so
// fewer cards stay tidy and more cards simply wrap onto the next row.
const COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};
const MAXW: Record<number, string> = {
  1: "max-w-sm",
  2: "max-w-3xl",
  3: "max-w-5xl",
  4: "max-w-none",
};

export function CardGridBlock({ title, columns = 3, cards, dark }: Props) {
  const t = tones(dark);
  const requested = Math.max(1, Math.min(columns || 3, 4));
  const actual = Math.max(1, Math.min(requested, cards.length));
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
          "mx-auto grid grid-cols-1 gap-4",
          cards.length >= 2 && "sm:grid-cols-2",
          COLS[actual],
          MAXW[actual]
        )}
      >
        {cards.map((card, i) => {
          const url = card.linkUrl ? normalizeUrl(card.linkUrl) : null;
          const ext = url ? isExternalUrl(url) : false;
          return (
            <Reveal key={i} delay={i * 0.06}>
              <div
                className={clsx(
                  "flex h-full flex-col gap-4 border p-6 md:p-8",
                  t.hairline,
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
                {url && (
                  <a
                    href={url}
                    {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-[10px] uppercase tracking-wider2 text-glacier transition-transform hover:translate-x-0.5"
                  >
                    {card.linkLabel ?? "En savoir plus"}
                    <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
