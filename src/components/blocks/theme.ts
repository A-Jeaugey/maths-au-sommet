// Shared light/dark class tokens so every block adapts to the page theme
// without each component re-deriving the same conditional class strings.

export function tones(dark?: boolean) {
  return {
    title: dark ? "text-neige" : "text-encre",
    body: dark ? "text-neige/80" : "text-encre/85",
    muted: dark ? "text-neige/55" : "text-encre/55",
    overline: dark ? "text-glacier" : "text-encre/60",
    rule: dark ? "bg-glacier" : "bg-encre/40",
    cardBg: dark ? "bg-nuit" : "bg-neige",
    gridBg: dark ? "bg-neige/15" : "bg-encre/10",
    cardTitle: dark ? "text-neige" : "text-encre",
    cardText: dark ? "text-neige/70" : "text-encre/75",
    hairline: dark ? "border-neige/15" : "border-encre/15",
  };
}
