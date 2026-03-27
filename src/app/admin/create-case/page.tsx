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

              <div className="text-slate-500">Sections</div>
              <div className="text-navy-900">{result.sectionCount}</div>

              <div className="text-slate-500">FAQs</div>
              <div className="text-navy-900">{result.faqCount}</div>

              <div className="text-slate-500">Form fields</div>
              <div className="text-navy-900">{result.formFieldCount}</div>

              <div className="text-slate-500">Status</div>
              <div className="text-amber-600 font-medium">Draft</div>
            </div>

            <div className="pt-3 border-t border-green-200 space-y-2">
              <p className="text-sm text-slate-600">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-slate-600 list-decimal list-inside space-y-1">
                <li>Review the page in Lovable CMS</li>
                <li>Edit sections, reorder blocks, or tweak copy as needed</li>
                <li>Set status to &quot;Active&quot; to publish</li>
              </ol>
            </div>

            <a
              href={result.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-gold-600 hover:text-gold-700 underline"
            >
              Preview on Vercel (after publishing)
            </a>
          </div>
        )}

        <div className="mt-12 p-6 bg-white border border-slate-200 rounded-lg">
          <h2 className="text-lg font-semibold text-navy-900 mb-3">
            Google Doc Format Guide
          </h2>
          <div className="text-sm text-slate-600 space-y-4">
            <div>
              <p className="font-medium text-navy-800">Basic structure:</p>
              <ul className="list-disc list-inside mt-1 space-y-1 text-slate-500">
                <li>First line = page title</li>
                <li>Content before first heading = hero subheadline + intro</li>
                <li>Each heading = new narrative section</li>
                <li>
                  &quot;Frequently Asked Questions&quot; heading = FAQ section
                  (Q&amp;A pairs)
                </li>
                <li>
                  &quot;Midpage CTA:&quot; = call-to-action block with [Button
                  Text]
                </li>
              </ul>
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
- Which facility? (select: Spofford, Horizon, Crossroads, Rikers)
- Anything else? (textarea)`}
              </pre>
            </div>

            <div>
              <p className="font-medium text-navy-800">
                SEO metadata (optional, at bottom):
              </p>
              <pre className="mt-1 p-3 bg-slate-50 rounded text-xs font-mono whitespace-pre-wrap">
{`Meta Title: Your Page Title | Help Law Group
Meta Description: A 150-character description for search results.`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
