import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { tones } from "./theme";
import { normalizeUrl } from "@/lib/url";

type Props = {
  url: string;
  title?: string;
  height?: number;
  dark?: boolean;
};

// Generic responsive iframe — works for a HelloAsso donation form, a Google
// Form, a map, etc. The editor pastes the embed URL; height is clamped to a
// sane range.
export function EmbedBlock({ url, title, height = 700, dark }: Props) {
  const t = tones(dark);
  const src = url ? normalizeUrl(url) : "#";
  if (src === "#") return null;
  const h = Math.max(200, Math.min(height || 700, 2000));
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
        <div className={clsx("overflow-hidden rounded-sm border", t.hairline)}>
          <iframe
            src={src}
            title={title ?? "Contenu intégré"}
            loading="lazy"
            allow="payment"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full bg-white"
            style={{ height: `${h}px`, border: 0 }}
          />
        </div>
      </Reveal>
    </div>
  );
}
