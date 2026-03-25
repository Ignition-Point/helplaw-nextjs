import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Active Cases & Investigations",
  description:
    "Browse active mass tort, class action, and data breach investigations. Find out if you qualify for compensation with a free case review.",
};

export const revalidate = 60;

async function getCases() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cases")
    .select("id, title, slug, case_type, category, hero_eyebrow, hero_subheadline, page_type")
    .eq("status", "active")
    .eq("page_type", "content")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function CasesPage() {
  const cases = await getCases();

  const massTorts = cases.filter((c) => c.case_type === "mass-tort");
  const classActions = cases.filter((c) => c.case_type === "class-action");
  const dataBreaches = cases.filter((c) => c.case_type === "data-breach");

  const sections = [
    { label: "Mass Torts", items: massTorts },
    { label: "Class Actions", items: classActions },
    { label: "Data Breaches", items: dataBreaches },
  ].filter((s) => s.items.length > 0);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cases" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-sm font-medium tracking-wider uppercase text-gold-400">
                Active Investigations
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Cases We&apos;re Fighting
            </h1>
            <p className="mt-4 text-lg text-navy-200 leading-relaxed">
              Our attorneys are currently investigating and litigating cases nationwide.
              Select a case to learn more and find out if you qualify.
            </p>
          </div>
        </div>
      </section>

      {/* Case listings by type */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {sections.map(({ label, items }) => (
            <div key={label}>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">{label}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <Link
                    key={c.id}
                    href={`/cases/${c.slug}`}
                    className="group relative rounded-xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-navy-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between">
                      <span className="inline-flex items-center rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-700 uppercase tracking-wide">
                        {c.case_type?.replace("-", " ")}
                      </span>
                      <ArrowRight className="h-4 w-4 text-navy-300 transition-transform group-hover:translate-x-1 group-hover:text-gold-500" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-navy-900 leading-snug group-hover:text-navy-700">
                      {c.title}
                    </h3>
                    {c.hero_subheadline && (
                      <p className="mt-2 text-sm text-slate-warm-500 line-clamp-2 leading-relaxed">
                        {c.hero_subheadline}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {cases.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-warm-500">No active cases at this time. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
