import clsx from "clsx";

type SectionLabelProps = {
  number: string;
  label: string;
  altitude?: number;
  light?: boolean;
};

export function SectionLabel({
  number,
  label,
  altitude,
  light,
}: SectionLabelProps) {
  return (
    <p
      className={clsx(
        "flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider2",
        light ? "text-glacier" : "text-encre/60"
      )}
    >
      <span
        className={clsx(
          "block h-px w-8",
          light ? "bg-glacier" : "bg-encre/40"
        )}
        aria-hidden
      />
      <span>
        Chapitre {number} <span aria-hidden>·</span>{" "}
        <span className={light ? "text-neige/80" : "text-encre/80"}>
          {label}
        </span>
        {altitude !== undefined && (
          <>
            {" "}
            <span aria-hidden>·</span>{" "}
            <span
              className={clsx(
                "tabular-nums",
                light ? "text-neige/70" : "text-encre/70"
              )}
            >
              {altitude.toLocaleString("fr-FR")}{" "}
              <span className={light ? "text-neige/40" : "text-encre/40"}>m</span>
            </span>
          </>
        )}
      </span>
    </p>
  );
}
