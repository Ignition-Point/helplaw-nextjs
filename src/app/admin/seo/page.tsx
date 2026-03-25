import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

// ─── Types ───

interface SeoCheck {
  label: string;
  passed: boolean;
  detail: string;
  weight: number;
}

interface PageAudit {
  name: string;
  href: string;
  type: "case" | "blog";
  score: number;
  checks: SeoCheck[];
}

// ─── Helpers ───

function countWords(text: string): number {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function extractTextFromJsonb(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const obj = content as Record<string, unknown>;
  const textFields = ["content", "headline", "subheadline", "eyebrow", "items", "conditions", "quote"];
  return textFields
    .map((f) => (typeof obj[f] === "string" ? (obj[f] as string) : ""))
    .join(" ");
}

function hasInternalLinks(text: string): boolean {
  return /href=["'][^"']*\/(cases|resources)\//.test(text);
}

// ─── Audit logic ───

function auditCase(
  caseData: Record<string, unknown>,
  sections: Array<{ content: unknown }>,
  faqCount: number
): PageAudit {
  const checks: SeoCheck[] = [];
  const title = (caseData.seo_title as string) || "";
  const desc = (caseData.seo_description as string) || "";
  const ogImage = (caseData.seo_image as string) || "";
  const canonical = (caseData.seo_canonical as string) || "";
  const heroHeadline = (caseData.hero_headline as string) || "";

  // Title check (weight 15)
  if (!title) {
    checks.push({ label: "Title", passed: false, detail: "Missing seo_title", weight: 15 });
  } else if (title.length > 60) {
    checks.push({ label: "Title", passed: false, detail: `Too long (${title.length} chars, max 60)`, weight: 15 });
  } else if (title.length < 30) {
    checks.push({ label: "Title", passed: false, detail: `Too short (${title.length} chars, min 30)`, weight: 15 });
  } else {
    checks.push({ label: "Title", passed: true, detail: `${title.length} chars`, weight: 15 });
  }

  // Meta description (weight 15)
  if (!desc) {
    checks.push({ label: "Meta Description", passed: false, detail: "Missing seo_description", weight: 15 });
  } else if (desc.length > 160) {
    checks.push({ label: "Meta Description", passed: false, detail: `Too long (${desc.length} chars, max 160)`, weight: 15 });
  } else if (desc.length < 70) {
    checks.push({ label: "Meta Description", passed: false, detail: `Too short (${desc.length} chars, min 70)`, weight: 15 });
  } else {
    checks.push({ label: "Meta Description", passed: true, detail: `${desc.length} chars`, weight: 15 });
  }

  // OG Image (weight 10)
  checks.push({
    label: "OG Image",
    passed: !!ogImage,
    detail: ogImage ? "Present" : "Missing seo_image",
    weight: 10,
  });

  // Content length (weight 20)
  const allText = sections.map((s) => extractTextFromJsonb(s.content)).join(" ");
  const wordCount = countWords(allText);
  checks.push({
    label: "Content Length",
    passed: wordCount >= 500,
    detail: `${wordCount} words${wordCount < 500 ? " (min 500)" : ""}`,
    weight: 20,
  });

  // Heading structure (weight 10)
  checks.push({
    label: "Heading (H1)",
    passed: !!heroHeadline,
    detail: heroHeadline ? "hero_headline present" : "Missing hero_headline",
    weight: 10,
  });

  // FAQ schema (weight 10)
  checks.push({
    label: "FAQ Schema",
    passed: faqCount > 0,
    detail: faqCount > 0 ? `${faqCount} FAQs` : "No FAQs found",
    weight: 10,
  });

  // Internal links (weight 10)
  checks.push({
    label: "Internal Links",
    passed: hasInternalLinks(allText),
    detail: hasInternalLinks(allText) ? "Found /cases/ or /resources/ links" : "No internal links to /cases/ or /resources/",
    weight: 10,
  });

  // Canonical URL (weight 10)
  checks.push({
    label: "Canonical URL",
    passed: !!canonical,
    detail: canonical ? "Set" : "Missing seo_canonical",
    weight: 10,
  });

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earnedWeight = checks.filter((c) => c.passed).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  return {
    name: (caseData.title as string) || "Untitled",
    href: `/cases/${caseData.slug}`,
    type: "case",
    score,
    checks,
  };
}

function auditBlogPost(post: Record<string, unknown>): PageAudit {
  const checks: SeoCheck[] = [];
  const title = (post.seo_title as string) || "";
  const desc = (post.seo_description as string) || "";
  const ogImage = (post.seo_image as string) || (post.featured_image as string) || "";
  const canonical = (post.seo_canonical as string) || "";
  const excerpt = (post.excerpt as string) || "";

  // Title (weight 20)
  if (!title) {
    checks.push({ label: "Title", passed: false, detail: "Missing seo_title", weight: 20 });
  } else if (title.length > 60) {
    checks.push({ label: "Title", passed: false, detail: `Too long (${title.length} chars, max 60)`, weight: 20 });
  } else if (title.length < 30) {
    checks.push({ label: "Title", passed: false, detail: `Too short (${title.length} chars, min 30)`, weight: 20 });
  } else {
    checks.push({ label: "Title", passed: true, detail: `${title.length} chars`, weight: 20 });
  }

  // Meta description (weight 20)
  const descToCheck = desc || excerpt;
  if (!descToCheck) {
    checks.push({ label: "Meta Description", passed: false, detail: "Missing seo_description and excerpt", weight: 20 });
  } else if (descToCheck.length > 160) {
    checks.push({ label: "Meta Description", passed: false, detail: `Too long (${descToCheck.length} chars, max 160)`, weight: 20 });
  } else if (descToCheck.length < 70) {
    checks.push({ label: "Meta Description", passed: false, detail: `Too short (${descToCheck.length} chars, min 70)`, weight: 20 });
  } else {
    checks.push({ label: "Meta Description", passed: true, detail: `${descToCheck.length} chars`, weight: 20 });
  }

  // OG Image (weight 20)
  checks.push({
    label: "OG Image",
    passed: !!ogImage,
    detail: ogImage ? "Present" : "Missing featured_image and seo_image",
    weight: 20,
  });

  // Canonical (weight 20)
  checks.push({
    label: "Canonical URL",
    passed: !!canonical,
    detail: canonical ? "Set" : "Missing seo_canonical",
    weight: 20,
  });

  // Content length (weight 20)
  const content = (post.content as string) || "";
  const wordCount = countWords(content);
  checks.push({
    label: "Content Length",
    passed: wordCount >= 500,
    detail: `${wordCount} words${wordCount < 500 ? " (min 500)" : ""}`,
    weight: 20,
  });

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earnedWeight = checks.filter((c) => c.passed).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  return {
    name: (post.title as string) || "Untitled",
    href: `/resources/${post.slug}`,
    type: "blog",
    score,
    checks,
  };
}

// ─── Page ───

export default async function SeoAuditPage() {
  const supabase = await createClient();

  // Fetch all data in parallel
  const [casesRes, blogRes, sectionsRes, faqCountsRes] = await Promise.all([
    supabase
      .from("cases")
      .select("id, title, slug, status, page_type, seo_title, seo_description, seo_canonical, seo_image, hero_headline, hero_subheadline, updated_at")
      .eq("status", "active"),
    supabase
      .from("blog_posts")
      .select("id, title, slug, status, excerpt, content, featured_image, seo_title, seo_description, seo_image, seo_canonical, seo_noindex, published_at, updated_at, category")
      .eq("status", "published"),
    supabase
      .from("case_sections")
      .select("id, case_id, section_type, content, visible, sort_order")
      .eq("visible", true),
    supabase
      .from("case_faqs")
      .select("id, case_id"),
  ]);

  const cases = (casesRes.data ?? []) as Record<string, unknown>[];
  const blogPosts = (blogRes.data ?? []) as Record<string, unknown>[];
  const allSections = (sectionsRes.data ?? []) as Array<{ case_id: string; content: unknown }>;
  const allFaqs = (faqCountsRes.data ?? []) as Array<{ case_id: string }>;

  // Group sections and faq counts by case_id
  const sectionsByCase = new Map<string, Array<{ content: unknown }>>();
  for (const s of allSections) {
    const arr = sectionsByCase.get(s.case_id) ?? [];
    arr.push({ content: s.content });
    sectionsByCase.set(s.case_id, arr);
  }

  const faqCountByCase = new Map<string, number>();
  for (const f of allFaqs) {
    faqCountByCase.set(f.case_id, (faqCountByCase.get(f.case_id) ?? 0) + 1);
  }

  // Build audits
  const audits: PageAudit[] = [];

  for (const c of cases) {
    const caseId = c.id as string;
    audits.push(auditCase(c, sectionsByCase.get(caseId) ?? [], faqCountByCase.get(caseId) ?? 0));
  }

  for (const p of blogPosts) {
    audits.push(auditBlogPost(p));
  }

  // Sort by score ascending (worst first)
  audits.sort((a, b) => a.score - b.score);

  const avgScore = audits.length > 0 ? Math.round(audits.reduce((s, a) => s + a.score, 0) / audits.length) : 0;
  const goodCount = audits.filter((a) => a.score >= 80).length;
  const warnCount = audits.filter((a) => a.score >= 50 && a.score < 80).length;
  const badCount = audits.filter((a) => a.score < 50).length;

  function scoreColor(score: number) {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 50) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  }

  function scoreDot(score: number) {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  }

  return (
    <div className="min-h-screen bg-slate-warm-50">
      {/* Header */}
      <header className="bg-navy-950 text-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">SEO Audit Dashboard</h1>
          <p className="mt-2 text-navy-300 text-sm">
            Auditing {audits.length} pages &middot; {cases.length} cases &middot; {blogPosts.length} blog posts
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-navy-100 p-5 text-center">
            <div className="text-3xl font-bold text-navy-900">{avgScore}</div>
            <div className="text-xs text-slate-warm-500 mt-1 uppercase tracking-wide">Avg Score</div>
          </div>
          <div className="bg-white rounded-lg border border-emerald-200 p-5 text-center">
            <div className="text-3xl font-bold text-emerald-700">{goodCount}</div>
            <div className="text-xs text-slate-warm-500 mt-1 uppercase tracking-wide">Good (80+)</div>
          </div>
          <div className="bg-white rounded-lg border border-amber-200 p-5 text-center">
            <div className="text-3xl font-bold text-amber-700">{warnCount}</div>
            <div className="text-xs text-slate-warm-500 mt-1 uppercase tracking-wide">Needs Work (50-79)</div>
          </div>
          <div className="bg-white rounded-lg border border-red-200 p-5 text-center">
            <div className="text-3xl font-bold text-red-700">{badCount}</div>
            <div className="text-xs text-slate-warm-500 mt-1 uppercase tracking-wide">Poor (&lt;50)</div>
          </div>
        </div>

        {/* Audit table */}
        <div className="bg-white rounded-lg border border-navy-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-100">
                <th className="text-left px-4 py-3 font-semibold text-navy-800">Page</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800 w-20">Type</th>
                <th className="text-center px-4 py-3 font-semibold text-navy-800 w-24">Score</th>
                <th className="text-left px-4 py-3 font-semibold text-navy-800">Checks</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((audit, i) => (
                <tr
                  key={`${audit.type}-${i}`}
                  className="border-b border-navy-50 hover:bg-navy-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <a
                      href={audit.href}
                      className="text-navy-700 font-medium hover:text-gold-600 transition-colors underline underline-offset-2"
                    >
                      {audit.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                        audit.type === "case"
                          ? "bg-navy-100 text-navy-700"
                          : "bg-gold-100 text-gold-700"
                      }`}
                    >
                      {audit.type === "case" ? "Case" : "Blog"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-12 h-8 rounded border text-sm font-bold ${scoreColor(audit.score)}`}
                    >
                      {audit.score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <details className="group">
                      <summary className="cursor-pointer text-xs text-slate-warm-500 hover:text-navy-700 transition-colors select-none">
                        <span className="inline-flex items-center gap-1.5">
                          {audit.checks.filter((c) => c.passed).length}/{audit.checks.length} passed
                          <span className="text-[10px] text-slate-warm-400 group-open:hidden">&darr; expand</span>
                          <span className="text-[10px] text-slate-warm-400 hidden group-open:inline">&uarr; collapse</span>
                        </span>
                      </summary>
                      <div className="mt-2 space-y-1">
                        {audit.checks.map((check, j) => (
                          <div
                            key={j}
                            className="flex items-start gap-2 text-xs"
                          >
                            <span
                              className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                                check.passed ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            />
                            <span className="text-slate-warm-700">
                              <span className="font-medium text-navy-800">{check.label}:</span>{" "}
                              {check.detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
              {audits.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-warm-400">
                    No active cases or published blog posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-xs text-slate-warm-500">
          <span className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${scoreDot(100)}`} /> 80+ Good
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${scoreDot(60)}`} /> 50-79 Needs Work
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${scoreDot(30)}`} /> &lt;50 Poor
          </span>
        </div>
      </div>
    </div>
  );
}
