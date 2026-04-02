import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";

import { HeroWithForm } from "@/components/blocks/HeroWithForm";
import { TrustBanner } from "@/components/blocks/TrustBanner";
import { NarrativeSection } from "@/components/blocks/NarrativeSection";
import { NarrativeWithImage } from "@/components/blocks/NarrativeWithImage";
import { NarrativeSideImage } from "@/components/blocks/NarrativeSideImage";
import { ConditionGrid } from "@/components/blocks/ConditionGrid";
import { MidPageCTA } from "@/components/blocks/MidPageCTA";
import { QualificationChecklist } from "@/components/blocks/QualificationChecklist";
import { TableOfContents } from "@/components/blocks/TableOfContents";
import { WhatYouNeedToKnow } from "@/components/blocks/WhatYouNeedToKnow";
import { FAQSection } from "@/components/blocks/FAQSection";
import { FinalCTABand } from "@/components/blocks/FinalCTABand";
import { InlineCTA } from "@/components/blocks/InlineCTA";
import { LeadFormRenderer } from "@/components/LeadFormRenderer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StickyTableOfContents } from "@/components/StickyTableOfContents";
import { DesktopTocWrapper } from "@/components/DesktopTocWrapper";

// Never cache preview pages
export const revalidate = 0;

// Prevent search engines from indexing preview pages
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// ─── Data fetching (no status filter — shows draft + active) ───

async function getCaseBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("cases")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

async function getCaseSections(caseId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("case_sections")
    .select("*")
    .eq("case_id", caseId)
    .eq("visible", true)
    .order("sort_order");
  return data ?? [];
}

async function getCaseFaqs(caseId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("case_faqs")
    .select("*")
    .eq("case_id", caseId)
    .order("sort_order");
  return data ?? [];
}

// ─── Helpers ───

function getStr(content: Record<string, unknown>, key: string): string {
  return (content[key] as string) || "";
}

// ─── Page component ───

type PageParams = { params: Promise<{ slug: string }> };

export default async function CasePreviewPage({ params }: PageParams) {
  const { slug } = await params;
  const caseData = await getCaseBySlug(slug);
  if (!caseData) notFound();

  const [sections, faqs] = await Promise.all([
    getCaseSections(caseData.id),
    getCaseFaqs(caseData.id),
  ]);

  const phoneNumber = caseData.phone_number || "1-800-HELP-LAW";
  const displayNumber = caseData.display_number || "1-800-HELP-LAW";

  // Extract headings for sticky ToC
  const tocHeadings = sections
    .map((section) => {
      const content = (typeof section.content === "object" && section.content !== null && !Array.isArray(section.content)
        ? section.content
        : {}) as Record<string, unknown>;
      const anchorId = (content.anchorId as string) || "";
      const headline = (content.headline as string) || "";
      const skipTypes = ["hero-with-form", "trust-banner", "mid-page-cta", "final-cta-band", "table-of-contents", "inline-cta", "inline_cta", "lead-form"];
      if (skipTypes.includes(section.section_type) || !headline) return null;
      return {
        id: anchorId || headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        text: headline,
        level: 2,
      };
    })
    .filter(Boolean) as { id: string; text: string; level: number }[];

  return (
    <>
      {/* Preview banner */}
      <div className="bg-amber-500 text-navy-950 text-center py-2 px-4 text-sm font-semibold sticky top-0 z-50">
        PREVIEW MODE — This case is currently <span className="uppercase">{(caseData.status as string) || "draft"}</span> and not visible on the public site
      </div>

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cases", href: "/cases" },
          { label: caseData.title as string },
        ]}
      />

      <article>
        {/* Mobile ToC dropdown */}
        {tocHeadings.length >= 3 && (
          <div className="lg:hidden px-4 sm:px-6 py-4 bg-white border-b border-slate-100">
            <StickyTableOfContents headings={tocHeadings} />
          </div>
        )}

        {sections.map((section) => {
          const content = (typeof section.content === "object" && section.content !== null && !Array.isArray(section.content)
            ? section.content
            : {}) as Record<string, unknown>;

          const headline = getStr(content, "headline");
          const anchorId = getStr(content, "anchorId") || (headline ? headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : undefined);
          const variant = getStr(content, "variant");

          const wrapper = (el: React.ReactNode) => (
            <div key={section.id} id={anchorId} className="scroll-mt-20">
              {el}
            </div>
          );

          switch (section.section_type) {
            case "hero-with-form":
              return wrapper(
                <HeroWithForm
                  backgroundImage={getStr(content, "backgroundImage") || caseData.hero_background_image || ""}
                  eyebrow={getStr(content, "eyebrow") || caseData.hero_eyebrow || ""}
                  headline={getStr(content, "headline") || caseData.hero_headline || ""}
                  subheadline={getStr(content, "subheadline") || caseData.hero_subheadline || ""}
                  content={getStr(content, "content") || undefined}
                  leadFormId={getStr(content, "leadFormId") || undefined}
                  caseId={caseData.id}
                  caseSlug={slug}
                  phoneNumber={phoneNumber}
                  displayNumber={displayNumber}
                />
              );

            case "lead-form": {
              const lfId = getStr(content, "leadFormId");
              if (!lfId) return null;
              return wrapper(
                <section className="py-12 bg-white" key={section.id}>
                  <div className="mx-auto max-w-xl px-4">
                    {getStr(content, "headline") && (
                      <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 text-center mb-2">
                        {getStr(content, "headline")}
                      </h2>
                    )}
                    {getStr(content, "subheadline") && (
                      <p className="text-slate-warm-500 text-center mb-4">
                        {getStr(content, "subheadline")}
                      </p>
                    )}
                    {getStr(content, "content") && (
                      <div
                        className="prose-helplaw text-center mb-8"
                        dangerouslySetInnerHTML={{ __html: getStr(content, "content") }}
                      />
                    )}
                    <LeadFormRenderer leadFormId={lfId} caseId={caseData.id} caseSlug={slug} />
                  </div>
                </section>
              );
            }

            case "trust-banner": {
              const itemsStr = getStr(content, "items");
              const trustItems = itemsStr
                ? itemsStr.split("\n").filter(Boolean).map((text) => ({ icon: "shield", text }))
                : undefined;
              return wrapper(
                <TrustBanner
                  items={trustItems}
                  variant={(variant as "gold" | "dark" | "light") || "gold"}
                />
              );
            }

            case "narrative":
              return wrapper(
                <NarrativeSection
                  eyebrow={getStr(content, "eyebrow")}
                  headline={getStr(content, "headline")}
                  content={getStr(content, "content")}
                  quote={getStr(content, "quote") ? { text: getStr(content, "quote") } : undefined}
                  variant={(variant as "light" | "dark") || "light"}
                />
              );

            case "narrative-with-image":
              return wrapper(
                <NarrativeWithImage
                  eyebrow={getStr(content, "eyebrow")}
                  headline={getStr(content, "headline")}
                  content={getStr(content, "content")}
                  backgroundImage={getStr(content, "imageUrl") || getStr(content, "backgroundImage") || undefined}
                  variant={(variant as "light" | "dark") || "dark"}
                />
              );

            case "narrative-side-image":
              return wrapper(
                <NarrativeSideImage
                  eyebrow={getStr(content, "eyebrow")}
                  headline={getStr(content, "headline")}
                  content={getStr(content, "content")}
                  imageUrl={getStr(content, "imageUrl") || undefined}
                  imagePosition={(getStr(content, "imagePosition") as "left" | "right") || "right"}
                  variant={(variant as "light" | "dark") || "light"}
                />
              );

            case "condition-grid": {
              const condStr = getStr(content, "conditions") || getStr(content, "items");
              return wrapper(
                <ConditionGrid
                  headline={getStr(content, "headline")}
                  subheadline={getStr(content, "subheadline")}
                  conditions={condStr ? condStr.split("\n").filter(Boolean) : []}
                  variant={(variant as "light" | "dark") || "dark"}
                />
              );
            }

            case "mid-page-cta":
              return wrapper(
                <MidPageCTA
                  headline={getStr(content, "headline")}
                  subheadline={getStr(content, "subheadline")}
                  content={getStr(content, "content") || undefined}
                  ctaText={getStr(content, "ctaText") || "Start Your Free Case Review"}
                  ctaHref="#form"
                  phoneNumber={phoneNumber}
                  displayNumber={displayNumber}
                  variant={(variant as "gold" | "dark" | "light") || "gold"}
                />
              );

            case "qualification-checklist": {
              const itemsStr = getStr(content, "items");
              return wrapper(
                <QualificationChecklist
                  headline={getStr(content, "headline")}
                  items={itemsStr ? itemsStr.split("\n").filter(Boolean) : []}
                  ctaText={getStr(content, "ctaText") || "See If You Qualify"}
                  ctaHref="#form"
                  variant={(variant as "light" | "dark") || "light"}
                />
              );
            }

            case "table-of-contents": {
              const tocStr = getStr(content, "items");
              const tocItems = tocStr
                ? tocStr.split("\n").filter(Boolean).map((line) => {
                    const parts = line.split("|").map((s) => s.trim());
                    const label = parts[0] || line;
                    const anchor = parts[1] || label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                    return { label, anchor };
                  })
                : [];
              return wrapper(
                <TableOfContents
                  headline={getStr(content, "headline") || "Table of Contents"}
                  items={tocItems}
                  variant={(variant as "light" | "dark") || "light"}
                />
              );
            }

            case "what-you-need-to-know":
              return wrapper(
                <WhatYouNeedToKnow
                  headline={getStr(content, "headline") || "What You Need to Know"}
                  content={getStr(content, "content")}
                  variant={(variant as "light" | "dark") || "light"}
                />
              );

            case "faq-section":
              return faqs.length > 0
                ? wrapper(
                    <FAQSection
                      headline={getStr(content, "headline")}
                      items={faqs.map((f) => ({ question: f.question, answer: f.answer }))}
                      variant={(variant as "light" | "dark") || "light"}
                    />
                  )
                : null;

            case "inline_cta":
            case "inline-cta":
              return wrapper(
                <InlineCTA
                  content={{
                    headline: getStr(content, "headline"),
                    button_text: getStr(content, "button_text") || getStr(content, "ctaText"),
                    button_url: getStr(content, "button_url") || getStr(content, "ctaHref") || "#form",
                    phone_number: phoneNumber,
                  }}
                />
              );

            case "final-cta-band":
              return wrapper(
                <FinalCTABand
                  headline={getStr(content, "headline") || caseData.final_cta_headline || ""}
                  content={getStr(content, "content") || undefined}
                  ctaText={getStr(content, "ctaText") || caseData.final_cta_button || "Start Your Free Case Review"}
                  ctaHref="#form"
                  backgroundImage={getStr(content, "backgroundImage") || caseData.final_cta_background_image || ""}
                  variant={(variant as "dark" | "light") || "dark"}
                />
              );

            default:
              return null;
          }
        })}
      </article>

      {/* Desktop sticky ToC */}
      {tocHeadings.length >= 3 && (
        <DesktopTocWrapper headings={tocHeadings} />
      )}
    </>
  );
}
