// Loader + types for the custom "page builder" pages.
//
// Each page is a JSON file in `content/pages/<slug>.json`, written by the
// CMS (admin interface). The filename is the URL slug — `tombola.json`
// becomes the page `/tombola`. A page is just an ordered list of blocks,
// and every block already carries the site's animations, so a
// non-technical editor never touches code or styling.

import fs from "node:fs";
import path from "node:path";

export type Theme = "light" | "dark";

export type GalleryImage = { image: string; caption?: string; meta?: string };

export type Card = {
  icon?: string;
  title: string;
  text?: string;
  linkLabel?: string;
  linkUrl?: string;
};

export type Figure = { value: number; suffix?: string; label: string };

export type Step = { date?: string; title: string; body?: string };

export type Background = "inherit" | "light" | "dark" | "accent";

// Discriminated union — `type` decides which component renders the block.
// `background` lets a block sit on its own light or dark band, so a single
// page can alternate clear and dark sections.
export type Block = {
  background?: Background;
  width?: "narrow" | "normal" | "wide" | "full";
  align?: "left" | "center";
} & (
  | { type: "sectionHeader"; label?: string; title: string; highlight?: string; intro?: string }
  | { type: "richText"; title?: string; body: string }
  | { type: "cardGrid"; title?: string; columns?: number; cards: Card[] }
  | { type: "gallery"; title?: string; images: GalleryImage[] }
  | { type: "keyFigures"; figures: Figure[] }
  | { type: "timeline"; steps: Step[] }
  | {
      type: "cta";
      title: string;
      text?: string;
      buttonLabel: string;
      buttonUrl: string;
      secondaryLabel?: string;
      secondaryUrl?: string;
    }
  | {
      type: "imageText";
      image: string;
      imageSide?: "left" | "right";
      title?: string;
      body: string;
      caption?: string;
    }
  | { type: "quote"; quote: string; author?: string }
  | { type: "fundraiser"; current: number; goal: number; label?: string; currency?: string }
  | { type: "countdown"; date: string; label?: string; expiredText?: string }
  | { type: "embed"; url: string; title?: string; height?: number }
  | { type: "video"; url: string; title?: string; caption?: string }
  | { type: "accordion"; title?: string; items: { question: string; answer: string }[] }
  | { type: "table"; title?: string; headers?: string[]; rows: { cells: string[] }[] }
  | { type: "file"; title?: string; file: string; description?: string; buttonLabel?: string }
  | {
      type: "buttons";
      align?: "left" | "center";
      buttons: { label: string; url: string; style?: "primary" | "secondary" }[];
    }
  | {
      type: "banner";
      image: string;
      title?: string;
      text?: string;
      buttonLabel?: string;
      buttonUrl?: string;
      height?: "small" | "medium" | "large";
    }
  | { type: "separator"; style?: "line" | "space"; size?: "small" | "medium" | "large" }
);

export type PageData = {
  slug: string;
  title: string;
  description?: string;
  ogImage?: string;
  theme?: Theme;
  blocks: Block[];
};

const PAGES_DIR = path.join(process.cwd(), "content", "pages");

export function getPageSlugs(): string[] {
  if (!fs.existsSync(PAGES_DIR)) return [];
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function getPage(slug: string): PageData | null {
  const file = path.join(PAGES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<PageData>;
    return {
      slug,
      title: data.title ?? slug,
      description: data.description,
      ogImage: data.ogImage,
      theme: data.theme === "dark" ? "dark" : "light",
      blocks: Array.isArray(data.blocks) ? data.blocks : [],
    };
  } catch {
    return null;
  }
}

export function getAllPages(): PageData[] {
  return getPageSlugs()
    .map((s) => getPage(s))
    .filter((p): p is PageData => p !== null);
}

// Lightweight list for navigation menus (server → client prop).
export function getPageLinks(): { slug: string; title: string }[] {
  return getAllPages().map((p) => ({ slug: p.slug, title: p.title }));
}
