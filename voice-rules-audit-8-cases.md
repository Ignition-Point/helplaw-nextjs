# Help Law Group Voice Rules Audit: 8-Case Comparison Analysis

## Purpose

This document audits the 22-rule voice framework for Help Law Group case pages by comparing AI-generated drafts (written using ONLY the original 22 rules) against human-written versions across 8 cases. The first 3 cases were the ones used to BUILD the rules. The next 5 cases test whether the rules hold up — and whether the human writer still follows the patterns that generated those rules in the first place.

The central finding: **the human writer has systematically departed from several patterns that the rules were built to capture.** This audit documents every departure, traces each back to the specific test case that generated the rule, and poses questions for the human writer to resolve before the rules are revised.

---

## The 8 Cases

### Original Test Cases (rules were built FROM these)

| # | Case | Type | Rules Generated |
|---|------|------|----------------|
| 1 | Maj. Blaine McGraw | Military medical abuse | Rules 1–16 (initial 12 + added 13–16) |
| 2 | California Women's Prison | Institutional sexual abuse | Rules 17–18 + hedging refinements |
| 3 | NYC Juvenile Detention | Institutional juvenile abuse | Rules 19–22 + Tone Principles meta-layer |

### New Comparison Cases (rules tested AGAINST these)

| # | Case | Type | Round |
|---|------|------|-------|
| 4 | Dr. Patrick Clyne | Individual defendant / medical / foster care | Round 1 |
| 5 | Alexander Brothers | Individual defendants / sex trafficking | Round 2 |
| 6 | Paul Nkoy Lumbi | Elder abuse / nursing home | Round 3 |
| 7 | Washington Clergy Abuse | Statewide institutional / clergy | Round 4 |
| 8 | Northwell Health Sleep Center | Hidden camera surveillance / privacy | Round 5 |

---

## PART 1: RULE-BY-RULE CONTRADICTION TRACKER

For each rule that shows a pattern break between the original test cases and the new 5 cases, I trace: which test case generated the rule, what the original human writer did in the test case, and what the same human writer now does differently.

### Rule 5: Open with a Moral Principle

**Source:** NYC Juvenile Detention (Test 3). The human writer opened with: "Children held in New York City's juvenile detention centers were supposed to be safe. The adults running these facilities had a legal duty to protect every child in their custody. For decades, they failed."

**What the rule says:** Structure: moral principle → facts → barrier → firm + family member invitation.

**What the human does in the 5 new cases:**

| Case | Moral principle opening? | What they did instead |
|------|------------------------|----------------------|
| Clyne | NO | Flat firm-positioning: "Help Law Group is reviewing claims connected to Dr. Patrick Clyne..." |
| Alexander Brothers | NO | Case summary opening: factual description of allegations |
| Paul Nkoy Lumbi | NO | Case summary: "Help Law Group is reviewing claims..." with factual description |
| Washington Clergy | NO | Case summary with scope framing: "spanning decades of alleged abuse" |
| Northwell Health | NO | Factual case briefing: "Patients and staff...had no reason to suspect that bathrooms throughout both facilities had been rigged with hidden cameras." |

**Score: 0/5 match the rule. The original test cases were 2/3 (McGraw is unclear, CA Prison YES, NYC Juvenile YES).**

**The question this raises:** Did the human writer deliberately move away from moral-principle openings? The Northwell intro is particularly interesting — "had no reason to suspect" is actually a BETTER principle statement than mine ("had a right to expect"), because it's factual rather than aspirational. But it's not structured as principle → facts → barrier → firm. It's a narrative opening that embeds the principle in the first sentence as context rather than as a standalone declaration.

---

### Rule 5 (cont.): Family Member Invitation in Intro

**Source:** NYC Juvenile Detention (Test 3). The human wrote: "Whether you experienced this firsthand or you're here for someone you love, reaching out takes courage. We are here to listen."

**What the human does in the 5 new cases:**

| Case | Family invitation in intro? | Where it appears instead |
|------|---------------------------|------------------------|
| Clyne | NO | FAQ only |
| Alexander Brothers | NO | FAQ only |
| Lumbi | NO | "How Help Law Group Can Help" section |
| Washington Clergy | NO | "How Help Law Group Can Help" section |
| Northwell | NO | "How Help Law Group Can Help" closing section |

**Score: 0/5.** The original test cases were 1/3 clearly in the intro (NYC Juvenile).

**Note:** My AI drafts consistently included family invitations in the intro per Rule 5. The human writer consistently pushes this to the end of the page or into FAQ. This is a deliberate structural choice — the human treats the intro as a case briefing, not an emotional onboarding moment.

---

### Rule 12: Trust Banner Is Mandatory

**Source:** Evolved across all three test cases. The component exists on the live site as hero badges.

**What the human does in the 5 new cases:**

| Case | Explicit Trust Banner block? |
|------|----------------------------|
| Clyne | NO |
| Alexander Brothers | NO |
| Lumbi | NO |
| Washington Clergy | NO |
| Northwell | NO |

**Score: 0/5.** The human never includes a Trust Banner as a content block. It appears the hero component handles this automatically on the live site, so the human writer doesn't write it into the Google Doc. **This may not be a contradiction — it may be an implementation detail** (the component renders regardless of what's in the doc). But the rule says "mandatory," which caused my AI drafts to always include it.

---

### Rule 14: Subheadline Positions the Firm

**Source:** CA Prison (Test 2) and NYC Juvenile (Test 3). In Test 2, the human wrote: "Help Law Group advocates for survivors of sexual abuse and staff misconduct in women's prisons, jails, and correctional facilities across the United States." In Test 3: "Help Law Group advocates for survivors of abuse in New York City juvenile detention facilities."

**What the human does in the 5 new cases:**

| Case | Subheadline |
|------|------------|
| Clyne | "Former patients and foster children in Santa Clara and Santa Cruz Counties may have legal options." — NO firm name, reader-oriented |
| Alexander Brothers | Reader-oriented, geographic + eligibility |
| Lumbi | Firm-positioning format ("Help Law Group advocates for...") |
| Washington Clergy | Firm-positioning format |
| Northwell | "Help Law Group advocates for patients and staff whose privacy was violated..." — firm-positioning |

**Score: 3/5 use the firm-positioning format. 2/5 use pure reader orientation with no firm name.**

**This is actually more consistent than the other rules.** The Clyne subheadline is the outlier — it's pure reader orientation with no mention of Help Law Group. This may be deliberate for an individual-defendant case where the reader is searching for the defendant's name, not a firm.

---

### Rule 4: Required Standalone Sections

**The rule lists these as required:** What You Need to Know, Timeline, Did They Know?, Who Is Responsible?, Impact, Legal Rights / Do You Have a Case?, Compensation, FAQ, Mid + Final CTA, How HLG Supports Survivors.

**Tracking which standalone sections the human OMITS across the 5 new cases:**

| Section | Clyne | Alexander | Lumbi | WA Clergy | Northwell |
|---------|-------|-----------|-------|-----------|-----------|
| What You Need to Know | YES | YES | YES | YES | YES |
| Timeline | YES | YES | YES | YES | YES |
| Who Is Responsible? | REFRAMED as "Which Agencies Are Named?" | YES | YES | YES | REFRAMED as "What Civil Lawsuits Allege" |
| Impact on Victims | NO — embedded | NO — embedded | NO — embedded | NO — embedded | NO — omitted |
| Compensation | NO — omitted | NO — omitted | NO — omitted | NO — omitted | NO — omitted |
| Why Survivors Coming Forward Now | NO — distributed | NO | NO | NO | NO — omitted |
| Legal Rights/Do You Have a Case? | YES as Q&A | YES | YES | YES | YES — integrated into civil lawsuits section |
| FAQ | YES | YES | YES | YES | YES |
| Mid + Final CTA | YES | YES | YES | YES | YES |
| How HLG Supports | YES | YES | YES | YES | YES |

**Sections the human NEVER includes as standalone in the new cases:**
- Standalone Impact on Victims: 0/5
- Standalone Compensation: 0/5
- Standalone "Why Coming Forward Now": 0/5

**Sections the human ALWAYS includes:**
- What You Need to Know: 5/5
- Timeline: 5/5
- FAQ: 5/5
- CTAs: 5/5
- How HLG Supports: 5/5
- Legal Rights (in some form): 5/5

**Key insight:** The human treats Impact, Compensation, and Why Now as CONTENT that gets distributed across other sections, not as standalone sections that need their own headings. In the original test cases, the human DID have standalone versions of some of these — but the new pattern is leaner and more integrated.

---

### Rule 18: Standalone "Why Survivors Are Coming Forward Now"

**Source:** CA Women's Prison (Test 2). The human had a dedicated persuasion section explaining why the legal landscape had changed.

**What the human does in the 5 new cases:**

| Case | Standalone Why Now section? | How the "why now" content appears |
|------|---------------------------|----------------------------------|
| Clyne | NO | Distributed into legal section and timeline |
| Alexander Brothers | NO | Distributed |
| Lumbi | NO | Integrated into legal discussion |
| Washington Clergy | NO | Distributed across legal and news sections |
| Northwell | NO | Distributed into legal section and news |

**Score: 0/5.** The original test case (CA Prison) had this as standalone. The human has abandoned the standalone format entirely.

---

### Rule 19: Address Shame Before the Reader Feels It

**Source:** NYC Juvenile Detention (Test 3). The human included standalone callouts: "Memory gaps are normal..." and "Your custody status does not define your rights..."

**What the human does in the 5 new cases:**

| Case | Standalone shame callouts? | How shame/uncertainty is addressed |
|------|--------------------------|-----------------------------------|
| Clyne | NO | Embedded in victim description: "survivors feeling something was wrong but lacking the framework to name it" |
| Alexander Brothers | NO | Embedded in FAQ answers |
| Lumbi | NO | Embedded: family guilt addressed in HLG section |
| Washington Clergy | NO | Embedded in FAQ and legal sections |
| Northwell | NO | No standalone shame callouts. Uncertainty addressed factually: "not receiving a notification letter does not mean you were not recorded" |

**Score: 0/5 standalone. All 5 embed shame/uncertainty validation into other sections.**

**This is significant.** The rule was built FROM the NYC Juvenile case, where the human DID use standalone callouts. The human has since moved to an embedding approach. The standalone callouts may read as "a technique" — something that's visible as a persuasion tactic rather than feeling organic.

---

### Rule 21: News Section Includes Parallel and Related Cases

**Source:** NYC Juvenile Detention (Test 3). The human included Maya Hayes at Brookwood Secure Center as a parallel case.

**What the human does in the 5 new cases:**

| Case | Parallel case in news? |
|------|----------------------|
| Clyne | NO |
| Alexander Brothers | NO |
| Lumbi | NO |
| Washington Clergy | NO |
| Northwell | NO |

**Score: 0/5.** My AI drafts consistently included parallel cases (UCLA/Heaps for Clyne, Johns Hopkins for Northwell). The human never does in the new cases. The NYC Juvenile parallel case (Maya Hayes) may have been an exception, not a pattern.

**However:** In my Northwell draft, I put Johns Hopkins ($190M settlement) in the News section as a parallel case. The human writer does NOT put it in news — but does reference precedent cases within the body of the civil lawsuits section. So the human uses precedent differently: as legal context within the argument, not as a separate news item.

---

## PART 2: NEW PATTERNS THE HUMAN CONSISTENTLY USES (NOT IN THE 22 RULES)

These patterns appear consistently across the 5 new cases and are NOT captured by the current rules.

### 1. SEO-Optimized Statement Headings for Key Sections

**Frequency: 5/5 cases.**

The human uses keyword-rich statement headings (not questions) for Timeline, News, and FAQ sections:

- "Dr. Patrick Clyne Abuse Lawsuit Timeline"
- "Northwell Health Sleep Disorder Center News and Legal Updates"
- "Frequently Asked Questions About the Northwell Health Hidden Camera Lawsuit"

These are exact-match or near-match search queries. **Note: The case page template already specifies this format for these sections.** The contradiction is between Rule 3 ("use question-format headings") and the template itself. The human follows the template. Rule 3 needs an explicit exception for template-specified SEO sections.

### 2. Legal Sections Organized as Reader Q&A, Not Statute Explainers

**Frequency: 5/5 cases.**

Instead of Rule 17's "standalone section that explains the law," the human structures legal content as specific reader questions:

- "Can a civil lawsuit be filed even though Clyne was never criminally charged?"
- "Does it matter that the criminal case has already concluded?"
- "Can family members pursue a claim on behalf of a minor who was recorded?"

These are searchable questions someone would actually ask. The statute names and legal frameworks are embedded in the answers, not presented as lecture material.

### 3. Defendant/Institution Response Included for Credibility

**Frequency: 4/5 cases (all except Alexander Brothers, where no public denial exists).**

- Clyne: "Clyne has consistently denied all allegations" (appears twice)
- Lumbi: Institution's response noted
- Washington Clergy: Diocesan responses documented
- Northwell: "Northwell Health has stated that it was instructed by the Nassau County DA's Office to delay victim notification"

My AI drafts never included defendant/institution responses. The 22 rules don't mention this. It's a credibility and fairness move — and it may also be a legal risk-mitigation choice.

### 4. News in Reverse Chronological Order (Newest First)

**Frequency: 5/5 cases.**

The human always leads with the most recent (and usually most conversion-relevant) news item. My drafts used chronological order for the first round, then adopted reverse chronological after the Clyne comparison.

### 5. Evidence Destruction / Tampering Highlighted

**Frequency: 3/5 cases where relevant (Alexander Brothers, Northwell).**

When the defendant destroyed evidence, the human highlights this prominently — both as a fact and as context for why the full scope of harm may never be known. The Northwell version is particularly effective: "Because Syamaprasad deleted significant portions of the footage, the full scope of who was recorded may never be determined." This does double work: it's a fact AND it addresses the reader's uncertainty ("was I even recorded?").

### 6. Emotional Temperature Calibrated to Case Type

This is the most important unlisted pattern. The human adjusts emotional register significantly by case type:

| Case Type | Temperature | Evidence |
|-----------|-------------|----------|
| NYC Juvenile (original) | WARM — "reaching out takes courage," "we are here to listen" | Children, custodial abuse, high shame barriers |
| CA Prison (original) | MEDIUM — principle opening, PREA education | Incarcerated women, institutional power dynamics |
| Clyne | COOL — flat case briefing, no emotional framing | Medical professional, long-past abuse, legal complexity |
| Alexander Brothers | COOL-MEDIUM — factual, trafficking framing | Sex trafficking, adult victims, criminal proceedings |
| Lumbi | COOL — clinical/factual | Elder abuse, family audience, recent death |
| Washington Clergy | COOL — measured, scope-focused | Decades of institutional abuse, complex legal landscape |
| Northwell | COOLEST — very factual, privacy-law focused | Surveillance, privacy violation, no physical contact |

**The pattern:** Cases involving children in custody (Juvenile Detention) get the warmest treatment. Cases involving adult patients/privacy violations get the coolest. The original test cases skewed warmer because 2 of 3 involved children or incarcerated populations. The new cases involve more varied populations, and the human adjusts accordingly.

**This is not captured by any rule.** The tone principles say "controlled authority, not prosecutorial heat" — but they don't say anything about calibrating warmth to case type or victim population.

### 7. Scope Broadening Beyond the Dossier

**Frequency: 2/5 clearly (Washington Clergy broadened to all denominations and nationwide; CA Prison broadened nationally in original test).**

The human sometimes takes a case that's geographically or institutionally specific and broadens it for SEO and intake purposes. This is a business decision the rules can't capture — but it's worth noting because it affects keyword strategy and reader orientation.

### 8. "What You Need to Know" as Bullet-Point Case Summary

**Frequency: 5/5 cases.**

The human consistently uses "What You Need to Know" as a structured bullet-point summary of key facts — not as a narrative section. My AI drafts sometimes made this a narrative intro. The human treats it as a scannable reference block: who, what, when, current status, who may have a claim.

---

## PART 3: ROUND 5 COMPARISON — NORTHWELL HEALTH SLEEP CENTER

This is the final comparison and the most instructive, because it's the most different case type: a privacy/surveillance case with no physical contact between perpetrator and victims.

### Structural Differences

**1. Title:** Human uses "Northwell Health Hidden Camera Lawsuit" — same as mine. Match.

**2. Subheadline:** Human: "Help Law Group advocates for patients and staff whose privacy was violated at the Northwell Health Sleep Disorders Center in Great Neck, New York." Mine was nearly identical. Close match.

**3. Intro approach:** Human opens with a factual narrative: "Patients and staff...had no reason to suspect that bathrooms throughout both facilities had been rigged with hidden cameras." This is a stronger opening than my moral-principle version ("had a right to expect that the most private moments of their visit would remain private"). The human's version is a fact; mine is an assertion. The human lets the situation speak.

**4. Section structure — human version is LEANER:**
- Human has NO standalone "Who Is Responsible?" section — instead uses "What Civil Lawsuits Against Northwell Health Allege" (framed as what's actually happening legally, not a theoretical liability argument)
- Human has NO standalone "Impact on Victims" section
- Human has NO standalone "Why Now" section
- Human has NO standalone "Compensation" section
- Human has NO standalone "Legal Education" section — legal frameworks embedded in civil lawsuits section

**5. The notification delay gets its OWN section:** Human gives "Why Did It Take Northwell Health Over a Year to Notify Victims?" its own dedicated section. This is the most conversion-relevant institutional failure — the one that makes patients angriest — and the human elevates it to a standalone section rather than burying it inside a broader "institutional failures" section. My draft treated it as a sub-section within "How Did This Go Undetected."

**6. Criminal case outcome gets its own section:** "What the Criminal Case Resulted In" — standalone. Includes the DA's quote. The sentencing disparity (6 months vs. 7-21 years requested) is the emotional anchor of this section. My draft embedded the criminal outcome in "Who Is Responsible?" The human's approach is better — it lets the reader absorb the sentencing injustice before pivoting to why civil accountability matters.

**7. Civil lawsuits section organized by claim type:** Failure to Supervise / Failure to Secure Private Spaces / Delayed Notification / Gross Negligence — each as a sub-headed category. My draft had a similar structure but inside a "Who Is Responsible?" framing. The human's "What Civil Lawsuits Allege" framing is more precise — it describes what's actually happening in litigation.

**8. The human includes a February 2026 update in news:** "Civil litigation against Northwell Health remains active, with class action proceedings and individual claims ongoing." This shows the page is maintained and current. My draft stopped at November 2025.

**9. FAQ is tighter:** Human has 4 FAQs; I had 9. The human's FAQs are more targeted: STARS vs. Sleep Center distinction (addresses confusion), criminal case independence, family claims for minors, and filing deadlines. All are highly searchable questions.

**10. HLG section approach:** Human opens with an institutional accountability framing: "When a medical facility creates the conditions for harm through inadequate supervision, absent security protocols, or a choice to delay disclosure, those failures do not belong to the individual who exploited them alone." This is arguably the strongest single sentence on the page — it reframes the entire case from "bad employee" to "institutional failure" right before the CTA. My version was more generic.

### Tone Differences

**1. The human version is the COOLEST of all 8 cases.** No "courage," no "we are here to listen," no moral principles. This is appropriate — the Northwell case is a privacy violation, not a sexual assault. The emotional register matches the harm.

**2. The human trusts the reader to feel the outrage.** The sentencing section presents the facts (6 months vs. 7-21 years requested) without editorial commentary. The DA's quote does the emotional work. My version added more explicit bridging ("many victims and advocates have criticized the sentence").

**3. Evidence destruction is highlighted for dual purpose.** "Because Syamaprasad deleted significant portions of the footage, the full scope of who was recorded may never be determined." This addresses the reader's uncertainty ("was I recorded?") while also strengthening the negligence case. My version mentioned the evidence destruction but didn't use it to address reader uncertainty.

**4. The human's mid-page CTA is more practical:** "Were You at the Sleep Disorders Center or STARS Rehabilitation Between 2022 and 2024?" vs. my "You Went to a Medical Facility and Expected Privacy. That Privacy Was Taken from You." The human version is a qualifying question; mine is an emotional statement. For a privacy case with 13,000+ potential claimants, the qualifying question is probably more effective — it helps people self-identify.

### What the Human Does Better (Northwell)

1. Dedicates a standalone section to the notification delay — the single most conversion-relevant institutional failure
2. Separates criminal outcome from civil claims — lets each breathe
3. Uses evidence destruction to address reader uncertainty about whether they were recorded
4. Includes a current-year news update showing the page is maintained
5. Opens the HLG section with the strongest institutional accountability framing on the page
6. Mid-page CTA is a qualifying question, not an emotional statement
7. Tighter FAQ (4 vs. my 9) with more targeted questions

### What My Version Does That the Human Doesn't (Northwell)

1. Moral-principle opening (Rule 5) — human skips
2. Family member invitation in intro (Rule 5) — human puts this in closing section
3. Standalone "Who Is Responsible?" section (Rule 4) — human reframes as "What Lawsuits Allege"
4. Trust Banner (Rule 12) — human relies on site component
5. Parallel case in news (Rule 21) — I included Johns Hopkins $190M; human embeds precedent in civil lawsuits section
6. Standalone Impact section (Rule 4) — human omits entirely
7. More FAQs (9 vs. 4) — mine includes Weill Cornell, children, compensation, privacy in filing
8. Standalone "Why Now" section (Rule 18) — human distributes across other sections
9. Explicit "What reaching out does/doesn't do" (Rule 22) — human includes this but in a lighter, less structured way

---

## PART 4: CASE-TYPE ADAPTATION INSIGHTS

The 8 cases span very different case types, and the comparison reveals that some rules need to flex based on case type. Here's what I observed:

### Privacy/Surveillance Cases (Northwell)

- **Shame barriers are different.** Not "what if I don't remember" but "was I even recorded?" and "I'm not sure this really affected me." Rule 19 needs to acknowledge that shame takes different forms for different case types.
- **No physical contact means cooler emotional temperature.** The moral-principle opening feels forced. A factual narrative opening works better.
- **The notification delay IS the story.** For cases where institutional failure is about delayed disclosure rather than enabling abuse, the delay deserves its own section.
- **Qualifying questions in CTAs beat emotional statements.** When the potential claimant pool is 13,000+ people who may not know they were affected, helping them self-identify is more useful than validating feelings they may not have yet.

### Elder Abuse/Nursing Home Cases (Lumbi)

- **Audience is family members, not victims.** The victim is deceased. Every section needs to speak to the family's experience and guilt, not the patient's trauma.
- **Shame barriers are about family guilt.** "Should I have done more?" "Should I have moved them sooner?" Rule 19 needs to name these specifically.
- **Legal education focuses on institutional negligence frameworks** (EADACPA, facility inspection records, staffing ratios) rather than SOL reforms.

### Clergy/Institutional Abuse (Washington)

- **Scale requires scope management.** When a case spans 3 dioceses, multiple religious orders, and 1,000+ victims, the page needs to help the reader find themselves in the case — which diocese, which era, which institution.
- **Legal landscape is layered.** Discovery rule + specific SOL legislation + mandatory reporting law + AG investigation. Legal education sections need to handle multiple frameworks without becoming a law review article.
- **Emotional temperature is medium** — between the warmth of juvenile cases and the coolness of privacy cases.

### Individual Defendant Medical Cases (Clyne)

- **The defendant IS the search query.** SEO strategy centers on the named defendant, not the institution. Headings should include the defendant's name.
- **Denial matters.** When a specific person is accused, including their denial creates credibility and distinguishes the page from a hit piece.
- **Cooler temperature.** The reader is likely someone who was this person's patient and is researching whether what happened to them was abuse. They need facts and validation, not emotional framing.

### Sex Trafficking Cases (Alexander Brothers)

- **Criminal proceedings are the anchor.** When the defendants are convicted, the criminal case provides the factual foundation. The page leads with what's been established.
- **Victim identification is sensitive.** Trafficking victims may not self-identify as victims. Language needs to be careful about labeling.

---

## PART 5: QUESTIONS FOR THE HUMAN WRITER

These questions are designed to resolve the contradictions between what the original test cases showed and what the new cases show. The answers will determine whether to revise the rules.

### On the Moral-Principle Opening (Rule 5)

1. **In the original NYC Juvenile and CA Prison cases, you opened with a moral principle ("Children held in juvenile detention centers were supposed to be safe"). In all 5 new cases, you open with a factual case briefing. Was this a deliberate change in approach, or is the principle opening specific to certain case types?**

2. **If it's case-type specific, what determines when you use a principle opening vs. a factual opening? Is it the victim population (children vs. adults)? The severity of the harm? The emotional distance the reader likely has from the events?**

### On the Family Invitation in the Intro (Rule 5)

3. **In the NYC Juvenile case, you included "whether you experienced this firsthand or you're here for someone you love" in the intro. In the new cases, you consistently push family acknowledgment to the closing section or FAQ. Why the change?**

4. **Is the intro now reserved purely for case briefing, with emotional onboarding happening later in the page? Or was the NYC Juvenile intro family language an exception because the victims were minors?**

### On Standalone Sections (Rule 4)

5. **You consistently omit standalone Impact on Victims, Compensation, and Why Now sections in the new cases. The content is either distributed into other sections or dropped entirely. Was this a deliberate decision to make pages leaner, or do you still see these as important content that just doesn't need its own heading?**

6. **The Compensation section is absent from ALL 5 new cases. Was this a legal risk decision (not wanting to list specific damage categories), a content strategy decision (too generic), or something else?**

7. **The "Why Survivors Are Coming Forward Now" section was standalone in the CA Prison case but is distributed or absent in all 5 new cases. Do you still see this as valuable content? If so, where does it belong?**

### On Shame Anticipation (Rule 19)

8. **In the NYC Juvenile case, you used standalone shame-anticipation callouts ("Memory gaps are normal," "Your custody status does not define your rights"). In the new cases, you embed this validation within other sections. Was the standalone approach something you moved away from? Did it feel too visible as a technique?**

9. **For the Northwell case, the shame barrier is "was I even recorded?" rather than "was what happened to me abuse?" How do you think about identifying the specific shame barrier for each case type? Is there a framework, or is it intuitive?**

### On Emotional Temperature

10. **The new cases are all significantly cooler in tone than the original test cases. No "courage," no "we are here to listen," no "reaching out takes courage" anywhere. Was this a deliberate decision to lower the emotional temperature across all cases, or is it that the original test cases (children in custody, incarcerated women) warranted warmer language that these cases don't?**

11. **Where do you see the line between emotional warmth that builds trust and emotional warmth that reads as performative in a legal context?**

### On the Defendant's Denial

12. **You include the defendant/institution's response or denial in 4 of 5 new cases. This is completely absent from the 22 rules. Is this a legal requirement, a credibility strategy, or both? When do you include it and when do you leave it out?**

### On Section Framing

13. **In the new cases, you reframe "Who Is Responsible?" as "Which Agencies Are Named in Civil Claims?" (Clyne) or "What Civil Lawsuits Allege" (Northwell). The reframing shifts from theoretical liability to describing what's actually happening in litigation. Was this intentional? Is there a reason the litigation-framing is better than the liability-framing?**

14. **The Northwell case gives the notification delay its own standalone section — it doesn't bury it inside a broader institutional failures section. This feels like you're identifying the single most conversion-relevant institutional failure and elevating it. Is that the thinking? How do you decide which failure gets elevated?**

### On FAQ Strategy

15. **Your FAQs in the new cases are highly case-specific and reference actual events, legal proceedings, or specific aspects of the case. The rules say "validate before redirecting" but don't address the SEO/AIO/GEO purpose of FAQs. How do you decide which questions to include? Are you writing for people who would type these into Google/ChatGPT?**

16. **Your FAQ counts range from 4 (Northwell) to 8+ (other cases). What determines how many FAQs a page needs? Is it the complexity of the case, the number of distinct reader questions, or SEO targeting?**

### On the Overall Direction

17. **Looking at all 8 cases together — 3 original test cases plus 5 new ones — do you see your approach as having evolved, or do you see the new cases as simply requiring a different treatment than the originals? In other words: if you rewrote the NYC Juvenile page today, would it look different from the original?**

18. **The original test cases produced rules that emphasize emotional warmth, standalone persuasion sections, and explicit shame-anticipation callouts. The new cases are cooler, leaner, and more integrated. If you had to describe the shift in one sentence, what would you say changed?**

---

## PART 6: RECOMMENDED VOICE RULE REVISIONS

Based on the 8-case audit, here are specific revisions to consider. These should be reviewed AFTER the human writer answers the questions above.

### Rules to Revise

**Rule 3 (Question-format headings):** Add exception: "SEO-critical sections (Timeline, News, FAQ) should use keyword-rich statement headings that match search queries, not question format."

**Rule 4 (Required sections):** Change from required SECTIONS to required CONTENT. The following content must appear somewhere on the page, but not necessarily as standalone sections: institutional accountability, impact acknowledgment, legal options/process, compensation possibilities. Sections that remain mandatory as standalone: What You Need to Know, Timeline, FAQ, CTAs, How HLG Supports. Sections that are now "required content, flexible placement": Impact, Compensation, Why Now, Who Is Responsible.

**Rule 5 (Moral principle opening):** Make case-type dependent. Warm/principle openings for cases involving children in custody or incarcerated populations. Factual narrative openings for individual defendant cases, privacy violations, and elder abuse. Move family invitation from intro to "How HLG Supports" section, with optional intro inclusion for cases involving minors.

**Rule 9 (Word count):** Expand range. 2,100–2,800 for standard cases; 3,000–3,500 for fact-dense cases with institutional timelines, multiple facilities, or complex legal frameworks.

**Rule 14 (Subheadline):** Keep firm-positioning as default. Note that single-defendant or geographically specific cases may benefit from reader-oriented subheadlines that name the location or population instead.

**Rule 18 (Why Now):** Downgrade from mandatory standalone section to recommended content. "Why now" arguments can be distributed across legal, timeline, and news sections. Standalone section is appropriate when there's a specific legal deadline or lookback window closing.

**Rule 19 (Shame anticipation):** Change from "standalone callouts" to "embedded validation." Name the specific shame barrier for the case type (memory gaps for assault, family guilt for elder abuse, "was I even recorded?" for surveillance, custody stigma for juvenile/prison). Embed in contextually appropriate sections rather than as standalone moments.

**Rule 21 (Parallel cases in news):** Downgrade from required to optional. If included, embed legal precedent within the body (e.g., civil lawsuits section) rather than as a separate news item. Use only when the parallel case directly strengthens the legal argument or helps the reader recognize their situation.

### Rules to Add

**NEW RULE: Include the defendant/institution's response.** When the defendant or institution has made a public statement or denial, include it. This builds credibility through fairness and distinguishes the page from one-sided advocacy. Omit only when no public response exists.

**NEW RULE: News in reverse chronological order.** Most recent and most conversion-relevant items first.

**NEW RULE: Calibrate emotional temperature to case type.** Cases involving children in custody or incarcerated populations warrant warmer emotional framing. Individual defendant cases, privacy violations, and elder abuse cases warrant cooler, more factual framing. The facts should carry the emotional weight; the writer's job is restraint.

**NEW RULE: Elevate the single most conversion-relevant institutional failure.** Identify the one failure that will make readers angriest or most motivated to act — and give it structural prominence (its own section heading, its own dedicated paragraphs). For surveillance cases, this is the notification delay. For facility abuse cases, it's typically the ignored complaints or reports.

**NEW RULE: "What You Need to Know" is a scannable fact block.** Use bullet points with key facts: who, what, when, current status, who may have a claim. Not a narrative section.

**NEW RULE: Legal sections as reader Q&A.** Structure legal content as specific questions a reader would ask, not as statute explainers. Embed legal framework names and details in the answers.

### Tone Principles Update

Add to the meta-layer: **"Match the temperature to the harm."** The current tone principles address prosecutorial heat vs. controlled authority — but they don't address the warmth spectrum. A case involving children who were sexually abused in custody warrants different emotional register than a privacy violation involving hidden cameras in a medical facility bathroom. Both require controlled authority. But the first earns warmth; the second earns clinical precision.

---

## SUMMARY: THE CENTRAL TENSION

The 22 rules were built from 3 test cases that skewed toward warm, emotionally present, standalone-section-heavy pages. The human writer's 5 new cases are cooler, leaner, and more integrated. Either:

**A) The human writer's approach has evolved** — they've moved toward a more restrained, fact-forward style that trusts the reader more and uses fewer standalone persuasion sections. The rules need to catch up.

**B) The original test cases were specific** — cases involving children in custody and incarcerated women warranted a different approach than individual medical defendants, privacy violations, elder abuse, and clergy institutional cases. The rules were over-fitted to a case type, not to a universal style.

**C) Some combination** — the writer has gotten more confident AND the case types are genuinely different. The rules need both a universal layer (tone principles, SEO, structure) and a case-type-specific layer (emotional temperature, shame barriers, standalone vs. integrated sections).

The questions for the human writer (Part 5) are designed to determine which of these is true. The rule revisions (Part 6) assume the answer is mostly (C) — but they should be validated by the writer's responses before implementation.
