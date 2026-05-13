import clsx from "clsx";

type SectionLabelProps = {
  number: string;
  label: string;
  light?: boolean;
};

export function SectionLabel({ number, label, light }: SectionLabelProps) {
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
      </span>
    </p>
  );
}
