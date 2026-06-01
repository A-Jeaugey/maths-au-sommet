import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { tones } from "./theme";

type Props = { url: string; title?: string; caption?: string; dark?: boolean };

// Turns a pasted YouTube/Vimeo link into a proper embed URL.
function embedSrc(url: string): string | null {
  const u = url.trim();
  let m = u.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;
  if (/^https?:\/\//.test(u)) return u; // already an embed URL
  return null;
}

export function VideoBlock({ url, title, caption, dark }: Props) {
  const t = tones(dark);
  const src = url ? embedSrc(url) : null;
  if (!src) return null;
  return (
    <div>
      {title && (
        <Reveal>
          <h2 className={clsx("mb-8 font-serif font-light text-display-md", t.title)}>
            {title}
          </h2>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-encre/10">
          <iframe
            src={src}
            title={title ?? "Vidéo"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
          />
        </div>
      </Reveal>
      {caption && (
        <Reveal delay={0.1}>
          <p className={clsx("mt-3 font-hand text-lg", t.muted)}>{caption}</p>
        </Reveal>
      )}
    </div>
  );
}
