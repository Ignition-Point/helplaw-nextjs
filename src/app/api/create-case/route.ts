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
  type: string;
  headline: string;
  content: string;
  variant: string;
  cta_text?: string;
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

// ─── Lead Form Parser ───

function parseLeadFormSection(lines: string[]): {
  name?: string;
  cta_text?: string;
  fields: FormField[];
} {
  const fields: FormField[] = [];
  let name: string | undefined;
  let ctaText: string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();
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

// ─── Meta Parser ───

function parseMetaSection(lines: string[]): Record<string, string> {
  const meta: Record<string, string> = {};
  for (const line of lines) {
    const match = line.trim().match(/^(.+?):\s*(.+)$/);
    if (!match) continue;
    const key = match[1].trim().toLowerCase().replace(/\s+/g, "_");
    const value = match[2].trim();
    if (key.includes("title")) meta.seo_title = value;
    else if (key.includes("description")) meta.seo_description = value;
    else if (key.includes("focus") || key.includes("primary")) meta.seo_focus_keyword = value;
    else if (key.includes("secondary")) meta.seo_secondary_keywords = value;
    else if (key === "category") meta.category = value;
    else if (key === "slug") meta.slug = value;
    else if (key === "case_type" || key === "type") meta.case_type = value;
  }
  return meta;
}

// ─── FAQ Parser ───

function parseFaqSection(lines: string[]): FAQ[] {
  const faqs: FAQ[] = [];
  let question: string | null = null;
  let answer: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
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

// ─── Text → HTML ───

function textToHtml(text: string): string {
  const lines = text.split("\n");
  const parts: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const listMatch = trimmed.match(/^[-•*]\s+(.+)$/);

    if (listMatch) {
      if (!inList) { inList = true; listItems = []; }
      listItems.push(listMatch[1]);
      continue;
    }

    if (inList) {
      parts.push("<ul>" + listItems.map((li) => `<li><p>${li}</p></li>`).join("") + "</ul>");
      inList = false;
      listItems = [];
    }

    if (!trimmed) continue;

    const h3Match = trimmed.match(/^(\d{4}(?:\s*[–—-]\s*\d{4})?(?:\s*[–—-]\s*.+)?)\s*$/);
    if (h3Match) { parts.push(`<h3>${h3Match[1]}</h3>`); continue; }

    parts.push(`<p>${trimmed}</p>`);
  }

  if (inList) {
    parts.push("<ul>" + listItems.map((li) => `<li><p>${li}</p></li>`).join("") + "</ul>");
  }
  return parts.join("");
}

// ─── Document Parser ───

function parseDocument(rawText: string): {
  title: string;
  heroSubheadline: string;
  introContent: string;
  sections: ParsedSection[];
  faqs: FAQ[];
  leadForm: { name?: string; cta_text?: string; fields: FormField[] };
  meta: Record<string, string>;
} {
  const lines = rawText.split("\n");
  let title = "";
  let heroSubheadline = "";
  const introLines: string[] = [];
  const sections: ParsedSection[] = [];
  let faqs: FAQ[] = [];
  const leadFormLines: string[] = [];
  const metaLines: string[] = [];

  let mode: "hero" | "intro" | "section" | "faq" | "lead-form" | "meta" | "cta" | "skip" = "hero";
  let sectionHeadline = "";
  let sectionContent: string[] = [];
  let ctaHeadline = "";
  let ctaContent: string[] = [];
  let darkToggle = true;

  const isRule = (l: string) => /^[_─━═]{3,}$/.test(l.trim()) || l.trim() === "---";
  const isHeroBlock = (l: string) => /^hero\s+with\s+form/i.test(l.trim());
  const isToc = (l: string) => /^table\s+of\s+contents$/i.test(l.trim());
  const isFaq = (l: string) => /^frequently\s+asked\s+questions/i.test(l.trim());
  const isLeadForm = (l: string) => /^lead\s+form:/i.test(l.trim());
  const isMidCta = (l: string) => /^midpage\s+cta:/i.test(l.trim());
  const isNote = (l: string) => /^note:/i.test(l.trim());
  const isDisclaimer = (l: string) => /^attorney\s+advertising/i.test(l.trim());

  const knownHeaders = [
    "what you need to know", "what you should know", "how widespread", "how did this happen",
    "which juvenile", "who was responsible", "what happened to", "why didn't anyone",
    "in the news", "what are your legal", "how help law", "do you have a case",
    "who is", "when did", "what were the results", "how does", "did the hospitals",
    "what compensation", "nyc juvenile detention", "dr. robert hadden",
    "what happened in", "what the nyc", "filing deadlines", "what a civil",
    "the law that opened",
  ];

  function saveSection() {
    if (sectionHeadline && sectionContent.length > 0) {
      sections.push({
        type: "narrative",
        headline: sectionHeadline,
        content: textToHtml(sectionContent.join("\n")),
        variant: darkToggle ? "dark" : "",
      });
      darkToggle = !darkToggle;
    }
    sectionHeadline = "";
    sectionContent = [];
  }

  function isKnownHeader(text: string): boolean {
    return knownHeaders.some((h) => text.toLowerCase().startsWith(h));
  }

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (isRule(trimmed) || isHeroBlock(trimmed)) continue;
    if (isDisclaimer(trimmed) || isNote(trimmed)) { saveSection(); mode = "skip"; continue; }
    if (mode === "skip") continue;

    // Lead form section
    if (isLeadForm(trimmed)) { saveSection(); mode = "lead-form"; continue; }
    if (mode === "lead-form") {
      if (trimmed && isKnownHeader(trimmed)) {
        mode = "section"; sectionHeadline = trimmed; sectionContent = []; continue;
      }
      leadFormLines.push(lines[i]); continue;
    }

    // Meta section
    if (trimmed.toLowerCase().startsWith("meta title:") || trimmed.toLowerCase().startsWith("meta description:")) {
      saveSection(); metaLines.push(lines[i]); mode = "meta"; continue;
    }
    if (mode === "meta") { if (trimmed) metaLines.push(lines[i]); continue; }

    // FAQ section
    if (isFaq(trimmed)) {
      saveSection();
      const faqLines: string[] = [];
      i++;
      while (i < lines.length) {
        const fl = lines[i].trim();
        if (isRule(fl) || isDisclaimer(fl) || isNote(fl) || fl.toLowerCase().startsWith("meta title:")) { i--; break; }
        // Check for a new major heading that isn't a question
        if (fl && !fl.endsWith("?") && isKnownHeader(fl)) { i--; break; }
        faqLines.push(lines[i]);
        i++;
      }
      faqs = parseFaqSection(faqLines);
      mode = "section"; continue;
    }

    // Midpage CTA
    if (isMidCta(trimmed)) {
      saveSection();
      ctaHeadline = trimmed.replace(/^midpage\s+cta:\s*/i, "");
      ctaContent = [];
      mode = "cta"; continue;
    }
    if (mode === "cta") {
      const btn = trimmed.match(/^\[(.+)\]$/);
      if (btn) {
        sections.push({ type: "mid-page-cta", headline: ctaHeadline, content: textToHtml(ctaContent.join("\n")), variant: "gold", cta_text: btn[1] });
        mode = "section"; sectionHeadline = ""; sectionContent = []; continue;
      }
      if (trimmed) ctaContent.push(trimmed);
      continue;
    }

    // ToC — skip
    if (isToc(trimmed)) {
      i++;
      while (i < lines.length && (lines[i].trim().match(/^\d+\./) || !lines[i].trim())) i++;
      i--; continue;
    }

    // Hero
    if (mode === "hero") {
      if (!trimmed) continue;
      title = trimmed; mode = "intro"; continue;
    }

    // Intro
    if (mode === "intro") {
      if (isKnownHeader(trimmed)) {
        if (introLines.length > 0) heroSubheadline = `<h3>${introLines[0]}</h3>`;
        mode = "section"; sectionHeadline = trimmed; sectionContent = []; continue;
      }
      if (trimmed) introLines.push(trimmed);
      continue;
    }

    // Section
    if (mode === "section") {
      if (isKnownHeader(trimmed) && trimmed !== sectionHeadline && sectionHeadline) {
        saveSection();
        sectionHeadline = trimmed; sectionContent = []; continue;
      }
      if (!sectionHeadline && trimmed) { sectionHeadline = trimmed; continue; }
      if (trimmed) sectionContent.push(trimmed);
    }
  }

  saveSection();

  const leadForm = parseLeadFormSection(leadFormLines);
  const meta = parseMetaSection(metaLines);

  const introContent = introLines.length > 1 ? textToHtml(introLines.slice(1).join("\n")) : "";

  return { title, heroSubheadline, introContent, sections, faqs, leadForm, meta };
}

// ─── Case Creator ───

async function createCaseFromDoc(docUrl: string) {
  const rawText = await fetchGoogleDoc(docUrl);
  const { title, heroSubheadline, introContent, sections, faqs, leadForm, meta } = parseDocument(rawText);

  if (!title) throw new Error("Could not find a title in the document");

  const slug = meta.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Check for existing slug
  const { data: existing } = await supabase.from("cases").select("id").eq("slug", slug).maybeSingle();
  if (existing) throw new Error(`A case with slug "${slug}" already exists`);

  // Create lead form
  const formId = randomUUID();
  const { error: formErr } = await supabase.from("lead_forms").insert({
    id: formId,
    name: leadForm.name || `${title} - Lead Form`,
    fields: leadForm.fields,
    cta_text: leadForm.cta_text || "Get Your Free Case Review",
    post_submit: "thank-you",
    intake_questions: [],
    intake_position: "after",
  });
  if (formErr) throw new Error(`Failed to create lead form: ${formErr.message}`);

  // Create case
  const caseId = randomUUID();
  const { error: caseErr } = await supabase.from("cases").insert({
    id: caseId,
    title,
    slug,
    case_type: meta.case_type || "mass-tort",
    category: meta.category || "Uncategorized",
    status: "draft",
    page_type: "content",
    phone_number: "1-800-555-0123",
    display_number: "1-800-555-0123",
    seo_title: meta.seo_title || `${title} | Help Law Group`,
    seo_description: meta.seo_description || "",
    seo_focus_keyword: meta.seo_focus_keyword || "",
    seo_secondary_keywords: meta.seo_secondary_keywords || "",
    hero_eyebrow: `Fighting for Survivors`,
    hero_headline: title,
    hero_subheadline: heroSubheadline || `<h3>Help Law Group advocates for survivors affected by this case.</h3>`,
    hero_background_image: "",
    final_cta_headline: "Take the First Step Toward Justice",
    final_cta_button: "Request a Confidential Case Review",
    final_cta_background_image: "",
  });
  if (caseErr) {
    await supabase.from("lead_forms").delete().eq("id", formId);
    throw new Error(`Failed to create case: ${caseErr.message}`);
  }

  // Build sections
  const sectionsToInsert: any[] = [];
  let sortOrder = 0;
  let anchorCounter = 1;

  // Hero
  sectionsToInsert.push({
    case_id: caseId,
    section_type: "hero-with-form",
    sort_order: sortOrder++,
    visible: true,
    content: {
      eyebrow: "Fighting for Survivors",
      headline: title,
      subheadline: heroSubheadline,
      content: "",
      backgroundImage: "",
      leadFormId: formId,
      anchorId: "",
      textAlign: "",
    },
  });

  // Intro narrative
  if (introContent) {
    sectionsToInsert.push({
      case_id: caseId,
      section_type: "narrative",
      sort_order: sortOrder++,
      visible: true,
      content: { eyebrow: "", headline: "", content: introContent, variant: "", anchorId: "", textAlign: "" },
    });
  }

  // Auto-generate ToC from headlined sections
  const headlinedSections = sections.filter(
    (s) => s.headline && s.type !== "mid-page-cta"
  );
  if (headlinedSections.length >= 3) {
    const tocLines = headlinedSections.map((s, i) => `${s.headline} | ${i + 1}`);
    if (faqs.length > 0) tocLines.push(`Frequently Asked Questions | ${headlinedSections.length + 1}`);

    sectionsToInsert.push({
      case_id: caseId,
      section_type: "table-of-contents",
      sort_order: sortOrder++,
      visible: true,
      content: { headline: "Table of Contents", items: tocLines.join("\n"), variant: "", anchorId: "", textAlign: "" },
    });
  }

  // Content sections
  for (const section of sections) {
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
        section_type: section.type,
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

  // FAQ section
  if (faqs.length > 0) {
    sectionsToInsert.push({
      case_id: caseId,
      section_type: "faq-section",
      sort_order: sortOrder++,
      visible: true,
      content: { headline: "Frequently Asked Questions", variant: "", anchorId: String(anchorCounter++), textAlign: "" },
    });
  }

  // Final CTA
  sectionsToInsert.push({
    case_id: caseId,
    section_type: "final-cta-band",
    sort_order: sortOrder++,
    visible: true,
    content: {
      headline: "Take the First Step Toward Justice",
      content: "<p>Contact Help Law Group today to request a confidential case review.</p>",
      ctaText: "Request a Confidential Case Review",
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
  if (faqs.length > 0) {
    const { error: faqErr } = await supabase.from("case_faqs").insert(
      faqs.map((faq, i) => ({ case_id: caseId, question: faq.question, answer: faq.answer, sort_order: i }))
    );
    if (faqErr) console.error("FAQ insert error:", faqErr.message);
  }

  return {
    caseId,
    slug,
    formId,
    title,
    sectionCount: sectionsToInsert.length,
    faqCount: faqs.length,
    formFieldCount: leadForm.fields.length,
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
      message: `Case "${result.title}" created as draft. Set to active in Lovable CMS to publish.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
