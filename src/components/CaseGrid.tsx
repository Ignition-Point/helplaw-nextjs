"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PreventWidowText from "./PreventWidowText";

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
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const centerActiveFilter = (cat: string) => {
    const bar = filterBarRef.current;
    const btn = filterButtonRefs.current[cat];
    if (!bar || !btn) return;
    // Only auto-center when the row is actually scrollable (mobile).
    if (bar.scrollWidth <= bar.clientWidth) return;

    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const delta =
      btnRect.left + btnRect.width / 2 - (barRect.left + barRect.width / 2);
    const targetLeft = bar.scrollLeft + delta;

    const maxLeft = Math.max(0, bar.scrollWidth - bar.clientWidth);
    const nextLeft = Math.min(maxLeft, Math.max(0, targetLeft));

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    bar.scrollTo({ left: nextLeft, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const filtered =
    activeFilter === "All"
      ? cases
      : cases.filter((c) => c.category === activeFilter);

  useEffect(() => {
    // Keep active tab visible/centered when filter changes.
    // rAF ensures layout measurements are correct after React updates.
    const id = requestAnimationFrame(() => centerActiveFilter(activeFilter));
    return () => cancelAnimationFrame(id);
  }, [activeFilter]);

  return (
    <>
    <PreventWidowText />
    <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-white">
      <div className="mx-auto max-w-7xl px-5">
        {/* Filter bar */}
        <div
          ref={filterBarRef}
          className="flex flex-nowrap whitespace-nowrap md:whitespace-normal overflow-auto md:flex-wrap scrollbar-hide gap-2 mb-[20px] md:mb-6 lg:mb-10"
        >
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              ref={(el) => {
                filterButtonRefs.current[cat] = el;
              }}
              onClick={() => {
                setActiveFilter(cat);
                requestAnimationFrame(() => centerActiveFilter(cat));
              }}
              className={` rounded-full cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === cat
                  ? "bg-[#122D56] text-white"
                  : "bg-navy-50 text-[#122D56] hover:bg-navy-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-[14px] md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/cases/${c.slug}`}
              className="group relative bg-white border border-[#F0F0F0] p-[15px] lg:p-[24px] rounded-[12px] lg:rounded-[16px] shadow-[0px_8px_80px_-12px_rgba(0,0,0,0.08)] hover:bg-[#F6F6F6] hover:border-[#FFBF0F]  transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                {c.category && (
                  <span className="max-w-[calc(100%-30px)] inline-flex items-center rounded-full bg-navy-50 px-3 py-1.5 text-xs font-medium text-navy-700 uppercase tracking-wide">
                    {c.category}
                  </span>
                )}
                <ArrowRight className="h-4 w-4 text-[#122D56] transition-transform group-hover:translate-x-1 group-hover:text-[#FFBF0F]" />
              </div>
              <h3 className="heading mt-4 text-[16px] lg:text-lg font-semibold text-[#122D56] leading-[120%] group-hover:text-[#09162A]">
                {c.title}
              </h3>
              {c.hero_subheadline && (
                <p className="mt-2 text-sm text-[#546885] line-clamp-3 leading-[140%]">
                  {c.hero_subheadline.replace(/<[^>]+>/g, "")}
                </p>
              )}
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-4 md:py-6 lg:py-12">
            <p className="text-[14px] md:text-[16px] text-[#546885] leading-[140%] font-normal">
              No cases in this category yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
    </>
  );
}
