import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";

export const metadata: Metadata = { title: "Frequently Asked Questions" };

const FAQ_SECTIONS = [
  {
    heading: "Before You Reach Out",
    items: [
      {
        q: "What does Help Law Group do?",
        a: "Help Law Group is a legal advocacy organization with its own attorneys and a network of legal partners across the country. When you reach out, we review your situation and connect you with an attorney who has specific experience handling your type of case.",
      },
      {
        q: "How is Help Law Group different from hiring a lawyer on my own?",
        a: "When you contact Help Law Group, we review your situation before making any connection. We match people with attorneys who have direct experience with their type of harm, whether that involves medical abuse, clergy abuse, online platform harm, or juvenile detention abuse. You are not searching on your own or relying on a general directory.",
      },
      {
        q: "Does it cost anything to reach out?",
        a: "No. The initial case evaluation is free. There is no obligation to move forward, and your information is not shared without your consent.",
      },
      {
        q: "What types of cases do you handle?",
        a: "Attorneys in our network handle cases involving sexual abuse by medical professionals, clergy, and institutions; exploitation facilitated by online platforms like Snapchat and Roblox; harm caused by unsafe products; abuse in juvenile detention facilities; foster care abuse; and rideshare assault. If you are not sure whether your situation fits, a case evaluation is the place to find out.",
      },
      {
        q: "What if I am not sure whether I have a case?",
        a: "That uncertainty is exactly what a case evaluation is for. You share what happened, and an attorney tells you honestly whether legal options exist. You do not need to have everything figured out before you reach out.",
      },
    ],
  },
  {
    heading: "What Happens When You Do",
    items: [
      {
        q: "What happens after I submit my information?",
        a: "Someone from our team reviews what you have shared and follows up with you directly. If your situation is a fit for an attorney in our network, we make that connection. If it is not, we will let you know. Either way, you will hear back from a real person.",
      },
      {
        q: "Does submitting a case review create an attorney-client relationship?",
        a: "No. Submitting your information starts a conversation, not a legal representation. An attorney-client relationship is only formed if you decide to move forward and formally retain an attorney.",
      },
      {
        q: "How long does a case take?",
        a: "It depends on the type of case. Some cases resolve through settlement in months. Others — particularly those involving institutions, class actions, or federal claims — can take several years. Your attorney will give you a realistic picture based on the specifics of your situation.",
      },
      {
        q: "Will I have to go to court?",
        a: "Most cases settle before trial. However, some cases do go to court, and your attorney will prepare you for that possibility if it becomes relevant. You will never be pressured to accept a settlement you are not comfortable with.",
      },
      {
        q: "What if the case is still under investigation?",
        a: "You can still reach out. Many survivors contact us while criminal or civil investigations are ongoing. A case evaluation can help you understand your options regardless of where things stand in the broader legal process.",
      },
      {
        q: "What if I already accepted a settlement?",
        a: "If you have already settled a claim related to the same harm, your options may be limited. However, circumstances vary, and it is worth a conversation with an attorney to understand what, if anything, remains available to you.",
      },
    ],
  },
  {
    heading: "The Cost of Moving Forward",
    items: [
      {
        q: "How much does it cost to get started?",
        a: "Nothing. The initial case evaluation is free, and there are no upfront costs at any stage.",
      },
      {
        q: "How do attorneys get paid?",
        a: "Attorneys in our network work on a contingency basis. That means their fee comes from what your case recovers. If your case does not succeed, you do not owe anything.",
      },
      {
        q: "What percentage do attorneys take?",
        a: "Contingency fees vary by case type, state, and the specific attorney. Your attorney will explain the fee structure clearly before you agree to anything. You will always know what the arrangement is before moving forward.",
      },
      {
        q: "What kind of compensation could I receive?",
        a: "Civil claims can seek compensation for medical and therapy costs, lost wages and earning capacity, pain and suffering, emotional distress, and in some cases punitive damages where institutional conduct was particularly egregious.",
      },
      {
        q: "When do I receive payment if my case succeeds?",
        a: "Payment typically comes at the conclusion of a case, either through a negotiated settlement or a court verdict. The timeline varies depending on the type of case and how it resolves. Your attorney will keep you informed throughout the process.",
      },
    ],
  },
  {
    heading: "Getting Started With Your Case",
    items: [
      {
        q: "Do I need documents to get started?",
        a: "No. You do not need to bring records, files, or any documentation to an initial case evaluation. You share what you remember, and your attorney will help identify what documentation exists and how to obtain it.",
      },
      {
        q: "What kinds of records help support a case?",
        a: "Depending on your situation, helpful records might include medical records, employment records, communications with an institution, intake logs, or incident reports. Your attorney will guide you on what is relevant and how to request it. Many records can be obtained through the legal process even if you do not have them now.",
      },
      {
        q: "What if I do not remember everything clearly?",
        a: "Fragmented or incomplete memories are a well-documented response to trauma, especially when abuse occurred during childhood or in high-stress environments. An unclear or non-linear account does not disqualify you from pursuing a claim. Start with what you remember and let your attorney take it from there.",
      },
    ],
  },
  {
    heading: "Your Privacy and Confidentiality",
    items: [
      {
        q: "Is my information confidential?",
        a: "Yes. What you share with Help Law Group is confidential. Your information is not passed to attorneys, institutions, or anyone else without your consent.",
      },
      {
        q: "Will my information be sold or shared?",
        a: "No. We do not sell your information and we do not share it without your consent.",
      },
      {
        q: "Who reviews my information?",
        a: "A member of our team reviews every inquiry. If your situation is a fit for an attorney in our network, we will reach out to you directly to discuss next steps before making any connection.",
      },
      {
        q: "Can I remain anonymous?",
        a: "You can reach out without providing your full name initially. Many civil lawsuits involving sexual abuse are filed using pseudonyms or initials, and courts regularly permit anonymous filings in sensitive cases. Your attorney can explain what privacy protections apply to your specific situation.",
      },
    ],
  },
  {
    heading: "Who You Are Talking To",
    items: [
      {
        q: "Are you a law firm?",
        a: "Yes. Help Law Group is a law firm that also works with a broader network of attorneys and legal partners across the country. Depending on your case type and location, you may work with Help Law Group attorneys directly or be connected with an attorney in our network who has specific experience in your area of harm.",
      },
      {
        q: "Will I work directly with the attorneys in your network?",
        a: "That depends on your case. Some clients work directly with Help Law Group attorneys. Others are connected with attorneys in our partner network based on their specific case type and location. Either way, you will be connected with someone who has handled cases like yours before.",
      },
      {
        q: "Do you work with other law firms?",
        a: "Yes. In addition to our own attorneys, we work with a network of law firms across the country who specialize in the types of cases we handle. We only make connections where there is a genuine fit based on your situation.",
      },
      {
        q: "What if I already have a lawyer?",
        a: "If you are already represented by an attorney for the same matter, we would not be the right resource for you. If you have a lawyer for something unrelated, or if you are exploring your options before committing to anyone, we are happy to have a conversation.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "FAQs" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-navy-200 leading-relaxed">
              Common questions about working with Help Law Group, the legal
              process, and what to expect.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-14">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight mb-6">
                {section.heading}
              </h2>
              <FAQAccordion items={section.items} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 sm:py-20 bg-navy-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Still Have Questions?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-navy-200 leading-relaxed">
            A free case evaluation is a conversation. You share what happened and
            an attorney tells you what your options are.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cases"
              className="inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-3.5 text-base font-semibold text-navy-950 transition-all hover:bg-gold-400"
            >
              Get a Free Case Evaluation
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/80 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white hover:text-navy-900"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
