import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

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

export const revalidate = 60;

// ─── Data fetching ───

async function getCaseBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cases")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  return data;
}

async function getCaseSections(caseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("case_sections")
    .select("*")
    .eq("case_id", caseId)
    .eq("visible", true)
    .order("sort_order");
  return data ?? [];
}

async function getCaseFaqs(caseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("case_faqs")
    .select("*")
    .eq("case_id", caseId)
    .order("sort_order");
  return data ?? [];
}

// ─── Dynamic metadata for SEO ───

type PageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const caseData = await getCaseBySlug(slug);
  if (!caseData) return { title: "Case Not Found" };

  const isContent = caseData.page_type === "content";

  // Smart description fallback: use hero_subheadline truncated to 155 chars
  let description = caseData.seo_description;
  if (!description) {
    const sub = (caseData.hero_subheadline as string) || "";
    if (sub) {
      const suffix = " Learn more about your legal options.";
      if (sub.length <= 155 - suffix.length) {
        description = sub + suffix;
      } else if (sub.length <= 155) {
        description = sub;
      } else {
        description = sub.slice(0, 152) + "...";
      }
    } else {
      description = "Find out if you qualify for compensation. Free, confidential case review.";
    }
  }

  const canonical = caseData.seo_canonical || `https://helplaw.com/cases/${slug}`;
  const ogImage = caseData.seo_image || "/assets/og-default.jpg";

  return {
    title: caseData.seo_title || `${caseData.title} | Free Case Review`,
    description,
    robots: isContent ? { index: true, follow: true } : { index: false, follow: false },
    alternates: { canonical },
    openGraph: {
      title: caseData.seo_title || caseData.title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: caseData.seo_title || caseData.title,
      description,
      images: [ogImage],
    },
  };
}

// ─── JSON-LD Schema ───

function buildJsonLd(
  caseData: Record<string, unknown>,
  faqs: Array<{ question: string; answer: string }>
) {
  const graph: object[] = [];

  // LegalService schema
  graph.push({
    "@type": (caseData.seo_schema_type as string) || "LegalService",
    name: caseData.title,
    description: caseData.seo_description || caseData.hero_subheadline || "",
    url: `https://helplaw.com/cases/${caseData.slug}`,
    provider: {
      "@type": "Organization",
      name: "Help Law Group",
      url: "https://helplaw.com",
    },
  });

  // Article schema with dateModified
  graph.push({
    "@type": "Article",
    headline: caseData.seo_title || caseData.title,
    description: caseData.seo_description || caseData.hero_subheadline || "",
    url: `https://helplaw.com/cases/${caseData.slug}`,
    ...(caseData.updated_at ? { dateModified: caseData.updated_at } : {}),
    ...(caseData.seo_image ? { image: caseData.seo_image } : { image: "/assets/og-default.jpg" }),
    author: { "@type": "Organization", name: "Help Law Group" },
    publisher: { "@type": "Organization", name: "Help Law Group", url: "https://helplaw.com" },
  });

  // FAQ schema
  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

// ─── Helpers ───

function getStr(content: Record<string, unknown>, key: string): string {
  return (content[key] as string) || "";
}

// ─── Page component ───

export default async function CasePage({ params }: PageParams) {
  const { slug } = await params;
  const caseData = await getCaseBySlug(slug);
  if (!caseData) notFound();

  const [sections, faqs] = await Promise.all([
    getCaseSections(caseData.id),
    getCaseFaqs(caseData.id),
  ]);

  const phoneNumber = caseData.phone_number || "1-800-HELP-LAW";
  const displayNumber = caseData.display_number || "1-800-HELP-LAW";
  const isContent = caseData.page_type === "content";

  // Extract headings for sticky ToC from sections that have anchorId + headline
  const tocHeadings = sections
    .map((section) => {
      const content = (typeof section.content === "object" && section.content !== null && !Array.isArray(section.content)
        ? section.content
        : {}) as Record<string, unknown>;
      const anchorId = (content.anchorId as string) || "";
      const headline = (content.headline as string) || "";
      // Skip hero, trust-banner, mid-page-cta, final-cta-band, table-of-contents, inline-cta from ToC
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
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cases", href: "/cases" },
          { label: caseData.title as string },
        ]}
      />

      {/* Content meta: last updated + reviewed by */}
      {isContent && caseData.updated_at && (
        <div className="bg-white border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>
              Last Updated:{" "}
              {new Date(caseData.updated_at as string).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="hidden sm:inline" aria-hidden="true">&middot;</span>
            <span>Reviewed by Help Law Legal Team</span>
          </div>
        </div>
      )}

      {/* JSON-LD */}
      {isContent && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(caseData, faqs)) }}
        />
      )}

      {/* Render sections with sticky ToC sidebar */}
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

      {/* Desktop sticky ToC — renders fixed but hides near footer */}
      {tocHeadings.length >= 3 && (
        <DesktopTocWrapper headings={tocHeadings} />
      )}
    </>
  );
}
