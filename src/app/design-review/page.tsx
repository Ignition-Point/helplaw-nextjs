import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Review",
  robots: { index: false, follow: false },
};

const proposals = [
  {
    id: 1,
    title: "Multi-Step Lead Form (Replace Single-Step)",
    effort: "High",
    impact: "High (conversion)",
    current:
      "Single form with all fields visible at once (first name, last name, email, phone, description).",
    proposed: [
      "3-step wizard form with progress indicator:",
      "Step 1: Case type selection (icon cards — Mass Tort, Class Action, Data Breach, Other)",
      "Step 2: 1-2 qualifying questions based on selection",
      "Step 3: Contact info (name, phone, email)",
      "Confirmation screen with clear next-steps messaging",
    ],
    why: "Multi-step forms outperform single-step across the legal industry. Lower perceived commitment at each step increases completion rates. Morgan & Morgan, Sokolove, and TorHoerman all use this pattern.",
  },
  {
    id: 2,
    title: "Sticky Mobile CTA Bar",
    effort: "Low",
    impact: "High (mobile conversion)",
    current:
      "No persistent mobile CTA. Users must scroll back to find the form or phone number.",
    proposed: [
      "Fixed bottom bar (60px) on mobile, appears after scrolling past the first CTA:",
      "Left side: Phone icon (tap to call)",
      "Right side: Gold \"Free Case Review\" button",
      "Navy background with subtle top shadow",
    ],
    why: "Universal on premium legal sites. Mobile is 60-70% of traffic. TorHoerman, Morgan & Morgan, and Sokolove all use this.",
  },
  {
    id: 3,
    title: "\"As Featured In\" / Trust Logo Bar",
    effort: "Low",
    impact: "Medium (credibility)",
    current:
      "Scrolling trust bar with text-only badges (\"No Upfront Cost\", \"Free Consultation\", etc.).",
    proposed: [
      "Add a secondary row below the hero with grayscale media/credential logos",
      "News outlets, bar associations, or partner logos — whatever real credentials Help Law has",
      "Clean horizontal row, subtle gray background",
      "Only add when real logos are available — fake ones hurt more than help",
    ],
    why: "Every premium legal site layers trust signals. The scrolling text bar is good; a logo row adds a second layer of credibility.",
  },
  {
    id: 4,
    title: "Headline Typography: Serif vs. Sans-Serif",
    effort: "Low",
    impact: "Medium (brand identity)",
    current:
      "Playfair Display (serif) for all headings. Gives a traditional/elegant feel.",
    proposed: [
      "Option A — Keep Playfair Display: Differentiates Help Law from the sea of sans-serif legal sites. Serif = premium, established feel.",
      "Option B — Switch to sans-serif headings (Inter Bold/Black): Aligns with industry standard. Feels more modern and direct. Every top competitor uses geometric sans-serif headings.",
    ],
    why: "This is a brand identity decision. Serif = classic/premium. Sans-serif = modern/clean. Both are valid. The brief recommends sans-serif based on competitor analysis, but Playfair Display is already distinctive.",
  },
  {
    id: 5,
    title: "Inline CTAs on Case/Content Pages",
    effort: "Medium",
    impact: "High (conversion)",
    current:
      "Case pages have a hero form at top and final CTA band at bottom. No mid-page conversion opportunities.",
    proposed: [
      "Full-width CTA box inserted within content flow:",
      "Light blue-gray background",
      "Short headline: \"Affected by [Case Name]? Find out if you qualify.\"",
      "Single gold CTA button",
      "Appears every 2-3 scroll-lengths on long case pages",
    ],
    why: "Long case pages (3,000+ words) lose readers who never scroll to the bottom CTA. TorHoerman and Sokolove place inline CTAs throughout content pages.",
  },
  {
    id: 6,
    title: "\"Last Updated\" Dates on Case Pages",
    effort: "Low",
    impact: "Medium (SEO + trust)",
    current: "No visible update timestamps on case or blog pages.",
    proposed: [
      "Subtle \"Last Updated: [date]\" line below the H1 on case pages and blog posts",
      "Small text, muted color — doesn't compete with the headline",
    ],
    why: "Signals active attention to cases. Google rewards content freshness. Every top-ranking legal content page shows update dates.",
  },
  {
    id: 7,
    title: "Author Bylines on Content Pages",
    effort: "Low",
    impact: "Medium (E-E-A-T / SEO)",
    current: "No author attribution on blog posts or case pages.",
    proposed: [
      "\"Reviewed by [Attorney Name]\" badge on case pages",
      "\"By [Author]\" on blog posts",
      "Include small photo and credentials",
    ],
    why: "Real attorney attribution builds credibility and E-E-A-T (Google's Experience, Expertise, Authoritativeness, Trustworthiness signals). Distinguishes from anonymous \"content mill\" sites.",
  },
  {
    id: 8,
    title: "Breadcrumb Navigation",
    effort: "Low",
    impact: "Medium (SEO + UX)",
    current:
      "No breadcrumbs. Users rely on the main nav to orient themselves.",
    proposed: [
      "Breadcrumb trail below the header on all inner pages:",
      "Home > Cases > [Case Name]",
      "Home > Resources > [Post Title]",
      "Includes BreadcrumbList schema markup for SEO",
    ],
    why: "Improves navigation UX and gives Google additional structured data. Small visual footprint, significant SEO benefit. Every competitor implements this.",
  },
  {
    id: 9,
    title: "Table of Contents Sidebar on Long-Form Pages",
    effort: "Medium",
    impact: "Medium (UX + SEO)",
    current:
      "Blog posts have an auto-generated ToC at the top. Case pages have a TableOfContents block but it's not sticky.",
    proposed: [
      "Desktop: Sticky left sidebar ToC that scrolls with the reader",
      "Highlights the current section as user scrolls",
      "Mobile: Collapses to a dropdown at the top",
    ],
    why: "Improves readability on long pages. TorHoerman and most content-heavy legal sites use this pattern. Generates jump-link anchors that Google can surface in search results.",
  },
  {
    id: 10,
    title: "Case Results / Settlement Numbers Section",
    effort: "Medium",
    impact: "High (trust)",
    current: "No section displaying case results or recovery amounts.",
    proposed: [
      "\"Results\" section on homepage and/or dedicated page",
      "Large-format dollar figures in cards ($X.X Million)",
      "Case type and brief description below each number",
      "Clean grid layout, 3-4 cards per row",
      "Only add when real, verifiable numbers are available",
    ],
    why: "Specific dollar amounts recovered is the #1 most effective trust signal in the legal industry. Morgan & Morgan leads with \"$20 Billion+ Recovered.\"",
  },
  {
    id: 11,
    title: "White Space & Spacing Refinement",
    effort: "Low",
    impact: "Medium (perceived quality)",
    current:
      "Sections have consistent spacing. Content feels organized but could breathe more.",
    proposed: [
      "Increase section padding on desktop (more vertical breathing room)",
      "More generous margins between content blocks within sections",
      "Slightly larger line-height on body text",
    ],
    why: "The #1 visual difference between premium and basic sites is white space. TorHoerman's site feels spacious — nothing cramped. Generous spacing signals quality and confidence.",
  },
];

export default function DesignReviewPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Design Upgrade Proposals
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-2xl">
            Each proposal is independent. Review and approve or reject
            individually. No changes will be made to the site until approved.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-navy-950 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  <span className="text-gold-400 mr-2">#{p.id}</span>
                  {p.title}
                </h2>
                <div className="flex gap-2">
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/80">
                    Effort: {p.effort}
                  </span>
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-400/20 text-gold-300">
                    Impact: {p.impact}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Current vs Proposed */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Current
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {p.current}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gold-600 uppercase tracking-wider mb-2">
                      Proposed
                    </h3>
                    <ul className="space-y-1.5">
                      {p.proposed.map((item, i) => (
                        <li
                          key={i}
                          className="text-slate-700 text-sm leading-relaxed flex gap-2"
                        >
                          <span className="text-gold-500 mt-0.5 shrink-0">
                            &bull;
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Why */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Why
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {p.why}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Summary Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-navy-950 px-6 py-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Summary
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      #
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Proposal
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Effort
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Impact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3 text-slate-500 font-medium">
                        {p.id}
                      </td>
                      <td className="px-4 py-3 text-slate-800">{p.title}</td>
                      <td className="px-4 py-3 text-slate-600">{p.effort}</td>
                      <td className="px-4 py-3 text-slate-600">{p.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
