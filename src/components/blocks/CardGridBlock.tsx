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

// Look d'origine (grille à filets fins connectés). Le nombre de colonnes est un
// maximum : la grille s'adapte au nombre de cases et se centre, pour éviter les
// cellules vides grises quand il y a moins de cases que de colonnes.
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
  const items = cards || [];
  const requested = Math.max(1, Math.min(columns || 3, 4));
  const actual = Math.max(1, Math.min(requested, items.length || 1));
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
          "mx-auto grid grid-cols-1 gap-px overflow-hidden border-y",
          items.length >= 2 && "sm:grid-cols-2",
          COLS[actual],
          MAXW[actual],
          t.gridBg,
          t.hairline
        )}
      >
        {items.map((card, i) => {
          const url = card.linkUrl ? normalizeUrl(card.linkUrl) : null;
          const ext = url ? isExternalUrl(url) : false;
          return (
            <Reveal key={i} delay={i * 0.06}>
              <div className={clsx("flex h-full flex-col gap-4 p-6 md:p-8", t.cardBg)}>
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
