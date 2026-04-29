import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Info, Lock, Layers, CreditCard } from "lucide-react";
import PreventWidowText from "@/components/PreventWidowText";

export const metadata: Metadata = {
  title: "Know Your Rights as a Survivor | Help Law Group",
  description:
    "If you were seriously harmed by a person, company, or institution, you have legal rights. Understanding them is the first step.",
  alternates: { canonical: "https://helplaw.com/your-rights" },
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
     <PreventWidowText />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Your Rights" },
        ]}
      />

      {/* Hero */}
      <section className="bg-[#1A365E] py-[30px] md:py-[60px] lg:py-[80px]">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] text-white tracking-tight">
              <span className="text-[#FFBF0F]">Your</span> Rights
            </h1>
            <p className="mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg text-white font-normal leading-[140%]">
              If you were seriously harmed by a person, company, or institution,
              you have legal rights. Understanding them is the first step.
            </p>
          </div>
        </div>
      </section>

      {/* Right to take legal action */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-white">
        <div className="mx-auto max-w-7xl px-5 text-center md:text-left">
          <h2 className="heading font-bold text-[24px] md:text-[34px] lg:text-[42px] leading-[1.2] text-[#122D56] tracking-tight">
            You have the right to take <span className="text-[#FFBF0F]">legal action</span>.
          </h2>
          <p className="mt-[14px] md:mt-4 lg:mt-6 text-[14px] md:text-base lg:text-lg leading-[140%] font-normal text-[#5C6F8B]">
            Civil lawsuits are separate from criminal proceedings. You do not
            need a police report, a criminal conviction, or any prior legal
            action to pursue a civil claim. The burden of proof in a civil case
            is lower than in a criminal one, which means cases can succeed even
            when no criminal charges were ever filed.
          </p>
          <p className="mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg leading-[140%] font-normal text-[#5C6F8B]">
            Institutions — hospitals, churches, detention centers, platforms, and
            companies — can be held accountable alongside the individual who
            caused harm. When an organization knew about misconduct and failed to
            act, it shares responsibility for what followed.
          </p>
        </div>
      </section>

      {/* Rights cards grid */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-slate-warm-50">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid sm:grid-cols-2 gap-[14px] md:gap-6">
            {RIGHTS_CARDS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-navy-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#122D56] mb-4">
                  <Icon className="h-5 w-5 text-[#FFBF0F]" />
                </div>
                <h3 className="text-base heading font-bold text-[#122D56] leading-[120%]">
                  {title}
                </h3>
                <p className="mt-2 text-sm  text-[#5C6F8B] leading-[140%]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statute of limitations */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-[#09162A]">
        <div className="mx-auto max-w-7xl px-5 text-center md:text-left">
          <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] text-white tracking-tight">
            What about the statute of <span className="text-[#FFBF0F]">limitations?</span>
          </h2>
          <p className="mt-[14px] md:mt-4 lg:mt-6 text-[14px] md:text-base lg:text-lg text-white leading-[140%]">
            Every state sets deadlines for filing civil claims. For sexual abuse
            cases, many states have passed laws that extend or reopen those
            deadlines, sometimes by decades. Whether your situation falls within
            a current filing window depends on where the harm occurred, when it
            happened, and who was responsible.
          </p>
          <p className="mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg text-white leading-[140%]">
            The only reliable way to know whether your claim is still within a
            filing window is to speak with an attorney. Do not assume it is too
            late without checking first.
          </p>
        </div>
      </section>

      {/* Common questions about your rights */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center md:text-left heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] text-[#122D56] tracking-tight mb-0 md:mb-6 lg:mb-8">
            Common questions about <span className="text-[#FFBF0F]">your rights</span>
          </h2>
          <FAQAccordion items={RIGHTS_FAQ} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-[#09162A]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] text-white tracking-tight">
            Ready to understand your <span className="text-[#FFBF0F]">options?</span>
          </h2>
          <p className="mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg text-white leading-[140%]">
            A free case evaluation is a conversation. You share what happened and
            an attorney tells you what your rights are.
          </p>
          <Link
            href="/#lead-form"
            className="mt-[14px] md:mt-6 inline-flex items-center justify-center rounded-full bg-white text-[#122D56] font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  px-[24px] py-[16px] transition-all hover:bg-navy-800 hover:text-white"
          >
            Get a Free Case Evaluation
          </Link>
        </div>
      </section>
    </>
  );
}
