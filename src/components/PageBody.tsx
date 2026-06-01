import clsx from "clsx";
import { ContourLines } from "@/components/ContourLines";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { Block, Theme } from "@/lib/pages";

// Shared body of a custom page: the header (with contour lines, title,
// description) + the blocks. Used both by the real /[slug] route and by the
// in-admin live preview (/admin-preview), so the preview IS the real page.
export function PageBody({
  title,
  description,
  theme,
  blocks,
}: {
  title: string;
  description?: string;
  theme?: Theme;
  blocks: Block[];
}) {
  const dark = theme === "dark";
  return (
    <main
      className={clsx(
        "min-h-screen",
        dark ? "grain bg-nuit text-neige" : "bg-neige text-encre"
      )}
    >
      <header className="relative isolate overflow-hidden pb-4 pt-36 md:pt-44">
        <ContourLines
          variant={dark ? "summit" : "ridge"}
          className="inset-x-0 top-0 h-[520px] -z-0"
        />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <p
            className={clsx(
              "flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider2",
              dark ? "text-glacier" : "text-encre/60"
            )}
          >
            <span
              className={clsx("block h-px w-8", dark ? "bg-glacier" : "bg-encre/40")}
              aria-hidden
            />
            Les Maths au Sommet
          </p>
          <h1
            className={clsx(
              "mt-6 max-w-4xl font-serif font-light text-display-xl",
              dark ? "text-neige" : "text-encre"
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={clsx(
                "mt-8 max-w-prose2 text-[17px] leading-[1.8] md:text-xl",
                dark ? "text-neige/80" : "text-encre/80"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </header>

      <BlockRenderer blocks={blocks} dark={dark} />
    </main>
  );
}
