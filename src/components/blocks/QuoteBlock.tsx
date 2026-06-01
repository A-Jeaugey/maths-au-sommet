import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { tones } from "./theme";

type Props = {
  quote: string;
  author?: string;
  dark?: boolean;
};

export function QuoteBlock({ quote, author, dark }: Props) {
  const t = tones(dark);
  return (
    <Reveal>
      <figure className="mx-auto max-w-3xl border-l-2 border-glacier pl-6 md:pl-10">
        <blockquote
          className={clsx(
            "font-serif text-2xl italic leading-[1.35] md:text-3xl",
            t.title
          )}
        >
          «&nbsp;{quote}&nbsp;»
        </blockquote>
        {author && (
          <figcaption className={clsx("mt-6 font-hand text-2xl leading-tight -rotate-1", t.muted)}>
            — {author}
          </figcaption>
        )}
      </figure>
    </Reveal>
  );
}
