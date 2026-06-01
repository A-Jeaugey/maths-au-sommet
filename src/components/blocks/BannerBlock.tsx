import clsx from "clsx";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { normalizeUrl, isExternalUrl } from "@/lib/url";

type Props = {
  image: string;
  title?: string;
  text?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  height?: "small" | "medium" | "large";
  align?: "left" | "center";
};

const H = {
  small: "min-h-[280px] md:min-h-[340px]",
  medium: "min-h-[420px] md:min-h-[520px]",
  large: "min-h-[560px] md:min-h-[80vh]",
};

// Full-bleed banner: a background photo with a dark veil and text on top.
export function BannerBlock({
  image,
  title,
  text,
  buttonLabel,
  buttonUrl,
  height = "medium",
  align = "center",
}: Props) {
  const url = buttonUrl ? normalizeUrl(buttonUrl) : null;
  const ext = url ? isExternalUrl(url) : false;
  const center = align === "center";
  return (
    <section
      className={clsx(
        "relative isolate flex w-full overflow-hidden",
        H[height] ?? H.medium,
        center ? "items-center" : "items-end"
      )}
    >
      {image && <Image src={image} alt="" fill sizes="100vw" className="object-cover" />}
      <div className="absolute inset-0 bg-nuit/55" />
      <div
        className={clsx(
          "relative mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24",
          center && "flex flex-col items-center text-center"
        )}
      >
        {title && (
          <Reveal>
            <h2 className="max-w-3xl font-serif font-light text-display-lg text-neige">
              {title}
            </h2>
          </Reveal>
        )}
        {text && (
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neige/85">{text}</p>
          </Reveal>
        )}
        {url && buttonLabel && (
          <Reveal delay={0.16}>
            <a
              href={url}
              {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-soleil px-7 py-4 font-mono text-xs uppercase tracking-wider2 text-nuit transition-transform hover:-translate-y-0.5"
            >
              {buttonLabel}
              <span aria-hidden>→</span>
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
