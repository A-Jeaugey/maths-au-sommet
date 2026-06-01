import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { tones } from "./theme";
import { normalizeUrl, isExternalUrl } from "@/lib/url";

type Btn = { label: string; url: string; style?: "primary" | "secondary" };
type Props = { align?: "left" | "center"; buttons: Btn[]; dark?: boolean };

export function ButtonsBlock({ align = "left", buttons, dark }: Props) {
  return (
    <Reveal>
      <div
        className={clsx(
          "flex flex-wrap gap-4",
          align === "center" ? "justify-center" : "justify-start"
        )}
      >
        {(buttons ?? []).map((b, i) => {
          const url = normalizeUrl(b.url);
          const ext = isExternalUrl(url);
          const primary = (b.style ?? "primary") === "primary";
          return (
            <a
              key={i}
              href={url}
              {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-mono text-xs uppercase tracking-wider2 transition-transform hover:-translate-y-0.5",
                primary
                  ? "bg-soleil text-nuit"
                  : dark
                  ? "border border-neige/30 text-neige hover:border-neige"
                  : "border border-encre/30 text-encre hover:border-encre"
              )}
            >
              {b.label}
              {primary && <span aria-hidden>→</span>}
            </a>
          );
        })}
      </div>
    </Reveal>
  );
}
