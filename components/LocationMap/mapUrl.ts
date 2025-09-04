export function googleMapsEmbedUrl(query: string) {
  const q = encodeURIComponent((query ?? "").trim());
  return `https://www.google.com/maps?q=${q}&output=embed`;
}
