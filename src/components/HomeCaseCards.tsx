"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CaseItem {
  id: string;
  title: string;
  slug: string;
  case_type: string;
  hero_subheadline?: string | null;
  seo_image?: string | null;
}

export function HomeCaseCards({ cases }: { cases: CaseItem[] }) {
  if (!cases.length) return null;

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
            Cases We Are Currently Reviewing
          </h2>
          <p className="mt-4 text-base text-slate-warm-500 leading-relaxed">
            Attorneys in our network are actively reviewing cases in these areas. If you or someone you know experienced this kind of harm, you may have legal options.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <Link
              key={c.id}
              href={`/cases/${c.slug}`}
              className="group relative rounded-2xl border border-navy-100 bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:border-navy-200 hover:-translate-y-0.5"
            >
              {/* Image */}
              {c.seo_image && (
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={c.seo_image}
                    alt={c.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-navy-900 leading-snug group-hover:text-navy-700">
                  {c.title}
                </h3>
                {c.hero_subheadline && (
                  <p className="mt-2 text-sm text-slate-warm-500 line-clamp-2 leading-relaxed">
                    {c.hero_subheadline}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 group-hover:text-gold-600 transition-colors">
                  Check Eligibility
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 rounded-full border-2 border-navy-200 px-7 py-3 text-sm font-semibold text-navy-700 hover:border-navy-400 hover:bg-navy-50 transition-all"
          >
            See All Cases
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
