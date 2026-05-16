import type { Metadata } from "next";
import {
  Caveat,
  Fraunces,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maths-au-sommet.fr"),
  title: {
    default: "Les Maths au Sommet — Lycée Notre-Dame, Dijon",
    template: "%s · Les Maths au Sommet",
  },
  description:
    "La réussite par le bien-être et le dépassement de soi. Trente-huit élèves de Terminale du lycée Notre-Dame de Dijon préparent l'ascension de Tête Blanche, 3 429 m, en juillet 2026.",
  openGraph: {
    title: "Les Maths au Sommet",
    description:
      "Une année de préparation, une cordée de 38 élèves, un sommet : Tête Blanche, 3 429 m.",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Les Maths au Sommet",
    description:
      "Une année de préparation, une cordée de 38 élèves, un sommet : Tête Blanche, 3 429 m.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} ${caveat.variable}`}
    >
      <body className="font-sans antialiased">
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
