"use client";

import { useState } from "react";

export default function CreateCasePage() {
  const [docUrl, setDocUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/create-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
        setDocUrl("");
      }
    } catch {
      setError("Failed to connect to the API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">
          Create Case Page
        </h1>
        <p className="text-slate-500 mb-8">
          Paste a Google Doc URL to auto-create a case page in the CMS. The page
          will be created as a <strong>draft</strong> for review before
          publishing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="docUrl"
              className="block text-sm font-medium text-navy-800 mb-1"
            >
              Google Doc URL
            </label>
            <input
              id="docUrl"
              type="url"
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              placeholder="https://docs.google.com/document/d/..."
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-navy-900"
            />
            <p className="text-xs text-slate-400 mt-1">
              The doc must be shared as &quot;Anyone with the link can view&quot;
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !docUrl}
            className="w-full bg-navy-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Creating case page...
              </span>
            ) : (
              "Create Case Page"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg space-y-3">
            <p className="text-green-800 font-semibold text-lg">
              Case page created!
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-slate-500">Title</div>
              <div className="text-navy-900 font-medium">{result.title}</div>

              <div className="text-slate-500">Slug</div>
              <div className="text-navy-900 font-mono text-xs">
                {result.slug}
              </div>

              <div className="text-slate-500">Category</div>
              <div className="text-navy-900 font-medium">{result.category}</div>

              <div className="text-slate-500">Sections</div>
              <div className="text-navy-900">{result.sectionCount}</div>

              <div className="text-slate-500">FAQs</div>
              <div className="text-navy-900">{result.faqCount}</div>

              <div className="text-slate-500">Form fields</div>
              <div className="text-navy-900">{result.formFieldCount}</div>

              <div className="text-slate-500">Status</div>
              <div className="text-amber-600 font-medium">Draft</div>
            </div>

            {/* Image Optimization */}
            {result.imageOptimization && (
              <div className={`mt-3 p-4 rounded-lg border ${result.imageOptimization.optimized ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
                <p className={`font-semibold text-sm mb-2 ${result.imageOptimization.optimized ? "text-blue-800" : "text-slate-600"}`}>
                  Hero Image
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {result.imageOptimization.optimized ? (
                    <>
                      <div className="text-slate-500">Original</div>
                      <div className="text-navy-900">
                        {result.imageOptimization.originalSize}
                        {result.imageOptimization.originalDimensions && (
                          <span className="text-slate-400 ml-1">
                            ({result.imageOptimization.originalDimensions.width}×{result.imageOptimization.originalDimensions.height})
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500">Optimized</div>
                      <div className="text-green-700 font-medium">
                        {result.imageOptimization.finalSize}
                        {result.imageOptimization.finalDimensions && (
                          <span className="text-slate-400 ml-1">
                            ({result.imageOptimization.finalDimensions.width}×{result.imageOptimization.finalDimensions.height})
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500">Saved</div>
                      <div className="text-green-700 font-medium">
                        {result.imageOptimization.savedBytes} ({result.imageOptimization.reduction})
                      </div>
                      <div className="text-slate-500">Format</div>
                      <div className="text-navy-900">WebP</div>
                    </>
                  ) : (
                    <>
                      <div className="text-slate-500">Size</div>
                      <div className="text-navy-900">{result.imageOptimization.originalSize}</div>
                      <div className="text-slate-500">Status</div>
                      <div className="text-slate-500 italic">No optimization needed</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* QC Warnings */}
            {result.qcWarnings && result.qcWarnings.length > 0 && (
              <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 font-semibold text-sm mb-2">
                  QC Warnings ({result.qcWarnings.length})
                </p>
                <ul className="text-xs text-amber-700 space-y-1">
                  {result.qcWarnings.map(
                    (w: { field: string; severity: string; message: string }, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${w.severity === "error" ? "bg-red-500" : "bg-amber-400"}`} />
                        <span>
                          <strong className="font-medium">{w.field}:</strong> {w.message}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {result.qcWarnings && result.qcWarnings.length === 0 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">All QC checks passed</p>
              </div>
            )}

            <div className="pt-3 border-t border-green-200 space-y-2">
              <p className="text-sm text-slate-600">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-slate-600 list-decimal list-inside space-y-1">
                <li>Preview the page using the link below</li>
                <li>Review any QC warnings above and fix in the Google Doc if needed</li>
                <li>Verify category, sections, and FAQs look correct</li>
                <li>Set status to &quot;Active&quot; in Supabase to publish</li>
              </ol>
            </div>

            <a
              href={result.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-navy-900 text-white text-sm font-semibold rounded-lg hover:bg-navy-800 transition-colors"
            >
              Preview Case Page
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        )}

        <div className="mt-8">
          <a
            href="/case-page-template.docx"
            download
            className="inline-flex items-center gap-2 rounded-lg border-2 border-navy-200 bg-white px-5 py-3 text-sm font-semibold text-navy-800 hover:border-navy-400 hover:bg-navy-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Case Page Template (.docx)
          </a>
        </div>

        <div className="mt-8 p-6 bg-white border border-slate-200 rounded-lg">
          <h2 className="text-lg font-semibold text-navy-900 mb-3">
            Google Doc Format Guide
          </h2>
          <div className="text-sm text-slate-600 space-y-4">
            <div>
              <p className="font-medium text-navy-800">
                Metadata fields (top of doc):
              </p>
              <pre className="mt-1 p-3 bg-slate-50 rounded text-xs font-mono whitespace-pre-wrap">
{`**Title:** San Diego County Juvenile Detention Abuse Lawsuit
**Background Image:** https://...
**Eyebrow:** County Name | Civil Lawsuits Active
**Subheadline:** Your one-sentence summary here.

**SEO Title (Meta Title):** Page Title | Help Law Group (60 chars)
**Meta Description:** 150-character description for search results.
**Focus Keyword:** primary keyword phrase
**Secondary Keywords:** keyword1, keyword2, keyword3`}
              </pre>
            </div>

            <div>
              <p className="font-medium text-navy-800">Content sections:</p>
              <ul className="list-disc list-inside mt-1 space-y-1 text-slate-500">
                <li>
                  Separate sections with horizontal rules (───)
                </li>
                <li>
                  Bold heading on first line: <code>**Section Title**</code>
                </li>
                <li>
                  Add variant hint: <code>**Section Title** (Dark)</code>
                </li>
                <li>
                  Sub-headings within a section: <code>**Sub Heading**</code>
                </li>
                <li>Bullet lists with * or - prefixes</li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-navy-800">Special sections:</p>
              <pre className="mt-1 p-3 bg-slate-50 rounded text-xs font-mono whitespace-pre-wrap">
{`**(MID-PAGE CTA)**
**Headline here**
Description paragraph.
[Button Text]

───

**Frequently Asked Questions**
**Question one?**
Answer text here.

**Question two?**
Answer text here.

───

**(CLOSING CTA)**
**Headline here**
Description paragraph.
[Button Text]`}
              </pre>
            </div>

            <div>
              <p className="font-medium text-navy-800">
                Custom lead form (optional):
              </p>
              <pre className="mt-1 p-3 bg-slate-50 rounded text-xs font-mono whitespace-pre-wrap">
{`LEAD FORM:
- Full Name (text, required)
- Email (email, required)
- Phone (phone, required)
- State (select, required)
- Which facility? (select: Spofford, Horizon, Crossroads)
- Anything else? (textarea)`}
              </pre>
            </div>

            <div>
              <p className="font-medium text-navy-800">
                Auto-detected categories:
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Category is auto-detected from the title, or you can add{" "}
                <code>**Category:** Juvenile Detention Abuse</code> to the
                metadata fields.
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {[
                  "Juvenile Detention Abuse",
                  "Clergy and Religious Institution Abuse",
                  "Medical Abuse",
                  "Foster Care Abuse",
                  "Rideshare Assault",
                  "Social Media Addiction",
                  "Online Platform Harm",
                  "Sexual Abuse and Institutional Harm",
                  "Unsafe Products",
                ].map((cat) => (
                  <span
                    key={cat}
                    className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
