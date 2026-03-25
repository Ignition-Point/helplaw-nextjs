# Help Law -- Design Upgrade Proposals

Each proposal below is independent. Mark **APPROVE** or **REJECT** next to each.
No changes will be made to the site until you approve them individually.

---

## 1. Multi-Step Lead Form (Replace Single-Step)

**Current:** Single form with all fields visible at once (first name, last name, email, phone, description).

**Proposed:** 3-step wizard form with progress indicator:
- Step 1: Case type selection (icon cards -- Mass Tort, Class Action, Data Breach, Other)
- Step 2: 1-2 qualifying questions based on selection
- Step 3: Contact info (name, phone, email)
- Confirmation screen with "A legal advisor will contact you within 24 hours"

**Why:** Multi-step forms outperform single-step across the legal industry. Lower perceived commitment at each step increases completion rates. Morgan & Morgan, Sokolove, and TorHoerman all use this pattern.

**Decision:** ________

---

## 2. Sticky Mobile CTA Bar

**Current:** No persistent mobile CTA. Users must scroll back to find the form or phone number.

**Proposed:** Fixed bottom bar (60px) on mobile that appears after scrolling past the first CTA:
- Left: Phone icon (tap to call)
- Right: Gold "Free Case Review" button
- Navy background, subtle top shadow

**Why:** Universal on premium legal sites. Mobile is 60-70% of traffic. TorHoerman, Morgan & Morgan, and Sokolove all use this.

**Decision:** ________

---

## 3. "As Featured In" / Trust Logo Bar

**Current:** Scrolling trust bar with text-only badges ("No Upfront Cost", "Free Consultation", etc.)

**Proposed:** Add a secondary row below the hero with grayscale media/credential logos (e.g., news outlets, bar associations, or partner logos -- whatever real credentials Help Law has). Clean horizontal row, subtle gray background.

**Why:** Every premium legal site layers trust signals. The scrolling text bar is good; a logo row adds a second layer of credibility. Only add this when real logos/credentials are available -- fake ones hurt more than help.

**Decision:** ________

---

## 4. Headline Typography: Serif vs. Sans-Serif

**Current:** Playfair Display (serif) for all headings. Gives a traditional/elegant feel.

**Proposed option A -- Keep Playfair Display:** It differentiates Help Law from the sea of sans-serif legal sites (most use Montserrat/Inter for headings). The serif gives a premium, established feel.

**Proposed option B -- Switch to sans-serif headings (Inter Bold/Black):** Aligns with industry standard. Feels more modern and direct. Every top competitor uses geometric sans-serif headings.

**Why:** This is a brand identity decision. Serif = classic/premium. Sans-serif = modern/clean. Both are valid. The brief recommends sans-serif based on competitor analysis, but Playfair Display is already distinctive.

**Decision:** A (keep serif) / B (switch to sans) / ________

---

## 5. Inline CTAs on Case/Content Pages

**Current:** Case pages have a hero form at top and final CTA band at bottom. No mid-page conversion opportunities.

**Proposed:** Add an "InlineCTA" block type -- a full-width box within content flow:
- Light blue-gray background
- Short headline: "Affected by [Case Name]? Find out if you qualify."
- Single gold CTA button
- Appears every 2-3 scroll-lengths on long case pages

**Why:** Long case pages (3,000+ words) lose readers who never scroll to the bottom CTA. TorHoerman and Sokolove place inline CTAs throughout content pages. The block already exists in the page builder design -- just needs to be built and used.

**Decision:** ________

---

## 6. "Last Updated" Dates on Case Pages

**Current:** No visible update timestamps on case or blog pages.

**Proposed:** Add a subtle "Last Updated: [date]" line below the H1 on case pages and blog posts. Small text, muted color.

**Why:** Signals active attention to cases. Google rewards content freshness. Every top-ranking legal content page shows update dates. TorHoerman and Console & Associates both do this prominently.

**Decision:** ________

---

## 7. Author Bylines on Content Pages

**Current:** No author attribution on blog posts or case pages.

**Proposed:** Add "Reviewed by [Attorney Name]" badge on case pages and "By [Author]" on blog posts. Include small photo and credentials.

**Why:** Real attorney attribution builds credibility and E-E-A-T (Google's Experience, Expertise, Authoritativeness, Trustworthiness signals). Also creates accountability that distinguishes from anonymous "content mill" sites.

**Decision:** ________

---

## 8. Breadcrumb Navigation

**Current:** No breadcrumbs. Users rely on the main nav to orient themselves.

**Proposed:** Add breadcrumb trail below the header on all inner pages:
- Home > Cases > [Case Name]
- Home > Resources > [Post Title]
- Uses BreadcrumbList schema markup for SEO

**Why:** Improves navigation UX and gives Google additional structured data. Small visual footprint, significant SEO benefit. Every competitor implements this.

**Decision:** ________

---

## 9. Table of Contents Sidebar on Long-Form Pages

**Current:** Blog posts have an auto-generated ToC at the top of the content. Case pages have a TableOfContents block type but it's not sticky.

**Proposed:** On desktop, move the ToC to a sticky left sidebar that scrolls with the reader on long-form pages (case pages and blog posts). Highlights the current section as user scrolls. On mobile, collapses to a dropdown at the top.

**Why:** Improves readability on long pages. Users can jump to relevant sections. TorHoerman and most content-heavy legal sites use this pattern. Also generates jump-link anchors that Google can surface in search results.

**Decision:** ________

---

## 10. Case Results / Settlement Numbers Section

**Current:** No section displaying case results or recovery amounts.

**Proposed:** Add a "Results" or "What We've Achieved" section (homepage and/or dedicated page) with large-format dollar figures in cards:
- Large number ($X.X Million)
- Case type below
- Brief description
- Clean grid layout, 3-4 cards per row

**Why:** Specific dollar amounts recovered is the #1 most effective trust signal in the legal industry. Morgan & Morgan leads with "$20 Billion+ Recovered." Only add this when real, verifiable numbers are available.

**Decision:** ________

---

## 11. White Space & Spacing Refinement

**Current:** Sections have consistent py-16/py-20 spacing. Content feels well-organized but could breathe more.

**Proposed:** Increase section padding to py-20/py-28 on desktop. Add more generous margins between content blocks within sections. Slightly larger line-height on body text (from 1.625 to 1.75).

**Why:** The #1 visual difference between premium and basic sites is white space. TorHoerman's site "breathes" -- nothing feels cramped. Generous spacing signals quality and confidence.

**Decision:** ________

---

## Summary

| # | Proposal | Effort | Impact |
|---|----------|--------|--------|
| 1 | Multi-step form | High | High (conversion) |
| 2 | Sticky mobile CTA | Low | High (mobile conversion) |
| 3 | Trust logo bar | Low | Medium (credibility) |
| 4 | Typography choice | Low | Medium (brand identity) |
| 5 | Inline CTAs | Medium | High (conversion) |
| 6 | Last Updated dates | Low | Medium (SEO + trust) |
| 7 | Author bylines | Low | Medium (E-E-A-T / SEO) |
| 8 | Breadcrumbs | Low | Medium (SEO + UX) |
| 9 | Sticky ToC sidebar | Medium | Medium (UX + SEO) |
| 10 | Case results section | Medium | High (trust) |
| 11 | White space refinement | Low | Medium (perceived quality) |

Mark each one and I'll implement only the approved changes.
