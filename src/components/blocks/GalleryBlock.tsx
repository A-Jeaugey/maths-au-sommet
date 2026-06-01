import clsx from "clsx";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import type { GalleryImage } from "@/lib/pages";
import { tones } from "./theme";

type Props = {
  title?: string;
  images: GalleryImage[];
  dark?: boolean;
};

export function GalleryBlock({ title, images, dark }: Props) {
  const t = tones(dark);
  return (
    <div>
      {title && (
        <Reveal>
          <h2 className={clsx("mb-10 font-serif font-light text-display-md", t.title)}>
            {title}
          </h2>
        </Reveal>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <Reveal key={i} delay={(i % 3) * 0.06}>
            <figure
              className={clsx(
                "flex flex-col p-2.5 pb-3 shadow-[0_10px_30px_-12px_rgba(10,22,40,0.45)]",
                t.cardBg
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-encre/10">
                <Image
                  src={img.image}
                  alt={img.caption ?? ""}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {(img.caption || img.meta) && (
                <figcaption className="mt-2 px-1">
                  {img.caption && (
                    <p className={clsx("font-serif text-[13px] leading-snug", t.cardText)}>
                      {img.caption}
                    </p>
                  )}
                  {img.meta && (
                    <p className={clsx("mt-0.5 font-hand text-lg leading-tight", t.muted)}>
                      {img.meta}
                    </p>
                  )}
                </figcaption>
              )}
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
