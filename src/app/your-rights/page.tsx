import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Info, Lock, Layers, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Your Rights",
  description:
    "If you were seriously harmed by a person, company, or institution, you have legal rights. Understanding them is the first step.",
};

const RIGHTS_CARDS = [
  {
    icon: Info,
    title: "The right to a free evaluation",
    description:
      "You can speak with an attorney about your situation at no cost and with no obligation to move forward.",
  },
  {
    icon: Lock,
    title: "The right to remain anonymous",
    description:
      "Many civil lawsuits involving sexual abuse are filed using pseudonyms. Courts regularly permit anonymous filings in sensitive cases.",
  },
  {
    icon: Layers,
    title: "The right to file even years later",
    description:
      "Lookback window legislation in states like New York and California has extended the time survivors have to file civil claims for past abuse.",
  },
  {
    icon: CreditCard,
    title: "The right to pay nothing upfront",
    description:
      "Attorneys who handle these cases work on contingency. Their fee comes from what your case recovers. You owe nothing if your case does not succeed.",
  },
];

const RIGHTS_FAQ = [
  {
    q: "Do I need a police report to file a civil claim?",
    a: "No. Civil claims are entirely separate from criminal proceedings. You do not need a police report, a criminal conviction, or any prior legal action to pursue a civil lawsuit.",
  },
  {
    q: "Can I sue the institution, not just the individual?",
    a: "Yes. When an institution hired, supervised, or retained someone who caused harm, and especially when that institution received complaints and failed to act, it can be held liable alongside the individual. Many of the largest abuse settlements in history have been paid by institutions, not individuals.",
  },
  {
    q: "What if I was a minor when the harm occurred?",
    a: "Many states have extended or reopened filing deadlines specifically for survivors of childhood abuse. California and New York have both passed legislation that allows survivors to file civil claims decades after the harm occurred. An attorney can tell you what applies to your specific situation.",
  },
  {
    q: "Can I file a claim if I am not a U.S. citizen?",
    a: "In most cases, yes. Immigration status does not automatically bar someone from filing a civil claim in U.S. courts. An attorney can advise you on the specifics of your situation.",
  },
  {
    q: "What if I signed something or was told I could not sue?",
    a: "Waivers and settlements are not always the final word. Depending on the circumstances, there may still be options available. An attorney can review what you signed and advise you on whether any legal avenues remain open.",
  },
];

export default function YourRightsPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Your Rights" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Your Rights
            </h1>
            <p className="mt-4 text-lg text-navy-200 leading-relaxed">
              If you were seriously harmed by a person, company, or institution,
              you have legal rights. Understanding them is the first step.
            </p>
          </div>
        </div>
      </section>

      {/* Right to take legal action */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
            You have the right to take legal action.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
            Civil lawsuits are separate from criminal proceedings. You do not
            need a police report, a criminal conviction, or any prior legal
            action to pursue a civil claim. The burden of proof in a civil case
            is lower than in a criminal one, which means cases can succeed even
            when no criminal charges were ever filed.
          </p>
          <p className="mt-4 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
            Institutions — hospitals, churches, detention centers, platforms, and
            companies — can be held accountable alongside the individual who
            caused harm. When an organization knew about misconduct and failed to
            act, it shares responsibility for what followed.
          </p>
        </div>
      </section>

      {/* Rights cards grid */}
      <section className="py-16 sm:py-20 bg-slate-warm-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {RIGHTS_CARDS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 mb-4">
                  <Icon className="h-5 w-5 text-gold-400" />
                </div>
                <h3 className="text-base font-semibold text-navy-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-warm-500 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statute of limitations */}
      <section className="py-16 sm:py-20 bg-navy-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            What about the statute of limitations?
          </h2>
          <p className="mt-6 text-base sm:text-lg text-navy-200 leading-relaxed">
            Every state sets deadlines for filing civil claims. For sexual abuse
            cases, many states have passed laws that extend or reopen those
            deadlines, sometimes by decades. Whether your situation falls within
            a current filing window depends on where the harm occurred, when it
            happened, and who was responsible.
          </p>
          <p className="mt-4 text-base sm:text-lg text-navy-200 leading-relaxed">
            The only reliable way to know whether your claim is still within a
            filing window is to speak with an attorney. Do not assume it is too
            late without checking first.
          </p>
        </div>
      </section>

      {/* Common questions about your rights */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight mb-8">
            Common questions about your rights
          </h2>
          <FAQAccordion items={RIGHTS_FAQ} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-navy-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ready to understand your options?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy-200 leading-relaxed">
            A free case evaluation is a conversation. You share what happened and
            an attorney tells you what your rights are.
          </p>
          <Link
            href="/get-legal-help"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-base font-semibold text-navy-950 transition-all hover:bg-gold-400"
          >
            Get a Free Case Evaluation
          </Link>
        </div>
      </section>
    </>
  );
}
