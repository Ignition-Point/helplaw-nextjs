/**
 * POST /api/admin/sanitize
 *
 * Walks every case, case_section, case_faq, and blog_post in the CMS,
 * runs each through the content sanitizer, and writes the corrected values
 * back to Supabase. This is the batch-cleanup half of the sanitizer story:
 * the render layer auto-fixes on read, and this endpoint auto-fixes on the
 * stored data so direct DB readers (Lovable, SQL clients) also see clean
 * records.
 *
 * Returns a per-record report of what was fixed. Does not delete or create
 * records — only updates fields whose sanitized value differs from stored.
 *
 * Auth: requires SUPABASE_SERVICE_ROLE_KEY for write access. Pass an
 * `?dryRun=1` query param to preview changes without writing.
 *
 * Usage:
 *   curl -X POST https://helplaw.com/api/admin/sanitize?dryRun=1
 *   curl -X POST https://helplaw.com/api/admin/sanitize
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  sanitizeCaseRecord,
  sanitizeCaseSection,
  sanitizeFaq,
  sanitizeMetaDescription,
  sanitizeSeoTitle,
  sanitizeCanonical,
  sanitizeHtml,
  type CaseRecord,
  type CaseSectionRecord,
  type CaseFaqRecord,
} from "@/lib/content-sanitize";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface FixReport {
  table: string;
  id: string;
  identifier: string;
  fixes: string[];
}

export async function POST(request: NextRequest) {
  if (!SERVICE_KEY) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY not configured — required for batch writes" },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dryRun") === "1";
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const reports: FixReport[] = [];
  const errors: string[] = [];

  // ── 1. Cases ──
  const { data: cases, error: caseErr } = await supabase
    .from("cases")
    .select("id, slug, title, seo_title, seo_description, seo_canonical, hero_subheadline, hero_background_image");
  if (caseErr) errors.push(`cases fetch: ${caseErr.message}`);

  for (const row of cases ?? []) {
    const res = sanitizeCaseRecord(row as CaseRecord);
    if (res.fixed.length === 0) continue;

    reports.push({
      table: "cases",
      id: row.id,
      identifier: row.slug || row.title || row.id,
      fixes: res.fixed,
    });

    if (!dryRun) {
      const updates: Record<string, unknown> = {};
      if (res.value.slug !== row.slug) updates.slug = res.value.slug;
      if (res.value.seo_title !== row.seo_title) updates.seo_title = res.value.seo_title;
      if (res.value.seo_description !== row.seo_description) updates.seo_description = res.value.seo_description;
      if (res.value.seo_canonical !== row.seo_canonical) updates.seo_canonical = res.value.seo_canonical;
      if (res.value.hero_background_image !== row.hero_background_image) {
        updates.hero_background_image = res.value.hero_background_image;
      }
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.from("cases").update(updates).eq("id", row.id);
        if (error) errors.push(`cases.update ${row.id}: ${error.message}`);
      }
    }
  }

  // ── 2. Case sections ──
  const { data: sections, error: secErr } = await supabase
    .from("case_sections")
    .select("id, case_id, section_type, content");
  if (secErr) errors.push(`case_sections fetch: ${secErr.message}`);

  for (const row of sections ?? []) {
    const res = sanitizeCaseSection(row as CaseSectionRecord);
    if (res.fixed.length === 0) continue;

    reports.push({
      table: "case_sections",
      id: row.id,
      identifier: `${row.section_type} (case ${row.case_id})`,
      fixes: res.fixed,
    });

    if (!dryRun) {
      const { error } = await supabase
        .from("case_sections")
        .update({ content: res.value.content })
        .eq("id", row.id);
      if (error) errors.push(`case_sections.update ${row.id}: ${error.message}`);
    }
  }

  // ── 3. FAQs ──
  const { data: faqs, error: faqErr } = await supabase
    .from("case_faqs")
    .select("id, case_id, question, answer");
  if (faqErr) errors.push(`case_faqs fetch: ${faqErr.message}`);

  for (const row of faqs ?? []) {
    const res = sanitizeFaq(row as CaseFaqRecord);
    if (res.fixed.length === 0) continue;

    reports.push({
      table: "case_faqs",
      id: row.id,
      identifier: row.question || row.id,
      fixes: res.fixed,
    });

    if (!dryRun) {
      const updates: Record<string, unknown> = {};
      if (res.value.question !== row.question) updates.question = res.value.question;
      if (res.value.answer !== row.answer) updates.answer = res.value.answer;
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.from("case_faqs").update(updates).eq("id", row.id);
        if (error) errors.push(`case_faqs.update ${row.id}: ${error.message}`);
      }
    }
  }

  // ── 4. Blog posts (resources) ──
  const { data: posts, error: postErr } = await supabase
    .from("blog_posts")
    .select("id, slug, title, seo_title, seo_description, seo_canonical, content, excerpt");
  if (postErr) errors.push(`blog_posts fetch: ${postErr.message}`);

  for (const row of posts ?? []) {
    const fixes: string[] = [];
    const updates: Record<string, unknown> = {};

    // SEO title
    const t = sanitizeSeoTitle(row.seo_title, row.title);
    if (t.value !== row.seo_title && t.fixed.length > 0) {
      updates.seo_title = t.value;
      fixes.push(...t.fixed);
    }

    // Meta description
    const d = sanitizeMetaDescription(row.seo_description);
    if (d.value !== row.seo_description && d.fixed.length > 0) {
      updates.seo_description = d.value;
      fixes.push(...d.fixed);
    }

    // Canonical
    const c = sanitizeCanonical(row.seo_canonical, `resources/${row.slug}`);
    if (c.value !== row.seo_canonical && c.fixed.length > 0) {
      updates.seo_canonical = c.value;
      fixes.push(...c.fixed);
    }

    // Body HTML
    const body = sanitizeHtml(row.content);
    if (body.value !== row.content && body.fixed.length > 0) {
      updates.content = body.value;
      fixes.push(...body.fixed.map((f) => `content: ${f}`));
    }

    if (fixes.length === 0) continue;

    reports.push({
      table: "blog_posts",
      id: row.id,
      identifier: row.slug || row.title || row.id,
      fixes,
    });

    if (!dryRun) {
      const { error } = await supabase.from("blog_posts").update(updates).eq("id", row.id);
      if (error) errors.push(`blog_posts.update ${row.id}: ${error.message}`);
    }
  }

  return NextResponse.json({
    success: errors.length === 0,
    dryRun,
    summary: {
      total_records_checked:
        (cases?.length ?? 0) + (sections?.length ?? 0) + (faqs?.length ?? 0) + (posts?.length ?? 0),
      records_fixed: reports.length,
      total_fixes_applied: reports.reduce((sum, r) => sum + r.fixes.length, 0),
      by_table: {
        cases: reports.filter((r) => r.table === "cases").length,
        case_sections: reports.filter((r) => r.table === "case_sections").length,
        case_faqs: reports.filter((r) => r.table === "case_faqs").length,
        blog_posts: reports.filter((r) => r.table === "blog_posts").length,
      },
    },
    reports,
    errors,
  });
}

export async function GET() {
  return NextResponse.json({
    description: "Batch sanitizer for CMS content. POST to run.",
    usage: {
      preview_only: "POST /api/admin/sanitize?dryRun=1",
      apply_fixes: "POST /api/admin/sanitize",
    },
    what_it_fixes: [
      "Slugs with spaces, uppercase, or invalid characters",
      "Meta descriptions over 155 characters (truncated at word boundary)",
      "SEO titles missing the 'Help Law Group' brand suffix (when room allows)",
      "Missing or malformed canonical URLs",
      "Inline <h1>/<h2> tags inside body content (downgraded to <h3>)",
      "Image tags missing loading/decoding/alt attributes",
      "FAQ questions missing trailing '?'",
      "Empty <p></p> blocks and runaway <br> sequences",
      "Image URLs on owned hosts pointed at .png/.jpg when .webp is preferred",
    ],
  });
}
