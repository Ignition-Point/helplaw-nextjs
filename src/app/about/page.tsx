import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Ear, Search, ShieldCheck, Lock, Users, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Help Law Group connects survivors of abuse, unsafe products, and institutional harm with experienced attorneys. Free case evaluations, no fees unless you win.",
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      {/* ─── SECTION 1: Hero ─── */}
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            About Help Law
          </h1>
          <p className="mt-6 text-base sm:text-lg text-navy-200 leading-relaxed max-w-3xl">
            Help Law Group connects individuals and families with attorneys who
            handle serious harm, including abuse by institutions and individuals,
            injuries caused by unsafe products, and harm facilitated by online
            platforms.
          </p>
          <p className="mt-4 text-base sm:text-lg text-navy-200 leading-relaxed max-w-3xl">
            Help Law Group is a law firm that also works with a broader network
            of attorneys and legal partners across the country. When you reach
            out, we review your situation and connect you with an attorney whose
            practice covers your type of case. The first conversation is free.
          </p>
        </div>
      </section>

      {/* ─── SECTION 2 & 3: Who We Are + By the Numbers ─── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Left: Who We Are */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 tracking-tight">
                Who We Are
              </h2>
              <p className="mt-6 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
                Help Law Group was built around a straightforward idea: people
                who have been seriously harmed deserve access to attorneys who
                know how to handle those specific cases. We connect survivors and
                their families with attorneys who have experience in abuse,
                institutional negligence, unsafe products, and platform harm.
              </p>
              <p className="mt-4 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
                Help Law Group is a law firm that also works with a broader
                network of attorneys and legal partners. Depending on your case
                type and location, you may work with Help Law Group attorneys
                directly or be connected with an attorney in our network who has
                specific experience in your area of harm.
              </p>
              <p className="mt-4 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
                Every attorney we work with takes cases on contingency. There are
                no upfront costs, and you owe nothing unless your case succeeds.
              </p>
            </div>

            {/* Right: By the Numbers */}
            <div className="grid grid-cols-2 gap-6 content-start">
              {[
                { number: "150+", label: "Attorneys in Our Network" },
                { number: "Nationwide", label: "Cases Reviewed Across the U.S." },
                { number: "Free", label: "Initial Case Evaluation" },
                { number: "No Fee", label: "Unless Your Case Succeeds" },
              ].map(({ number, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-navy-100 bg-navy-50/50 p-6 text-center"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-navy-900">
                    {number}
                  </p>
                  <p className="mt-2 text-sm text-slate-warm-500 leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: How We Approach Every Case ─── */}
      <section className="py-16 sm:py-20 bg-slate-warm-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 tracking-tight text-center">
            How We Approach Every Case
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Ear,
                title: "We Listen First",
                description:
                  "Every situation is different. Before we connect you with an attorney, we take the time to understand what happened and what kind of help you are looking for.",
              },
              {
                icon: Search,
                title: "We Match Carefully",
                description:
                  "We connect people with attorneys who have specific experience in their type of case, taking the time to understand your situation before making any referral.",
              },
              {
                icon: ShieldCheck,
                title: "No Pressure, No Obligation",
                description:
                  "Reaching out does not start a legal process. You are in control of every decision, including whether to move forward at all.",
              },
              {
                icon: Lock,
                title: "Confidentiality Is Not Optional",
                description:
                  "What you share with us stays private. Your information is never passed along without your consent.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-800">
                  <Icon className="h-5 w-5 text-gold-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-navy-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-warm-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: The Cases We Handle ─── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 tracking-tight">
            The Cases We Handle
          </h2>
          <p className="mt-6 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
            The attorneys in our network handle cases involving serious harm,
            including sexual abuse by medical professionals, clergy, and
            institutions; exploitation facilitated by online platforms; harm
            caused by unsafe products; and abuse in juvenile detention
            facilities.
          </p>
          <p className="mt-4 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
            These cases involve powerful institutions, complex legal processes,
            and survivors who have often been carrying their experiences for
            years. The attorneys we work with have handled exactly these kinds of
            cases before.
          </p>
          <p className="mt-4 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
            Every situation is different. When you reach out, your case is
            reviewed by someone who understands the legal landscape and can
            explain what your options actually are.
          </p>
        </div>
      </section>

      {/* ─── SECTION 6: Available Across the Country ─── */}
      <section className="py-16 sm:py-20 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Left: copy */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Available Across the Country
              </h2>
              <p className="mt-6 text-base sm:text-lg text-navy-200 leading-relaxed">
                The attorneys in our network are licensed across multiple states
                and handle cases nationwide. No matter where you are located or
                where the harm occurred, we can review your situation and connect
                you with the right attorney.
              </p>
              <p className="mt-4 text-base sm:text-lg text-navy-200 leading-relaxed">
                Reaching out takes minutes. A real person will follow up with
                every inquiry directly.
              </p>
            </div>

            {/* Right: stat items */}
            <div className="flex flex-col justify-center gap-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-800">
                  <Globe className="h-5 w-5 text-gold-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    Attorneys Available Nationwide
                  </p>
                  <p className="mt-1 text-sm text-navy-300">
                    Cases reviewed across all 50 states
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-800">
                  <Users className="h-5 w-5 text-gold-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    Direct Response
                  </p>
                  <p className="mt-1 text-sm text-navy-300">
                    A real person follows up with every inquiry
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Band ─── */}
      <section className="py-14 sm:py-16 bg-gold-500">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
            Ready to Learn About Your Options?
          </h2>
          <p className="mt-3 text-base text-navy-900/80">
            The first conversation is free. No obligation. No pressure.
          </p>
          <Link
            href="/cases"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-navy-900 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-navy-800"
          >
            Get a Free Case Evaluation
          </Link>
        </div>
      </section>
    </>
  );
}
