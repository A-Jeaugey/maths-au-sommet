import clsx from "clsx";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Markdown } from "./Markdown";
import { tones } from "./theme";

type Props = {
  image: string;
  imageSide?: "left" | "right";
  title?: string;
  body: string;
  caption?: string;
  dark?: boolean;
};

export function ImageTextBlock({
  image,
  imageSide = "left",
  title,
  body,
  caption,
  dark,
}: Props) {
  const t = tones(dark);
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal className={clsx(imageSide === "right" && "md:order-2")}>
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden bg-encre/10">
            <Image
              src={image}
              alt={caption ?? title ?? ""}
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {caption && (
            <figcaption className={clsx("mt-3 font-hand text-lg", t.muted)}>
              {caption}
            </figcaption>
          )}
        </figure>
      </Reveal>
      <Reveal delay={0.1}>
        <div>
          {title && (
            <h2 className={clsx("font-serif font-light text-display-md", t.title)}>{title}</h2>
          )}
          <Markdown
            className={clsx(
              "max-w-prose2 space-y-5 text-[17px] leading-[1.8] md:text-lg",
              title && "mt-6",
              t.body
            )}
          >
            {body}
          </Markdown>
        </div>
      </Reveal>
    </div>
  );
}
