import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Resources & Legal Guidance",
  description:
    "Expert legal guidance on mass torts, class actions, and data breaches. Learn about your rights and legal options.",
};

export const revalidate = 60;

async function getPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, category, featured_image, published_at, author_name")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export default async function ResourcesPage() {
  const posts = await getPosts();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Resources" },
        ]}
      />

      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-sm font-medium tracking-wider uppercase text-gold-400">
                Resources
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Information That Can Help
            </h1>
            <p className="mt-4 text-lg text-navy-200 leading-relaxed">
              Our resources cover common questions about case eligibility, the legal process, and what to expect at each stage.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/resources/${post.slug}`}
                  className="group rounded-2xl border border-navy-100 bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  {post.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                      {post.category}
                    </span>
                    <h2 className="mt-2 text-lg font-semibold text-navy-900 leading-snug group-hover:text-navy-700">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-slate-warm-500 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <span className="mt-4 inline-block text-sm font-semibold text-navy-700 group-hover:text-gold-600 transition-colors">
                      Read More
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-warm-500">No articles published yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
