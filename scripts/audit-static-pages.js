#!/usr/bin/env node
/**
 * audit-static-pages.js
 *
 * Build-time QC for code-edited pages — homepage, /about, /how-it-works,
 * /privacy, /terms, etc. These pages don't go through Lovable CMS or
 * /admin/create-case, so the runtime sanitizer can't see them. This script
 * walks the source tree, parses each `page.tsx`, and reports issues that
 * Screaming Frog or PageSpeed would flag.
 *
 * What it checks per page:
 *   - `metadata` export exists with title + description
 *   - title length 30-60 chars
 *   - description length 50-155 chars
 *   - `alternates: { canonical }` is set (or layout-level fallback exists)
 *   - No raw <img> tags (must use next/image Image component)
 *   - All <Image> usages have an `alt` prop
 *   - At most one <h1> per page
 *   - No CSS background-image referring to a raw .png/.jpg in /public
 *     when the file is over 100 KB
 *
 * Plus repo-wide image hygiene:
 *   - Any image in /public over 100 KB without a webp counterpart is flagged
 *   - Any unused image in /public/uploads (gitignored anyway) is informational
 *
 * Exit codes:
 *   0 — clean
 *   1 — errors found (CI should fail the build)
 *
 * Run with `node scripts/audit-static-pages.js` or `pnpm audit:pages`.
 * Add `--fix` to auto-compress oversize PNGs/JPGs to WebP. Without --fix
 * the script is read-only.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(ROOT, "src/app");
const PUBLIC_DIR = path.join(ROOT, "public");

const args = process.argv.slice(2);
const FIX = args.includes("--fix");
const VERBOSE = args.includes("--verbose");

// Pages that intentionally noindex or have non-standard metadata are
// allow-listed. Add to this list if you have an admin-only or preview page.
const SKIP_PAGES = new Set([
  "src/app/admin/create-case/page.tsx",
  "src/app/admin/seo/page.tsx",
  "src/app/cases/preview/[slug]/page.tsx",
  "src/app/design-review/page.tsx",
  "src/app/cases/[slug]/page.tsx", // dynamic — metadata is generated per-slug
  "src/app/resources/[slug]/page.tsx", // dynamic — metadata is generated per-slug
]);

const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 50;
const DESC_MAX = 155;
const IMAGE_BIG = 100 * 1024; // Screaming Frog threshold

const issues = [];
function issue(severity, file, message) {
  issues.push({ severity, file, message });
}

// ─── Walk app directory for page.tsx files ───

function walkPages(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkPages(full, results);
    } else if (entry.name === "page.tsx") {
      results.push(full);
    }
  }
  return results;
}

// ─── Page checks ───

function relPath(p) {
  return path.relative(ROOT, p);
}

function checkPage(file) {
  const rel = relPath(file);
  if (SKIP_PAGES.has(rel)) {
    if (VERBOSE) console.log(`  skip: ${rel}`);
    return;
  }

  const src = fs.readFileSync(file, "utf8");

  // ── Metadata export ──
  // Look for `export const metadata` or `export async function generateMetadata`.
  const hasStaticMeta = /export\s+const\s+metadata\s*[:=]/.test(src);
  const hasGenMeta = /export\s+async\s+function\s+generateMetadata/.test(src);

  if (!hasStaticMeta && !hasGenMeta) {
    issue("error", rel, "No metadata export — page will use layout default title/description");
  }

  // ── Title and description in static metadata ──
  if (hasStaticMeta) {
    const titleMatch = src.match(/title\s*:\s*["'`]([^"'`]+)["'`]/);
    const descMatch = src.match(/description\s*:\s*["'`]([^"'`]+)["'`]/);

    if (titleMatch) {
      const t = titleMatch[1];
      if (t.length < TITLE_MIN) {
        issue("warning", rel, `Title is ${t.length} chars (Screaming Frog flags <30): "${t}"`);
      }
      if (t.length > TITLE_MAX) {
        issue("warning", rel, `Title is ${t.length} chars (Screaming Frog flags >60): "${t}"`);
      }
      if (!/help\s*law\s*group/i.test(t)) {
        issue("warning", rel, `Title doesn't mention "Help Law Group": "${t}"`);
      }
    } else if (hasStaticMeta) {
      issue("error", rel, "metadata export exists but no `title` field found");
    }

    if (descMatch) {
      const d = descMatch[1];
      if (d.length < DESC_MIN) {
        issue("warning", rel, `Description is ${d.length} chars — too short for SERP (aim for 120-155)`);
      }
      if (d.length > DESC_MAX) {
        issue("warning", rel, `Description is ${d.length} chars — Google may truncate (aim for 120-155)`);
      }
    } else if (hasStaticMeta) {
      issue("warning", rel, "metadata export exists but no `description` field found");
    }
  }

  // ── Canonical ──
  // Either set explicitly here or inherited from layout. The homepage already
  // sets it. Other pages should too if they want clean Screaming Frog output.
  const hasCanonical = /alternates\s*:\s*\{[^}]*canonical/.test(src);
  if (hasStaticMeta && !hasCanonical) {
    issue("warning", rel, "metadata is missing `alternates: { canonical }` — relies on layout fallback");
  }

  // ── Raw <img> tags ──
  // Next.js's @next/next/no-img-element rule should catch these in lint, but
  // we double-check here in case lint is bypassed.
  const rawImgMatches = src.match(/<img\b[^>]*>/g) || [];
  if (rawImgMatches.length > 0) {
    issue("error", rel, `${rawImgMatches.length} raw <img> tag(s) — use next/image Image component instead`);
  }

  // ── <Image> without alt ──
  // Crude regex but catches the common case. Multiline-safe via [\s\S].
  const imageMatches = src.match(/<Image\b[\s\S]*?\/>/g) || [];
  for (const tag of imageMatches) {
    if (!/\balt\s*=/.test(tag)) {
      const preview = tag.replace(/\s+/g, " ").slice(0, 80);
      issue("error", rel, `<Image> missing alt prop: ${preview}...`);
    }
  }

  // ── Multiple <h1> ──
  // Exact h1 count. Some pages use <H1> components — those would need their
  // own check. The standard case page already wraps title in <h1>.
  const h1Count = (src.match(/<h1[\s>]/gi) || []).length;
  if (h1Count > 1) {
    issue("warning", rel, `${h1Count} <h1> tags on page — should have exactly one for SEO`);
  }

  // ── CSS background-image referring to raw PNG/JPG ──
  // Pattern: backgroundImage: "url(/something.png)" — these bypass next/image.
  // Flag if the file is over IMAGE_BIG.
  const bgRegex = /backgroundImage\s*:\s*["'`]url\(([^)]+)\)["'`]/g;
  let m;
  while ((m = bgRegex.exec(src)) !== null) {
    const ref = m[1].trim().replace(/^["']|["']$/g, "");
    if (!/\.(png|jpe?g)(\?|$)/i.test(ref)) continue; // webp/svg are fine
    const filePath = ref.startsWith("/") ? path.join(PUBLIC_DIR, ref) : path.resolve(path.dirname(file), ref);
    if (!fs.existsSync(filePath)) continue;
    const size = fs.statSync(filePath).size;
    if (size >= IMAGE_BIG) {
      issue(
        "warning",
        rel,
        `CSS backgroundImage references ${(size / 1024).toFixed(0)} KB ${path.extname(ref).slice(1).toUpperCase()} — convert to WebP and use Next/Image where possible (${ref})`
      );
    }
  }
}

// ─── Repo-wide image hygiene ───

function walkAssets(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip /uploads — gitignored, never deployed
      if (full.includes(path.sep + "uploads" + path.sep) || entry.name === "uploads") continue;
      walkAssets(full, results);
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function auditAssets() {
  const images = walkAssets(PUBLIC_DIR);
  const oversized = images.filter((p) => fs.statSync(p).size >= IMAGE_BIG);

  for (const file of oversized) {
    const rel = relPath(file);
    const size = fs.statSync(file).size;
    const webpPath = file.replace(/\.(png|jpe?g)$/i, ".webp");
    const hasWebp = fs.existsSync(webpPath);

    if (!hasWebp) {
      issue(
        "warning",
        rel,
        `${(size / 1024).toFixed(0)} KB — over 100 KB threshold and no .webp counterpart exists`
      );
    } else if (size > fs.statSync(webpPath).size * 2) {
      // PNG/JPG significantly larger than WebP — code is probably referencing
      // the original. The build-time check above will flag specific refs.
      if (VERBOSE) {
        console.log(`  note: ${rel} (${(size / 1024).toFixed(0)} KB) has webp at ${(fs.statSync(webpPath).size / 1024).toFixed(0)} KB`);
      }
    }
  }
}

// ─── --fix mode: compress oversize PNG/JPG to WebP ───

async function autoFix() {
  let sharp;
  try {
    sharp = require(path.join(ROOT, "node_modules/sharp"));
  } catch {
    console.error("sharp is required for --fix. Run from project root.");
    process.exit(1);
  }

  const images = walkAssets(PUBLIC_DIR);
  for (const file of images) {
    const size = fs.statSync(file).size;
    if (size < IMAGE_BIG) continue;
    const webpPath = file.replace(/\.(png|jpe?g)$/i, ".webp");
    if (fs.existsSync(webpPath)) continue;

    const before = size;
    await sharp(file)
      .resize(1920, null, { withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 80 })
      .toFile(webpPath);
    const after = fs.statSync(webpPath).size;
    console.log(
      `  compressed ${relPath(file)}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (${Math.round((1 - after / before) * 100)}% reduction)`
    );
  }
}

// ─── Run ───

(async () => {
  const pages = walkPages(APP_DIR);
  console.log(`Auditing ${pages.length} page.tsx file(s)...`);
  for (const p of pages) checkPage(p);

  console.log("Auditing public/ assets...");
  auditAssets();

  if (FIX) {
    console.log("\nRunning --fix to compress oversize images...");
    await autoFix();
  }

  // Report
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  console.log(`\n=== AUDIT RESULTS ===`);
  console.log(`Errors:   ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log(`\n--- ERRORS ---`);
    for (const i of errors) console.log(`  [${i.file}] ${i.message}`);
  }
  if (warnings.length > 0) {
    console.log(`\n--- WARNINGS ---`);
    for (const i of warnings) console.log(`  [${i.file}] ${i.message}`);
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log("\nAll static pages and assets pass QC.");
  }

  // Exit non-zero if errors so CI can block. Warnings don't fail the build.
  process.exit(errors.length > 0 ? 1 : 0);
})();
