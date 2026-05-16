import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nuit: "#0A1628",
        glacier: "#4AAFD4",
        neige: "#F8F9FB",
        soleil: "#F4B942",
        ardoise: "#6B7280",
        encre: "#0F172A",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        hand: ["var(--font-caveat)", "Caveat", "cursive"],
      },
      fontSize: {
        "display-xl": ["clamp(4.5rem, 11vw, 9rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(3rem, 7vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(2rem, 4vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        wider2: "0.18em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      maxWidth: {
        prose2: "62ch",
      },
    },
  },
  plugins: [],
};

export default config;
