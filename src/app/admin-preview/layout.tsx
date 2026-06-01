import type { Metadata } from "next";

// Utility route used only inside the admin's live preview iframe.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
