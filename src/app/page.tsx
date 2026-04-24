import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { HomeCaseCards } from "@/components/HomeCaseCards";
import { HomeBlogCards } from "@/components/HomeBlogCards";
import { HomeLeadForm } from "@/components/HomeLeadForm";
import PreventWidowText from "@/components/PreventWidowText";

export const metadata: Metadata = {
  title: "Help Law Group | Mass Tort & Class Action Attorneys",
  description:
    "Were you harmed by a person, company, or institution? Help Law Group connects you with experienced attorneys for a free, confidential case evaluation. No fees unless you win.",
  openGraph: {
    title: "Help Law Group | Mass Tort & Class Action Attorneys",
    description:
      "Free, confidential case evaluations for survivors of abuse, unsafe products, and institutional harm. No fees unless you win.",
    url: "https://helplaw.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Law Group | Mass Tort & Class Action Attorneys",
    description:
      "Free, confidential case evaluations for survivors of abuse, unsafe products, and institutional harm.",
  },
  alternates: { canonical: "https://helplaw.com" },
};

export const revalidate = 60;

export default async function HomePage() {
  return (
    <>
      <PreventWidowText />
      {/* ─── Hero: "You Deserve Answers" ─── */}
      <section className="relative overflow-hidden">
        {/* Background video */}
        <Image
          src="/assets/alt/hero-img.png"
          alt="Hero Image"
          fill
          className="!relative md:!absolute !inset-auto md:!inset-0 aspect-video md:aspect-auto w-full h-full object-cover object-[88%_top] md:object-top md:border-t-2 border-white"
        />
        {/* <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/alt/section-1-video.mp4" type="video/mp4" />
        </video> */}
        {/* Overlay to keep text legible */}
        <div className="hidden md:block absolute inset-0 bg-[linear-gradient(127.16deg,rgba(9,22,42,0.7)_34.14%,rgba(9,22,42,0.62454)_39.46%,rgba(9,22,42,0)_57.5%,rgba(9,22,42,0.12601)_71.6%,rgba(9,22,42,0.378)_76.49%,rgba(9,22,42,0.63)_88.82%)]" />

        <div className="bg-[#122d56] md:bg-transparent relative mx-auto  max-w-7xl items-center justify-between px-5  pt-[30px] pb-[30px] md:pt-[70px] md:pb-[72px] lg:pt-[100px] lg:pb-[92px]">
          <div className="max-w-[785px] w-full text-center md:text-left">
        
            <h1 className="heading font-bold text-[26px] md:text-[50px] lg:text-[70px] leading-[120%]  align-middle capitalize text-white">
              Standing With People When It Matters Most
            </h1>

            <p className="max-w-[580px] mt-[8px] md:mt-[5px] mb-[20px] font-medium text-[14px] md:text-[18px] lg:text-[20px] leading-[140%]  text-white">
              Clear guidance to help you understand what comes next. Whether
              caused by a product, a company, a platform, or an individual,
              we’re here to help and we don't back down.
            </p>

            <div className="hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="76"
                viewBox="0 0 46 79"
                fill="none"
                className="h-[35px] md:h-[45px] w-[46px] lg:h-[78px] lg:w-[46px] object-contain mx-auto md:mx-0"
              >
                <path
                  d="M22.7529 0L22.7529 76.7414"
                  stroke="white"
                  stroke-width="1.96818"
                />
                <path
                  d="M0.685547 55.3054L22.7527 76.7413L44.8199 55.3054"
                  stroke="white"
                  stroke-width="1.96818"
                />
              </svg>
            </div>

            <div className="mt-6 md:mt-8 lg:mt-15 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link
                href="/cases"
                className="inline-flex items-center justify-center rounded-full bg-white text-[#122D56] font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  px-[24px] py-[16px] transition-all hover:bg-navy-800 hover:text-white"
              >
                Check Eligibility
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-full border-2 border-white px-[24px] py-[15px] font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%] text-white transition-all hover:bg-white hover:text-[#122D56]"
              >
                How It Works
              </Link>
            </div>

            {/* Attorney avatar row */}
          </div>
          <div className="lg:absolute right-0 bottom-[92px] mt-[20px] lg:mt-[0]">
            <div className="max-w-[435px] bg-[linear-gradient(90deg,rgba(12,12,12,0.4)_0%,rgba(12,12,12,0.4)_100%)] border border-[2px] border-white/12 p-[12px] md:p-[20px] backdrop-blur-[34px]">
              <div className="flex items-center justify-between mb-2 md:mb-5 lg:mb-7">
                <div className="">
                  <div className="font-bold text-[22px] md:text-[40px] lg:text-[60px] leading-[110%]  capitalize text-[#FFBF0F] mb-3">
                    150+
                  </div>
                  <p className="font-normal text-[16px] leading-[140%]  capitalize text-white">
                    attorneys in our network
                  </p>
                </div>
                <div className="flex -space-x-5">
                  {[
                    "sarah-mitchell",
                    "michael-chen",
                    "jennifer-rodriguez",
                    "david-park",
                  ].map((name) => (
                    <Image
                      key={name}
                      src={`/assets/attorneys/${name}.jpg`}
                      alt="Attorney"
                      width={55}
                      height={55}
                      className="rounded-full h-[46px] w-[48px] min-w-[46px] lg:h-[53px] lg:w-[53px] border-2 lg:border-4 border-black object-cover"
                    />
                  ))}
                </div>
              </div>
              <p className="font-bold text-[14px] md:text-[16px] leading-[140%] tracking-[-0.03em] text-white">
                Guidance from experienced attorneys and legal professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Scrolling Trust Bar ─── */}
      <div className="bg-[#FFBF0F] py-3 md:py-4 overflow-hidden">
        <div className="animate-scroll-x flex whitespace-nowrap gap-3 lg:gap-5">
          {[...Array(4)].flatMap((_, setIdx) =>
            [
              "Free Case Evaluation",
              "No Fee Unless You Win",
              "Confidential",
              "Attorneys Available Nationwide",
              "No Obligation",
            ].map((item, i) => (
              <span
                key={`${setIdx}-${i}`}
                className="inline-flex items-center gap-[20px] heading font-normal text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  text-center align-middle uppercase text-[#122D56] shrink-0"
              >
                <Check className="h-5 w-5 lg:h-6 lg:w-6 text-[#122D56] shrink-0" />
                {item}
              </span>
            )),
          )}
        </div>
      </div>

      {/* ─── "When You Are Ready. We Are Here." ─── */}
          <section
            className="relative overflow-hidden bg-none md:bg-[url('/assets/alt/section-2-image-new.png')] md:bg-cover md:bg-no-repeat md:bg-[center_0]"
          >
          <div className="aspect-video md:hidden">
         <Image
          src="/assets/alt/section-2-image-mobile-new-1.png"
          alt="section-2-image"
          fill
          className="!relative md:!absolute  w-full h-full object-cover object-[88%_top] md:object-top md:border-t-2 border-white"
        />
        </div>
        {/* <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(9,22,42,0)_0%,#09162A_100%)]" /> */}
        <div className="relative mx-auto max-w-7xl px-5 py-[30px] md:py-[60px] lg:py-[80px]">
          <div className="max-w-[578px] ml-auto text-center md:text-left">
            <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[1.2] align-middle capitalize text-[#122D56] md:text-white tracking-normal">
              The <span className="text-[#FFBF0F]">First Step</span> Is Always
              the Hardest...
            </h2>

            <p className="mt-[14px] md:mt-[18px] lg:mt-[20px] font-normal text-[14px] md:text-[18px] leading-[140%] text-[#546885] md:text-white">
              If you’re here, it’s because something serious happened.
            </p>
            <p className="mt-[10px] md:mt-[16px] lg:mt-[18px] font-normal text-[14px] md:text-[18px] leading-[140%] text-[#546885] md:text-white">
              When you’re ready to take the first step, we carry the burden from
              there. We take on powerful companies and individuals who believe
              they’re untouchable.
            </p>
            <p className="mt-[10px] md:mt-[16px] lg:mt-[18px] font-normal text-[14px] md:text-[18px] leading-[140%] text-[#546885] md:text-white">
              We fight for accountability and we don’t stop until the work is
              done.
            </p>

            <Link
              href="/cases"
              className="mt-4 md:mt-6 lg:mt-8 inline-flex items-center justify-center rounded-full bg-[#122D56] md:bg-white text-white md:text-[#122D56] font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  px-[24px] py-[16px] transition-all hover:bg-[#1A365E] hover:text-white"
            >
              Take the First Step Here
            </Link>

            <p className="inline-flex items-start leading-[130%] gap-[10px] mt-4 md:mt-6 font-medium text-[14px] md:text-[16px] lg:text-[18px] text-[#546885] md:text-white">
              &bull; Free review &bull; Private &amp; confidential &bull; No cost
              unless you win
            </p>
          </div>
        </div>
      </section>

      <div className="border-b lg:border-0"></div>

      {/* ─── "Guidance You Can Trust" ─── */}
      <section className="bg-white overflow-hidden py-[30px] md:py-[60px] lg:py-[80px]">
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid lg:grid-cols-[48%_45.3%] gap-y-[30px] gap-x-[80px]">
            {/* Copy — right side */}
            <div className="flex items-center mb-[50px] lg:mb-0">
              <div className="w-full text-center md:text-left">
                <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] tracking-[-0.045em] align-middle capitalize text-[#122D56]">
                  Guidance <span className="text-[#FFBF0F]">You Can Trust</span>
                  <br /> No Guesswork. No Pressure.
                </h2>

                <div className="lg:max-w-[565px]">
                  <p className="mt-[14px] md:mt-[16px] lg:mt-[18px] font-normal text-[14px] lg:text-[18px] leading-[140%] text-[#546885]">
                    When something serious happens, the hardest part is knowing
                    what to do next, especially when the other side has power.
                  </p>
                  <p className="mt-[10px] md:mt-[14px] font-normal text-[14px] lg:text-[18px] leading-[140%] text-[#546885]">
                    Our role is simple: listen carefully, review what happened,
                    and help you understand whether accountability applies, and
                    whether compensation may be available.
                  </p>
                  <p className="mt-[10px] md:mt-[14px] font-normal text-[14px] lg:text-[18px] leading-[140%] text-[#546885]">
                    You decide if and when to move forward. We handle the
                    complexity, the pressure, and the fight.
                  </p>

                  <Link
                    href="/cases"
                    className="mt-[18px] inline-flex items-center justify-center rounded-full bg-[#122D56] font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  px-[24px] py-[16px] text-white transition-all hover:bg-[#1A365E]"
                  >
                    Start a Confidential Review
                  </Link>
                </div>
              </div>
            </div>
            {/* Image — left side with fade */}
            <div className="relative h-full lg:h-[389px]">
              <Image
                src="/assets/alt/section-3-image-new.png"
                alt="Help Law Group Team"
                fill
                className="!relative lg:!absolute rounded-[14px] md:rounded-[16px] lg:rounded-[26px] object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              {/* Fade-out gradient on right edge */}
              {/* <div className="hidden lg:block absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white to-transparent" /> */}
              {/* Fade-out gradient on bottom for mobile */}
              {/* <div className="lg:hidden absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" /> */}
              <div className="absolute -top-[65px] left-0 right-0 mx-auto lg:top-1/2 lg:-translate-y-1/2 lg:-left-[65px] lg:right-auto flex items-center justify-center size-[123px] rounded-full bg-white shadow-[0px_0px_80px_0px_#0000001A]">
                <div className="animate-spin [animation-duration:12s]">
                  <div className="relative flex items-center justify-center p-[8px  ] ">
                    <Image
                      src="/assets/alt/Happy-Customers.svg"
                      alt="Icon"
                      width={110}
                      height={110}
                      className="rounded-full h-[112px] w-[112px] object-contain"
                    />
                  </div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 text-center mx-auto z-10">
                  <div className="mb-[5px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      className="block mx-auto"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6.45833 0C4.27221 0 2.5 1.77221 2.5 3.95833C2.5 6.14446 4.27221 7.91667 6.45833 7.91667C8.64446 7.91667 10.4167 6.14446 10.4167 3.95833C10.4167 1.77221 8.64446 0 6.45833 0ZM3.75 3.95833C3.75 2.46256 4.96256 1.25 6.45833 1.25C7.9541 1.25 9.16667 2.46256 9.16667 3.95833C9.16667 5.4541 7.9541 6.66667 6.45833 6.66667C4.96256 6.66667 3.75 5.4541 3.75 3.95833Z"
                        fill="#161D27"
                      />
                      <path
                        d="M11.4583 0.833333C11.1132 0.833333 10.8333 1.11316 10.8333 1.45833C10.8333 1.80351 11.1132 2.08333 11.4583 2.08333C12.4939 2.08333 13.3333 2.9228 13.3333 3.95833C13.3333 4.99387 12.4939 5.83333 11.4583 5.83333C11.1132 5.83333 10.8333 6.11316 10.8333 6.45833C10.8333 6.80351 11.1132 7.08333 11.4583 7.08333C13.1842 7.08333 14.5833 5.68422 14.5833 3.95833C14.5833 2.23244 13.1842 0.833333 11.4583 0.833333Z"
                        fill="#161D27"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M2.02346 10.2253C3.1896 9.55896 4.75889 9.16667 6.45833 9.16667C8.15778 9.16667 9.72707 9.55896 10.8932 10.2253C12.0417 10.8816 12.9167 11.8834 12.9167 13.125C12.9167 14.3666 12.0417 15.3684 10.8932 16.0247C9.72707 16.691 8.15778 17.0833 6.45833 17.0833C4.75889 17.0833 3.1896 16.691 2.02346 16.0247C0.874997 15.3684 0 14.3666 0 13.125C0 11.8834 0.874997 10.8816 2.02346 10.2253ZM2.64363 11.3106C1.68084 11.8608 1.25 12.5256 1.25 13.125C1.25 13.7244 1.68084 14.3892 2.64363 14.9394C3.58874 15.4794 4.93612 15.8333 6.45833 15.8333C7.98055 15.8333 9.32793 15.4794 10.273 14.9394C11.2358 14.3892 11.6667 13.7244 11.6667 13.125C11.6667 12.5256 11.2358 11.8608 10.273 11.3106C9.32793 10.7706 7.98055 10.4167 6.45833 10.4167C4.93612 10.4167 3.58874 10.7706 2.64363 11.3106Z"
                        fill="#161D27"
                      />
                      <path
                        d="M14.0922 10.0145C13.755 9.94057 13.4218 10.154 13.3478 10.4911C13.2739 10.8283 13.4873 11.1616 13.8245 11.2355C14.4848 11.3803 15.0125 11.629 15.3607 11.914C15.7095 12.1994 15.8333 12.4781 15.8333 12.7083C15.8333 12.9173 15.7328 13.1625 15.4558 13.4199C15.1767 13.6792 14.7479 13.9187 14.1948 14.0852C13.8643 14.1848 13.677 14.5334 13.7765 14.8639C13.8761 15.1944 14.2247 15.3817 14.5552 15.2822C15.2407 15.0758 15.8536 14.7565 16.3065 14.3357C16.7615 13.9131 17.0833 13.3572 17.0833 12.7083C17.0833 11.9877 16.6881 11.385 16.1523 10.9466C15.6161 10.5078 14.8938 10.1903 14.0922 10.0145Z"
                        fill="#161D27"
                      />
                    </svg>
                  </div>
                  <div className="font-semibold text-[17px] leading-[100%] tracking-[0%] text-center align-middle text-[#161D27]">
                    150+
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[16px] md:mt-[22px] lg:mt-[30px]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-[12px] md:gap-[16px] lg:gap-[21px]">
              <div className="order-1 md:order-1 border border-[#e8edf3] md:border-0 flex md:flex-row flex-col text-center md:text-left items-center gap-2 md:gap-4 bg-[#FBFBFB] rounded-[12px] md:rounded-[18px] px-[12px] py-[10px] md:px-[22px] md:py-[16px] lg:px-[30px] lg:py-[20px]">
                <div className="relative flex items-center justify-center  ">
                  <Image
                    src="/assets/alt/free-review.svg"
                    alt="Icon"
                    width={70}
                    height={70}
                    className="rounded-full h-[42px] min-w-[42px] w-[42px] lg:h-[70px] lg:w-[70px] object-contain"
                  />
                </div>
                <p className="heading text-[14px] md:text-[18px] lg:text-[20px] leading-[140%] font-medium text-[#161D27]">
                  Free Review
                </p>
              </div>

              <div className="order-3 md:order-2 col-span-2 md:col-span-1 border border-[#e8edf3] md:border-0 flex md:flex-row flex-col text-center md:text-left items-center gap-2 md:gap-4 bg-[#FBFBFB] rounded-[12px] md:rounded-[18px] px-[12px] py-[10px] md:px-[22px] md:py-[16px] lg:px-[30px] lg:py-[20px]">
                <div className="relative flex items-center justify-center  ">
                  <Image
                    src="/assets/alt/private-icon.svg"
                    alt="Icon"
                    width={70}
                    height={70}
                    className="rounded-full h-[42px] w-[42px] min-w-[42px] lg:h-[70px] lg:w-[70px]  object-contain"
                  />
                </div>
                <p className="heading text-[14px] md:text-[18px] lg:text-[20px] leading-[140%] font-medium text-[#161D27]">
                  Private & Confidential 
                </p>
              </div>

              <div className="order-2 md:order-3 flex md:flex-row flex-col border border-[#e8edf3] md:border-0 text-center md:text-left items-center gap-2 md:gap-4 bg-[#FBFBFB] rounded-[12px] md:rounded-[18px] px-[12px] py-[10px] md:px-[22px] md:py-[16px] lg:px-[30px] lg:py-[20px]">
                <div className="relative flex items-center justify-center  ">
                  <Image
                    src="/assets/alt/no-obligation.svg"
                    alt="Icon"
                    width={70}
                    height={70}
                    className="rounded-full h-[42px] min-w-[42px] w-[42px] lg:h-[70px] lg:w-[70px]  object-contain"
                  />
                </div>
                <p className="heading text-[14px] md:text-[18px] lg:text-[20px] leading-[140%] font-medium text-[#161D27]">
                  No obligation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section
        className="relative overflow-hidden pt-0 py-[30px] md:py-[60px] lg:py-[80px] bg-none md:bg-[url('/assets/alt/section-4-image-new.png')] bg-cover bg-no-repeat bg-[position:20%_0] md:bg-[position:center_top]"
      >
        <div className="absolute inset-0 bg-white/60 md:hidden"></div>

         <Image
          src="/assets/alt/section-4-image-new-mobile.png"
          alt="section-4-image"
          fill
          className="!relative md:!absolute md:hidden w-full h-full object-cover object-[88%_top] md:object-top md:border-t-2 border-white"
        />

        <div className="hidden md:block  -rotate-180 absolute inset-0 bg-[linear-gradient(260.96deg,rgba(255,255,255,0)_27.52%,rgba(255,255,255,0.519954)_37.25%,rgba(255,255,255,0.85)_45.55%,rgba(255,255,255,0.95)_65.98%,rgba(255,255,255,0.98)_86.05%,#FFFFFF_100%)]" />

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="max-w-[650px] w-full ml-auto pt-[30px]">
            <div className="mb-[20px] md:mb-[30px] text-center md:text-left">
              <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] align-middle capitalize text-[#122D56]">
                A Private Conversation On 
                <span className="text-[#FFBF0F]">Your Terms</span>
              </h2>
              <p className="mt-[10px] font-normal text-[14px] lg:text-[18px] leading-[140%] text-[#546885]">
                You don’t need to prepare, explain everything, or make decisions
                right now. This starts with a conversation - private,
                respectful, and focused on listening.
              </p>
            </div>

            <div className="grid  grid-cols-1 md:grid-cols-2 gap-[12px] md:gap-[20px] lg:grid-cols-[290px_335px] xl:grid-cols-[300px_335px] justify-center gap-[7px] gap-y-[20px]">
              {[
                {
                  step: "1",
                  title: "Share What Happened",
                  description:
                    "Tell us what you’re comfortable sharing, in your own words. You don’t need legal knowledge, documentation, or certainty.",
                },
                {
                  step: "2",
                  title: "We Review the Big Picture",
                  description:
                    "We carefully review what you’ve shared to determine whether responsibility may extend beyond you and whether legal options or compensation could be available.",
                },
                {
                  step: "3",
                  title: "You Decide Next Steps",
                  description: (
                    <>
                      If options may be available, we explain them clearly. You
                      decide how to move forward.
                    </>
                  ),
                },
                {
                  step: "4",
                  title: "No Pressure To Commit",
                  description:
                    "This begins with a review, not a commitment. We don’t push, rush, or pressure - we help you understand your options first.",
                },
              ].map(({ step, title, description }) => (
                <div key={step} className="flex gap-[12px] md:gap-[16px]">
                  <span className="flex w-[25px] h-[38px] border border-[#FFBF0F] rounded-[120px] shrink-0 items-center justify-center rounded-full font-semibold text-[18px] leading-[120%] align-middle text-[#132F55] ">
                    {step}
                  </span>
                  <div>
                    <h3 className="font-bold text-[16px] md:text-[18px] lg:text-[20px] leading-[1.2] align-middle text-[#132F55]">
                      {title}
                    </h3>
                    <p className="mt-[10px] font-normal text-[14px] lg:text-[16px] leading-[140%] text-[#546885]">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-[20px] md:my-[26px] lg:my-[28px] text-center md:text-left">
              <Link
                href="/cases"
                className="inline-flex items-center justify-center rounded-full bg-[#122D56] hover:bg-[#1A365E] px-[24px] py-[10px] text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-white transition-all"
              >
                Speak With Our Team
              </Link>
            </div>
            <p className="text-center md:text-left inline-flex items-start leading-[130%] gap-[10px] font-medium text-[14px] md:text-[16px] lg:text-[18px] text-[#122D56]">
              &bull; Private & confidential &bull; No obligation &bull; No cost unless
              your case wins
            </p>
          </div>
        </div>
      </section>

      <div className="border-b lg:border-0"></div>

      {/* ─── Cases We Are Currently Reviewing ─── */}
      <HomeCaseCards />

      {/* ─── Information That Can Help (Blog) ─── */}
      <HomeBlogCards />

      {/* ─── What Help Law Group Can Do For You + Lead Form ─── */}
      <section className="">
        <div className="">
          <div className="grid md:grid-cols-[50%_50%] lg:grid-cols-[38%_62%] items-center">
            {/* Left: value props */}
                  <Image
          src="/assets/alt/contect-info-bg-mobile.jpg"
          alt="section-2-image"
          fill
          className="!relative md:!absolute md:hidden aspect-video w-full h-full object-cover object-[88%_top] md:object-top md:border-t-2 border-white"
        />
            <div
              className="relative z-10 py-[30px] md:py-[60px] lg:py-[80px] px-5 md:px-[40px] lg:px-[60px] bg-[#1A365E] md:bg-[url('/assets/alt/contect-info-bg.jpg')] md:bg-cover md:bg-no-repeat md:bg-top">
              <div className="hidden md:block absolute bg-[#19263799] inset-0 -z-10" />

              <h2 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] tracking-[-0.045em] align-middle capitalize text-white text-center md:text-left">
                Why <span className="text-[#FFBF0F]">Clients Choose</span> Help
                Law Group
              </h2>

              <div className="mt-4 md:mt-6 lg:mt-10 space-y-6 w-full max-w-[430px]">
                {[
                  {
                    title: "We Take On the Powerful",
                    description:
                      "We go head-to-head with companies and individuals who believe they’re above accountability and we don’t back down",
                  },
                  {
                    title: "Focused on Serious Harm ",
                    description:
                      "We handle complex, high-impact matters, not small claims or quick settlements.",
                  },
                  {
                    title: "Experienced Legal Leadership",
                    description:
                      "Your case is reviewed by attorneys and legal professionals with experience navigating difficult, high-stakes cases.",
                  },
                  {
                    title: "You Stay in Control",
                    description:
                      "We start with a confidential review. No pressure. No obligation. You decide if and when to move forward.",
                  },
                  {
                    title: "Meaningful Impact",
                    description:
                      "Be part of lawsuits that drive change, set legal precedents, and hold parties accountable.",
                  },
                ].map(({ title, description }) => (
                  <div key={title} className="flex items-start gap-[10px]">
                    <div className="w-[16px] min-w-[16px] -mt-[2px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="22"
                        viewBox="0 0 16 22"
                        fill="none"
                      >
                        <path
                          d="M8 3C3.58866 3 0 6.58866 0 11C0 15.4113 3.58866 19 8 19C12.4113 19 16 15.4113 16 11C16 6.58866 12.4113 3 8 3ZM10.4713 11.4713L7.138 14.8047C7.07617 14.8666 7.0027 14.9158 6.92181 14.9493C6.84093 14.9829 6.75421 15.0001 6.66666 15C6.5791 15.0001 6.49239 14.9829 6.4115 14.9493C6.33062 14.9158 6.25715 14.8666 6.19531 14.8047C5.93466 14.544 5.93466 14.1227 6.19531 13.862L9.05734 11L6.19534 8.138C5.93469 7.87734 5.93469 7.456 6.19534 7.19534C6.456 6.93469 6.87734 6.93469 7.138 7.19534L10.4713 10.5287C10.732 10.7893 10.732 11.2107 10.4713 11.4713Z"
                          fill="#D4AD4A"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="heading font-semibold text-[16px] leading-[100%] tracking-[0%] text-white mb-[8px]">
                        {title}
                      </h3>
                      <p className="font-normal text-[14px] leading-[140%] tracking-[0%] text-white">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Lead form */}
            <div>
              <div className="py-[30px] md:py-[60px] px-[20px] md:px-[32px] lg:px-[40px]">
                <h3 className="font-bold text-[22px] md:text-[26px] lg:text-[30px] leading-[110%] tracking-[0%] text-[#1F3044] text-center mb-[20px] md:mb-[30px]lg:mb-[40px]">
                  Request a Private Review
                </h3>
                <HomeLeadForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
