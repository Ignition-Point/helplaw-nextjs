import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  sanitizeMetaDescription,
  sanitizeSeoTitle,
  sanitizeCanonical,
  sanitizeHtml,
} from "@/lib/content-sanitize";
import { FAQSection } from "@/components/blocks/FAQSection";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StickyTableOfContents } from "@/components/StickyTableOfContents";
import {
  getDummyResourceBySlug,
  getDummyResourceFaqs,
} from "@/lib/dummyResources";
import { shouldUseDummyResources } from "@/lib/featureFlags";
import PreventWidowText from "@/components/PreventWidowText";

export const revalidate = 60;

type PageParams = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  if (shouldUseDummyResources()) {
    return getDummyResourceBySlug(slug);
  }

  const supabase = await createClient();

  // Try exact slug match first
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (data) return data;

  // Fallback: slug may have been stored with a path prefix (e.g. "/resources/slug")
  const { data: fallback } = await supabase
    .from("blog_posts")
    .select("*")
    .like("slug", `%${slug}`)
    .eq("status", "published")
    .single();
  return fallback;
}

async function getPostFaqs(postId: string) {
  if (shouldUseDummyResources()) {
    return getDummyResourceFaqs(postId);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_post_faqs")
    .select("*")
    .eq("blog_post_id", postId)
    .order("sort_order");
  return data ?? [];
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };

  // Description: sanitizer truncates at word boundary if needed
  const descSource = (post.seo_description as string)
    || ((post.excerpt as string) ? `${post.excerpt} Learn more about your legal options.` : "");
  const description = sanitizeMetaDescription(descSource).value;

  // Canonical: sanitizer fills missing, forces https, strips trailing slash
  const canonical = sanitizeCanonical(post.seo_canonical as string | undefined, `resources/${slug}`).value;

  // SEO title: ensure brand presence and length cap
  const seoTitle = sanitizeSeoTitle(post.seo_title as string | undefined, post.title as string | undefined).value;

  const canonical = sanitizeCanonical(post.seo_canonical as string | undefined, `resources/${slug}`).value;
  const ogImage =
    post.seo_image || post.featured_image || "/assets/og-default.jpg";

  return {
    title: seoTitle,
    description,
    robots: post.seo_noindex ? { index: false } : { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: seoTitle,
      description,
      images: [{ url: ogImage }],
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: [ogImage],
    },
  };
}

function extractHeadings(html: string) {
  const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi;
  const headings: { level: number; text: string; anchor: string }[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const anchor = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ level: parseInt(match[1]), text, anchor });
  }
  return headings;
}

function injectAnchors(
  html: string,
  headings: { text: string; anchor: string }[],
) {
  let result = html;
  headings.forEach((h) => {
    const escaped = h.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(<h[2-3][^>]*>)(${escaped})`, "i");
    result = result.replace(regex, `$1<span id="${h.anchor}"></span>$2`);
  });
  return result;
}

export default async function BlogPostPage({ params }: PageParams) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const faqs = await getPostFaqs(shouldUseDummyResources() ? slug : post.id);
  // Sanitize body HTML before extracting headings — strips inline h1/h2,
  // ensures img attrs, removes empty paragraphs.
  const sanitizedContent = sanitizeHtml(post.content || "").value;
  const headings = extractHeadings(sanitizedContent);
  const contentWithAnchors = injectAnchors(sanitizedContent, headings);

  // JSON-LD
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.seo_description || post.excerpt || "",
        author: {
          "@type": "Person",
          name: post.author_name || "Help Law Group",
        },
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at,
        publisher: {
          "@type": "Organization",
          name: "Help Law Group",
          url: "https://helplaw.com",
        },
        ...(post.seo_image || post.featured_image
          ? { image: post.seo_image || post.featured_image }
          : {}),
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
     <PreventWidowText />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: post.title },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-[#1A365E]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FFBF0F]">
            {post.category}
          </span>
          <h1 className="mt-3 heading text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] text-white tracking-tight">
            {post.title}
          </h1>
          <p className="mt-[14px] md:mt-4 mb-[14px] md:mb-0 text-[14px] md:text-base lg:text-lg text-white leading-[140%]">
            By {post.author_name || "Help Law Group"}
            {post.published_at && (
              <>
                {" "}
                &middot;{" "}
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </>
            )}
            {post.updated_at && (
              <>
                {" "}
                &middot; Updated{" "}
                {new Date(post.updated_at as string).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </>
            )}
          </p>
        </div>
      </section>

      {/* Featured image */}
      {post.featured_image && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="relative aspect-[2/1] rounded-xl overflow-hidden shadow-xl">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>
        </div>
      )}

      {/* Article body */}
      <article className="py-[30px] md:py-[40px] lg:py-[60px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile ToC */}
          {headings.length > 2 && (
            <div className="lg:hidden max-w-3xl mx-auto">
              <StickyTableOfContents
                headings={headings.map((h) => ({
                  id: h.anchor,
                  text: h.text,
                  level: h.level,
                }))}
              />
            </div>
          )}

          <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12 max-w-4xl mx-auto">
            {/* Main content */}
            <div className="max-w-3xl">
              {/* Content */}
              <div
                className="prose-helplaw"
                dangerouslySetInnerHTML={{ __html: contentWithAnchors }}
              />

              {/* Back link */}
              <div className="mt-12 pt-8 border-t border-navy-100">
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#122D56] hover:text-[#FFBF0F] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Resources
                </Link>
              </div>
            </div>

            {/* Desktop ToC sidebar */}
            {headings.length > 2 && (
              <div className="hidden lg:block">
                <StickyTableOfContents
                  headings={headings.map((h) => ({
                    id: h.anchor,
                    text: h.text,
                    level: h.level,
                  }))}
                />
              </div>
            )}
          </div>
        </div>
      </article>
      {/* FAQs */}
      {faqs.length > 0 && (
        <div className="mt-12">
          <FAQSection
            headline="Frequently Asked Questions"
            items={faqs.map((f) => ({
              question: f.question,
              answer: f.answer,
            }))}
            variant="light"
          />
        </div>
      )}
    </>
  );
}
