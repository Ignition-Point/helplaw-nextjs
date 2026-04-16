import dummyResourcesJson from "@/data/dummy-resources.json";

type ResourceListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  published_at: string | null;
};

type ResourceFaq = {
  id: string;
  blog_post_id: string;
  question: string;
  answer: string;
  sort_order: number;
};

type ResourceDetail = ResourceListItem & {
  author_name: string | null;
  featured_image: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_canonical: string | null;
  seo_image: string | null;
  seo_noindex: boolean | null;
  updated_at: string | null;
  created_at: string | null;
  faqs: ResourceFaq[];
};

const dummyResources = dummyResourcesJson as {
  resources: ResourceListItem[];
  resourceDetails: Record<string, ResourceDetail>;
};

export function getDummyResources(): ResourceListItem[] {
  return dummyResources.resources;
}

export function getDummyResourceBySlug(slug: string): ResourceDetail | null {
  return dummyResources.resourceDetails[slug] ?? null;
}

export function getDummyResourceFaqs(slug: string): ResourceFaq[] {
  return dummyResources.resourceDetails[slug]?.faqs ?? [];
}
