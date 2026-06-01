"use client";

import { useEffect, useState } from "react";
import { PageBody } from "@/components/PageBody";
import type { Block, Theme } from "@/lib/pages";

type PreviewData = {
  title?: string;
  description?: string;
  theme?: Theme;
  blocks?: Block[];
};

// Rendered inside the Decap admin preview iframe. Receives the page data from
// the CMS via postMessage and renders the REAL page body — so the preview is
// the actual site (same components, CSS, contour lines, animations).
export default function AdminPreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const d = e.data as { __cmsPreview?: boolean; payload?: PreviewData };
      if (d && d.__cmsPreview) setData(d.payload || {});
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
    <PageBody
      title={data.title || "Titre de la page"}
      description={data.description}
      theme={data.theme}
      blocks={Array.isArray(data.blocks) ? data.blocks : []}
    />
  );
}
