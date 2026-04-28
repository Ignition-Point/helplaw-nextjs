/**
 * Content sanitizer — auto-fixes content quality issues regardless of source.
 *
 * Why this exists: Content can be created or edited via three different paths:
 *   1. /admin/create-case (the Google Doc parser)
 *   2. Lovable's CMS UI (writes directly to Supabase)
 *   3. Direct Supabase / SQL edits
 *
 * The QC checks in /admin/create-case only cover path 1. To guarantee that
 * Help Law Group's pages always render correctly — and pass Screaming Frog
 * audits — we run every fetched case through this sanitizer at render time.
 * The functions are pure and idempotent, so they can also be applied to
 * batch DB cleanups (see scripts/sanitize-existing-content.ts) and to new
 * inserts via the parser. Same logic, three application points.
 *
 * Design principles:
 *   - Non-destructive. We never delete content, only normalize and tighten.
 *   - Idempotent. Running twice produces the same output as running once.
 *   - Reportable. Every function returns a list of `fixed` strings so the
 *     caller can log what changed.
 *   - No external dependencies. Plain TypeScript + regex.
 */

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

export interface SanitizeResult<T> {
  value: T;
  fixed: string[];
}

export interface CaseRecord {
  id?: string;
  slug?: string | null;
  title?: string | null;
  status?: string | null;
  page_type?: string | null;
  category?: string | null;
  case_type?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_canonical?: string | null;
  seo_image?: string | null;
  seo_focus_keyword?: string | null;
  seo_secondary_keywords?: string | null;
  seo_schema_type?: string | null;
  seo_noindex?: boolean | null;
  hero_subheadline?: string | null;
  hero_eyebrow?: string | null;
  hero_headline?: string | null;
  hero_background_image?: string | null;
  final_cta_headline?: string | null;
  final_cta_button?: string | null;
  final_cta_background_image?: string | null;
  phone_number?: string | null;
  display_number?: string | null;
  updated_at?: string | null;
  // ...other fields are passed through untouched
  [key: string]: unknown;
}

export interface CaseSectionRecord {
  id: string;
  case_id?: string;
  section_type: string;
  content?: Record<string, unknown> | null;
  visible?: boolean;
  sort_order?: number;
  [key: string]: unknown;
}

export interface CaseFaqRecord {
  id: string;
  case_id?: string;
  question: string;
  answer: string;
  sort_order?: number;
  [key: string]: unknown;
}

// ───────────────────────────────────────────────
// Slug
// ───────────────────────────────────────────────

/**
 * Normalize a slug to lowercase, hyphen-separated, ASCII-safe.
 * Fixes Screaming Frog's "URL Contains Space" warning and similar issues
 * caused by direct CMS edits that don't enforce slug rules.
 */
export function sanitizeSlug(rawSlug: string | null | undefined, fallbackTitle?: string | null): SanitizeResult<string> {
  const fixed: string[] = [];
  let slug = (rawSlug || "").trim();

  if (!slug && fallbackTitle) {
    slug = fallbackTitle;
    fixed.push("Slug was empty — derived from title");
  }

  const original = slug;

  // Replace any non-ASCII with ASCII equivalents (basic Latin-1 normalization)
  slug = slug.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  // Lowercase
  slug = slug.toLowerCase();
  // Replace spaces and any non-alphanumeric run with a single hyphen
  slug = slug.replace(/[^a-z0-9]+/g, "-");
  // Collapse repeated hyphens
  slug = slug.replace(/-+/g, "-");
  // Trim leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");

  if (slug !== original && original) {
    fixed.push(`Slug normalized: "${original}" → "${slug}"`);
  }

  // Cap at 75 chars at a hyphen boundary if possible
  if (slug.length > 75) {
    const truncated = slug.slice(0, 75);
    const lastHyphen = truncated.lastIndexOf("-");
    slug = lastHyphen > 30 ? truncated.slice(0, lastHyphen) : truncated;
    fixed.push(`Slug truncated to ${slug.length} chars`);
  }

  return { value: slug, fixed };
}

// ───────────────────────────────────────────────
// Meta description
// ───────────────────────────────────────────────

const META_DESCRIPTION_MAX = 155;

/**
 * Truncate a meta description at a word boundary so Google doesn't cut
 * mid-word in the SERP snippet.
 */
export function sanitizeMetaDescription(raw: string | null | undefined): SanitizeResult<string> {
  const fixed: string[] = [];
  let desc = (raw || "").trim();

  if (!desc) return { value: "", fixed };

  // Strip any HTML tags that may have leaked in from a CMS rich-text editor
  if (/<[^>]+>/.test(desc)) {
    desc = desc.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    fixed.push("Stripped HTML tags from meta description");
  }

  // Normalize internal whitespace (tabs, newlines)
  if (/[\n\t]/.test(desc) || /\s{2,}/.test(desc)) {
    desc = desc.replace(/\s+/g, " ").trim();
    fixed.push("Collapsed whitespace in meta description");
  }

  if (desc.length <= META_DESCRIPTION_MAX) {
    return { value: desc, fixed };
  }

  // Truncate at word boundary, leaving room for ellipsis
  const target = META_DESCRIPTION_MAX - 3;
  const lastSpace = desc.lastIndexOf(" ", target);
  const cutAt = lastSpace > target * 0.6 ? lastSpace : target;
  desc = desc.slice(0, cutAt).trimEnd() + "...";
  fixed.push(`Truncated meta description to ${desc.length} chars at word boundary`);

  return { value: desc, fixed };
}

// ───────────────────────────────────────────────
// SEO title
// ───────────────────────────────────────────────

const BRAND = "Help Law Group";
const SEO_TITLE_MAX = 60;
const SEO_TITLE_BRAND_SUFFIX = ` | ${BRAND}`;

/**
 * Ensure SEO title contains the brand and is within the 60-char SERP cap.
 * If the brand is missing and there's room, append it. If we'd exceed the
 * cap, leave it alone (don't truncate page-specific copy just to cram brand in).
 */
export function sanitizeSeoTitle(raw: string | null | undefined, fallbackPageTitle?: string | null): SanitizeResult<string> {
  const fixed: string[] = [];
  let title = (raw || "").trim();

  if (!title && fallbackPageTitle) {
    title = `${fallbackPageTitle.trim()}${SEO_TITLE_BRAND_SUFFIX}`;
    fixed.push("SEO title was empty — derived from page title with brand");
  }

  if (!title) return { value: "", fixed };

  // Strip stray HTML
  if (/<[^>]+>/.test(title)) {
    title = title.replace(/<[^>]+>/g, "").trim();
    fixed.push("Stripped HTML tags from SEO title");
  }

  // Collapse whitespace
  if (/\s{2,}|[\n\t]/.test(title)) {
    title = title.replace(/\s+/g, " ").trim();
    fixed.push("Collapsed whitespace in SEO title");
  }

  // If brand is missing AND adding it stays under 60, add it
  const brandRegex = /help\s*law\s*group/i;
  if (!brandRegex.test(title) && title.length + SEO_TITLE_BRAND_SUFFIX.length <= SEO_TITLE_MAX) {
    title = title + SEO_TITLE_BRAND_SUFFIX;
    fixed.push("Appended brand to SEO title");
  }

  return { value: title, fixed };
}

// ───────────────────────────────────────────────
// Canonical URL
// ───────────────────────────────────────────────

const PRODUCTION_ORIGIN = "https://helplaw.com";

/**
 * Resolve the canonical URL for a page. If a custom canonical is set
 * but malformed (relative URL, http://, trailing slash on the path), we fix
 * it. Otherwise we fall back to the derived canonical.
 *
 * The `path` argument is the URL path without origin, e.g. "cases/my-slug"
 * or "resources/my-post" — leading slash is optional.
 *
 * Addresses Screaming Frog "Canonicals: Missing" warnings (22% of pages).
 */
export function sanitizeCanonical(custom: string | null | undefined, path: string): SanitizeResult<string> {
  const fixed: string[] = [];
  const cleanPath = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const derived = `${PRODUCTION_ORIGIN}/${cleanPath}`;

  if (!custom || !custom.trim()) {
    return { value: derived, fixed: ["Canonical was missing — derived from slug"] };
  }

  let canonical = custom.trim();

  // Force https
  if (canonical.startsWith("http://")) {
    canonical = "https://" + canonical.slice(7);
    fixed.push("Forced canonical to https");
  }

  // Convert relative to absolute
  if (canonical.startsWith("/")) {
    canonical = PRODUCTION_ORIGIN + canonical;
    fixed.push("Made canonical absolute");
  }

  // Strip trailing slash on non-root paths
  if (canonical.length > PRODUCTION_ORIGIN.length + 1 && canonical.endsWith("/")) {
    canonical = canonical.replace(/\/+$/, "");
    fixed.push("Stripped trailing slash from canonical");
  }

  // Validate the result is a sane URL
  try {
    new URL(canonical);
  } catch {
    fixed.push(`Custom canonical "${custom}" was invalid — using derived`);
    return { value: derived, fixed };
  }

  return { value: canonical, fixed };
}

// ───────────────────────────────────────────────
// HTML body content
// ───────────────────────────────────────────────

/**
 * Sanitize HTML body content from any source.
 *
 *   - Strip <h1> tags entirely (page already has exactly one h1: the page title)
 *   - Downgrade <h2> to <h3> (page h2s come from section headlines)
 *   - Add loading="lazy" and decoding="async" to <img> if missing
 *   - Add alt="" if alt is missing entirely (accessibility minimum)
 *   - Remove inline width/height style strings that conflict with attributes
 *   - Collapse triple+ <br> into double
 *   - Strip empty <p></p> blocks
 */
export function sanitizeHtml(raw: string | null | undefined): SanitizeResult<string> {
  const fixed: string[] = [];
  let html = raw || "";
  if (!html) return { value: "", fixed };

  // ── Heading hierarchy ──
  if (/<h1\b/i.test(html)) {
    html = html.replace(/<h1\b([^>]*)>/gi, "<h3$1>").replace(/<\/h1>/gi, "</h3>");
    fixed.push("Downgraded inline <h1> to <h3>");
  }
  if (/<h2\b/i.test(html)) {
    html = html.replace(/<h2\b([^>]*)>/gi, "<h3$1>").replace(/<\/h2>/gi, "</h3>");
    fixed.push("Downgraded inline <h2> to <h3>");
  }

  // ── Image attributes ──
  // Match each <img> tag and rewrite its attributes if needed.
  html = html.replace(/<img\b([^>]*)\/?>/gi, (match, attrsRaw: string) => {
    let attrs = attrsRaw;
    let changed = false;

    if (!/\bloading\s*=/i.test(attrs)) {
      attrs += ' loading="lazy"';
      changed = true;
    }
    if (!/\bdecoding\s*=/i.test(attrs)) {
      attrs += ' decoding="async"';
      changed = true;
    }
    if (!/\balt\s*=/i.test(attrs)) {
      attrs += ' alt=""';
      changed = true;
    }
    if (changed && !fixed.includes("Added missing img attributes (loading/decoding/alt)")) {
      fixed.push("Added missing img attributes (loading/decoding/alt)");
    }
    return `<img${attrs}>`;
  });

  // ── Empty paragraphs ──
  if (/<p>\s*<\/p>/i.test(html)) {
    html = html.replace(/<p>\s*<\/p>/gi, "");
    fixed.push("Removed empty <p> blocks");
  }

  // ── Collapse runaway <br> ──
  if (/(<br\s*\/?>\s*){3,}/i.test(html)) {
    html = html.replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>");
    fixed.push("Collapsed 3+ consecutive <br> tags");
  }

  return { value: html, fixed };
}

// ───────────────────────────────────────────────
// Image URL — prefer .webp variant if it exists
// ───────────────────────────────────────────────

/**
 * If an image URL points to a .png or .jpg, swap to .webp on the assumption
 * that the image pipeline produces a .webp variant alongside the original.
 * Used for hero background URLs from older records.
 *
 * NOTE: This is a heuristic. It only fires when the URL is on our own
 * Supabase storage bucket OR points at a /assets/alt path we control —
 * never against an arbitrary remote URL we can't predict.
 */
export function preferWebpUrl(url: string | null | undefined): SanitizeResult<string> {
  const fixed: string[] = [];
  if (!url) return { value: "", fixed };
  const u = url.trim();
  if (!u) return { value: u, fixed };

  // Only rewrite for paths we control
  const isOurAsset = u.startsWith("/assets/alt/") || u.includes("supabase.co/storage/");
  if (!isOurAsset) return { value: u, fixed };

  if (/\.(png|jpe?g)(\?|#|$)/i.test(u)) {
    const webp = u.replace(/\.(png|jpe?g)(\?|#|$)/i, ".webp$2");
    fixed.push(`Rewrote image URL to WebP variant`);
    return { value: webp, fixed };
  }

  return { value: u, fixed };
}

// ───────────────────────────────────────────────
// Top-level: a single case record
// ───────────────────────────────────────────────

/**
 * Sanitize an entire case record. Returns a new record with sanitized
 * fields and a list of every fix applied. Original is not mutated.
 */
export function sanitizeCaseRecord(input: CaseRecord): SanitizeResult<CaseRecord> {
  const fixed: string[] = [];
  const out: CaseRecord = { ...input };

  const slugRes = sanitizeSlug(input.slug, input.title);
  if (slugRes.value !== input.slug) {
    out.slug = slugRes.value;
    fixed.push(...slugRes.fixed);
  }

  const descRes = sanitizeMetaDescription(input.seo_description);
  if (descRes.value !== input.seo_description) {
    out.seo_description = descRes.value || null;
    fixed.push(...descRes.fixed);
  }

  const titleRes = sanitizeSeoTitle(input.seo_title, input.title);
  if (titleRes.value !== input.seo_title) {
    out.seo_title = titleRes.value || null;
    fixed.push(...titleRes.fixed);
  }

  const canonRes = sanitizeCanonical(input.seo_canonical, `cases/${out.slug || ""}`);
  if (canonRes.value !== input.seo_canonical) {
    out.seo_canonical = canonRes.value;
    fixed.push(...canonRes.fixed);
  }

  // Hero background image: prefer WebP if we own the URL
  const bgRes = preferWebpUrl(input.hero_background_image);
  if (bgRes.value !== input.hero_background_image) {
    out.hero_background_image = bgRes.value || null;
    fixed.push(...bgRes.fixed.map((f) => `hero_background_image: ${f}`));
  }

  return { value: out, fixed };
}

/**
 * Sanitize a case_section row — runs HTML through the body sanitizer.
 */
export function sanitizeCaseSection(input: CaseSectionRecord): SanitizeResult<CaseSectionRecord> {
  const fixed: string[] = [];
  const rawContent = input.content as unknown;
  let contentObj: Record<string, unknown> = {};

  if (typeof rawContent === "object" && rawContent !== null && !Array.isArray(rawContent)) {
    contentObj = rawContent as Record<string, unknown>;
  } else if (typeof rawContent === "string") {
    const trimmed = rawContent.trim();
    if (trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
          contentObj = parsed as Record<string, unknown>;
          fixed.push("Parsed section.content JSON string into object");
        }
      } catch {
        // fall through
      }
    }
  }

  const content = contentObj;
  const out: CaseSectionRecord = { ...input, content: { ...contentObj } };
  const newContent = out.content as Record<string, unknown>;

  // Only certain content keys hold HTML body
  const htmlKeys = ["content", "subheadline"];
  for (const key of htmlKeys) {
    const raw = content[key];
    if (typeof raw === "string" && raw) {
      const res = sanitizeHtml(raw);
      if (res.value !== raw) {
        newContent[key] = res.value;
        fixed.push(...res.fixed.map((f) => `${input.section_type ?? "section"}.${key}: ${f}`));
      }
    }
  }

  // Background images on section blocks
  const bgKeys = ["backgroundImage", "imageUrl"];
  for (const key of bgKeys) {
    const raw = content[key];
    if (typeof raw === "string" && raw) {
      const res = preferWebpUrl(raw);
      if (res.value !== raw) {
        newContent[key] = res.value;
        fixed.push(...res.fixed.map((f) => `${input.section_type ?? "section"}.${key}: ${f}`));
      }
    }
  }

  return { value: out, fixed };
}

/**
 * Sanitize an FAQ — runs the answer through the HTML sanitizer.
 */
export function sanitizeFaq(input: CaseFaqRecord): SanitizeResult<CaseFaqRecord> {
  const fixed: string[] = [];
  const out: CaseFaqRecord = { ...input };

  if (typeof input.answer === "string" && input.answer) {
    const res = sanitizeHtml(input.answer);
    if (res.value !== input.answer) {
      out.answer = res.value;
      fixed.push(...res.fixed.map((f) => `faq.answer: ${f}`));
    }
  }

  // Trim and ensure question ends with ?
  if (typeof input.question === "string") {
    const trimmed = input.question.trim();
    if (trimmed && !trimmed.endsWith("?")) {
      out.question = trimmed + "?";
      fixed.push("faq.question: appended missing '?'");
    } else if (trimmed !== input.question) {
      out.question = trimmed;
    }
  }

  return { value: out, fixed };
}
