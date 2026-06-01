import clsx from "clsx";
import { Reveal } from "@/components/Reveal";
import { tones } from "./theme";

type Row = { cells: string[] };
type Props = { title?: string; headers?: string[]; rows: Row[]; dark?: boolean };

export function TableBlock({ title, headers, rows, dark }: Props) {
  const t = tones(dark);
  const hasHead = !!headers && headers.length > 0;
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[15px]">
            {hasHead && (
              <thead>
                <tr className={clsx("border-b", t.hairline)}>
                  {headers!.map((h, i) => (
                    <th
                      key={i}
                      className={clsx(
                        "px-4 py-3 font-mono text-[11px] uppercase tracking-wider2",
                        t.muted
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(rows ?? []).map((r, ri) => (
                <tr key={ri} className={clsx("border-b", t.hairline)}>
                  {(r.cells ?? []).map((c, ci) => (
                    <td
                      key={ci}
                      className={clsx("px-4 py-3 align-top", ci === 0 ? t.title : t.body)}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
