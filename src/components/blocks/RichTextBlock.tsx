import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { Markdown } from "./Markdown";
import { tones } from "./theme";

type Props = {
  title?: string;
  body: string;
  dark?: boolean;
};

export function RichTextBlock({ title, body, dark }: Props) {
  const t = tones(dark);
  return (
    <div>
      {title && (
        <Reveal>
          <h2 className={clsx("font-serif font-light text-display-md", t.title)}>
            {title}
          </h2>
        </Reveal>
      )}
      <Reveal delay={title ? 0.08 : 0}>
        <Markdown
          className={clsx(
            "max-w-prose2 space-y-5 text-[17px] leading-[1.8] md:text-lg",
            title && "mt-8",
            t.body
          )}
        >
          {body}
        </Markdown>
      </Reveal>
    </div>
  );
}
