import type { ReactNode } from "react";

// Minimal, dependency-free Markdown renderer for the rich-text fields.
// Supports headings (#..######), bullet and numbered lists, paragraphs,
// **bold**, *italic* and [label](url) links. It returns React nodes
// (never dangerouslySetInnerHTML), so it is XSS-safe by construction.

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      nodes.push(<em key={`${keyPrefix}-i${i}`}>{m[3]}</em>);
    } else if (m[4] !== undefined) {
      const url = m[5];
      const external = /^https?:\/\//.test(url);
      nodes.push(
        <a
          key={`${keyPrefix}-a${i}`}
          href={url}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="text-glacier underline underline-offset-4 decoration-glacier/40 hover:decoration-glacier"
        >
          {m[4]}
        </a>
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

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
        const lines = block.split("\n");
        const heading = block.match(/^(#{1,6})\s+(.*)$/);
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
        return <p key={bi}>{renderInline(lines.join(" "), `p${bi}`)}</p>;
      })}
    </div>
  );
}
