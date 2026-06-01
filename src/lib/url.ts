// URL helpers shared by the page-builder blocks.
//
// Editors type things like "google.com" without a scheme; left as-is, the
// browser treats them as a path relative to the current page
// (…/google.com). normalizeUrl prepends https:// unless the value is already
// an absolute URL, a mailto:/tel: link, an in-site path (/…) or an anchor (#…).

export function normalizeUrl(url?: string): string {
  if (!url) return "#";
  const u = url.trim();
  if (!u) return "#";
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(u)) return u;
  return `https://${u}`;
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
