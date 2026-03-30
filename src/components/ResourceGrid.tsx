"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

const FILTER_CATEGORIES = [
  "All",
  "General",
  "Medical abuse",
  "Clergy abuse",
  "Juvenile detention",
  "Online platforms",
  "Breaking news",
];

const CATEGORY_STYLES: Record<string, string> = {
  "Breaking news": "bg-red-100 text-red-700",
  "Medical abuse": "bg-blue-100 text-blue-700",
  "Clergy abuse": "bg-purple-100 text-purple-700",
  "Juvenile detention": "bg-amber-100 text-amber-700",
  "Online platforms": "bg-teal-100 text-teal-700",
  General: "bg-navy-100 text-navy-700",
};

const DEFAULT_BADGE = "bg-navy-50 text-navy-600";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  published_at: string | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ResourceGrid({ posts }: { posts: Post[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = posts;

    if (activeFilter !== "All") {
      result = result.filter(
        (p) =>
          p.category?.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [posts, activeFilter, searchQuery]);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-warm-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-full border border-navy-200 bg-white pl-10 pr-4 py-2 text-sm text-navy-900 placeholder:text-slate-warm-400 focus:outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-300"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === cat
                    ? "bg-navy-800 text-white"
                    : "bg-navy-50 text-navy-700 hover:bg-navy-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article count */}
        <p className="text-sm text-slate-warm-500 mb-6">
          Showing {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Cards */}
        {filtered.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link
                key={post.id}
                href={`/resources/${post.slug}`}
                className="group flex flex-col rounded-xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      CATEGORY_STYLES[post.category || ""] || DEFAULT_BADGE
                    }`}
                  >
                    {post.category || "General"}
                  </span>
                  <span className="text-xs text-slate-warm-400">
                    {formatDate(post.published_at)}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-navy-900 leading-snug group-hover:text-navy-700">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="mt-2 text-sm text-slate-warm-500 line-clamp-3 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                )}

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 group-hover:text-gold-600 transition-colors">
                  Read more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-warm-500">
              No articles match your search. Try a different term or category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
