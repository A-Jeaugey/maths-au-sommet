import { notFound } from "next/navigation";
import type { Metadata } from "next";
import clsx from "clsx";
import { Navigation } from "@/components/Navigation";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Footer } from "@/components/Footer";
import { ContourLines } from "@/components/ContourLines";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { getPage, getPageSlugs, getPageLinks } from "@/lib/pages";

// Only the pages that exist as files are built; any other URL 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPageSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getPage(params.slug);
  if (!page) return {};
  const images = page.ogImage ? [page.ogImage] : undefined;
  return {
    title: page.title,
    description: page.description,
    openGraph: { title: page.title, description: page.description, images },
    twitter: {
      card: page.ogImage ? "summary_large_image" : "summary",
      title: page.title,
      description: page.description,
    },
  };
}

export default function CustomPage({ params }: { params: { slug: string } }) {
  const page = getPage(params.slug);
  if (!page) notFound();

  const dark = page.theme === "dark";
  const pages = getPageLinks();

  return (
    <>
      <ScrollProgress />
      <Navigation basePath="/" pages={pages} />
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
              {page.title}
            </h1>
            {page.description && (
              <p
                className={clsx(
                  "mt-8 max-w-prose2 text-[17px] leading-[1.8] md:text-xl",
                  dark ? "text-neige/80" : "text-encre/80"
                )}
              >
                {page.description}
              </p>
            )}
          </div>
        </header>

        <BlockRenderer blocks={page.blocks} dark={dark} />
      </main>
      <Footer />
    </>
  );
}
