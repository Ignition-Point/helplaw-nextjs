/**
 * Derives the expected `site_access` cookie value from SITE_PASSWORD.
 * Uses Web Crypto (Edge-compatible) so the same logic works in middleware and server actions.
 */
export async function getExpectedSiteAccessCookieValue(): Promise<string> {
  const secret = process.env.SITE_PASSWORD?.trim();
  if (!secret) return "";
  const data = new TextEncoder().encode(`site_access:${secret}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
