import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Footer } from "@/components/Footer";
import { PageBody } from "@/components/PageBody";
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

  const pages = getPageLinks();

  return (
    <>
      <ScrollProgress />
      <Navigation basePath="/" pages={pages} />
      <PageBody
        title={page.title}
        description={page.description}
        theme={page.theme}
        blocks={page.blocks}
      />
      <Footer />
    </>
  );
}
