import dummyCasesJson from "@/data/dummy-cases.json";

type CaseListItem = {
  id: string;
  title: string;
  slug: string;
  case_type: string | null;
  category: string | null;
  hero_eyebrow: string | null;
  hero_headline?: string | null;
  hero_subheadline: string | null;
  hero_background_image?: string | null;
  page_type: string | null;
  phone_number?: string | null;
  display_number?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_canonical?: string | null;
  seo_image?: string | null;
  seo_schema_type?: string | null;
  updated_at?: string | null;
  final_cta_headline?: string | null;
  final_cta_button?: string | null;
  final_cta_background_image?: string | null;
};

type CaseSection = {
  id: string;
  case_id: string;
  section_type: string;
  sort_order: number;
  visible: boolean;
  content: Record<string, unknown>;
};

type CaseFaq = {
  id: string;
  case_id: string;
  question: string;
  answer: string;
  sort_order: number;
};

type CaseDetail = {
  sections: CaseSection[];
  faqs: CaseFaq[];
};

const dummyCases = dummyCasesJson as {
  cases: CaseListItem[];
  caseDetails: Record<string, CaseDetail>;
};

export function getDummyCases(): CaseListItem[] {
  return dummyCases.cases;
}

export function getDummyCaseBySlug(slug: string): CaseListItem | null {
  return dummyCases.cases.find((item) => item.slug === slug) ?? null;
}

export function getDummyCaseSections(slug: string): CaseSection[] {
  return dummyCases.caseDetails[slug]?.sections ?? [];
}

export function getDummyCaseFaqs(slug: string): CaseFaq[] {
  return dummyCases.caseDetails[slug]?.faqs ?? [];
}
