import type { ReactNode } from "react";
import { ContentImage } from "@/components/ContentImage";
import { normalizeUrl, isExternalUrl } from "@/lib/url";

// Lightweight, dependency-free Markdown renderer for the rich-text fields.
// Supports headings (#..######), bullet/numbered lists, paragraphs,
// **bold**/__bold__, *italic*/_italic_, ~~strikethrough~~, `code`,
// [label](url) links and ![alt](url "title") images. Returns React nodes
// (never dangerouslySetInnerHTML), so it is XSS-safe by construction.
// Links without a scheme are sent through normalizeUrl so "google.com"
// opens https://google.com instead of a path on this site. Images are
// click-to-zoom (see ContentImage).

const INLINE_RX =
  /!\[(?<imgAlt>[^\]]*)\]\((?<imgUrl>[^)\s]+)(?:\s+"(?<imgTitle>[^"]*)")?\)|\[(?<linkText>[^\]]+)\]\((?<linkUrl>[^)\s]+)\)|\*\*(?<b1>[^*]+)\*\*|__(?<b2>[^_]+)__|\*(?<i1>[^*]+)\*|_(?<i2>[^_]+)_|~~(?<s>[^~]+)~~|`(?<code>[^`]+)`/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  INLINE_RX.lastIndex = 0;
  while ((m = INLINE_RX.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const g = m.groups ?? {};
    const key = `${keyPrefix}-${i}`;
    if (g.imgUrl !== undefined) {
      nodes.push(
        <ContentImage key={key} src={normalizeUrl(g.imgUrl)} alt={g.imgAlt} title={g.imgTitle} />
      );
    } else if (g.linkUrl !== undefined) {
      const url = normalizeUrl(g.linkUrl);
      const ext = isExternalUrl(url);
      nodes.push(
        <a
          key={key}
          href={url}
          {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}
          className="text-glacier underline underline-offset-4 decoration-glacier/40 hover:decoration-glacier"
        >
          {g.linkText}
        </a>
      );
    } else if (g.b1 !== undefined || g.b2 !== undefined) {
      nodes.push(<strong key={key}>{g.b1 ?? g.b2}</strong>);
    } else if (g.i1 !== undefined || g.i2 !== undefined) {
      nodes.push(<em key={key}>{g.i1 ?? g.i2}</em>);
    } else if (g.s !== undefined) {
      nodes.push(<s key={key}>{g.s}</s>);
    } else if (g.code !== undefined) {
      nodes.push(
        <code key={key} className="rounded bg-glacier/15 px-1.5 py-0.5 font-mono text-[0.9em]">
          {g.code}
        </code>
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const BLOCK_IMG_RX = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/;

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const blocks = children.trim().split(/\n\s*\n/).filter(Boolean);
  return (
    <div className={className}>
      {blocks.map((block, bi) => {
        const trimmed = block.trim();

        const blockImg = trimmed.match(BLOCK_IMG_RX);
        if (blockImg) {
          return (
            <ContentImage
              key={bi}
              block
              src={normalizeUrl(blockImg[2])}
              alt={blockImg[1]}
              title={blockImg[3]}
            />
          );
        }

        const lines = block.split("\n");
        const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
          const level = heading[1].length;
          const cls =
            level <= 2
              ? "font-serif text-2xl md:text-3xl mt-10 first:mt-0"
              : "font-serif text-xl md:text-2xl mt-8 first:mt-0";
          return (
            <h3 key={bi} className={cls}>
              {renderInline(heading[2], `h${bi}`)}
            </h3>
          );
        }
        if (lines.every((l) => /^[-*+]\s+/.test(l.trim()))) {
          return (
            <ul key={bi} className="list-disc space-y-1.5 pl-5">
              {lines.map((l, li) => (
                <li key={li}>
                  {renderInline(l.trim().replace(/^[-*+]\s+/, ""), `u${bi}-${li}`)}
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\.\s+/.test(l.trim()))) {
          return (
            <ol key={bi} className="list-decimal space-y-1.5 pl-5">
              {lines.map((l, li) => (
                <li key={li}>
                  {renderInline(l.trim().replace(/^\d+\.\s+/, ""), `o${bi}-${li}`)}
                </li>
              ))}
            </ol>
          );
        }
        if (lines.every((l) => /^>\s?/.test(l) || l.trim() === "")) {
          const inner = lines.map((l) => l.replace(/^>\s?/, "")).join(" ").trim();
          return (
            <blockquote key={bi} className="border-l-2 border-glacier/50 pl-4 italic">
              {renderInline(inner, `q${bi}`)}
            </blockquote>
          );
        }
        return <p key={bi}>{renderInline(lines.join(" "), `p${bi}`)}</p>;
      })}
    </div>
  );
}
