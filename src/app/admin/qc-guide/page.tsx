import type { Metadata } from "next";
import { PrintButton } from "./PrintButton";

// Internal reference page. Not in sitemap, noindex'd, no link from public nav.
// Designed in an editorial single-column style — chapter-numbered sections,
// generous whitespace, serif display, clean sans body. Print-friendly so it
// can be saved as PDF directly from the browser.

export const metadata: Metadata = {
  title: "Content QC Guide | Help Law Group (Internal)",
  description: "Internal reference: how content quality control works across helplaw.com — the four QC layers, what auto-fixes, and what needs human review.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://helplaw.com/admin/qc-guide" },
};

const lastUpdated = "April 27, 2026";

export default function QcGuidePage() {
  return (
    <main className="bg-cream-50 text-navy-950 min-h-screen">
      {/* Load Playfair Display for the editorial serif look. Scoped to this
          page so it doesn't add weight to the rest of the site. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap"
      />
      <style>{`
        @media print {
          .no-print { display: none !important; }
          main { background: white !important; }
        }
        .display-serif {
          font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
          font-feature-settings: "lnum" on, "kern" on;
        }
        .chapter-num {
          font-feature-settings: "smcp" on, "c2sc" on;
          letter-spacing: 0.18em;
        }
        :root {
          --cream: #FAF7F2;
        }
        .bg-cream-50 { background-color: #FAF7F2; }
        .bg-cream-100 { background-color: #F2EDE3; }
        .border-cream-200 { border-color: #E5DDCD; }
      `}</style>

      {/* Print this page button (hidden when printing) */}
      <div className="no-print fixed top-6 right-6 z-50">
        <PrintButton />
      </div>

      <article className="mx-auto max-w-[680px] px-6 sm:px-8 py-20 sm:py-28">

        {/* ─── Masthead ─── */}
        <header className="mb-20 sm:mb-24">
          <p className="chapter-num text-xs font-semibold text-gold-600 uppercase mb-6">
            Internal Reference · Help Law Group
          </p>
          <h1 className="display-serif text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight text-navy-950 mb-6">
            How content quality control works on helplaw.com.
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-light">
            A single page describing how every word, image, and metadata field on the site gets quality-checked, what is auto-fixed silently, and what needs human eyes.
          </p>
          <div className="mt-10 flex items-center gap-4 text-xs text-slate-500 chapter-num uppercase tracking-wider">
            <span>Last Updated · {lastUpdated}</span>
            <span aria-hidden="true">·</span>
            <span>Maintained by Sarah Servold</span>
          </div>
        </header>

        <Divider />

        {/* ─── Chapter 01: The four layers ─── */}
        <Chapter num="01" title="The four QC layers">
          <p>
            Every change to the site flows through one of four layers. The layer is determined by where the edit was made — you don&rsquo;t pick it, it picks you.
          </p>

          <table className="my-10 w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-navy-900/15">
                <th className="py-3 pr-6 font-semibold text-navy-900 chapter-num uppercase tracking-wider text-xs">
                  Edit path
                </th>
                <th className="py-3 pr-6 font-semibold text-navy-900 chapter-num uppercase tracking-wider text-xs">
                  QC layer
                </th>
                <th className="py-3 font-semibold text-navy-900 chapter-num uppercase tracking-wider text-xs">
                  When it runs
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              <Row a="/admin/create-case" b="Parser-time sanitizer + QC checks" c="At upload, before insert" />
              <Row a="Lovable CMS UI" b="Render-time sanitizer" c="On every page view" />
              <Row a="Direct Supabase or SQL" b="Render-time + batch cleanup" c="On view + on demand" />
              <Row a="Code edits (homepage, /about, etc.)" b="Build-time audit" c="Before every Vercel deploy" />
              <Row a="Image upload to /public/" b="Build-time audit (--fix)" c="Before every Vercel deploy" />
            </tbody>
          </table>

          <p>
            The four layers exist because content can enter the site through paths that bypass each other. The render-time sanitizer cleans data Lovable writes; the build-time audit cleans code Lovable doesn&rsquo;t touch; the parser handles new uploads; the batch endpoint mops up anything already in the database. Together they cover every path.
          </p>
        </Chapter>

        <Divider />

        {/* ─── Chapter 02: What gets fixed silently ─── */}
        <Chapter num="02" title="What gets fixed automatically">
          <p>
            These corrections happen at every layer, idempotently. You will see them logged in the QC panel as <em>auto-fix</em> entries, but they require no action.
          </p>

          <ul className="my-8 space-y-3 list-none pl-0">
            {[
              ["Slugs", "lowercased, spaces stripped, special chars hyphenated, double-hyphens collapsed, capped at 75 characters"],
              ["Meta descriptions", "over 155 characters truncated at the nearest word boundary, ellipsis appended"],
              ["SEO titles", "missing the brand suffix get “ | Help Law Group” appended when there is room"],
              ["Canonical URLs", "missing ones derived from slug, http:// forced to https://, trailing slashes stripped, relative paths made absolute"],
              ["Heading hierarchy", "inline <h1> and <h2> downgraded to <h3>; the page title is the only h1, section headlines are the only h2s"],
              ["<img> tags", "missing loading, decoding, or alt attributes get sensible defaults added"],
              ["Empty <p></p> blocks", "removed"],
              ["Three or more <br> tags in a row", "collapsed to two"],
              ["FAQ questions", "missing trailing question marks appended"],
              ["Image URLs", "on owned hosts, .png/.jpg rewritten to .webp when a .webp variant exists"],
              ["Static page images", "over 100 KB compressed to WebP via pnpm audit:pages:fix"],
            ].map(([label, body]) => (
              <li key={label} className="flex gap-4">
                <span className="display-serif text-gold-600 text-base mt-0.5">·</span>
                <div>
                  <span className="font-semibold text-navy-900">{label}.</span>{" "}
                  <span className="text-slate-700">{body}</span>
                </div>
              </li>
            ))}
          </ul>
        </Chapter>

        <Divider />

        {/* ─── Chapter 03: What needs human review ─── */}
        <Chapter num="03" title="What needs your review">
          <p>
            These show up as <strong className="text-red-700">errors</strong> or <strong className="text-amber-700">warnings</strong> in the QC panel at <code className="text-sm bg-cream-100 px-1.5 py-0.5 rounded">/admin/create-case</code>. They are flagged but not auto-corrected, because fixing them risks butchering editorial intent.
          </p>

          <ul className="my-8 space-y-3 list-none pl-0">
            {[
              "Title content quality, missing required keywords, missing brand context",
              "Subheadline content and tone",
              "Body copy quality and adherence to voice rules",
              "Whether the right category was chosen",
              "Whether all required sections exist (Who Is Responsible? · How HLG Supports Survivors · Why Now · etc.)",
              "Word count outside the 2,100–2,800 target range",
              "Duplicate section headlines",
              "Source images still over 200 KB after compression",
              "Section content with very few words",
              "Brief or instructional text that leaked into rendered content",
            ].map((item) => (
              <li key={item} className="flex gap-4">
                <span className="display-serif text-gold-600 text-base mt-0.5">·</span>
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>

          <p>
            Errors do not block creation — the case is still saved as a draft — but they should be corrected in the Google Doc before status is set to Active.
          </p>
        </Chapter>

        <Divider />

        {/* ─── Chapter 04: Where to view flags ─── */}
        <Chapter num="04" title="Where to view what needs attention">

          <SubHead>For new uploads through /admin/create-case</SubHead>
          <p>
            After paste-and-click, scroll the result panel. You will see two sections:
          </p>
          <ul className="my-6 space-y-2 list-none pl-0">
            <li className="flex items-start gap-3">
              <Dot color="bg-red-500" />
              <span><strong className="text-navy-900">QC Errors</strong> — red. Fix in the Google Doc and re-upload.</span>
            </li>
            <li className="flex items-start gap-3">
              <Dot color="bg-amber-400" />
              <span><strong className="text-navy-900">QC Warnings</strong> — amber. Review and decide whether to fix.</span>
            </li>
          </ul>
          <p>
            Auto-fixes also appear here, prefixed <em>auto-fix:</em>, so you can see what was silently corrected.
          </p>

          <SubHead>For existing CMS content (after Lovable or direct edits)</SubHead>
          <p>
            Visit <code className="text-sm bg-cream-100 px-1.5 py-0.5 rounded">/admin/create-case</code> and scroll to the <strong>Batch CMS Sanitizer</strong> panel. Click <strong>Preview (Dry Run)</strong> to see the fix log without writing. The log is organized by table:
          </p>
          <ul className="my-6 space-y-2 list-none pl-0 text-slate-700">
            <li><span className="font-mono text-xs text-navy-700">cases</span> — slugs, SEO titles, descriptions, canonicals, hero images</li>
            <li><span className="font-mono text-xs text-navy-700">case_sections</span> — body HTML hygiene, image attributes</li>
            <li><span className="font-mono text-xs text-navy-700">case_faqs</span> — questions and answers</li>
            <li><span className="font-mono text-xs text-navy-700">blog_posts</span> — same checks plus body content sanitization</li>
          </ul>
          <p>
            After review, click <strong>Apply Fixes</strong> to write the corrections back to Supabase.
          </p>

          <SubHead>For code-edited pages (homepage, /about, /faq, etc.)</SubHead>
          <p>
            Run <code className="text-sm bg-cream-100 px-1.5 py-0.5 rounded">pnpm audit:pages</code> from the repo. Errors fail the build automatically when Vercel deploys, so anything in production has already passed. To see warnings without running a full build, run the audit directly.
          </p>
        </Chapter>

        <Divider />

        {/* ─── Chapter 05: When the build fails ─── */}
        <Chapter num="05" title="When the build fails">
          <p>
            If a Vercel deploy fails with a <em>[prebuild] Static-page audit found errors</em> message:
          </p>
          <ol className="my-8 space-y-3 list-decimal pl-6 text-slate-700 marker:text-gold-600 marker:font-semibold">
            <li>The audit found a hard error — most likely a raw <code className="text-sm bg-cream-100 px-1.5 py-0.5 rounded">&lt;img&gt;</code> tag, an <code className="text-sm bg-cream-100 px-1.5 py-0.5 rounded">&lt;Image&gt;</code> missing alt text, or a missing metadata export.</li>
            <li>Run <code className="text-sm bg-cream-100 px-1.5 py-0.5 rounded">pnpm audit:pages</code> locally to see the exact file and line.</li>
            <li>Fix the issue in the source file.</li>
            <li>Push again.</li>
          </ol>
          <p>
            Warnings (titles too short, missing canonicals) do not fail the build. They print but the deploy proceeds. Address them at your own pace.
          </p>
        </Chapter>

        <Divider />

        {/* ─── Chapter 06: When to run the batch sanitizer ─── */}
        <Chapter num="06" title="When to run the batch sanitizer">
          <p>Run <strong>Apply Fixes</strong> on the Batch CMS Sanitizer:</p>
          <ul className="my-6 space-y-2 list-none pl-0 text-slate-700">
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> Right after Ashley does a heavy editing session in Lovable</li>
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> After any direct SQL fix on the database</li>
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> Once a month as a hygiene pass, even if nothing visible has changed</li>
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> Before any stakeholder demo or audit</li>
          </ul>
          <p>
            It is idempotent — running it twice in a row does nothing the second time. Safe to run at any cadence.
          </p>
        </Chapter>

        <Divider />

        {/* ─── Chapter 07: What's already deployed ─── */}
        <Chapter num="07" title="What is already in production">

          <SubHead>Auto-fixed on the April 2026 deploy</SubHead>
          <ul className="my-6 space-y-2 list-none pl-0 text-slate-700">
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> 11 static pages: titles, descriptions, canonicals corrected</li>
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> 5 oversize JPG case-card images compressed to WebP (~330 KB saved)</li>
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> 3 oversize PNG homepage backgrounds compressed to WebP (~2.9 MB saved)</li>
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> Site-wide security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP, HSTS, Permissions-Policy)</li>
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> AVIF and WebP enabled in Next/Image configuration</li>
          </ul>

          <SubHead>Will auto-fix on next interaction</SubHead>
          <ul className="my-6 space-y-2 list-none pl-0 text-slate-700">
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> Any case page edited in Lovable — render-time sanitizer cleans the rendered HTML</li>
            <li className="flex gap-3"><span className="text-gold-600 display-serif">·</span> Any case uploaded via Google Doc — parser-time sanitizer cleans before insert</li>
          </ul>

          <SubHead>Still requires running batch cleanup once</SubHead>
          <p>
            Existing Supabase records that pre-date this work — open <code className="text-sm bg-cream-100 px-1.5 py-0.5 rounded">/admin/create-case</code> and click <strong>Apply Fixes</strong> to bring them up to standard.
          </p>
        </Chapter>

        <Divider />

        {/* ─── Chapter 08: File map ─── */}
        <Chapter num="08" title="Where to find the code">
          <table className="my-8 w-full text-sm">
            <tbody className="divide-y divide-cream-200">
              <FileRow what="Sanitizer source" where="src/lib/content-sanitize.ts" />
              <FileRow what="Batch endpoint" where="POST /api/admin/sanitize" />
              <FileRow what="Batch UI" where="/admin/create-case (scroll to Batch CMS Sanitizer)" />
              <FileRow what="Static page audit" where="scripts/audit-static-pages.js · pnpm audit:pages" />
              <FileRow what="Image compressor" where="scripts/audit-static-pages.js --fix · pnpm audit:pages:fix" />
              <FileRow what="Parser QC checks" where="runQcChecks() in src/app/api/create-case/route.ts" />
              <FileRow what="Security headers" where="next.config.ts" />
              <FileRow what="This guide" where="src/app/admin/qc-guide/page.tsx" />
            </tbody>
          </table>
        </Chapter>

        {/* ─── Closing ─── */}
        <div className="mt-24 sm:mt-32 mb-16 pt-16 border-t border-cream-200">
          <p className="display-serif text-2xl sm:text-3xl text-navy-900 leading-snug font-medium italic">
            &ldquo;If you can edit it from a UI, the sanitizer will catch it on render. If you have to write code to change it, the build-time audit will catch it before deploy. The only way to ship a problem is to bypass both — and the batch cleanup endpoint exists to mop up anything that slips through.&rdquo;
          </p>
          <p className="mt-8 text-xs chapter-num uppercase tracking-wider text-slate-500">
            End of guide
          </p>
        </div>
      </article>
    </main>
  );
}

// ─── Small reusable bits ─────────────────────────────────────────

function Chapter({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-20 sm:mb-24">
      <p className="chapter-num text-xs font-semibold text-gold-600 uppercase mb-3">
        Chapter {num}
      </p>
      <h2 className="display-serif text-3xl sm:text-4xl font-semibold leading-[1.15] tracking-tight text-navy-950 mb-8">
        {title}
      </h2>
      <div className="space-y-6 text-base sm:text-lg leading-[1.7] text-slate-700 [&_p]:text-slate-700 [&_strong]:text-navy-900 [&_strong]:font-semibold">
        {children}
      </div>
    </section>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="chapter-num text-xs font-semibold text-navy-900 uppercase tracking-wider mt-12 mb-4">
      {children}
    </h3>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center my-8 sm:my-12" aria-hidden="true">
      <div className="h-px w-12 bg-gold-500/40" />
    </div>
  );
}

function Row({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <tr className="align-top">
      <td className="py-4 pr-6 font-mono text-xs text-navy-800">{a}</td>
      <td className="py-4 pr-6 text-slate-700">{b}</td>
      <td className="py-4 text-slate-500 italic">{c}</td>
    </tr>
  );
}

function FileRow({ what, where }: { what: string; where: string }) {
  return (
    <tr className="align-top">
      <td className="py-3 pr-6 text-slate-700 w-1/3">{what}</td>
      <td className="py-3 font-mono text-xs text-navy-800">{where}</td>
    </tr>
  );
}

function Dot({ color }: { color: string }) {
  return <span className={`inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0 ${color}`} />;
}
