/**
 * Case Page Creator Agent
 *
 * Takes structured case content (from a Google Doc or JSON input) and creates
 * a complete case page in Supabase, including:
 * - cases table entry
 * - lead_forms entry
 * - case_sections entries (page builder blocks)
 * - case_faqs entries
 *
 * The page is created as a DRAFT (status: 'draft') so it appears in the
 * Lovable CMS for human review before going live.
 *
 * Usage:
 *   npx tsx scripts/create-case-page.ts ./content/my-case.json
 *   npx tsx scripts/create-case-page.ts --from-doc "Google Doc URL"
 *
 * Input JSON format: see scripts/sample-case-input.json
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// ─── Supabase client (uses service role for writes) ───

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Types ───

interface CaseInput {
  // Core case info
  title: string;
  slug?: string; // auto-generated if not provided
  case_type: "mass-tort" | "class-action" | "data-breach";
  category: string;
  page_type?: "content" | "landing-page"; // default: "content"

  // Hero section
  hero_eyebrow: string;
  hero_headline?: string; // defaults to title
  hero_subheadline: string; // HTML string
  hero_background_image?: string;

  // Phone
  phone_number?: string;
  display_number?: string;

  // SEO
  seo_title?: string; // auto-generated if not provided
  seo_description?: string; // auto-generated from subheadline
  seo_focus_keyword?: string;
  seo_secondary_keywords?: string;
  seo_image?: string;

  // Lead form config
  lead_form?: {
    name?: string;
    cta_text?: string;
    fields?: Array<{
      key: string;
      type: "text" | "email" | "tel" | "textarea" | "select";
      label: string;
      required?: boolean;
      options?: Array<{ value: string; label: string }>;
    }>;
  };

  // Use an existing lead form ID instead of creating a new one
  existing_lead_form_id?: string;

  // Content sections - the main body of the page
  sections: SectionInput[];

  // FAQs
  faqs?: Array<{
    question: string;
    answer: string;
  }>;

  // Final CTA
  final_cta?: {
    headline: string;
    content?: string;
    cta_text?: string;
    background_image?: string;
  };
}

interface SectionInput {
  type:
    | "narrative"
    | "narrative-with-image"
    | "narrative-side-image"
    | "condition-grid"
    | "mid-page-cta"
    | "qualification-checklist"
    | "what-you-need-to-know"
    | "trust-banner"
    | "inline-cta";
  headline?: string;
  eyebrow?: string;
  content?: string; // HTML
  variant?: "light" | "dark" | "gold";
  anchor_id?: string; // auto-generated from headline if not provided

  // Type-specific fields
  image_url?: string;
  image_position?: "left" | "right";
  quote?: string;
  items?: string; // newline-separated for condition-grid, checklist, trust-banner
  cta_text?: string;
  cta_href?: string;
  subheadline?: string;
}

// ─── Helpers ───

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateSeoTitle(title: string): string {
  const base = `${title} | Help Law Group`;
  if (base.length <= 60) return base;
  return `${title.slice(0, 50)}... | Help Law Group`;
}

function generateSeoDescription(subheadline: string, title: string): string {
  // Strip HTML tags from subheadline
  const clean = subheadline.replace(/<[^>]*>/g, "").trim();
  if (clean && clean.length <= 155) {
    return clean + (clean.length <= 120 ? " Learn about your legal options." : "");
  }
  if (clean) {
    return clean.slice(0, 152) + "...";
  }
  return `Learn about ${title}. Free, confidential case review from Help Law Group.`;
}

function generateAnchorId(headline: string, index: number): string {
  if (!headline) return String(index);
  // Use simple numeric IDs like the Hadden page does
  return String(index);
}

// ─── Main creation function ───

async function createCasePage(input: CaseInput) {
  console.log("\n🏗️  Creating case page:", input.title);
  console.log("─".repeat(50));

  // 1. Generate defaults
  const slug = input.slug || generateSlug(input.title);
  const seoTitle = input.seo_title || generateSeoTitle(input.title);
  const seoDescription = input.seo_description || generateSeoDescription(input.hero_subheadline, input.title);

  console.log(`📝 Slug: ${slug}`);
  console.log(`🔍 SEO Title: ${seoTitle}`);

  // 2. Check if slug already exists
  const { data: existing } = await supabase
    .from("cases")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    console.error(`❌ Case with slug "${slug}" already exists (ID: ${existing.id})`);
    console.error("   Use a different slug or delete the existing case first.");
    process.exit(1);
  }

  // 3. Create lead form (or use existing)
  let leadFormId = input.existing_lead_form_id;

  if (!leadFormId && input.lead_form) {
    console.log("📋 Creating lead form...");
    const formFields = input.lead_form.fields || [
      { key: "fullName", type: "text", label: "Full Name", required: true },
      { key: "phone", type: "tel", label: "Phone", required: true },
      { key: "email", type: "email", label: "Email", required: true },
      { key: "state", type: "select", label: "State", required: true },
    ];

    const formId = crypto.randomUUID();
    const { error: formError } = await supabase
      .from("lead_forms")
      .insert({
        id: formId,
        name: input.lead_form.name || input.title,
        fields: formFields,
        cta_text: input.lead_form.cta_text || "Get Your Free Case Review",
        post_submit: "thank-you",
        intake_questions: [],
        intake_position: "after",
      });

    if (formError) {
      console.error("❌ Failed to create lead form:", formError.message);
      process.exit(1);
    }
    leadFormId = formId;
    console.log(`   ✅ Lead form created: ${leadFormId}`);
  } else if (!leadFormId) {
    // Create a default form
    console.log("📋 Creating default lead form...");
    const defaultFormId = crypto.randomUUID();
    const { error: formError } = await supabase
      .from("lead_forms")
      .insert({
        id: defaultFormId,
        name: input.title,
        fields: [
          { key: "fullName", type: "text", label: "Full Name", required: true },
          { key: "phone", type: "tel", label: "Phone", required: true },
          { key: "email", type: "email", label: "Email", required: true },
          { key: "state", type: "select", label: "State", required: true },
        ],
        cta_text: "Get Your Free Case Review",
        post_submit: "thank-you",
        intake_questions: [],
        intake_position: "after",
      });

    if (formError) {
      console.error("❌ Failed to create lead form:", formError.message);
      process.exit(1);
    }
    leadFormId = defaultFormId;
    console.log(`   ✅ Default lead form created: ${leadFormId}`);
  } else {
    console.log(`📋 Using existing lead form: ${leadFormId}`);
  }

  // 4. Create the case record
  console.log("📄 Creating case record...");
  const caseId = crypto.randomUUID();
  const { error: caseError } = await supabase
    .from("cases")
    .insert({
      id: caseId,
      title: input.title,
      slug,
      case_type: input.case_type,
      category: input.category,
      status: "draft", // Always draft — human reviews in Lovable CMS
      page_type: input.page_type || "content",
      hero_eyebrow: input.hero_eyebrow,
      hero_headline: input.hero_headline || input.title,
      hero_subheadline: input.hero_subheadline,
      hero_background_image: input.hero_background_image || "",
      phone_number: input.phone_number || "1-800-555-0123",
      display_number: input.display_number || "1-800-555-0123",
      seo_title: seoTitle,
      seo_description: seoDescription,
      seo_focus_keyword: input.seo_focus_keyword || "",
      seo_secondary_keywords: input.seo_secondary_keywords || "",
      seo_image: input.seo_image || "",
      seo_canonical: "",
      seo_noindex: false,
      seo_schema_type: "LegalService",
      seo_custom_jsonld: "",
      final_cta_headline: input.final_cta?.headline || "",
      final_cta_button: input.final_cta?.cta_text || "Start Your Free Case Review",
      final_cta_background_image: input.final_cta?.background_image || "",
      reviewer_attorney_name: "",
      reviewer_attorney_title: "",
      reviewer_attorney_slug: "",
    })
  if (caseError) {
    console.error("❌ Failed to create case:", caseError.message);
    process.exit(1);
  }
  console.log(`   ✅ Case created: ${caseId}`);

  // 5. Build sections array
  console.log("🧱 Creating sections...");
  const sectionsToInsert: Array<{
    case_id: string;
    section_type: string;
    sort_order: number;
    visible: boolean;
    content: Record<string, unknown>;
  }> = [];

  let sortOrder = 0;

  // 5a. Hero with form (always first)
  sectionsToInsert.push({
    case_id: caseId,
    section_type: "hero-with-form",
    sort_order: sortOrder++,
    visible: true,
    content: {
      eyebrow: input.hero_eyebrow,
      headline: input.hero_headline || input.title,
      subheadline: input.hero_subheadline,
      content: "",
      backgroundImage: input.hero_background_image || "",
      leadFormId: leadFormId,
      anchorId: "",
      textAlign: "",
    },
  });

  // 5b. Intro narrative (if first section is a narrative without headline)
  // Check if user provided an intro section
  const firstSection = input.sections[0];
  let sectionStartIndex = 0;

  if (firstSection && firstSection.type === "narrative" && !firstSection.headline) {
    sectionsToInsert.push({
      case_id: caseId,
      section_type: "narrative",
      sort_order: sortOrder++,
      visible: true,
      content: {
        eyebrow: "",
        headline: "",
        content: firstSection.content || "",
        variant: firstSection.variant || "",
        anchorId: "",
        textAlign: "",
      },
    });
    sectionStartIndex = 1;
  }

  // 5c. Collect headlined sections for ToC
  const headlinedSections = input.sections
    .slice(sectionStartIndex)
    .filter((s) => s.headline && !["mid-page-cta", "trust-banner", "inline-cta"].includes(s.type));

  // 5d. Table of contents (if we have enough headlined sections)
  if (headlinedSections.length >= 3) {
    // Include FAQs and final sections in ToC if present
    const tocLines: string[] = [];
    let anchorCounter = 1;

    for (const s of headlinedSections) {
      tocLines.push(`${s.headline} | ${anchorCounter}`);
      anchorCounter++;
    }

    if (input.faqs && input.faqs.length > 0) {
      tocLines.push(`Frequently Asked Questions | ${anchorCounter}`);
      anchorCounter++;
    }

    sectionsToInsert.push({
      case_id: caseId,
      section_type: "table-of-contents",
      sort_order: sortOrder++,
      visible: true,
      content: {
        headline: "Table of Contents",
        items: tocLines.join("\n"),
        variant: "",
        anchorId: "",
        textAlign: "",
      },
    });
  }

  // 5e. Content sections
  let anchorCounter = 1;
  const contentSections = input.sections.slice(sectionStartIndex);
  const midpoint = Math.floor(contentSections.length / 2);
  let midPageCtaInserted = false;

  for (let i = 0; i < contentSections.length; i++) {
    const section = contentSections[i];

    // Auto-insert mid-page CTA at the midpoint if user didn't explicitly add one
    if (
      i >= midpoint &&
      !midPageCtaInserted &&
      section.type !== "mid-page-cta" &&
      !contentSections.some((s) => s.type === "mid-page-cta")
    ) {
      // Don't auto-insert — only add if explicitly in the content
      // Uncomment below to enable auto-insertion:
      // sectionsToInsert.push({
      //   case_id: caseId,
      //   section_type: "mid-page-cta",
      //   sort_order: sortOrder++,
      //   visible: true,
      //   content: {
      //     headline: "You Deserve to Be Heard",
      //     subheadline: "",
      //     content: "<p>Our team is ready to listen. Start your free case review today.</p>",
      //     ctaText: "Speak With a Case Advocate Today",
      //     variant: "",
      //     anchorId: "",
      //     textAlign: "",
      //   },
      // });
      midPageCtaInserted = true;
    }

    const isHeadlined = section.headline && !["mid-page-cta", "trust-banner", "inline-cta"].includes(section.type);
    const anchorId = isHeadlined ? String(anchorCounter++) : "";

    const baseContent: Record<string, unknown> = {
      anchorId: section.anchor_id || anchorId,
      textAlign: "",
    };

    switch (section.type) {
      case "narrative":
        sectionsToInsert.push({
          case_id: caseId,
          section_type: "narrative",
          sort_order: sortOrder++,
          visible: true,
          content: {
            ...baseContent,
            eyebrow: section.eyebrow || "",
            headline: section.headline || "",
            content: section.content || "",
            variant: section.variant || "",
          },
        });
        break;

      case "narrative-with-image":
        sectionsToInsert.push({
          case_id: caseId,
          section_type: "narrative-with-image",
          sort_order: sortOrder++,
          visible: true,
          content: {
            ...baseContent,
            eyebrow: section.eyebrow || "",
            headline: section.headline || "",
            content: section.content || "",
            imageUrl: section.image_url || "",
            variant: section.variant || "dark",
          },
        });
        break;

      case "narrative-side-image":
        sectionsToInsert.push({
          case_id: caseId,
          section_type: "narrative-side-image",
          sort_order: sortOrder++,
          visible: true,
          content: {
            ...baseContent,
            eyebrow: section.eyebrow || "",
            headline: section.headline || "",
            content: section.content || "",
            imageUrl: section.image_url || "",
            imagePosition: section.image_position || "right",
            variant: section.variant || "",
          },
        });
        break;

      case "condition-grid":
        sectionsToInsert.push({
          case_id: caseId,
          section_type: "condition-grid",
          sort_order: sortOrder++,
          visible: true,
          content: {
            ...baseContent,
            headline: section.headline || "",
            subheadline: section.subheadline || "",
            conditions: section.items || "",
            variant: section.variant || "dark",
          },
        });
        break;

      case "mid-page-cta":
        sectionsToInsert.push({
          case_id: caseId,
          section_type: "mid-page-cta",
          sort_order: sortOrder++,
          visible: true,
          content: {
            ...baseContent,
            headline: section.headline || "",
            subheadline: section.subheadline || "",
            content: section.content || "",
            ctaText: section.cta_text || "Speak With a Case Advocate Today",
            variant: section.variant || "",
          },
        });
        midPageCtaInserted = true;
        break;

      case "qualification-checklist":
        sectionsToInsert.push({
          case_id: caseId,
          section_type: "qualification-checklist",
          sort_order: sortOrder++,
          visible: true,
          content: {
            ...baseContent,
            headline: section.headline || "",
            items: section.items || "",
            ctaText: section.cta_text || "See If You Qualify",
            variant: section.variant || "",
          },
        });
        break;

      case "what-you-need-to-know":
        sectionsToInsert.push({
          case_id: caseId,
          section_type: "what-you-need-to-know",
          sort_order: sortOrder++,
          visible: true,
          content: {
            ...baseContent,
            headline: section.headline || "What You Need to Know",
            content: section.content || "",
            variant: section.variant || "",
          },
        });
        break;

      case "trust-banner":
        sectionsToInsert.push({
          case_id: caseId,
          section_type: "trust-banner",
          sort_order: sortOrder++,
          visible: true,
          content: {
            ...baseContent,
            items: section.items || "",
            variant: section.variant || "gold",
          },
        });
        break;

      case "inline-cta":
        sectionsToInsert.push({
          case_id: caseId,
          section_type: "inline-cta",
          sort_order: sortOrder++,
          visible: true,
          content: {
            ...baseContent,
            headline: section.headline || "",
            button_text: section.cta_text || "Start Your Free Case Review",
            button_url: section.cta_href || "#form",
          },
        });
        break;
    }
  }

  // 5f. FAQ section (if FAQs provided)
  if (input.faqs && input.faqs.length > 0) {
    sectionsToInsert.push({
      case_id: caseId,
      section_type: "faq-section",
      sort_order: sortOrder++,
      visible: true,
      content: {
        headline: "Frequently Asked Questions",
        variant: "",
        anchorId: String(anchorCounter++),
        textAlign: "",
      },
    });
  }

  // 5g. Final CTA band
  if (input.final_cta) {
    sectionsToInsert.push({
      case_id: caseId,
      section_type: "final-cta-band",
      sort_order: sortOrder++,
      visible: true,
      content: {
        headline: input.final_cta.headline,
        content: input.final_cta.content || "",
        ctaText: input.final_cta.cta_text || "Start Your Free Case Review",
        backgroundImage: input.final_cta.background_image || "",
        variant: "",
        anchorId: "",
        textAlign: "",
      },
    });
  }

  // 6. Insert all sections
  const { error: sectionsError } = await supabase
    .from("case_sections")
    .insert(sectionsToInsert);

  if (sectionsError) {
    console.error("❌ Failed to create sections:", sectionsError.message);
    // Clean up the case record
    await supabase.from("cases").delete().eq("id", caseId);
    if (leadFormId && !input.existing_lead_form_id) {
      await supabase.from("lead_forms").delete().eq("id", leadFormId);
    }
    process.exit(1);
  }

  console.log(`   ✅ ${sectionsToInsert.length} sections created`);

  // 7. Insert FAQs
  if (input.faqs && input.faqs.length > 0) {
    console.log("❓ Creating FAQs...");
    const faqsToInsert = input.faqs.map((faq, i) => ({
      case_id: caseId,
      question: faq.question,
      answer: faq.answer,
      sort_order: i,
    }));

    const { error: faqError } = await supabase
      .from("case_faqs")
      .insert(faqsToInsert);

    if (faqError) {
      console.error("❌ Failed to create FAQs:", faqError.message);
    } else {
      console.log(`   ✅ ${faqsToInsert.length} FAQs created`);
    }
  }

  // 8. Summary
  console.log("\n" + "═".repeat(50));
  console.log("✅ Case page created successfully!");
  console.log("═".repeat(50));
  console.log(`   Title:      ${input.title}`);
  console.log(`   Slug:       ${slug}`);
  console.log(`   Case ID:    ${caseId}`);
  console.log(`   Form ID:    ${leadFormId}`);
  console.log(`   Sections:   ${sectionsToInsert.length}`);
  console.log(`   FAQs:       ${input.faqs?.length || 0}`);
  console.log(`   Status:     DRAFT (review in Lovable CMS before publishing)`);
  console.log(`\n   🔗 After publishing, view at:`);
  console.log(`      Local:   http://localhost:3000/cases/${slug}`);
  console.log(`      Vercel:  https://helplaw-nextjs.vercel.app/cases/${slug}`);
  console.log("");

  return { caseId, slug, leadFormId };
}

// ─── CLI entry point ───

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage:");
    console.log("  npx tsx scripts/create-case-page.ts ./content/my-case.json");
    console.log("");
    console.log("See scripts/sample-case-input.json for the expected format.");
    process.exit(1);
  }

  const inputPath = path.resolve(args[0]);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    process.exit(1);
  }

  const rawContent = fs.readFileSync(inputPath, "utf-8");
  let input: CaseInput;

  try {
    input = JSON.parse(rawContent);
  } catch {
    console.error("❌ Invalid JSON in input file");
    process.exit(1);
  }

  // Validate required fields
  if (!input.title) {
    console.error("❌ Missing required field: title");
    process.exit(1);
  }
  if (!input.case_type) {
    console.error("❌ Missing required field: case_type");
    process.exit(1);
  }
  if (!input.category) {
    console.error("❌ Missing required field: category");
    process.exit(1);
  }
  if (!input.hero_eyebrow) {
    console.error("❌ Missing required field: hero_eyebrow");
    process.exit(1);
  }
  if (!input.hero_subheadline) {
    console.error("❌ Missing required field: hero_subheadline");
    process.exit(1);
  }
  if (!input.sections || input.sections.length === 0) {
    console.error("❌ Missing required field: sections (must have at least one)");
    process.exit(1);
  }

  await createCasePage(input);
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
