import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { Markdown } from "./Markdown";
import { tones } from "./theme";

type Item = { question: string; answer: string };
type Props = { title?: string; items: Item[]; dark?: boolean };

// Native <details> accordion — accessible and works without JavaScript.
export function AccordionBlock({ title, items, dark }: Props) {
  const t = tones(dark);
  return (
    <div className="max-w-prose2">
      {title && (
        <Reveal>
          <h2 className={clsx("mb-8 font-serif font-light text-display-md", t.title)}>
            {title}
          </h2>
        </Reveal>
      )}
      <div className={clsx("border-t", t.hairline)}>
        {(items ?? []).map((it, i) => (
          <Reveal key={i} delay={(i % 4) * 0.05}>
            <details className={clsx("group border-b", t.hairline)}>
              <summary
                className={clsx(
                  "flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-serif text-lg md:text-xl [&::-webkit-details-marker]:hidden",
                  t.title
                )}
              >
                {it.question}
                <span
                  aria-hidden
                  className="font-mono text-glacier transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className={clsx("pb-5 text-[16px] leading-relaxed", t.body)}>
                <Markdown className="space-y-3">{it.answer}</Markdown>
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
