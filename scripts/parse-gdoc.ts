/**
 * Google Doc → Case JSON Parser
 *
 * Fetches a Google Doc (must be publicly shared) and converts it into
 * the JSON format expected by create-case-page.ts.
 *
 * Features:
 * - Auto-detects LEAD FORM: section for custom form fields
 * - Parses headings into narrative sections
 * - Detects FAQ sections
 * - Extracts SEO metadata from META: section
 * - Detects Midpage CTA blocks
 *
 * Usage:
 *   npx tsx scripts/parse-gdoc.ts "https://docs.google.com/document/d/..." [output.json]
 *
 * If no output path is given, prints to stdout.
 *
 * Google Doc Format:
 *   - First H1 or bold line = page title
 *   - H2 headings = section breaks
 *   - "LEAD FORM:" section = custom form field definitions
 *   - "META:" section = SEO metadata
 *   - "FAQ" heading = FAQ section with Q/A pairs
 *   - "Midpage CTA:" prefix = mid-page call-to-action block
 */

import * as fs from "fs";
import * as path from "path";

// ─── Lead Form Parser ───

interface FormField {
  key: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

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

    // Check for form name
    const nameMatch = trimmed.match(/^(?:form\s+)?name:\s*(.+)/i);
    if (nameMatch) {
      name = nameMatch[1].trim();
      continue;
    }

    // Check for CTA text
    const ctaMatch = trimmed.match(/^(?:cta|button)(?:\s+text)?:\s*(.+)/i);
    if (ctaMatch) {
      ctaText = ctaMatch[1].trim();
      continue;
    }

    // Parse field line: "- Label (type, required)" or "- Label (select: Option1, Option2)"
    const fieldMatch = trimmed.match(
      /^[-•*]\s*(.+?)(?:\s*\(([^)]+)\))?\s*$/
    );
    if (!fieldMatch) continue;

    const label = fieldMatch[1].trim();
    const parens = fieldMatch[2]?.trim() || "";

    // Determine field type and options
    let type = "text";
    let required = false;
    let options: { value: string; label: string }[] | undefined;

    if (parens) {
      const parts = parens.split(",").map((p) => p.trim().toLowerCase());

      // Check for required
      if (parts.includes("required")) {
        required = true;
      }

      // Check for type
      const typeKeywords = ["text", "email", "phone", "tel", "textarea", "select"];
      for (const part of parts) {
        // Handle "select: Option1, Option2, Option3"
        const selectMatch = parens.match(/select:\s*(.+)/i);
        if (selectMatch) {
          type = "select";
          options = selectMatch[1].split(",").map((opt) => {
            const trimOpt = opt.trim();
            return {
              value: trimOpt
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""),
              label: trimOpt,
            };
          });
          break;
        }

        if (typeKeywords.includes(part)) {
          type = part === "phone" ? "tel" : part;
        }
      }
    }

    // Auto-detect type from label
    if (type === "text") {
      const lowerLabel = label.toLowerCase();
      if (lowerLabel.includes("email")) type = "email";
      else if (lowerLabel.includes("phone")) type = "tel";
      else if (
        lowerLabel.includes("describe") ||
        lowerLabel.includes("details") ||
        lowerLabel.includes("anything else") ||
        lowerLabel.includes("tell us")
      )
        type = "textarea";
    }

    // Generate key from label
    const key = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .replace(/_+/g, "_");

    // Map common labels to standard keys
    const keyMap: Record<string, string> = {
      full_name: "fullName",
      name: "fullName",
      your_name: "fullName",
      email: "email",
      email_address: "email",
      phone: "phone",
      phone_number: "phone",
      state: "state",
    };

    fields.push({
      key: keyMap[key] || key,
      type,
      label,
      required,
      ...(options ? { options } : {}),
    });
  }

  // If no fields defined, use defaults
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

interface MetaInfo {
  seo_title?: string;
  seo_description?: string;
  seo_focus_keyword?: string;
  seo_secondary_keywords?: string;
  case_type?: string;
  category?: string;
  slug?: string;
}

function parseMetaSection(lines: string[]): MetaInfo {
  const meta: MetaInfo = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^(.+?):\s*(.+)$/);
    if (!match) continue;

    const key = match[1].trim().toLowerCase().replace(/\s+/g, "_");
    const value = match[2].trim();

    switch (key) {
      case "meta_title":
      case "seo_title":
      case "title_tag":
        meta.seo_title = value;
        break;
      case "meta_description":
      case "seo_description":
        meta.seo_description = value;
        break;
      case "focus_keyword":
      case "seo_focus_keyword":
      case "primary_keyword":
        meta.seo_focus_keyword = value;
        break;
      case "secondary_keywords":
      case "seo_secondary_keywords":
        meta.seo_secondary_keywords = value;
        break;
      case "case_type":
      case "type":
        meta.case_type = value;
        break;
      case "category":
        meta.category = value;
        break;
      case "slug":
        meta.slug = value;
        break;
    }
  }
  return meta;
}

// ─── FAQ Parser ───

interface FAQ {
  question: string;
  answer: string;
}

function parseFaqSection(lines: string[]): FAQ[] {
  const faqs: FAQ[] = [];
  let currentQuestion: string | null = null;
  let currentAnswer: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines between FAQs
    if (!trimmed) {
      if (currentQuestion && currentAnswer.length > 0) {
        faqs.push({
          question: currentQuestion,
          answer: currentAnswer.join("\n"),
        });
        currentQuestion = null;
        currentAnswer = [];
      }
      continue;
    }

    // Question detection: ends with ? or is bold or is significantly shorter than answer text
    if (
      trimmed.endsWith("?") &&
      (!currentQuestion || currentAnswer.length > 0)
    ) {
      // Save previous FAQ if exists
      if (currentQuestion && currentAnswer.length > 0) {
        faqs.push({
          question: currentQuestion,
          answer: currentAnswer.join("\n"),
        });
      }
      currentQuestion = trimmed;
      currentAnswer = [];
    } else if (currentQuestion) {
      currentAnswer.push(trimmed);
    }
  }

  // Don't forget the last FAQ
  if (currentQuestion && currentAnswer.length > 0) {
    faqs.push({
      question: currentQuestion,
      answer: currentAnswer.join("\n"),
    });
  }

  return faqs;
}

// ─── Section Parser ───

interface ParsedSection {
  type: string;
  headline: string;
  content: string;
  variant: string;
  anchor_id?: string;
  cta_text?: string;
}

function textToHtml(text: string): string {
  // Convert plain text paragraphs to HTML
  const lines = text.split("\n");
  const htmlParts: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect list items
    const listMatch = trimmed.match(/^[-•*]\s+(.+)$/);
    if (listMatch) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(listMatch[1]);
      continue;
    }

    // Close list if we were in one
    if (inList) {
      htmlParts.push(
        "<ul>" + listItems.map((li) => `<li><p>${li}</p></li>`).join("") + "</ul>"
      );
      inList = false;
      listItems = [];
    }

    if (!trimmed) continue;

    // Detect H3 subheadings (lines that look like date headers or sub-sections)
    // Pattern: starts with a year, or is short and followed by longer content
    const h3Match = trimmed.match(
      /^(\d{4}(?:\s*[–—-]\s*\d{4})?(?:\s*[–—-]\s*.+)?)\s*$/
    );
    if (h3Match) {
      htmlParts.push(`<h3>${h3Match[1]}</h3>`);
      continue;
    }

    // Regular paragraph
    htmlParts.push(`<p>${trimmed}</p>`);
  }

  // Close any remaining list
  if (inList) {
    htmlParts.push(
      "<ul>" + listItems.map((li) => `<li><p>${li}</p></li>`).join("") + "</ul>"
    );
  }

  return htmlParts.join("");
}

// ─── Main Parser ───

function parseGoogleDoc(rawText: string): any {
  const lines = rawText.split("\n");

  // State
  let title = "";
  let heroEyebrow = "";
  let heroSubheadline = "";
  let introContent: string[] = [];
  let sections: ParsedSection[] = [];
  let faqs: FAQ[] = [];
  let leadFormLines: string[] = [];
  let metaLines: string[] = [];
  let finalCtaHeadline = "";
  let finalCtaContent = "";

  // Parsing state
  let currentMode:
    | "hero"
    | "intro"
    | "section"
    | "faq"
    | "lead-form"
    | "meta"
    | "cta"
    | "note"
    | "final-cta" = "hero";
  let currentSectionHeadline = "";
  let currentSectionContent: string[] = [];
  let currentCtaHeadline = "";
  let currentCtaContent: string[] = [];
  let sectionIndex = 0;
  let darkToggle = true; // alternates dark/light for sections

  // Special section markers
  const isHorizontalRule = (line: string) =>
    /^[_─━═]{3,}$/.test(line.trim()) || line.trim() === "---";
  const isTocHeader = (line: string) =>
    /^table\s+of\s+contents$/i.test(line.trim());
  const isFaqHeader = (line: string) =>
    /^frequently\s+asked\s+questions/i.test(line.trim());
  const isLeadFormHeader = (line: string) =>
    /^lead\s+form:/i.test(line.trim());
  const isMetaHeader = (line: string) =>
    /^meta(?:\s+title)?:/i.test(line.trim()) && !line.includes("Meta Description");
  const isMidpageCta = (line: string) =>
    /^midpage\s+cta:/i.test(line.trim());
  const isNoteSection = (line: string) =>
    /^note:/i.test(line.trim());
  const isAttorneyAdvertising = (line: string) =>
    /^attorney\s+advertising/i.test(line.trim());
  const isHeroBlock = (line: string) =>
    /^hero\s+with\s+form/i.test(line.trim());

  // Find the meta section at the bottom first
  let metaSectionStart = -1;
  let leadFormSectionStart = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.toLowerCase().startsWith("meta title:") || line.toLowerCase().startsWith("meta description:")) {
      // Found inline meta - scan backwards to find start
      metaSectionStart = i;
      // Look for more meta lines above
      while (metaSectionStart > 0 && lines[metaSectionStart - 1].trim().match(/^(meta|seo|focus|secondary|slug|category|case)/i)) {
        metaSectionStart--;
      }
      break;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines in hero mode
    if (currentMode === "hero" && !trimmed) continue;

    // Skip horizontal rules
    if (isHorizontalRule(trimmed)) continue;

    // Skip hero block marker
    if (isHeroBlock(trimmed)) continue;

    // Skip attorney advertising / disclaimers at the bottom
    if (isAttorneyAdvertising(trimmed)) {
      currentMode = "note";
      continue;
    }

    // Skip NOTE sections
    if (isNoteSection(trimmed)) {
      currentMode = "note";
      continue;
    }
    if (currentMode === "note") continue;

    // Detect LEAD FORM section
    if (isLeadFormHeader(trimmed)) {
      // Save current section if any
      if (currentMode === "section" && currentSectionHeadline) {
        sections.push({
          type: "narrative",
          headline: currentSectionHeadline,
          content: textToHtml(currentSectionContent.join("\n")),
          variant: darkToggle ? "dark" : "",
        });
        darkToggle = !darkToggle;
      }
      currentMode = "lead-form";
      continue;
    }
    if (currentMode === "lead-form") {
      // Lead form section ends at next H2-level heading or horizontal rule or empty section
      if (trimmed && (trimmed.startsWith("#") || /^[A-Z][A-Za-z\s]+:$/.test(trimmed))) {
        // This might be a new section - check if it's a known header
        if (!trimmed.match(/^(cta|button|form\s+name)/i)) {
          currentMode = "section";
          currentSectionHeadline = trimmed.replace(/^#+\s*/, "");
          currentSectionContent = [];
          continue;
        }
      }
      leadFormLines.push(line);
      continue;
    }

    // Detect META section (usually at bottom)
    if (trimmed.toLowerCase().startsWith("meta title:")) {
      // Save current section
      if (currentMode === "section" && currentSectionHeadline) {
        sections.push({
          type: "narrative",
          headline: currentSectionHeadline,
          content: textToHtml(currentSectionContent.join("\n")),
          variant: darkToggle ? "dark" : "",
        });
        darkToggle = !darkToggle;
      }
      metaLines.push(line);
      currentMode = "meta";
      continue;
    }
    if (currentMode === "meta") {
      if (trimmed) metaLines.push(line);
      continue;
    }

    // Detect FAQ section
    if (isFaqHeader(trimmed)) {
      // Save current section
      if (currentMode === "section" && currentSectionHeadline) {
        sections.push({
          type: "narrative",
          headline: currentSectionHeadline,
          content: textToHtml(currentSectionContent.join("\n")),
          variant: darkToggle ? "dark" : "",
        });
        darkToggle = !darkToggle;
      }
      // Collect all remaining lines until next major section
      const faqLines: string[] = [];
      i++;
      while (i < lines.length) {
        const faqLine = lines[i].trim();
        if (isHorizontalRule(faqLine) || isAttorneyAdvertising(faqLine) || isNoteSection(faqLine) || faqLine.toLowerCase().startsWith("meta title:")) {
          i--;
          break;
        }
        // Check if this is a new major heading (not a FAQ question)
        if (faqLine && !faqLine.endsWith("?") && faqLines.length > 0) {
          const nextNonEmpty = lines.slice(i + 1).find(l => l.trim());
          if (nextNonEmpty && !nextNonEmpty.trim().endsWith("?") && faqLine.length < 80) {
            // Might be a new section heading - check if the next line after looks like content
            // Keep going for now, it might be an answer
          }
        }
        faqLines.push(lines[i]);
        i++;
      }
      faqs = parseFaqSection(faqLines);
      currentMode = "section";
      currentSectionHeadline = "";
      currentSectionContent = [];
      continue;
    }

    // Detect Midpage CTA
    if (isMidpageCta(trimmed)) {
      // Save current section
      if (currentMode === "section" && currentSectionHeadline) {
        sections.push({
          type: "narrative",
          headline: currentSectionHeadline,
          content: textToHtml(currentSectionContent.join("\n")),
          variant: darkToggle ? "dark" : "",
        });
        darkToggle = !darkToggle;
      }
      currentCtaHeadline = trimmed.replace(/^midpage\s+cta:\s*/i, "");
      currentCtaContent = [];
      currentMode = "cta";
      continue;
    }
    if (currentMode === "cta") {
      // CTA ends at [Button Text] or next heading
      const buttonMatch = trimmed.match(/^\[(.+)\]$/);
      if (buttonMatch) {
        sections.push({
          type: "mid-page-cta",
          headline: currentCtaHeadline,
          content: textToHtml(currentCtaContent.join("\n")),
          variant: "gold",
          cta_text: buttonMatch[1],
        });
        currentMode = "section";
        currentSectionHeadline = "";
        currentSectionContent = [];
        continue;
      }
      if (trimmed) currentCtaContent.push(trimmed);
      continue;
    }

    // Skip Table of Contents section
    if (isTocHeader(trimmed)) {
      // Skip until next horizontal rule or heading
      i++;
      while (i < lines.length) {
        if (isHorizontalRule(lines[i].trim()) || (!lines[i].trim().match(/^\d+\./) && lines[i].trim().length > 0 && !lines[i].trim().match(/^\s/))) {
          // Check if this is a numbered list item
          if (!lines[i].trim().match(/^\d+\./)) {
            i--;
            break;
          }
        }
        i++;
      }
      continue;
    }

    // Hero mode: first real content is the title
    if (currentMode === "hero") {
      if (!title) {
        title = trimmed;
        currentMode = "intro";
        continue;
      }
    }

    // Intro mode: content before first H2 heading
    if (currentMode === "intro") {
      // Check if this looks like a section heading (starts new section)
      // A heading is typically: short line, followed by longer content
      if (
        trimmed &&
        !trimmed.startsWith("-") &&
        !trimmed.startsWith("•") &&
        !trimmed.startsWith("*") &&
        trimmed.length < 100 &&
        trimmed === trimmed.replace(/<[^>]*>/g, "") && // no HTML
        i + 1 < lines.length
      ) {
        // Look ahead - if next non-empty line is long content, this might be a heading
        let nextContent = "";
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          if (lines[j].trim()) {
            nextContent = lines[j].trim();
            break;
          }
        }

        // Known section headers from the doc pattern
        const knownHeaders = [
          "what you need to know",
          "how widespread",
          "how did this happen",
          "which juvenile",
          "who was responsible",
          "what happened to",
          "why didn't anyone",
          "in the news",
          "what are your legal",
          "how help law",
          "do you have a case",
          "who is",
          "when did",
          "what were the results",
          "how does",
          "did the hospitals",
          "what compensation",
        ];

        const isKnownHeader = knownHeaders.some((h) =>
          trimmed.toLowerCase().startsWith(h)
        );

        if (isKnownHeader) {
          // Save intro as hero subheadline
          if (introContent.length > 0 && !heroSubheadline) {
            heroSubheadline = `<h3>${introContent[0]}</h3>`;
          }
          currentMode = "section";
          currentSectionHeadline = trimmed;
          currentSectionContent = [];
          continue;
        }
      }

      if (trimmed) introContent.push(trimmed);
      continue;
    }

    // Section mode
    if (currentMode === "section") {
      // Check if this is a new section heading
      const knownHeaders = [
        "what you need to know",
        "what you should know",
        "how widespread",
        "how did this happen",
        "which juvenile",
        "who was responsible",
        "what happened to",
        "why didn't anyone",
        "in the news",
        "what are your legal",
        "how help law",
        "do you have a case",
        "who is",
        "when did",
        "what were the results",
        "how does",
        "did the hospitals",
        "what compensation",
        "nyc juvenile detention abuse lawsuits in the news",
      ];

      const isNewHeading = knownHeaders.some((h) =>
        trimmed.toLowerCase().startsWith(h)
      );

      if (
        isNewHeading &&
        trimmed !== currentSectionHeadline &&
        currentSectionHeadline
      ) {
        // Save previous section
        sections.push({
          type: "narrative",
          headline: currentSectionHeadline,
          content: textToHtml(currentSectionContent.join("\n")),
          variant: darkToggle ? "dark" : "",
        });
        darkToggle = !darkToggle;

        currentSectionHeadline = trimmed;
        currentSectionContent = [];
        continue;
      }

      if (!currentSectionHeadline && trimmed) {
        currentSectionHeadline = trimmed;
        continue;
      }

      if (trimmed) currentSectionContent.push(trimmed);
    }
  }

  // Save last section
  if (currentMode === "section" && currentSectionHeadline && currentSectionContent.length > 0) {
    sections.push({
      type: "narrative",
      headline: currentSectionHeadline,
      content: textToHtml(currentSectionContent.join("\n")),
      variant: darkToggle ? "dark" : "",
    });
  }

  // Parse lead form
  const leadForm = parseLeadFormSection(leadFormLines);

  // Parse meta
  const meta = parseMetaSection(metaLines);

  // Build intro narrative section
  const introSection = introContent.length > 1
    ? {
        type: "narrative" as const,
        headline: "",
        content: textToHtml(introContent.slice(1).join("\n")),
        variant: "",
      }
    : null;

  // Build output JSON
  const output: any = {
    title,
    slug: meta.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    case_type: meta.case_type || "mass-tort",
    category: meta.category || "Uncategorized",
    page_type: "content",
    phone_number: "1-800-555-0123",
    display_number: "1-800-555-0123",
    seo_title: meta.seo_title || `${title} | Help Law Group`,
    seo_description: meta.seo_description || "",
    seo_focus_keyword: meta.seo_focus_keyword || "",
    seo_secondary_keywords: meta.seo_secondary_keywords || "",
    hero_eyebrow: heroEyebrow || `Fighting for Survivors`,
    hero_headline: title,
    hero_subheadline: heroSubheadline || `<h3>Help Law Group advocates for survivors affected by ${title.toLowerCase()}.</h3>`,
    hero_background_image: "",
    final_cta_headline: "Take the First Step Toward Justice",
    final_cta_button: "Request a Confidential Case Review",
    final_cta_background_image: "",
    lead_form: {
      name: leadForm.name || `${title} - Lead Form`,
      cta_text: leadForm.cta_text || "Get Your Free Case Review",
      fields: leadForm.fields,
    },
    sections: [
      ...(introSection ? [introSection] : []),
      ...sections.map((s) => ({
        type: s.type,
        headline: s.headline,
        content: s.content,
        variant: s.variant,
        ...(s.cta_text ? { cta_text: s.cta_text } : {}),
      })),
    ],
    faqs,
  };

  return output;
}

// ─── Fetch Google Doc ───

async function fetchGoogleDoc(url: string): Promise<string> {
  // Extract doc ID from URL
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) {
    throw new Error("Could not extract document ID from URL");
  }
  const docId = match[1];

  // Fetch as plain text export
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  console.log(`📄 Fetching Google Doc: ${docId}`);

  const response = await fetch(exportUrl, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch document (${response.status}). Make sure it's shared as "Anyone with the link can view".`
    );
  }

  return response.text();
}

// ─── CLI ───

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage:");
    console.log('  npx tsx scripts/parse-gdoc.ts "https://docs.google.com/document/d/..." [output.json]');
    console.log("");
    console.log("If no output path is given, prints JSON to stdout.");
    console.log("");
    console.log("You can also pipe a local text file:");
    console.log("  npx tsx scripts/parse-gdoc.ts --file ./my-doc.txt [output.json]");
    process.exit(1);
  }

  let rawText: string;

  if (args[0] === "--file") {
    const filePath = path.resolve(args[1]);
    rawText = fs.readFileSync(filePath, "utf-8");
  } else {
    rawText = await fetchGoogleDoc(args[0]);
  }

  console.log(`📝 Parsing document (${rawText.length} chars)...`);
  const output = parseGoogleDoc(rawText);

  const outputPath = args[args.length - 1];
  if (outputPath && outputPath.endsWith(".json")) {
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`✅ Written to ${outputPath}`);
    console.log(`   Title: ${output.title}`);
    console.log(`   Sections: ${output.sections.length}`);
    console.log(`   FAQs: ${output.faqs.length}`);
    console.log(`   Lead form fields: ${output.lead_form.fields.length}`);
    console.log("");
    console.log(`Next step: npx tsx scripts/create-case-page.ts ${outputPath}`);
  } else {
    console.log(JSON.stringify(output, null, 2));
  }
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
