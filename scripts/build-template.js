const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, LevelFormat } = require("docx");
const fs = require("fs");

const NAVY = "1B2A4A";
const GOLD = "C69214";
const GRAY = "666666";
const LIGHT_GRAY = "999999";
const RULE_COLOR = "CCCCCC";

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, spacing: { before: 300, after: 120 }, children: [new TextRun({ text, bold: true, font: "Arial", color: NAVY })] });
}

function label(labelText, placeholder) {
  return new Paragraph({
    spacing: { before: 200, after: 60 },
    children: [
      new TextRun({ text: labelText + " ", bold: true, font: "Arial", size: 22, color: NAVY }),
      new TextRun({ text: placeholder, font: "Arial", size: 22, color: LIGHT_GRAY, italics: true }),
    ],
  });
}

function note(text) {
  return new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text, font: "Arial", size: 18, color: GRAY, italics: true })] });
}

function body(text) {
  return new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text, font: "Arial", size: 22 })] });
}

function rule() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE_COLOR, space: 1 } },
    children: [],
  });
}

function sectionExample(text) {
  return new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun({ text, font: "Courier New", size: 20, color: GRAY })] });
}

function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: "Arial", size: opts.size || 22, color: opts.color || undefined })],
  });
}

function boldBullet(label, desc) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: label + " ", bold: true, font: "Arial", size: 22 }),
      new TextRun({ text: desc, font: "Arial", size: 22, color: GRAY }),
    ],
  });
}

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    }],
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 36, bold: true, font: "Arial", color: NAVY }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, font: "Arial", color: NAVY }, paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, font: "Arial", color: GOLD }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [
      // ═══ TITLE ═══
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "Help Law Group", font: "Arial", size: 40, bold: true, color: NAVY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: "Case Page Template", font: "Arial", size: 32, color: GOLD })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({ text: "Fill out the ", font: "Arial", size: 20, color: GRAY }),
          new TextRun({ text: "Settings", font: "Arial", size: 20, color: GRAY, bold: true }),
          new TextRun({ text: " and ", font: "Arial", size: 20, color: GRAY }),
          new TextRun({ text: "SEO", font: "Arial", size: 20, color: GRAY, bold: true }),
          new TextRun({ text: " sections, then write your page content below. Submit the Google Doc URL to ", font: "Arial", size: 20, color: GRAY }),
          new TextRun({ text: "/admin/create-case", font: "Courier New", size: 20, color: GOLD, bold: true }),
        ],
      }),

      rule(),

      // ═══ SETTINGS ═══
      heading("SETTINGS (Required)", HeadingLevel.HEADING_1),
      note("These fields populate the Settings tab in the CMS. Every field is required."),

      label("Title:", "[Full case page title]"),
      label("Slug:", "[Leave blank to auto-generate, or specify e.g. san-diego-county-juvenile-detention-abuse-lawsuit]"),
      label("Category:", "[Pick ONE]"),
      note("Valid categories: Clergy and Religious Institution Abuse | Medical Abuse | Online Platform Harm | Social Media Addiction | Sexual Abuse and Institutional Harm | Juvenile Detention Abuse | Foster Care Abuse | Rideshare Assault | Unsafe Products"),
      label("Case Type:", "[Pick ONE: mass-tort | class-action | data-breach]"),
      label("Background Image:", "[Paste image URL from image2url.com or Lovable]"),
      label("Eyebrow:", "[Short pipe-separated context, e.g. County Name | Civil Lawsuits Active | Investigation Underway]"),
      label("Subheadline:", "[One sentence that speaks directly to the survivor]"),

      rule(),

      // ═══ SEO ═══
      heading("SEO (Required)", HeadingLevel.HEADING_1),
      note("These fields populate the SEO section on the Settings tab."),

      label("SEO Title (Meta Title):", "[Under 60 characters]"),
      label("Meta Description:", "[Under 160 characters. Action-oriented summary for search results.]"),
      label("Focus Keyword:", "[Primary keyword phrase]"),
      label("Secondary Keywords:", "[Comma-separated, 3-6 phrases]"),

      rule(),

      // ═══ PAGE CONTENT ═══
      heading("PAGE CONTENT", HeadingLevel.HEADING_1),
      body("Write your page content below. Separate each section with a horizontal rule. Use whatever sections make sense for this case. Delete this instruction text before submitting."),

      rule(),

      note("[Start writing your content here. See the Block Type Reference at the end of this document for formatting rules.]"),

      rule(),

      // ═══ OPTIONAL LEAD FORM ═══
      heading("OPTIONAL: Custom Lead Form", HeadingLevel.HEADING_1),
      note("Only include if you need custom fields. If this section is omitted, a default form (Full Name, Email, Phone, State) is created automatically. Delete this section if not needed."),
      sectionExample("LEAD FORM:"),
      sectionExample("- Full Name (text, required)"),
      sectionExample("- Email (email, required)"),
      sectionExample("- Phone (phone, required)"),
      sectionExample("- State (select, required)"),
      sectionExample("- Which facility? (select: Option1, Option2, Option3)"),
      sectionExample("- Tell us what happened (textarea)"),

      rule(),

      // ═══ BLOCK TYPE REFERENCE ═══
      heading("BLOCK TYPE REFERENCE", HeadingLevel.HEADING_1),
      body("Use any combination of these block types in the Page Content section above. Separate each block with a horizontal rule."),

      // --- Intro ---
      heading("Intro paragraphs (no heading)", HeadingLevel.HEADING_2),
      body("2-3 paragraphs right after the Settings/SEO section, before your first heading. These appear below the hero and do NOT get a heading line."),
      sectionExample("________________"),
      sectionExample("Help Law Group advocates for survivors of..."),
      sectionExample("Hundreds of survivors have filed civil lawsuits..."),

      // --- Standard Section ---
      heading("Standard section", HeadingLevel.HEADING_2),
      body("First line = heading. Everything after = body content. Use * or - for bullet lists."),
      sectionExample("________________"),
      sectionExample("What You Need to Know"),
      sectionExample("* Key fact one"),
      sectionExample("* Key fact two"),
      sectionExample("* Key fact three"),

      // --- Variant ---
      heading("Dark/Light variant", HeadingLevel.HEADING_2),
      body("Add (Dark) or (Light) after the heading to set the section background. Default is light."),
      sectionExample("________________"),
      sectionExample("Section Heading (Dark)"),
      sectionExample("Body content here..."),

      // --- Sub-headings ---
      heading("Sub-headings within a section", HeadingLevel.HEADING_2),
      body("Short standalone lines (< 100 characters, no ending period) followed by longer content are rendered as sub-headings."),
      sectionExample("________________"),
      sectionExample("Which Facilities Are Named in Lawsuits?"),
      sectionExample("Kearny Mesa Juvenile Detention Facility"),
      sectionExample("Description of this facility and its role..."),
      sectionExample("Camp Barrett"),
      sectionExample("Description of this facility..."),

      // --- Timeline ---
      heading("Timeline", HeadingLevel.HEADING_2),
      body("Date lines on their own become timeline markers. Supported formats: 2024, Early 1990s, Pre-2015, September 2024, May 13, 2025 - Source Name"),
      sectionExample("________________"),
      sectionExample("Case Timeline (Dark)"),
      sectionExample("January 2024"),
      sectionExample("What happened at this date."),
      sectionExample("March 2025"),
      sectionExample("What happened at this date."),

      // --- Mid-Page CTA ---
      heading("Mid-Page CTA", HeadingLevel.HEADING_2),
      body("Call-to-action block placed in the middle of the page. Button text in square brackets."),
      sectionExample("________________"),
      sectionExample("(MID-PAGE CTA)"),
      sectionExample("CTA Headline Here"),
      sectionExample("1-2 sentences of supporting copy."),
      sectionExample("[Button Text Here]"),

      // --- FAQ ---
      heading("Frequently Asked Questions", HeadingLevel.HEADING_2),
      body("Heading must be exactly \"Frequently Asked Questions\" (or start with it). Questions end with ?. Separate Q&A pairs with a blank line."),
      sectionExample("________________"),
      sectionExample("Frequently Asked Questions"),
      sectionExample("Question one?"),
      sectionExample("Answer text here."),
      sectionExample(""),
      sectionExample("Question two?"),
      sectionExample("Answer text here."),

      // --- Closing CTA ---
      heading("Closing CTA", HeadingLevel.HEADING_2),
      body("Final call-to-action at the bottom of the page."),
      sectionExample("________________"),
      sectionExample("(CLOSING CTA)"),
      sectionExample("CTA Headline Here"),
      sectionExample("1-2 sentences of supporting copy."),
      sectionExample("[Button Text Here]"),

      // --- Disclaimer ---
      heading("Disclaimer", HeadingLevel.HEADING_2),
      body("Include at the very end. The parser automatically skips this block."),
      sectionExample("________________"),
      sectionExample("Attorney Advertising. This content is for informational purposes only..."),

      rule(),

      // ═══ NOTES ═══
      heading("Reminders", HeadingLevel.HEADING_2),
      bullet("Table of Contents is auto-generated from your section headings. Do not write one."),
      bullet("The case is created as a DRAFT. Set to Active in Lovable CMS to publish."),
      bullet("Category must match one of the valid options exactly. The parser can auto-detect from the title if omitted."),
      bullet("Background Image: upload through Lovable CMS first, then copy the image2url.com URL here."),
      bullet("Google Doc must be shared as \"Anyone with the link can view\" before submitting."),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/Users/sarahmenkesservold/help-law/scripts/case-page-template.docx", buffer);
  console.log("Template saved to scripts/case-page-template.docx");
});
