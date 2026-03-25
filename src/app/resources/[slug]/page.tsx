import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { FAQSection } from "@/components/blocks/FAQSection";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StickyTableOfContents } from "@/components/StickyTableOfContents";

export const revalidate = 60;

type PageParams = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

async function getPostFaqs(postId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_post_faqs")
    .select("*")
    .eq("blog_post_id", postId)
    .order("sort_order");
  return data ?? [];
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };

  // Smart description fallback
  let description = post.seo_description;
  if (!description) {
    const excerpt = (post.excerpt as string) || "";
    if (excerpt) {
      const suffix = " Learn more about your legal options.";
      if (excerpt.length <= 155 - suffix.length) {
        description = excerpt + suffix;
      } else if (excerpt.length <= 155) {
        description = excerpt;
      } else {
        description = excerpt.slice(0, 152) + "...";
      }
    } else {
      description = "";
    }
  }

  const canonical = post.seo_canonical || `https://helplaw.com/resources/${slug}`;
  const ogImage = post.seo_image || post.featured_image || "/assets/og-default.jpg";

  return {
    title: post.seo_title || post.title,
    description,
    robots: post.seo_noindex ? { index: false } : { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.seo_title || post.title,
      description,
      images: [{ url: ogImage }],
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title || post.title,
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
    const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    headings.push({ level: parseInt(match[1]), text, anchor });
  }
  return headings;
}

function injectAnchors(html: string, headings: { text: string; anchor: string }[]) {
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

  const faqs = await getPostFaqs(post.id);
  const headings = extractHeadings(post.content || "");
  const contentWithAnchors = injectAnchors(post.content || "", headings);

  // JSON-LD
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.seo_description || post.excerpt || "",
        author: { "@type": "Person", name: post.author_name || "Help Law Group" },
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at,
        publisher: { "@type": "Organization", name: "Help Law Group", url: "https://helplaw.com" },
        ...(post.seo_image || post.featured_image ? { image: post.seo_image || post.featured_image } : {}),
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
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            {post.category}
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-navy-300">
            By {post.author_name || "Help Law Group"}
            {post.published_at && (
              <> &middot; {new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</>
            )}
            {post.updated_at && (
              <> &middot; Updated {new Date(post.updated_at as string).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</>
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
      <article className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile ToC */}
          {headings.length > 2 && (
            <div className="lg:hidden max-w-3xl mx-auto">
              <StickyTableOfContents
                headings={headings.map((h) => ({ id: h.anchor, text: h.text, level: h.level }))}
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

              {/* FAQs */}
              {faqs.length > 0 && (
                <div className="mt-12">
                  <FAQSection
                    headline="Frequently Asked Questions"
                    items={faqs.map((f) => ({ question: f.question, answer: f.answer }))}
                    variant="light"
                  />
                </div>
              )}

              {/* Back link */}
              <div className="mt-12 pt-8 border-t border-navy-100">
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-gold-600 transition-colors"
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
                  headings={headings.map((h) => ({ id: h.anchor, text: h.text, level: h.level }))}
                />
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
