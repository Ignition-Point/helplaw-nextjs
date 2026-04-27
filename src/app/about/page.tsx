import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Ear, Search, ShieldCheck, Lock, Users, Globe } from "lucide-react";
import PreventWidowText from "@/components/PreventWidowText";

export const metadata: Metadata = {
  title: "About Help Law Group | Mass Tort Advocates",
  description:
    "Help Law Group connects survivors of abuse, unsafe products, and institutional harm with attorneys. Free case review, no fees unless you win.",
  alternates: { canonical: "https://helplaw.com/about" },
};

export default function AboutPage() {
  return (
    <>
     <PreventWidowText />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* ─── SECTION 1: Hero ─── */}
      <section
        className="bg-[#1A365E] md:bg-[url('/assets/alt/about-bg-img.jpg')] bg-cover bg-no-repeat bg-[position:50%_0] pt-0 py-[30px] md:py-[60px] lg:py-[80px] relative overflow-hidden z-10"
      >
      <div className="hidden md:block absolute -rotate-180 bg-[linear-gradient(270deg,_#09162A_1.84%,_rgba(9,22,42,0)_51.09%)] inset-0 pointer-events-none -z-10" />
      <Image
          src="/assets/alt/about-bg-img-mobile.jpg"
          alt="About Background"
          fill
          sizes="100vw"
          quality={100}
          className="!relative md:!absolute md:hidden object-cover object-center"
        />
        <div className="mx-auto max-w-7xl px-5 pt-[30px] md:pt-[0]">
          <div className=" w-full max-w-[600px] text-center md:text-left">
            <h1 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] align-middle capitalize text-white tracking-normal">
              About <span className="text-[#FFBF0F]">Help Law</span>
            </h1>
            <p className="mt-[14px] md:mt-6 text-[14px] md:text-base lg:text-lg text-white leading-[140%]">
              Help Law Group connects individuals and families with attorneys
              who handle serious harm, including abuse by institutions and
              individuals, injuries caused by unsafe products, and harm
              facilitated by online platforms.
            </p>
            <p className="mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg text-white leading-[140%]">
              Help Law Group is a law firm that also works with a broader
              network of attorneys and legal partners across the country. When
              you reach out, we review your situation and connect you with an
              attorney whose practice covers your type of case. The first
              conversation is free.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2 & 3: Who We Are + By the Numbers ─── */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid lg:grid-cols-2 items-center gap-[20px] md:gap-14 lg:gap-20 text-center md:text-left">
            {/* Left: Who We Are */}
            <div>
              <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] text-[#17335D] tracking-tight">
                Who <span className="text-[#FFBF0F]">We Are</span>
              </h2>
              <p className="mt-[14px] md:mt-4 lg:mt-6 text-[14px] md:text-base lg:text-lg font-normal text-[#5C6F8B] leading-[140%]">
                Help Law Group was built around a straightforward idea: people
                who have been seriously harmed deserve access to attorneys who
                know how to handle those specific cases. We connect survivors
                and their families with attorneys who have experience in abuse,
                institutional negligence, unsafe products, and platform harm.
              </p>
              <p className="mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg font-normal text-[#5C6F8B] leading-[140%]">
                Help Law Group is a law firm that also works with a broader
                network of attorneys and legal partners. Depending on your case
                type and location, you may work with Help Law Group attorneys
                directly or be connected with an attorney in our network who has
                specific experience in your area of harm.
              </p>
              <p className="mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg leading-[140%] font-normal text-[#5C6F8B] leading-[140%]">
                Every attorney we work with takes cases on contingency. There
                are no upfront costs, and you owe nothing unless your case
                succeeds.
              </p>
            </div>

            {/* Right: By the Numbers */}
            <div className="grid grid-cols-2 gap-[12px] lg:gap-6 content-start">
              {[
                { number: "150+", label: "Attorneys in Our Network" },
                {
                  number: "Nationwide",
                  label: "Cases Reviewed Across the U.S.",
                },
                { number: "Free", label: "Initial Case Evaluation" },
                { number: "No Fee", label: "Unless Your Case Succeeds" },
              ].map(({ number, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-navy-100 bg-navy-50/50 px-[12px] py-[15px] md:p-6 md:py-12 text-center"
                >
                  <p className="heading text-[16px] md:text-3xl font-bold text-[#17335D] leading-[120%]">
                    {number}
                  </p>
                  <p className="mt-[4px] md:mt-2 text-sm text-[#546885] leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: How We Approach Every Case ─── */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-slate-warm-50">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] text-[#17335D] tracking-tight text-center">
            How We Approach <span className="text-[#FFBF0F]">Every Case</span>
          </h2>

          <div className="mt-[14px] md:mt-8 lg:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-[14px] md:gap-6 lg:gap-8">
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
                className="rounded-xl border border-navy-100 bg-white p-4 md:p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#17335D]">
                  <Icon className="h-5 w-5 text-[#FFBF0F]" />
                </div>
                <h3 className="heading mt-4 text-base md:text-lg font-bold text-[#17335D] leading-[140%]">
                  {title}
                </h3>
                <p className="mt-[4px] md:mt-2 text-sm text-[#546885] leading-[140%]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: The Cases We Handle ─── */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px]">
        <div className="mx-auto mx-auto max-w-7xl px-5 text-center md:text-left">
          <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] text-[#17335D] tracking-tight">
            The <span className="text-[#FFBF0F]">Cases</span> We Handle
          </h2>
          <p className="mt-3.5 lg:mt-6 text-[14px] md:text-base lg:text-lg leading-[140%] text-[#546885]">
            The attorneys in our network handle cases involving serious harm,
            including sexual abuse by medical professionals, clergy, and
            institutions; exploitation facilitated by online platforms; harm
            caused by unsafe products; and abuse in juvenile detention
            facilities.
          </p>
          <p className="mt-[14px] text-[14px] md:text-base lg:text-lg leading-[140%] text-[#546885]">
            These cases involve powerful institutions, complex legal processes,
            and survivors who have often been carrying their experiences for
            years. The attorneys we work with have handled exactly these kinds
            of cases before.
          </p>
          <p className="mt-[14px] text-[14px] md:text-base lg:text-lg leading-[140%] text-[#546885]">
            Every situation is different. When you reach out, your case is
            reviewed by someone who understands the legal landscape and can
            explain what your options actually are.
          </p>
        </div>
      </section>

      {/* ─── SECTION 6: Available Across the Country ─── */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-[#122d56]">
        <div className="mx-auto max-w-7xl px-5 ">
          <h2 className="text-center md:text-left heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%]  text-white tracking-tight mb-[14px] md:mb-6 lg:mb-8">
            Available Across <span className="text-[#FFBF0F]">the Country</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-6 md:gap-14 lg:gap-20 items-start">
            {/* Left: copy */}
            <div>
              <p className="text-center md:text-left text-[14px] md:text-base lg:text-lg text-white leading-[140%]">
                The attorneys in our network are licensed across multiple states
                and handle cases nationwide. No matter where you are located or
                where the harm occurred, we can review your situation and
                connect you with the right attorney.
              </p>
              <p className="text-center md:text-left mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg text-white leading-[140%]">
                Reaching out takes minutes. A real person will follow up with
                every inquiry directly.
              </p>
            </div>

            {/* Right: stat items */}
            <div className="flex flex-col justify-center gap-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[white]/[0.1]">
                  <Globe className="h-5 w-5 text-[#FFBF0F]" />
                </div>
                <div>
                  <p className="text-base md:text-lg font-semibold text-white">
                    Attorneys Available Nationwide
                  </p>
                  <p className="mt-1 text-sm text-navy-300">
                    Cases reviewed across all 50 states
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[white]/[0.1]">
                  <Users className="h-5 w-5 text-[#FFBF0F]" />
                </div>
                <div>
                  <p className="text-base md:text-lg font-semibold text-white">
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
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] text-[#17335D] tracking-tight">
            <span className="text-[#FFBF0F]">Ready to Learn</span> About Your
            Options?
          </h2>
          <p className="mt-[14px] md:mt-3 text-[14px] md:text-base lg:text-[18px] leading-[140%] font-normal text-[#5C6F8B]">
            The first conversation is free. No obligation. No pressure.
          </p>
          <Link
            href="/cases"
            className="mt-[14px] md:mt-6 inline-flex items-center gap-2 rounded-full px-[24px] py-[13px] text-[14px] md:text-[16px] lg:text-[18px] leading-[100%] font-semibold tracking-[0%] bg-[#122D56] text-white hover:bg-[#1A365E] transition-all"
          >
            Get a Free Case Evaluation
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="transition-transform group-hover:translate-x-1"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.5 5.625C7.15482 5.625 6.875 5.34518 6.875 5C6.875 4.65482 7.15482 4.375 7.5 4.375H15C15.3452 4.375 15.625 4.65482 15.625 5V12.5C15.625 12.8452 15.3452 13.125 15 13.125C14.6548 13.125 14.375 12.8452 14.375 12.5V6.50888L5.44194 15.4419C5.19786 15.686 4.80214 15.686 4.55806 15.4419C4.31398 15.1979 4.31398 14.8021 4.55806 14.5581L13.4911 5.625H7.5Z"
                fill="currentColor"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
