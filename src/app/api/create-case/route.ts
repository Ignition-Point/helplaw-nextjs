import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sharp from "sharp";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Anon client for general inserts (cases, sections, etc.)
const supabase = createClient(
  SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Service role client for storage uploads (bypasses RLS)
const supabaseAdmin = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

interface QCWarning {
  field: string;
  severity: "error" | "warning";
  message: string;
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
  qcWarnings: QCWarning[];
}

// ─── Allowed categories (must match CaseGrid FILTER_CATEGORIES) ───

const ALLOWED_CATEGORIES = [
  "Clergy and Religious Institution Abuse",
  "Medical Abuse",
  "Online Platform Harm",
  "Social Media Addiction",
  "Sexual Abuse and Institutional Harm",
  "Juvenile Detention Abuse",
  "Foster Care Abuse",
  "Rideshare Assault",
  "Unsafe Products",
];

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

// Detect instructional/brief blocks that should NOT become page content
function isInstructionalBlock(firstLine: string, blockText: string): boolean {
  const fl = firstLine.toLowerCase();

  // Heading-level detection: block starts with a known instructional heading
  const instructionalHeadings = [
    /^seo\s+keyword\s+report/i,
    /^seo\s+report/i,
    /^keyword\s+report/i,
    /^content\s+brief/i,
    /^writing\s+(notes|instructions|brief)/i,
    /^editorial\s+(notes|brief|instructions)/i,
    /^internal\s+notes/i,
    /^notes\s+for\s+(writer|editor|content)/i,
    /^page\s+brief/i,
    /^content\s+strategy/i,
    /^seo\s+strategy/i,
    /^seo\s+notes/i,
    /^keyword\s+strategy/i,
    /^keyword\s+placement/i,
    /^on-?page\s+seo/i,
  ];
  if (instructionalHeadings.some((re) => re.test(firstLine))) return true;

  // Content-level detection: block contains multiple instructional phrases
  const instructionalPhrases = [
    /primary\s+keyword/i,
    /secondary\s+keywords?/i,
    /used\s+in\s+the\s+h[1-6]/i,
    /woven\s+into/i,
    /used\s+in\s+the\s+(title|heading|section|body|faq)/i,
    /keyword\s+density/i,
    /content\s+outline/i,
    /word\s+count\s*:/i,
    /target\s+audience/i,
    /search\s+intent/i,
    /competitor\s+analysis/i,
    /meta\s+title\s*:/i,
    /appears\s+in\s+(body|content|section)/i,
  ];
  const phraseMatches = instructionalPhrases.filter((re) => re.test(blockText)).length;
  if (phraseMatches >= 2) return true;

  return false;
}

function extractField(line: string, prefix: string): string | null {
  const cleaned = clean(line);
  // Match "Field Name:" or "Field Name (anything):" — the parenthetical is part of the label, not the value
  const regex = new RegExp(`^${prefix}\\s*(?:\\([^)]*\\))?\\s*:\\s*(.+)`, "i");
  const m = cleaned.match(regex);
  if (!m) return null;
  let val = m[1].trim();
  // Strip trailing character counts like "(60 characters)", "(148 characters)", "60 characters"
  val = val.replace(/\s*\(?\d+\s+characters?\)?\s*$/i, "").trim();
  // Strip leading/trailing quotes that sometimes appear in docs
  val = val.replace(/^["']+|["']+$/g, "").trim();
  return val;
}

// Fuzzy-match a category string to the closest allowed category
function matchCategory(input: string): string {
  if (!input || input === "Uncategorized") return "Uncategorized";

  // Exact match (case-insensitive)
  const exact = ALLOWED_CATEGORIES.find(
    (c) => c.toLowerCase() === input.toLowerCase()
  );
  if (exact) return exact;

  // Partial match: input contains the category name or vice versa
  const inputLower = input.toLowerCase();
  const partial = ALLOWED_CATEGORIES.find(
    (c) => inputLower.includes(c.toLowerCase()) || c.toLowerCase().includes(inputLower)
  );
  if (partial) return partial;

  // Keyword match
  const keywordMap: [RegExp, string][] = [
    [/clergy|church|diocese|religious/i, "Clergy and Religious Institution Abuse"],
    [/medical|doctor|dr\.|hospital|physician|nurse/i, "Medical Abuse"],
    [/online\s*platform/i, "Online Platform Harm"],
    [/social\s*media/i, "Social Media Addiction"],
    [/juvenile|detention|youth\s*facility|youth\s*center|juvenile\s*hall/i, "Juvenile Detention Abuse"],
    [/foster\s*care/i, "Foster Care Abuse"],
    [/rideshare|uber|lyft/i, "Rideshare Assault"],
    [/unsafe\s*product|product\s*liability|defective/i, "Unsafe Products"],
    [/sexual\s*abuse|sexual\s*assault|institutional\s*harm|survivor/i, "Sexual Abuse and Institutional Harm"],
  ];

  for (const [regex, category] of keywordMap) {
    if (regex.test(input)) return category;
  }

  return "Uncategorized";
}

// Strip HTML tags from text (for plain-text contexts like card descriptions)
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

// ─── Image Optimization ───

const IMAGE_MAX_WIDTH = 1920;
const IMAGE_MAX_FILE_SIZE = 500 * 1024; // 500KB threshold to trigger optimization
const IMAGE_WEBP_QUALITY = 80;

interface ImageOptResult {
  url: string;
  optimized: boolean;
  originalSize: number;
  finalSize: number;
  originalDimensions: { width: number; height: number } | null;
  finalDimensions: { width: number; height: number } | null;
  error?: string;
}

async function fetchAndOptimizeImage(sourceUrl: string, slug: string): Promise<ImageOptResult> {
  const result: ImageOptResult = {
    url: sourceUrl,
    optimized: false,
    originalSize: 0,
    finalSize: 0,
    originalDimensions: null,
    finalDimensions: null,
  };

  try {
    // 1. Fetch the source image
    const response = await fetch(sourceUrl, { redirect: "follow" });
    if (!response.ok) {
      result.error = `Failed to fetch image (${response.status})`;
      return result;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    result.originalSize = buffer.length;

    // 2. Read metadata (dimensions)
    const metadata = await sharp(buffer).metadata();
    if (metadata.width && metadata.height) {
      result.originalDimensions = { width: metadata.width, height: metadata.height };
    }

    // 3. Decide if optimization is needed
    const needsResize = (metadata.width || 0) > IMAGE_MAX_WIDTH;
    const needsCompress = buffer.length > IMAGE_MAX_FILE_SIZE;
    const isAlreadyWebp = metadata.format === "webp";

    if (!needsResize && !needsCompress && isAlreadyWebp) {
      // Image is already small and optimized — upload as-is for hosting consistency
      result.finalSize = buffer.length;
      result.finalDimensions = result.originalDimensions;
    }

    // 4. Optimize with sharp
    let pipeline = sharp(buffer);

    if (needsResize) {
      pipeline = pipeline.resize(IMAGE_MAX_WIDTH, undefined, {
        withoutEnlargement: true,
        fit: "inside",
      });
    }

    const optimizedBuffer = await pipeline
      .webp({ quality: IMAGE_WEBP_QUALITY })
      .toBuffer();

    const optimizedMeta = await sharp(optimizedBuffer).metadata();
    result.finalSize = optimizedBuffer.length;
    result.finalDimensions = {
      width: optimizedMeta.width || metadata.width || 0,
      height: optimizedMeta.height || metadata.height || 0,
    };

    // 5. Upload to Supabase Storage
    const filename = `${slug}-hero-${Date.now()}.webp`;
    const { error: uploadErr } = await supabaseAdmin.storage
      .from("case-images")
      .upload(filename, optimizedBuffer, {
        contentType: "image/webp",
        cacheControl: "public, max-age=31536000, immutable",
        upsert: false,
      });

    if (uploadErr) {
      result.error = `Upload failed: ${uploadErr.message}`;
      return result;
    }

    // 6. Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("case-images")
      .getPublicUrl(filename);

    result.url = publicUrlData.publicUrl;
    result.optimized = true;

    return result;
  } catch (err: any) {
    result.error = `Image optimization failed: ${err.message}`;
    return result;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

// ─── QC Engine ───

// Category keyword signatures: what words we expect to appear in content for each category
const CATEGORY_CONTENT_SIGNALS: Record<string, RegExp[]> = {
  "Juvenile Detention Abuse": [/juvenile/i, /detention/i, /youth\s*(facility|center|hall)/i, /probation/i, /incarcerat/i],
  "Clergy and Religious Institution Abuse": [/clergy/i, /church/i, /priest/i, /diocese/i, /parish/i, /religious/i, /bishop/i, /archdiocese/i],
  "Medical Abuse": [/doctor/i, /physician/i, /hospital/i, /patient/i, /medical/i, /clinic/i, /OB-?GYN/i, /nurse/i],
  "Foster Care Abuse": [/foster/i, /placement/i, /child\s*welfare/i, /CPS/i, /DCFS/i, /group\s*home/i],
  "Rideshare Assault": [/uber/i, /lyft/i, /rideshare/i, /driver/i, /ride-?hail/i],
  "Social Media Addiction": [/social\s*media/i, /instagram/i, /tiktok/i, /facebook/i, /snapchat/i, /algorithm/i, /addiction/i],
  "Online Platform Harm": [/online\s*platform/i, /internet/i, /website/i, /app\b/i, /digital/i],
  "Sexual Abuse and Institutional Harm": [/sexual\s*(abuse|assault)/i, /survivor/i, /institutional/i, /molestation/i],
  "Unsafe Products": [/product/i, /defect/i, /recall/i, /manufacturer/i, /consumer/i, /injury/i, /toxic/i],
};

// Extract significant words from a string (for cross-field coherence checks)
function extractKeyTerms(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
    "by", "from", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
    "do", "does", "did", "will", "would", "could", "should", "may", "might", "can", "shall",
    "this", "that", "these", "those", "it", "its", "not", "no", "nor", "so", "if", "then",
    "than", "too", "very", "just", "about", "up", "out", "how", "what", "when", "where",
    "who", "which", "their", "our", "your", "my", "we", "you", "he", "she", "they",
    "help", "law", "group", "case", "review", "free", "legal", "lawsuit", "lawsuits",
    "attorney", "attorneys", "learn", "more", "find", "options", "contact",
  ]);
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

// Count how many of the given regexes match in the text
function countSignalMatches(text: string, signals: RegExp[]): number {
  return signals.filter((re) => re.test(text)).length;
}

interface QcInput {
  title: string;
  slug: string;
  eyebrow: string;
  subheadline: string;
  backgroundImage: string;
  sections: ParsedSection[];
  faqs: FAQ[];
  closingCta: { headline: string; content: string; cta_text: string } | null;
  seoTitle: string;
  seoDescription: string;
  seoFocusKeyword: string;
  seoSecondaryKeywords: string;
  category: string;
}

function runQcChecks(input: QcInput): QCWarning[] {
  const w: QCWarning[] = [];

  // Gather all body content as one string for semantic checks
  const allContentText = [
    input.subheadline,
    ...input.sections.map((s) => `${s.headline} ${stripHtml(s.content)}`),
    ...input.faqs.map((f) => `${f.question} ${f.answer}`),
    input.closingCta?.headline || "",
    input.closingCta?.content || "",
  ].join(" ");

  const allContentLower = allContentText.toLowerCase();

  // ════════════════════════════════════════
  // FORMAT CHECKS (garbage-in detection)
  // ════════════════════════════════════════

  // Character count contamination — check every metadata field
  const metaFields = [
    { name: "title", val: input.title },
    { name: "eyebrow", val: input.eyebrow },
    { name: "subheadline", val: input.subheadline },
    { name: "seo_title", val: input.seoTitle },
    { name: "seo_description", val: input.seoDescription },
    { name: "seo_focus_keyword", val: input.seoFocusKeyword },
    { name: "seo_secondary_keywords", val: input.seoSecondaryKeywords },
  ];
  for (const f of metaFields) {
    if (f.val && /\d+\s*characters?/i.test(f.val)) {
      w.push({ field: f.name, severity: "error", message: `Contains a character count hint: "${f.val}"` });
    }
    // Detect if the value is just a number (likely parsed a line number or count instead of content)
    if (f.val && /^\d+$/.test(f.val.trim())) {
      w.push({ field: f.name, severity: "error", message: `Value is just a number "${f.val}" — likely a parsing error` });
    }
  }

  // HTML tag contamination
  if (/<[^>]+>/.test(input.subheadline)) {
    w.push({ field: "subheadline", severity: "warning", message: "Contains HTML tags — will be auto-stripped" });
  }
  if (/<[^>]+>/.test(input.title)) {
    w.push({ field: "title", severity: "error", message: `Title contains HTML tags: "${input.title}"` });
  }

  // ════════════════════════════════════════
  // TITLE CHECKS
  // ════════════════════════════════════════

  if (!input.title) {
    w.push({ field: "title", severity: "error", message: "No title found in document" });
  } else {
    if (input.title.length > 80) {
      w.push({ field: "title", severity: "warning", message: `Title is ${input.title.length} chars (recommended: under 80)` });
    }
    if (input.title.length < 10) {
      w.push({ field: "title", severity: "error", message: `Title seems too short (${input.title.length} chars): "${input.title}"` });
    }
    // Title should contain a label prefix (likely parsed wrong)
    if (/^(title|headline|heading|name)\s*:/i.test(input.title)) {
      w.push({ field: "title", severity: "error", message: `Title starts with a field label: "${input.title}"` });
    }
    // Title should end with "Lawsuit" or "Lawsuits" for case pages
    if (!/lawsuit/i.test(input.title)) {
      w.push({ field: "title", severity: "warning", message: `Title doesn't contain "Lawsuit(s)" — expected for case pages: "${input.title}"` });
    }

    // Title-to-content coherence: key terms from title should appear in body
    const titleTerms = extractKeyTerms(input.title);
    const significantTitleTerms = titleTerms.filter(
      (t) => t.length > 3 && !["abuse", "sexual", "assault"].includes(t)
    );
    if (significantTitleTerms.length > 0) {
      const missingFromContent = significantTitleTerms.filter(
        (term) => !allContentLower.includes(term)
      );
      if (missingFromContent.length > significantTitleTerms.length * 0.5) {
        w.push({
          field: "title",
          severity: "error",
          message: `Title doesn't match content — key terms not found in body: "${missingFromContent.join('", "')}"`,
        });
      }
    }
  }

  // ════════════════════════════════════════
  // SUBHEADLINE CHECKS
  // ════════════════════════════════════════

  if (!input.subheadline) {
    w.push({ field: "subheadline", severity: "warning", message: "No subheadline found — will use default fallback" });
  } else {
    // Should reference Help Law Group or relate to the title
    const subPlain = stripHtml(input.subheadline).toLowerCase();
    if (!subPlain.includes("help law") && !subPlain.includes("attorney") && !subPlain.includes("advocate")) {
      w.push({ field: "subheadline", severity: "warning", message: "Subheadline doesn't mention Help Law Group or attorneys — may want to add brand context" });
    }
    // Should be 1-2 sentences, not a paragraph
    const sentenceCount = (input.subheadline.match(/[.!?]+/g) || []).length;
    if (sentenceCount > 3) {
      w.push({ field: "subheadline", severity: "warning", message: `Subheadline has ${sentenceCount} sentences — recommended: 1-2 for hero readability` });
    }
  }

  // ════════════════════════════════════════
  // EYEBROW CHECKS
  // ════════════════════════════════════════

  if (!input.eyebrow) {
    w.push({ field: "eyebrow", severity: "warning", message: "No eyebrow found — using default" });
  } else if (input.eyebrow.length > 80) {
    w.push({ field: "eyebrow", severity: "warning", message: `Eyebrow is ${input.eyebrow.length} chars — may be too long for the hero UI` });
  }

  // ════════════════════════════════════════
  // CATEGORY SEMANTIC CHECKS
  // ════════════════════════════════════════

  if (input.category && input.category !== "Uncategorized") {
    const signals = CATEGORY_CONTENT_SIGNALS[input.category];
    if (signals) {
      const matchCount = countSignalMatches(allContentText, signals);
      if (matchCount === 0) {
        w.push({
          field: "category",
          severity: "error",
          message: `Category "${input.category}" has zero keyword matches in the content — likely wrong category`,
        });
      } else if (matchCount === 1) {
        w.push({
          field: "category",
          severity: "warning",
          message: `Category "${input.category}" has only 1 keyword match in content — double-check it's correct`,
        });
      }
    }

    // Check if a different category is a stronger match
    let bestCategory = input.category;
    let bestScore = signals ? countSignalMatches(allContentText, signals) : 0;
    for (const [cat, sigs] of Object.entries(CATEGORY_CONTENT_SIGNALS)) {
      if (cat === input.category) continue;
      const score = countSignalMatches(allContentText, sigs);
      if (score > bestScore + 2) {
        bestCategory = cat;
        bestScore = score;
      }
    }
    if (bestCategory !== input.category) {
      w.push({
        field: "category",
        severity: "error",
        message: `Content matches "${bestCategory}" much better than "${input.category}" (${bestScore} vs ${signals ? countSignalMatches(allContentText, signals) : 0} keyword hits) — likely miscategorized`,
      });
    }
  } else {
    w.push({ field: "category", severity: "error", message: `Could not determine category. Add "Category: ..." to the doc. Allowed: ${ALLOWED_CATEGORIES.join(", ")}` });
  }

  // ════════════════════════════════════════
  // SEO CHECKS
  // ════════════════════════════════════════

  if (!input.seoTitle) {
    w.push({ field: "seo_title", severity: "warning", message: "No SEO title — using fallback" });
  } else {
    if (input.seoTitle.length > 70) {
      w.push({ field: "seo_title", severity: "warning", message: `SEO title is ${input.seoTitle.length} chars (recommended: under 70)` });
    }
    if (!/help\s*law/i.test(input.seoTitle)) {
      w.push({ field: "seo_title", severity: "warning", message: "SEO title doesn't contain 'Help Law' — brand name should be in the meta title" });
    }
  }

  if (!input.seoDescription) {
    w.push({ field: "seo_description", severity: "warning", message: "No meta description found" });
  } else {
    if (input.seoDescription.length > 160) {
      w.push({ field: "seo_description", severity: "warning", message: `Meta description is ${input.seoDescription.length} chars (recommended: under 160)` });
    }
    if (input.seoDescription.length < 50) {
      w.push({ field: "seo_description", severity: "warning", message: `Meta description is only ${input.seoDescription.length} chars — too short for search snippets (aim for 120-155)` });
    }
  }

  // Focus keyword should appear in title, SEO title, and content
  if (input.seoFocusKeyword) {
    const kw = input.seoFocusKeyword.toLowerCase();
    if (!input.title.toLowerCase().includes(kw)) {
      w.push({ field: "seo_focus_keyword", severity: "warning", message: `Focus keyword "${input.seoFocusKeyword}" not found in page title` });
    }
    if (input.seoTitle && !input.seoTitle.toLowerCase().includes(kw)) {
      w.push({ field: "seo_focus_keyword", severity: "warning", message: `Focus keyword "${input.seoFocusKeyword}" not found in SEO title` });
    }
    if (input.seoDescription && !input.seoDescription.toLowerCase().includes(kw)) {
      w.push({ field: "seo_focus_keyword", severity: "warning", message: `Focus keyword "${input.seoFocusKeyword}" not found in meta description` });
    }
    // Count keyword occurrences in body content
    const kwRegex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const kwCount = (allContentText.match(kwRegex) || []).length;
    if (kwCount === 0) {
      w.push({ field: "seo_focus_keyword", severity: "error", message: `Focus keyword "${input.seoFocusKeyword}" not found anywhere in body content` });
    } else if (kwCount < 3) {
      w.push({ field: "seo_focus_keyword", severity: "warning", message: `Focus keyword appears only ${kwCount} time(s) in body — aim for 3-8 for SEO` });
    }
  } else {
    w.push({ field: "seo_focus_keyword", severity: "warning", message: "No focus keyword found" });
  }

  // ════════════════════════════════════════
  // BACKGROUND IMAGE CHECKS
  // ════════════════════════════════════════

  if (!input.backgroundImage) {
    w.push({ field: "backgroundImage", severity: "warning", message: "No background image URL — hero will use default" });
  } else if (!input.backgroundImage.startsWith("http")) {
    w.push({ field: "backgroundImage", severity: "error", message: `Background image doesn't look like a URL: "${input.backgroundImage}"` });
  }

  // ════════════════════════════════════════
  // CONTENT STRUCTURE CHECKS
  // ════════════════════════════════════════

  if (input.sections.length === 0) {
    w.push({ field: "sections", severity: "error", message: "No content sections found — document may not have horizontal rule separators" });
  } else {
    // Check for expected section types
    const hasWYNTK = input.sections.some((s) => /what\s+you\s+need\s+to\s+know/i.test(s.headline));
    if (!hasWYNTK) {
      w.push({ field: "sections", severity: "warning", message: 'No "What You Need to Know" section found — recommended for all case pages' });
    }

    const hasMidCta = input.sections.some((s) => s.type === "mid-page-cta");
    if (!hasMidCta) {
      w.push({ field: "sections", severity: "warning", message: "No mid-page CTA found — recommended to break up long content" });
    }

    // Check for duplicate section headlines
    const headlines = input.sections.map((s) => s.headline.toLowerCase()).filter(Boolean);
    const dupes = headlines.filter((h, i) => headlines.indexOf(h) !== i);
    if (dupes.length > 0) {
      w.push({ field: "sections", severity: "warning", message: `Duplicate section headlines found: "${[...new Set(dupes)].join('", "')}"` });
    }

    // Check for empty sections (headline but no content)
    for (const s of input.sections) {
      if (s.headline && stripHtml(s.content).trim().length < 20) {
        w.push({ field: "sections", severity: "warning", message: `Section "${s.headline}" has very little content (${stripHtml(s.content).trim().length} chars)` });
      }
    }

    // Check for sections with no headline (after the intro)
    const headlessSections = input.sections.filter((s) => !s.headline && s.type === "narrative");
    if (headlessSections.length > 1) {
      w.push({ field: "sections", severity: "warning", message: `${headlessSections.length} sections have no headline — may be parser issue or missing headings in doc` });
    }

    // Section count reasonableness
    if (input.sections.length < 3) {
      w.push({ field: "sections", severity: "warning", message: `Only ${input.sections.length} content section(s) — most case pages have 6-12` });
    }

    // Detect instructional/brief content that leaked into sections
    const instructionalPatterns = [
      { re: /primary\s+keyword/i, label: "primary keyword" },
      { re: /secondary\s+keywords?/i, label: "secondary keywords" },
      { re: /used\s+in\s+the\s+h[1-6]/i, label: "H-tag placement instructions" },
      { re: /woven\s+into\s+(the\s+)?(body|section|content)/i, label: "keyword weaving instructions" },
      { re: /keyword\s+density/i, label: "keyword density" },
      { re: /seo\s+keyword\s+report/i, label: "SEO keyword report" },
      { re: /content\s+brief/i, label: "content brief" },
      { re: /word\s+count\s*:/i, label: "word count target" },
      { re: /target\s+audience\s*:/i, label: "target audience" },
      { re: /search\s+intent/i, label: "search intent" },
      { re: /appears\s+in\s+(body|content|section)/i, label: "placement instructions" },
    ];
    for (const s of input.sections) {
      const sectionText = `${s.headline} ${stripHtml(s.content)}`;
      const matches = instructionalPatterns.filter((p) => p.re.test(sectionText));
      if (matches.length >= 2) {
        w.push({
          field: "sections",
          severity: "error",
          message: `Section "${s.headline || "(no headline)"}" contains instructional/SEO brief content that should not be on the page (detected: ${matches.map((m) => m.label).join(", ")})`,
        });
      }
    }
  }

  // ════════════════════════════════════════
  // FAQ CHECKS
  // ════════════════════════════════════════

  if (input.faqs.length === 0) {
    w.push({ field: "faqs", severity: "warning", message: "No FAQs found — recommended for SEO (FAQ schema)" });
  } else {
    // Check for very short answers
    for (const faq of input.faqs) {
      if (faq.answer.length < 30) {
        w.push({ field: "faqs", severity: "warning", message: `FAQ answer too short (${faq.answer.length} chars): "${faq.question}"` });
      }
    }
    // Check if any FAQ question doesn't end with ?
    for (const faq of input.faqs) {
      if (!faq.question.trim().endsWith("?")) {
        w.push({ field: "faqs", severity: "warning", message: `FAQ doesn't end with "?": "${faq.question}"` });
      }
    }
    // Check for FAQ answers that contain what looks like a section heading (parser bleed)
    for (const faq of input.faqs) {
      if (/^[A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+/.test(faq.answer) && faq.answer.includes("\n")) {
        w.push({ field: "faqs", severity: "warning", message: `FAQ answer for "${faq.question}" may contain a section heading — check for parser bleed` });
      }
    }
  }

  // ════════════════════════════════════════
  // CLOSING CTA CHECKS
  // ════════════════════════════════════════

  if (!input.closingCta) {
    w.push({ field: "closingCta", severity: "warning", message: "No closing CTA found — will use default" });
  }

  // ════════════════════════════════════════
  // CROSS-FIELD COHERENCE CHECKS
  // ════════════════════════════════════════

  // Title should appear (or be referenced) in the subheadline or intro content
  if (input.title && input.sections.length > 0) {
    const titleTerms = extractKeyTerms(input.title).filter((t) => t.length > 4);
    const introContent = input.sections[0]?.content || "";
    const introText = (input.subheadline + " " + stripHtml(introContent)).toLowerCase();
    const introMatches = titleTerms.filter((t) => introText.includes(t));
    if (titleTerms.length > 0 && introMatches.length === 0) {
      w.push({
        field: "coherence",
        severity: "warning",
        message: `Title key terms not referenced in subheadline or intro section — content may not match the title`,
      });
    }
  }

  // SEO title and page title should be related
  if (input.seoTitle && input.title) {
    const titleTerms = extractKeyTerms(input.title).filter((t) => t.length > 4);
    const seoLower = input.seoTitle.toLowerCase();
    const overlap = titleTerms.filter((t) => seoLower.includes(t));
    if (titleTerms.length > 0 && overlap.length === 0) {
      w.push({
        field: "seo_title",
        severity: "warning",
        message: `SEO title "${input.seoTitle}" shares no key terms with page title "${input.title}"`,
      });
    }
  }

  // Slug should match title
  if (input.title && input.slug) {
    const expectedSlug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (input.slug !== expectedSlug) {
      w.push({ field: "slug", severity: "warning", message: `Slug "${input.slug}" doesn't match auto-generated slug from title "${expectedSlug}"` });
    }
  }

  return w;
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

    // Skip instructional/brief blocks — these are writer notes, not page content
    const blockText = block.map((l) => clean(l)).join(" ").toLowerCase();
    if (isInstructionalBlock(firstLine, blockText)) continue;

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

  // ── Category resolution ──
  // 1. If doc specified a category, validate/fuzzy-match it
  // 2. If still uncategorized, try auto-detecting from title
  if (category !== "Uncategorized") {
    category = matchCategory(category);
  }
  if (category === "Uncategorized" && title) {
    category = matchCategory(title);
  }

  // ── QC Validation ──
  const qcWarnings: QCWarning[] = runQcChecks({
    title, slug, eyebrow, subheadline, backgroundImage, sections, faqs, closingCta,
    seoTitle, seoDescription, seoFocusKeyword, seoSecondaryKeywords, category,
  });

  // Auto-fix: strip HTML from subheadline if detected
  if (/<[^>]+>/.test(subheadline)) {
    subheadline = stripHtml(subheadline);
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
    qcWarnings,
  };
}

// ─── Case Creator ───

async function createCaseFromDoc(docUrl: string) {
  const rawText = await fetchGoogleDoc(docUrl);
  const doc = parseDocument(rawText);

  if (!doc.title) throw new Error("Could not find a title in the document");

  // Block creation if there are QC errors
  const qcErrors = doc.qcWarnings.filter((w) => w.severity === "error");
  if (qcErrors.length > 0) {
    const errorList = qcErrors.map((e) => `• [${e.field}] ${e.message}`).join("\n");
    throw new Error(
      `QC check failed with ${qcErrors.length} error(s). Fix these in the Google Doc and retry:\n${errorList}`
    );
  }

  // Check for existing slug (note: anon key may not see draft cases due to RLS)
  const { data: existing } = await supabase.from("cases").select("id").eq("slug", doc.slug).maybeSingle();
  if (existing) throw new Error(`A case with slug "${doc.slug}" already exists. Delete or rename the existing case first.`);

  // ── Image optimization ──
  let heroImageUrl = doc.backgroundImage;
  let imageOptResult: ImageOptResult | null = null;

  if (heroImageUrl && heroImageUrl.startsWith("http")) {
    imageOptResult = await fetchAndOptimizeImage(heroImageUrl, doc.slug);

    if (imageOptResult.optimized) {
      heroImageUrl = imageOptResult.url;
      doc.qcWarnings.push({
        field: "backgroundImage",
        severity: "warning",
        message: `Image optimized: ${formatBytes(imageOptResult.originalSize)} → ${formatBytes(imageOptResult.finalSize)} `
          + `(${Math.round((1 - imageOptResult.finalSize / imageOptResult.originalSize) * 100)}% reduction)`
          + (imageOptResult.originalDimensions
            ? `, ${imageOptResult.originalDimensions.width}×${imageOptResult.originalDimensions.height}`
              + ` → ${imageOptResult.finalDimensions?.width}×${imageOptResult.finalDimensions?.height}`
            : "")
          + `, converted to WebP`,
      });
    } else if (imageOptResult.error) {
      doc.qcWarnings.push({
        field: "backgroundImage",
        severity: "warning",
        message: `Could not optimize image: ${imageOptResult.error}. Using original URL.`,
      });
    }
  }

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

  // Create case — store subheadline as plain text, NOT wrapped in <h3>
  const caseId = randomUUID();
  const heroSubheadline = doc.subheadline || "Help Law Group advocates for survivors affected by this case.";
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
    hero_subheadline: heroSubheadline,
    hero_background_image: heroImageUrl,
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
      backgroundImage: heroImageUrl,
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
    qcWarnings: doc.qcWarnings,
    imageOptimization: imageOptResult
      ? {
          optimized: imageOptResult.optimized,
          originalSize: formatBytes(imageOptResult.originalSize),
          finalSize: formatBytes(imageOptResult.finalSize),
          originalDimensions: imageOptResult.originalDimensions,
          finalDimensions: imageOptResult.finalDimensions,
          savedBytes: imageOptResult.optimized
            ? formatBytes(imageOptResult.originalSize - imageOptResult.finalSize)
            : null,
          reduction: imageOptResult.optimized
            ? `${Math.round((1 - imageOptResult.finalSize / imageOptResult.originalSize) * 100)}%`
            : null,
        }
      : null,
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
      previewUrl: `https://helplaw.com/cases/preview/${result.slug}`,
      qcWarnings: result.qcWarnings,
      message: `Case "${result.title}" created as draft with category "${result.category}". ${result.qcWarnings.length > 0 ? `⚠️ ${result.qcWarnings.length} QC warning(s) — review below.` : "✅ All QC checks passed."} Preview the page, then set to active to publish.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
