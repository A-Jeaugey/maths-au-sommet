"use client";

import React, { useEffect, useState } from "react";
import { PageBody } from "@/components/PageBody";
import type { Block, Theme } from "@/lib/pages";

type PreviewData = {
  title?: string;
  description?: string;
  theme?: Theme;
  blocks?: Block[];
};

// Safety net: while typing, a block can momentarily hold incomplete data. If a
// block throws, we show a calm message instead of crashing the whole preview;
// the `key` below remounts it on the next edit, so it recovers on its own.
class Boundary extends React.Component<
  { children: React.ReactNode },
  { error: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: false };
  }
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: "60px 24px",
            fontFamily: "system-ui, sans-serif",
            color: "#6B7280",
          }}
        >
          Un bloc est incomplet ou en cours de saisie — l&apos;aperçu reprend dès
          qu&apos;il est valide.
        </div>
      );
    }
    return this.props.children;
  }
}

// Rendered inside the Decap admin preview iframe. Receives the page data from
// the CMS via postMessage and renders the REAL page body — so the preview is
// the actual site (same components, CSS, contour lines, animations).
export default function AdminPreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const d = e.data as { __cmsPreview?: boolean; payload?: PreviewData };
      if (d && d.__cmsPreview) {
        setData(d.payload || {});
        setVersion((v) => v + 1);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!data) {
    return (
      <div
        style={{
          padding: "80px 24px",
          fontFamily: "system-ui, sans-serif",
          color: "#6B7280",
        }}
      >
        L&apos;aperçu s&apos;affiche ici dès que vous remplissez la page.
      </div>
    );
  }

  return (
    <Boundary key={version}>
      <PageBody
        title={data.title || "Titre de la page"}
        description={data.description}
        theme={data.theme}
        blocks={Array.isArray(data.blocks) ? data.blocks : []}
      />
    </Boundary>
  );
}
