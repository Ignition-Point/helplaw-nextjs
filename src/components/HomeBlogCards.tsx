"use client";

import Link from "next/link";
import Image from "next/image";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  category: string;
  featured_image?: string | null;
}

export function HomeBlogCards({ posts }: { posts: PostItem[] }) {
  if (!posts.length) return null;

  return (
    <section className="py-20 sm:py-28 bg-slate-warm-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
              Information That Can Help
            </h2>
            <p className="mt-3 text-base text-slate-warm-500">
              Our resources cover common questions about case eligibility, the legal process, and what to expect at each stage.
            </p>
          </div>
          <Link
            href="/resources"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-navy-700 hover:text-gold-600 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/resources/${post.slug}`}
              className="group rounded-2xl border border-navy-100 bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {post.featured_image && (
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  {post.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-navy-900 leading-snug group-hover:text-navy-700">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-slate-warm-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-3 inline-block text-sm font-semibold text-navy-700 group-hover:text-gold-600 transition-colors">
                  Learn More
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/resources" className="text-sm font-semibold text-navy-700">
            View All Resources
          </Link>
        </div>
      </div>
    </section>
  );
}
