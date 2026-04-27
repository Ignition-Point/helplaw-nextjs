import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CaseGrid } from "@/components/CaseGrid";
import { getDummyCases } from "@/lib/dummyCases";
import { shouldUseDummyCases } from "@/lib/featureFlags";

export const metadata: Metadata = {
  title: "Our Cases",
  description:
    "Attorneys in our network are actively reviewing cases involving abuse, unsafe products, and platform harm. Learn more and find out if you have legal options.",
};

export const revalidate = 60;

async function getCases() {
  if (shouldUseDummyCases()) {
    return getDummyCases();
  }

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
      <section className="bg-[#1A365E] py-[30px] md:py-[60px] lg:py-[80px]">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="heading text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] leading-[120%] text-white tracking-tight">
              Our <span className="text-[#FFBF0F]">Cases</span>
            </h1>
            <p className="mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg text-white font-normal leading-[140%]">
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
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-[#09162A]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[1.2] text-white tracking-tight">
            Have a Situation That Is Not <span className="text-[#FFBF0F]">Listed Here?</span>
          </h2>
          <p className="mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg text-white leading-[140%]">
            We review cases across a range of harm types. If you are not sure
            whether your situation qualifies, a free case evaluation is the
            place to find out.
          </p>
          <Link
            href="/cases"
            className="mt-[14px] md:mt-6 inline-flex items-center justify-center rounded-full bg-white text-[#122D56] font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  px-[24px] py-[16px] transition-all hover:bg-navy-800 hover:text-white"
          >
            Get a Free Case Evaluation
          </Link>
        </div>
      </section>
    </>
  );
}
