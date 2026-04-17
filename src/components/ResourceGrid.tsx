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
    <section className="py-[40px] md:py-[60px] lg:py-[80px] bg-white">
      <div className="mx-auto max-w-7xl px-5">
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
                className={`rounded-full cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === cat
                    ? "bg-[#122D56] text-white"
                    : "bg-navy-50 text-[#122D56] hover:bg-navy-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article count */}
        <p className="text-sm text-[#546885] mb-6">
          Showing {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Cards */}
        {filtered.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link
                key={post.id}
                href={`/resources/${post.slug}`}
                className="group flex flex-col overflow-hidden bg-white border border-[#F0F0F0] p-[12px] lg:p-[18px] rounded-[12px] lg:rounded-[16px] shadow-[0px_8px_80px_-12px_rgba(0,0,0,0.08)] hover:bg-[#F6F6F6] hover:border-[#D4AD4A]  transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-medium ${
                      CATEGORY_STYLES[post.category || ""] || DEFAULT_BADGE
                    }`}
                  >
                    {post.category || "General"}
                  </span>
                  <span className="text-xs text-[#546885]">
                    {formatDate(post.published_at)}
                  </span>
                </div>

                <h2 className="heading text-lg font-semibold text-[#122D56] leading-snug group-hover:text-[#09162A]">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="mt-2 text-sm text-[#546885] line-clamp-3 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-[12px] lg:mt-[20px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="350"
                    height="1"
                    viewBox="0 0 350 1"
                    fill="none"
                  >
                    <line
                      opacity="0.2"
                      y1="0.5"
                      x2="350"
                      y2="0.5"
                      stroke="url(#paint0_linear_391_46)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_391_46"
                        x1="0"
                        y1="1.5"
                        x2="350"
                        y2="1.5"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="white" />
                        <stop offset="0.504808" stop-color="#1C385F" />
                        <stop offset="1" stop-color="white" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 font-medium text-[14px] lg:text-[16px] leading-[100%] tracking-[0%] text-[#D4AD4A] group-hover:text-[#132F55] transition-colors">
                  Read more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.5 5.625C7.15482 5.625 6.875 5.34518 6.875 5C6.875 4.65482 7.15482 4.375 7.5 4.375H15C15.3452 4.375 15.625 4.65482 15.625 5V12.5C15.625 12.8452 15.3452 13.125 15 13.125C14.6548 13.125 14.375 12.8452 14.375 12.5V6.50888L5.44194 15.4419C5.19786 15.686 4.80214 15.686 4.55806 15.4419C4.31398 15.1979 4.31398 14.8021 4.55806 14.5581L13.4911 5.625H7.5Z"
                      fill="currentColor"
                    />
                  </svg>
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
