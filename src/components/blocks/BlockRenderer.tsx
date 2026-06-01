import clsx from "clsx";
import type { Block } from "@/lib/pages";
import { SectionHeaderBlock } from "./SectionHeaderBlock";
import { RichTextBlock } from "./RichTextBlock";
import { CardGridBlock } from "./CardGridBlock";
import { GalleryBlock } from "./GalleryBlock";
import { KeyFiguresBlock } from "./KeyFiguresBlock";
import { TimelineBlock } from "./TimelineBlock";
import { CtaBlock } from "./CtaBlock";
import { ImageTextBlock } from "./ImageTextBlock";
import { QuoteBlock } from "./QuoteBlock";
import { FundraiserBlock } from "./FundraiserBlock";
import { CountdownBlock } from "./CountdownBlock";
import { EmbedBlock } from "./EmbedBlock";
import { VideoBlock } from "./VideoBlock";
import { AccordionBlock } from "./AccordionBlock";
import { TableBlock } from "./TableBlock";
import { FileBlock } from "./FileBlock";
import { ButtonsBlock } from "./ButtonsBlock";
import { BannerBlock } from "./BannerBlock";
import { SeparatorBlock } from "./SeparatorBlock";

// Maps a stored block to its component. Each block manages its own scroll
// animations internally, so a page is "animated automatically" no matter
// how the editor arranges the blocks.
function renderBlock(block: Block, dark: boolean) {
  switch (block.type) {
    case "sectionHeader":
      return <SectionHeaderBlock {...block} dark={dark} />;
    case "richText":
      return <RichTextBlock {...block} dark={dark} />;
    case "cardGrid":
      return <CardGridBlock {...block} dark={dark} />;
    case "gallery":
      return <GalleryBlock {...block} dark={dark} />;
    case "keyFigures":
      return <KeyFiguresBlock {...block} dark={dark} />;
    case "timeline":
      return <TimelineBlock {...block} dark={dark} />;
    case "cta":
      return <CtaBlock {...block} dark={dark} />;
    case "imageText":
      return <ImageTextBlock {...block} dark={dark} />;
    case "quote":
      return <QuoteBlock {...block} dark={dark} />;
    case "fundraiser":
      return <FundraiserBlock {...block} dark={dark} />;
    case "countdown":
      return <CountdownBlock {...block} dark={dark} />;
    case "embed":
      return <EmbedBlock {...block} dark={dark} />;
    case "video":
      return <VideoBlock {...block} dark={dark} />;
    case "accordion":
      return <AccordionBlock {...block} dark={dark} />;
    case "table":
      return <TableBlock {...block} dark={dark} />;
    case "file":
      return <FileBlock {...block} dark={dark} />;
    case "buttons":
      return <ButtonsBlock {...block} dark={dark} />;
    case "banner":
      return <BannerBlock {...block} />;
    case "separator":
      return <SeparatorBlock {...block} dark={dark} />;
    default:
      return null;
  }
}

const WIDTH: Record<string, string> = {
  narrow: "max-w-3xl",
  normal: "max-w-[1400px]",
  wide: "max-w-[1700px]",
  full: "max-w-none",
};

// Blocks that render edge-to-edge, without the centered content container.
const FULL_BLEED = new Set(["banner", "separator"]);

// Each block can opt into its own light/dark/accent band via `background`, and
// pick its container width and text alignment — so one page can alternate
// clear, dark and accent sections of different widths.
export function BlockRenderer({ blocks, dark }: { blocks: Block[]; dark?: boolean }) {
  return (
    <>
      {blocks.map((block, i) => {
        const bg = block.background;
        const blockDark = bg === "dark" ? true : bg === "light" || bg === "accent" ? false : !!dark;

        if (FULL_BLEED.has(block.type)) {
          return <div key={i}>{renderBlock(block, blockDark)}</div>;
        }

        const band =
          bg === "dark"
            ? "grain bg-nuit text-neige"
            : bg === "light"
            ? "bg-neige text-encre"
            : bg === "accent"
            ? "bg-soleil text-nuit"
            : null;
        const widthClass = WIDTH[block.width ?? "normal"] ?? WIDTH.normal;

        return (
          <section key={i} className={clsx(band)}>
            <div
              className={clsx(
                "mx-auto px-6 py-12 md:px-10 md:py-16",
                widthClass,
                block.align === "center" && "text-center"
              )}
            >
              {renderBlock(block, blockDark)}
            </div>
          </section>
        );
      })}
    </>
  );
}
