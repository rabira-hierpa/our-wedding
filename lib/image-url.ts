/**
 * Build a gallery thumbnail URL via the uploads resize API (?w=&q=).
 * Lightbox / download should use the bare publicUrl (no query).
 */
export function galleryThumbUrl(
  publicUrl: string,
  width = 720,
  quality = 75
): string {
  if (!publicUrl) return publicUrl;
  try {
    const url = new URL(publicUrl, "http://localhost");
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality));
    // Preserve relative paths if the original was relative
    if (publicUrl.startsWith("/")) {
      return `${url.pathname}${url.search}`;
    }
    return url.toString();
  } catch {
    const sep = publicUrl.includes("?") ? "&" : "?";
    return `${publicUrl}${sep}w=${width}&q=${quality}`;
  }
}
