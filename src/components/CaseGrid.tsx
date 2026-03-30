"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FILTER_CATEGORIES = [
  "All",
  "Clergy and Religious Institution Abuse",
  "Medical Abuse",
  "Online Platform Harm",
  "Social Media Addiction",
  "Sexual Abuse and Institutional Harm",
  "Juvenile Detention Abuse",
  "Foster Care Abuse",
  "Rideshare Assault",
  "Unsafe Products",
];

interface CaseItem {
  id: string;
  title: string;
  slug: string;
  case_type: string | null;
  category: string | null;
  hero_eyebrow: string | null;
  hero_subheadline: string | null;
  page_type: string | null;
}

export function CaseGrid({ cases }: { cases: CaseItem[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? cases
      : cases.filter((c) => c.category === activeFilter);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-10">
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

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/cases/${c.slug}`}
              className="group relative rounded-xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-navy-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                {c.category && (
                  <span className="inline-flex items-center rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-700 uppercase tracking-wide">
                    {c.category}
                  </span>
                )}
                <ArrowRight className="h-4 w-4 text-navy-300 transition-transform group-hover:translate-x-1 group-hover:text-gold-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-navy-900 leading-snug group-hover:text-navy-700">
                {c.title}
              </h3>
              {c.hero_subheadline && (
                <p className="mt-2 text-sm text-slate-warm-500 line-clamp-3 leading-relaxed">
                  {c.hero_subheadline}
                </p>
              )}
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-warm-500">
              No cases in this category yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
