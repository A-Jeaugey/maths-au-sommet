import clsx from "clsx";

type Props = {
  style?: "line" | "space";
  size?: "small" | "medium" | "large";
  dark?: boolean;
};

const SPACE = {
  small: "h-6 md:h-10",
  medium: "h-12 md:h-20",
  large: "h-24 md:h-40",
};

// Full-bleed: either a thin rule or pure vertical breathing space.
export function SeparatorBlock({ style = "line", size = "medium", dark }: Props) {
  if (style === "space") {
    return <div className={SPACE[size] ?? SPACE.medium} aria-hidden />;
  }
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6 md:px-10 md:py-10">
      <hr className={clsx("border-0 border-t", dark ? "border-neige/15" : "border-encre/15")} />
    </div>
  );
}
