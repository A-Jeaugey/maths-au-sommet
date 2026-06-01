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
    default:
      return null;
  }
}

// Each block can opt into its own light/dark band via `background`, so one
// page can alternate clear and dark sections. When a block inherits (the
// default), it stays transparent and uses the page's theme.
export function BlockRenderer({ blocks, dark }: { blocks: Block[]; dark?: boolean }) {
  return (
    <>
      {blocks.map((block, i) => {
        const override =
          block.background && block.background !== "inherit" ? block.background : null;
        const blockDark = override ? override === "dark" : !!dark;
        return (
          <section
            key={i}
            className={clsx(
              override && (blockDark ? "grain bg-nuit text-neige" : "bg-neige text-encre")
            )}
          >
            <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 md:py-16">
              {renderBlock(block, blockDark)}
            </div>
          </section>
        );
      })}
    </>
  );
}
