# Help Law Group — Content QC Guide

A single page describing how every word, image, and metadata field on helplaw.com gets quality-checked, what's auto-fixed silently, and what needs your eyes.

---

## The four QC layers

Every change to the site flows through one of these layers. Pick the one that matches how the change is being made.

| If the edit happens via... | The QC layer is... | Runs when... |
|---|---|---|
| `/admin/create-case` (Google Doc upload) | **Parser-time sanitizer + QC checks** | At upload, before insert |
| Lovable CMS UI | **Render-time sanitizer** | On every page view |
| Direct Supabase / SQL edits | **Render-time sanitizer** + **batch cleanup** | On view + on demand |
| Code edits to homepage, /about, /how-it-works, etc. | **Build-time audit** | Before every Vercel deploy |
| Image upload to `/public/` | **Build-time audit** with `--fix` | Before every Vercel deploy |

You don't pick a layer. The layer picks you, based on where the edit happened.

---

## What gets fixed automatically (no human review needed)

Silent, idempotent fixes applied at every layer:

- **Slugs** — lowercased, spaces stripped, special chars replaced with hyphens, double-hyphens collapsed, capped at 75 chars
- **Meta descriptions** over 155 chars — truncated at the nearest word boundary with ellipsis
- **SEO titles** missing the "Help Law Group" brand — appended automatically when there's room
- **Canonical URLs** — missing ones derived from slug, `http://` forced to `https://`, trailing slashes stripped, relative paths made absolute
- **Inline `<h1>` and `<h2>` tags** in body content — downgraded to `<h3>` (the page title is the only `<h1>`, section headlines are the only `<h2>`s)
- **`<img>` tags** missing `loading=`, `decoding=`, or `alt=` attributes — sensible defaults added
- **Empty `<p></p>` blocks** — removed
- **Three-or-more `<br>` tags in a row** — collapsed
- **FAQ questions** missing trailing `?` — appended
- **Image URLs** on owned hosts (Supabase storage, `/assets/alt/`) pointing at `.png`/`.jpg` — rewritten to `.webp` if a `.webp` variant exists
- **Static page images** over 100 KB — compressed to WebP via `pnpm audit:pages:fix`

---

## What needs your review (gets flagged, not fixed)

These show up as **errors** (red) or **warnings** (amber) in the QC panel at `/admin/create-case`:

- Title content quality, missing required keywords, missing brand
- Subheadline content
- Body copy quality, voice rules adherence
- Whether the right category was chosen
- Whether all required sections exist (Who Is Responsible?, How HLG Supports Survivors, etc.)
- Word count outside the 2,100–2,800 target range
- Duplicate section headlines
- Source images that are still over 200 KB after compression
- Section content with very few words
- Brief / instructional text that leaked into rendered content (SEO notes, keyword reports, etc.)

Errors block nothing — the case is still created as a draft — but they should be fixed in the Google Doc before you set status to Active.

---

## How to view what needs human attention

**For new uploads through `/admin/create-case`:**
After paste-and-click, scroll the result panel. You'll see two boxes:

- 🔴 **QC Errors** — red, fix in the Google Doc and re-upload
- ⚠️ **QC Warnings** — amber, review and decide whether to fix

Auto-fixes also surface here, prefixed `auto-fix:` so you can see what was silently corrected.

**For existing CMS content (after Lovable edits or direct Supabase writes):**
Go to `/admin/create-case` → scroll to the **Batch CMS Sanitizer** panel → click **Preview (Dry Run)**. The fix log shows every record that has issues, organized by table:

- `cases` — slugs, SEO titles, descriptions, canonicals, hero images
- `case_sections` — body HTML hygiene, image attributes
- `case_faqs` — questions, answers
- `blog_posts` — same checks, plus body content sanitization

After review, click **Apply Fixes** to write the corrections back to Supabase.

**For code-edited pages (homepage, /about, /faq, etc.):**
Run `pnpm audit:pages` from the repo. Errors fail the build automatically when Vercel deploys, so anything in production has already passed. To see warnings without running the build, run the audit directly.

---

## What to do when the build fails

If a Vercel deploy fails with a "[prebuild] Static-page audit found errors" message:

1. The audit found a hard error — most likely a raw `<img>` tag, an `<Image>` missing alt text, or a missing `metadata` export
2. Run `pnpm audit:pages` locally to see the exact file and line
3. Fix the issue in the source file
4. Push again

Warnings (titles too short, missing canonicals) don't fail the build. They print but the deploy proceeds. Address them at your own pace.

---

## When to run the batch sanitizer

Run **Apply Fixes** on the Batch CMS Sanitizer:

- Right after Ashley does a heavy editing session in Lovable
- After running any direct SQL fix on the database
- Once a month as a hygiene pass, even if nothing visible has changed
- Before any stakeholder demo or audit

It's idempotent — running it twice in a row does nothing the second time. Safe to run any time.

---

## What's been deployed (April 2026)

**Auto-fixed at deploy:**
- 11 static pages: titles, descriptions, canonicals all corrected
- 5 oversize JPG case-card images compressed to WebP (330+ KB saved)
- 3 oversize PNG homepage backgrounds compressed to WebP (2.9 MB saved)
- Site-wide security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP, HSTS)
- AVIF + WebP enabled in Next/Image config

**Will auto-fix on next interaction:**
- Any case page edited in Lovable → render-time sanitizer cleans the rendered HTML
- Any case uploaded via Google Doc → parser-time sanitizer cleans before insert

**Still requires running batch cleanup once:**
- Existing Supabase records that pre-date this work — run **Apply Fixes** in `/admin/create-case` to bring them up to standard

---

## Where to find things

- **Sanitizer source:** `src/lib/content-sanitize.ts`
- **Batch endpoint:** `POST /api/admin/sanitize` (UI in `/admin/create-case`)
- **Static page audit:** `scripts/audit-static-pages.js` (or `pnpm audit:pages`)
- **Image compressor:** `scripts/audit-static-pages.js --fix` (or `pnpm audit:pages:fix`)
- **Parser QC checks:** `runQcChecks` in `src/app/api/create-case/route.ts`
- **Security headers:** `next.config.ts`

---

*Quick rule of thumb: if you can edit it from a UI, the sanitizer will catch it on render. If you have to write code to change it, the build-time audit will catch it before deploy. The only way to ship a problem is to bypass both — and the batch cleanup endpoint exists to mop up anything that slipped through.*
