import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CaseGrid } from "@/components/CaseGrid";

export const metadata: Metadata = {
  title: "Our Cases",
  description:
    "Attorneys in our network are actively reviewing cases involving abuse, unsafe products, and platform harm. Learn more and find out if you have legal options.",
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

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Our Cases" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Our Cases
            </h1>
            <p className="mt-4 text-lg text-navy-200 leading-relaxed">
              Attorneys in our network are actively reviewing cases in these
              areas. If you or someone you know experienced this kind of harm,
              you may have legal options. Select a case to learn more.
            </p>
          </div>
        </div>
      </section>

      {/* Case filter + cards */}
      <CaseGrid cases={cases} />

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 bg-navy-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Have a Situation That Is Not Listed Here?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy-200 leading-relaxed">
            We review cases across a range of harm types. If you are not sure
            whether your situation qualifies, a free case evaluation is the
            place to find out.
          </p>
          <Link
            href="/cases"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-base font-semibold text-navy-950 transition-all hover:bg-gold-400"
          >
            Get a Free Case Evaluation
          </Link>
        </div>
      </section>
    </>
  );
}
