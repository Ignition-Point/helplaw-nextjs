import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

// Use anon key — relies on INSERT RLS policies
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ───

interface FormField {
  key: string;
  type: string;
  label: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface ParsedSection {
  type: "narrative" | "mid-page-cta";
  headline: string;
  content: string;
  variant: "dark" | "light" | "gold" | "";
  cta_text?: string;
}

interface ParsedDoc {
  title: string;
  slug: string;
  eyebrow: string;
  subheadline: string;
  backgroundImage: string;
  introHtml: string;
  sections: ParsedSection[];
  faqs: FAQ[];
  closingCta: { headline: string; content: string; cta_text: string } | null;
  leadForm: { name?: string; cta_text?: string; fields: FormField[] };
  meta: {
    seo_title: string;
    seo_description: string;
    seo_focus_keyword: string;
    seo_secondary_keywords: string;
    case_type: string;
    category: string;
  };
}

// ─── Google Doc Fetcher ───

async function fetchGoogleDoc(url: string): Promise<string> {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) throw new Error("Could not extract document ID from URL");

  const exportUrl = `https://docs.google.com/document/d/${match[1]}/export?format=txt`;
  const response = await fetch(exportUrl, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch document (${response.status}). Make sure it's shared as "Anyone with the link can view".`
    );
  }
  return response.text();
}

// ─── Helpers ───

function clean(text: string): string {
  // Strip \r, ** bold markers, and trim
  return text.replace(/\r/g, "").replace(/\*\*/g, "").trim();
}

function isHorizontalRule(line: string): boolean {
  const t = line.replace(/\r/g, "").trim();
  return /^[_─━═\-]{3,}$/.test(t) || t === "---";
}

function isDisclaimer(line: string): boolean {
  return /^(?:\*\*)?attorney\s+advertising/i.test(clean(line));
}

function extractField(line: string, prefix: string): string | null {
  const cleaned = clean(line);
  const regex = new RegExp(`^${prefix}\\s*(?:\\(.*?\\))?\\s*:\\s*(.+)`, "i");
  const m = cleaned.match(regex);
  if (!m) return null;
  // Strip trailing character counts like "(60 characters)"
  return m[1].replace(/\s*\(\d+\s+characters?\)\s*$/i, "").trim();
}

// ─── Text → HTML converter ───

function textToHtml(lines: string[]): string {
  const parts: string[] = [];
  let inList = false;
  const listItems: string[] = [];

  for (const rawLine of lines) {
    const trimmed = clean(rawLine);
    if (!trimmed) continue;

    const listMatch = trimmed.match(/^[-•*]\s+(.+)$/);

    if (listMatch) {
      if (!inList) { inList = true; listItems.length = 0; }
      listItems.push(listMatch[1]);
      continue;
    }

    if (inList) {
      parts.push("<ul>" + listItems.map((li) => `<li><p>${li}</p></li>`).join("") + "</ul>");
      inList = false;
      listItems.length = 0;
    }

    // Year headings for timelines
    // Matches: "1954", "Early 1990s", "Pre-2015", "September 2024", "May 13, 2025 — Source"
    if (/^(?:Early\s+|Mid-|Late\s+|Pre-)?(?:\d{4}s?|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}?,?\s*\d{4})(?:\s*[–—-]\s*.+)?$/i.test(trimmed)) {
      parts.push(`<h3>${trimmed}</h3>`);
      continue;
    }

    // Sub-headings: standalone short line (< 100 chars) that doesn't end in period and is followed by content
    // These get turned into h3 in the content
    // We detect these later via a different mechanism (see block classification)

    parts.push(`<p>${trimmed}</p>`);
  }

  if (inList) {
    parts.push("<ul>" + listItems.map((li) => `<li><p>${li}</p></li>`).join("") + "</ul>");
  }
  return parts.join("");
}

// Convert body lines with sub-headings (lines that are short, don't end in period, followed by paragraph content)
function bodyToHtml(lines: string[]): string {
  const parts: string[] = [];
  let inList = false;
  const listItems: string[] = [];

  function flushList() {
    if (inList) {
      parts.push("<ul>" + listItems.map((li) => `<li><p>${li}</p></li>`).join("") + "</ul>");
      inList = false;
      listItems.length = 0;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = clean(lines[i]);
    if (!trimmed) continue;

    // Bullet list item
    const listMatch = trimmed.match(/^[-•*]\s+(.+)$/);
    if (listMatch) {
      if (!inList) { inList = true; listItems.length = 0; }
      listItems.push(listMatch[1]);
      continue;
    }

    flushList();

    // Year/date headings for timelines
    if (/^(?:Early\s+|Mid-|Late\s+|Pre-)?(?:\d{4}s?|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}?,?\s*\d{4})(?:\s*[–—-]\s*.+)?$/i.test(trimmed)) {
      parts.push(`<h3>${trimmed}</h3>`);
      continue;
    }

    // Sub-heading detection: short line, doesn't end in punctuation, followed by longer content
    const isShort = trimmed.length < 100;
    const endsInPunctuation = /[.!?:,;]$/.test(trimmed);
    const nextLine = i + 1 < lines.length ? clean(lines[i + 1]) : "";
    const nextIsContent = nextLine.length > 0 && (nextLine.length > trimmed.length || /^[-•*]\s/.test(nextLine));

    if (isShort && !endsInPunctuation && nextIsContent && !trimmed.startsWith("*") && !trimmed.startsWith("-")) {
      parts.push(`<h3>${trimmed}</h3>`);
      continue;
    }

    parts.push(`<p>${trimmed}</p>`);
  }

  flushList();
  return parts.join("");
}

// ─── Lead Form Parser ───

function parseLeadFormSection(lines: string[]): {
  name?: string;
  cta_text?: string;
  fields: FormField[];
} {
  const fields: FormField[] = [];
  let name: string | undefined;
  let ctaText: string | undefined;

  for (const rawLine of lines) {
    const trimmed = clean(rawLine);
    if (!trimmed) continue;

    const nameMatch = trimmed.match(/^(?:form\s+)?name:\s*(.+)/i);
    if (nameMatch) { name = nameMatch[1].trim(); continue; }

    const ctaMatch = trimmed.match(/^(?:cta|button)(?:\s+text)?:\s*(.+)/i);
    if (ctaMatch) { ctaText = ctaMatch[1].trim(); continue; }

    const fieldMatch = trimmed.match(/^[-•*]\s*(.+?)(?:\s*\(([^)]+)\))?\s*$/);
    if (!fieldMatch) continue;

    const label = fieldMatch[1].trim();
    const parens = fieldMatch[2]?.trim() || "";

    let type = "text";
    let required = false;
    let options: { value: string; label: string }[] | undefined;

    if (parens) {
      const parts = parens.split(",").map((p) => p.trim().toLowerCase());
      if (parts.includes("required")) required = true;

      const selectMatch = parens.match(/select:\s*(.+)/i);
      if (selectMatch) {
        type = "select";
        options = selectMatch[1].split(",").map((opt) => {
          const t = opt.trim();
          return { value: t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), label: t };
        });
      } else {
        const typeKeywords = ["text", "email", "phone", "tel", "textarea", "select"];
        for (const part of parts) {
          if (typeKeywords.includes(part)) type = part === "phone" ? "tel" : part;
        }
      }
    }

    if (type === "text") {
      const ll = label.toLowerCase();
      if (ll.includes("email")) type = "email";
      else if (ll.includes("phone")) type = "tel";
      else if (ll.includes("describe") || ll.includes("details") || ll.includes("anything else") || ll.includes("tell us")) type = "textarea";
    }

    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const keyMap: Record<string, string> = { full_name: "fullName", name: "fullName", your_name: "fullName", email: "email", email_address: "email", phone: "phone", phone_number: "phone", state: "state" };

    fields.push({ key: keyMap[key] || key, type, label, required, ...(options ? { options } : {}) });
  }

  if (fields.length === 0) {
    fields.push(
      { key: "fullName", type: "text", label: "Full Name", required: true },
      { key: "email", type: "email", label: "Email", required: true },
      { key: "phone", type: "tel", label: "Phone", required: true },
      { key: "state", type: "select", label: "State", required: true }
    );
  }

  return { name, cta_text: ctaText, fields };
}

// ─── FAQ Parser ───

function parseFaqs(lines: string[]): FAQ[] {
  const faqs: FAQ[] = [];
  let question: string | null = null;
  let answer: string[] = [];

  for (const rawLine of lines) {
    const trimmed = clean(rawLine);
    if (!trimmed) {
      if (question && answer.length > 0) {
        faqs.push({ question, answer: answer.join("\n") });
        question = null;
        answer = [];
      }
      continue;
    }
    if (trimmed.endsWith("?") && (!question || answer.length > 0)) {
      if (question && answer.length > 0) faqs.push({ question, answer: answer.join("\n") });
      question = trimmed;
      answer = [];
    } else if (question) {
      answer.push(trimmed);
    }
  }
  if (question && answer.length > 0) faqs.push({ question, answer: answer.join("\n") });
  return faqs;
}

// ─── Main Document Parser ───
//
// Google Docs export as PLAIN TEXT — no bold markers, no formatting.
// Ashley's format:
//   - Top metadata: "Title: ...", "Eyebrow: ...", "Subheadline: ...", "Background Image: ..."
//   - SEO fields: "SEO Title (Meta Title): ...", "Meta Description: ...", etc.
//   - Sections separated by underscores (________________)
//   - First non-empty line of each block = section heading
//   - (MID-PAGE CTA) or (MIDPAGE CTA) blocks with [Button Text]
//   - (CLOSING CTA) blocks with [Button Text]
//   - "Frequently Asked Questions" block
//   - "Table of Contents" block (skipped)
//   - "Attorney Advertising." (skipped)
//   - Variant hints: "Section Title (Dark)" or "Section Title (Light)"

function parseDocument(rawText: string): ParsedDoc {
  const allLines = rawText.split("\n");

  // ── Phase 1: Extract metadata from top ──
  let title = "";
  let slug = "";
  let eyebrow = "";
  let subheadline = "";
  let backgroundImage = "";
  let seoTitle = "";
  let seoDescription = "";
  let seoFocusKeyword = "";
  let seoSecondaryKeywords = "";
  let caseType = "mass-tort";
  let category = "Uncategorized";

  const metaScanLimit = Math.min(allLines.length, 40);
  const metaFieldsConsumed = new Set<number>();

  for (let i = 0; i < metaScanLimit; i++) {
    const line = allLines[i];

    let val = extractField(line, "Title");
    if (val && !title) { title = val; metaFieldsConsumed.add(i); continue; }

    val = extractField(line, "Background Image");
    if (val) { backgroundImage = val; metaFieldsConsumed.add(i); continue; }

    val = extractField(line, "Eyebrow");
    if (val) { eyebrow = val; metaFieldsConsumed.add(i); continue; }

    val = extractField(line, "Subheadline");
    if (val) { subheadline = val; metaFieldsConsumed.add(i); continue; }

    val = extractField(line, "SEO Title(?:\\s*\\(Meta Title\\))?") || extractField(line, "Meta Title");
    if (val) { seoTitle = val; metaFieldsConsumed.add(i); continue; }

    val = extractField(line, "Meta Description");
    if (val) { seoDescription = val; metaFieldsConsumed.add(i); continue; }

    val = extractField(line, "Focus Keyword");
    if (val) { seoFocusKeyword = val; metaFieldsConsumed.add(i); continue; }

    val = extractField(line, "Secondary Keywords");
    if (val) { seoSecondaryKeywords = val; metaFieldsConsumed.add(i); continue; }

    val = extractField(line, "Category");
    if (val) { category = val; metaFieldsConsumed.add(i); continue; }

    val = extractField(line, "Case Type") || extractField(line, "Type");
    if (val) { caseType = val.toLowerCase().replace(/\s+/g, "-"); metaFieldsConsumed.add(i); continue; }

    val = extractField(line, "Slug");
    if (val) { slug = val; metaFieldsConsumed.add(i); continue; }
  }

  // If no Title: field, look for standalone title line
  // (a line that matches the doc title repeated after metadata)
  if (!title) {
    for (let i = 0; i < allLines.length; i++) {
      const t = clean(allLines[i]);
      if (t && !isHorizontalRule(allLines[i]) && !metaFieldsConsumed.has(i) && !t.includes(":")) {
        title = t;
        metaFieldsConsumed.add(i);
        break;
      }
    }
  }

  // Also consume the repeated title line if it appears right after metadata
  for (let i = 0; i < metaScanLimit; i++) {
    if (metaFieldsConsumed.has(i)) continue;
    const t = clean(allLines[i]);
    if (t === title) { metaFieldsConsumed.add(i); break; }
  }

  if (!slug && title) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // ── Phase 2: Split remaining lines into blocks by horizontal rules ──
  const contentLines: string[] = [];
  for (let i = 0; i < allLines.length; i++) {
    if (metaFieldsConsumed.has(i)) continue;
    contentLines.push(allLines[i]);
  }

  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  for (const line of contentLines) {
    if (isHorizontalRule(line)) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
    } else {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) blocks.push(currentBlock);

  // ── Phase 3: Classify each block ──
  const sections: ParsedSection[] = [];
  const introLines: string[] = [];
  let faqs: FAQ[] = [];
  let closingCta: { headline: string; content: string; cta_text: string } | null = null;
  const leadFormLines: string[] = [];
  let foundFirstSection = false;

  for (const block of blocks) {
    // Find first non-empty line
    const firstNonEmpty = block.find((l) => clean(l).length > 0);
    if (!firstNonEmpty) continue;
    const firstLine = clean(firstNonEmpty);

    // Skip disclaimer
    if (isDisclaimer(firstNonEmpty)) continue;

    // Skip Table of Contents
    if (/^table\s+of\s+contents$/i.test(firstLine)) continue;

    // Skip SEO metadata blocks (already consumed in phase 1)
    if (/^(?:SEO Title|Meta Title|Meta Description|Focus Keyword|Secondary Keywords)/i.test(firstLine)) continue;

    // Lead Form
    if (/^lead\s+form:/i.test(firstLine)) {
      const startIdx = block.indexOf(firstNonEmpty);
      leadFormLines.push(...block.slice(startIdx + 1));
      continue;
    }

    // FAQ section
    if (/^frequently\s+asked\s+questions/i.test(firstLine)) {
      const startIdx = block.indexOf(firstNonEmpty);
      faqs = parseFaqs(block.slice(startIdx + 1));
      continue;
    }

    // Mid-page CTA
    if (/^\(?\s*MID[\s-]*PAGE\s+CTA\s*\)?/i.test(firstLine)) {
      const ctaLines = block.filter((l) => clean(l).length > 0 && !/^\(?\s*MID[\s-]*PAGE\s+CTA\s*\)?/i.test(clean(l)));
      let ctaHeadline = "";
      let ctaText = "Request a Case Review";
      const ctaContentLines: string[] = [];

      for (const line of ctaLines) {
        const t = clean(line);
        const btnMatch = t.match(/^\[(.+)\]$/);
        if (btnMatch) {
          ctaText = btnMatch[1];
        } else if (!ctaHeadline) {
          ctaHeadline = t;
        } else {
          ctaContentLines.push(line);
        }
      }

      sections.push({
        type: "mid-page-cta",
        headline: ctaHeadline,
        content: textToHtml(ctaContentLines),
        variant: "gold",
        cta_text: ctaText,
      });
      continue;
    }

    // Closing CTA
    if (/^\(?\s*CLOSING\s+CTA\s*\)?/i.test(firstLine)) {
      const ctaLines = block.filter((l) => clean(l).length > 0 && !/^\(?\s*CLOSING\s+CTA\s*\)?/i.test(clean(l)));
      let ctaHeadline = "";
      let ctaText = "Get Your Case Reviewed";
      const ctaContentLines: string[] = [];

      for (const line of ctaLines) {
        const t = clean(line);
        const btnMatch = t.match(/^\[(.+)\]$/);
        if (btnMatch) {
          ctaText = btnMatch[1];
        } else if (!ctaHeadline) {
          ctaHeadline = t;
        } else {
          ctaContentLines.push(line);
        }
      }

      closingCta = {
        headline: ctaHeadline,
        content: textToHtml(ctaContentLines),
        cta_text: ctaText,
      };
      continue;
    }

    // Regular content block
    // First non-empty line is the section heading
    // Check for variant hint: "Heading (Dark)" or "Heading (Light)"
    let headingText = firstLine;
    let variant: "dark" | "light" | "" = "";

    const variantMatch = headingText.match(/\s*\((Dark|Light)\)\s*$/i);
    if (variantMatch) {
      variant = variantMatch[1].toLowerCase() as "dark" | "light";
      headingText = headingText.replace(/\s*\((Dark|Light)\)\s*$/i, "").trim();
    }

    // Get body lines (everything after the heading line)
    const headingIdx = block.indexOf(firstNonEmpty);
    const bodyLines = block.slice(headingIdx + 1);
    const hasBody = bodyLines.some((l) => clean(l).length > 0);

    // Determine if this is a section with a heading or just intro content
    // Heuristic: if the first line is short-ish (< 120 chars) and there's body content, treat as section
    const looksLikeHeading = headingText.length < 120 && !headingText.endsWith(".") && hasBody;

    if (looksLikeHeading && foundFirstSection) {
      // Named section
      sections.push({
        type: "narrative",
        headline: headingText,
        content: bodyToHtml(bodyLines),
        variant,
      });
    } else if (looksLikeHeading && !foundFirstSection) {
      // First real section — mark it
      foundFirstSection = true;
      sections.push({
        type: "narrative",
        headline: headingText,
        content: bodyToHtml(bodyLines),
        variant,
      });
    } else if (!foundFirstSection) {
      // Intro content (before first section)
      introLines.push(...block.filter((l) => clean(l).length > 0));
    } else {
      // Content without a clear heading after sections started
      sections.push({
        type: "narrative",
        headline: "",
        content: bodyToHtml(block),
        variant: "",
      });
    }
  }

  // Build lead form
  const leadForm = parseLeadFormSection(leadFormLines);

  // Build intro HTML
  const introHtml = introLines.length > 0 ? textToHtml(introLines) : "";

  // Auto-detect category from title if still uncategorized
  if (category === "Uncategorized" && title) {
    const tl = title.toLowerCase();
    if (tl.includes("juvenile detention") || tl.includes("juvenile hall")) category = "Juvenile Detention Abuse";
    else if (tl.includes("clergy") || tl.includes("diocese")) category = "Clergy and Religious Institution Abuse";
    else if (tl.includes("foster care")) category = "Foster Care Abuse";
    else if (tl.includes("rideshare") || tl.includes("uber") || tl.includes("lyft")) category = "Rideshare Assault";
    else if (tl.includes("social media")) category = "Social Media Addiction";
    else if (tl.includes("dr.") || tl.includes("doctor") || tl.includes("medical") || tl.includes("hospital")) category = "Medical Abuse";
    else if (tl.includes("sexual abuse") || tl.includes("sexual assault")) category = "Sexual Abuse and Institutional Harm";
    else if (tl.includes("online platform")) category = "Online Platform Harm";
    else if (tl.includes("product") || tl.includes("unsafe")) category = "Unsafe Products";
  }

  return {
    title,
    slug,
    eyebrow,
    subheadline,
    backgroundImage,
    introHtml,
    sections,
    faqs,
    closingCta,
    leadForm,
    meta: {
      seo_title: seoTitle || `${title} | Help Law Group`,
      seo_description: seoDescription,
      seo_focus_keyword: seoFocusKeyword,
      seo_secondary_keywords: seoSecondaryKeywords,
      case_type: caseType,
      category,
    },
  };
}

// ─── Case Creator ───

async function createCaseFromDoc(docUrl: string) {
  const rawText = await fetchGoogleDoc(docUrl);
  const doc = parseDocument(rawText);

  if (!doc.title) throw new Error("Could not find a title in the document");

  // Check for existing slug (note: anon key may not see draft cases due to RLS)
  const { data: existing } = await supabase.from("cases").select("id").eq("slug", doc.slug).maybeSingle();
  if (existing) throw new Error(`A case with slug "${doc.slug}" already exists. Delete or rename the existing case first.`);

  // Create lead form
  const formId = randomUUID();
  const { error: formErr } = await supabase.from("lead_forms").insert({
    id: formId,
    name: doc.leadForm.name || `${doc.title} - Lead Form`,
    fields: doc.leadForm.fields,
    cta_text: doc.leadForm.cta_text || "Get Your Free Case Review",
    post_submit: "thank-you",
    intake_questions: [],
    intake_position: "after",
  });
  if (formErr) throw new Error(`Failed to create lead form: ${formErr.message}`);

  // Create case
  const caseId = randomUUID();
  const heroSubheadline = doc.subheadline ? `<h3>${doc.subheadline}</h3>` : "";
  const { error: caseErr } = await supabase.from("cases").insert({
    id: caseId,
    title: doc.title,
    slug: doc.slug,
    case_type: doc.meta.case_type,
    category: doc.meta.category,
    status: "draft",
    page_type: "content",
    phone_number: "1-800-HELP-LAW",
    display_number: "1-800-HELP-LAW",
    seo_title: doc.meta.seo_title,
    seo_description: doc.meta.seo_description,
    seo_focus_keyword: doc.meta.seo_focus_keyword,
    seo_secondary_keywords: doc.meta.seo_secondary_keywords,
    hero_eyebrow: doc.eyebrow || "Fighting for Survivors",
    hero_headline: doc.title,
    hero_subheadline: heroSubheadline || `<h3>Help Law Group advocates for survivors affected by this case.</h3>`,
    hero_background_image: doc.backgroundImage,
    final_cta_headline: doc.closingCta?.headline || "Take the First Step Toward Justice",
    final_cta_button: doc.closingCta?.cta_text || "Start Your Free Case Review",
    final_cta_background_image: "",
  });
  if (caseErr) {
    await supabase.from("lead_forms").delete().eq("id", formId);
    if (caseErr.message.includes("duplicate key") || caseErr.message.includes("unique constraint")) {
      throw new Error(`A case with slug "${doc.slug}" already exists (possibly as a draft). Delete the existing case in Supabase or Lovable CMS first.`);
    }
    throw new Error(`Failed to create case: ${caseErr.message}`);
  }

  // Build sections
  const sectionsToInsert: any[] = [];
  let sortOrder = 0;
  let anchorCounter = 1;

  // 1. Hero with form
  sectionsToInsert.push({
    case_id: caseId,
    section_type: "hero-with-form",
    sort_order: sortOrder++,
    visible: true,
    content: {
      eyebrow: doc.eyebrow || "Fighting for Survivors",
      headline: doc.title,
      subheadline: heroSubheadline,
      content: "",
      backgroundImage: doc.backgroundImage,
      leadFormId: formId,
      anchorId: "",
      textAlign: "",
    },
  });

  // 2. Intro narrative
  if (doc.introHtml) {
    sectionsToInsert.push({
      case_id: caseId,
      section_type: "narrative",
      sort_order: sortOrder++,
      visible: true,
      content: { eyebrow: "", headline: "", content: doc.introHtml, variant: "", anchorId: "", textAlign: "" },
    });
  }

  // 3. Table of contents
  const headlinedSections = doc.sections.filter((s) => s.headline && s.type !== "mid-page-cta");
  if (headlinedSections.length >= 3) {
    const tocLines: string[] = [];
    let tocAnchor = 1;
    for (const s of headlinedSections) {
      tocLines.push(`${s.headline} | ${tocAnchor++}`);
    }
    if (doc.faqs.length > 0) {
      tocLines.push(`Frequently Asked Questions | ${tocAnchor++}`);
    }
    sectionsToInsert.push({
      case_id: caseId,
      section_type: "table-of-contents",
      sort_order: sortOrder++,
      visible: true,
      content: { headline: "Table of Contents", items: tocLines.join("\n"), variant: "", anchorId: "", textAlign: "" },
    });
  }

  // 4. Content sections
  for (const section of doc.sections) {
    if (section.type === "mid-page-cta") {
      sectionsToInsert.push({
        case_id: caseId,
        section_type: "mid-page-cta",
        sort_order: sortOrder++,
        visible: true,
        content: {
          headline: section.headline,
          subheadline: "",
          content: section.content,
          ctaText: section.cta_text || "Speak With a Case Advocate Today",
          variant: section.variant || "gold",
          anchorId: "",
          textAlign: "",
        },
      });
    } else {
      sectionsToInsert.push({
        case_id: caseId,
        section_type: "narrative",
        sort_order: sortOrder++,
        visible: true,
        content: {
          eyebrow: "",
          headline: section.headline,
          content: section.content,
          variant: section.variant,
          anchorId: section.headline ? String(anchorCounter++) : "",
          textAlign: "",
        },
      });
    }
  }

  // 5. FAQ section
  if (doc.faqs.length > 0) {
    sectionsToInsert.push({
      case_id: caseId,
      section_type: "faq-section",
      sort_order: sortOrder++,
      visible: true,
      content: { headline: "Frequently Asked Questions", variant: "", anchorId: String(anchorCounter++), textAlign: "" },
    });
  }

  // 6. Final CTA band
  sectionsToInsert.push({
    case_id: caseId,
    section_type: "final-cta-band",
    sort_order: sortOrder++,
    visible: true,
    content: {
      headline: doc.closingCta?.headline || "Take the First Step Toward Justice",
      content: doc.closingCta?.content || "<p>Contact Help Law Group today to request a confidential case review.</p>",
      ctaText: doc.closingCta?.cta_text || "Start Your Free Case Review",
      backgroundImage: "",
      variant: "",
      anchorId: "",
      textAlign: "",
    },
  });

  // Insert sections
  const { error: secErr } = await supabase.from("case_sections").insert(sectionsToInsert);
  if (secErr) {
    await supabase.from("cases").delete().eq("id", caseId);
    await supabase.from("lead_forms").delete().eq("id", formId);
    throw new Error(`Failed to create sections: ${secErr.message}`);
  }

  // Insert FAQs
  if (doc.faqs.length > 0) {
    const { error: faqErr } = await supabase.from("case_faqs").insert(
      doc.faqs.map((faq, i) => ({ case_id: caseId, question: faq.question, answer: faq.answer, sort_order: i }))
    );
    if (faqErr) console.error("FAQ insert error:", faqErr.message);
  }

  return {
    caseId,
    slug: doc.slug,
    formId,
    title: doc.title,
    category: doc.meta.category,
    sectionCount: sectionsToInsert.length,
    faqCount: doc.faqs.length,
    formFieldCount: doc.leadForm.fields.length,
  };
}

// ─── API Route ───

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { docUrl } = body;

    if (!docUrl || !docUrl.includes("docs.google.com")) {
      return NextResponse.json({ error: "Please provide a valid Google Docs URL" }, { status: 400 });
    }

    const result = await createCaseFromDoc(docUrl);

    return NextResponse.json({
      success: true,
      ...result,
      previewUrl: `https://helplaw-nextjs.vercel.app/cases/${result.slug}`,
      message: `Case "${result.title}" created as draft with category "${result.category}". Set to active in Lovable CMS to publish.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
