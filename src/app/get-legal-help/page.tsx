import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GetLegalHelpForm } from "@/components/GetLegalHelpForm";
import PreventWidowText from "@/components/PreventWidowText";

export const metadata: Metadata = {
  title: "Get Free Legal Help Now | Help Law Group",
  description:
    "Tell us what happened. A member of our team will review your situation and follow up with you directly. The first conversation is free.",
  alternates: { canonical: "https://helplaw.com/get-legal-help" },
};

export default function GetLegalHelpPage() {
  return (
    <>
     <PreventWidowText />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Get Legal Help" },
        ]}
      />

      {/* Hero */}
      <section className="bg-[#1A365E] py-[30px] md:py-[60px] lg:py-[80px]">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] align-middle capitalize text-white tracking-normal">
              Get Legal <span className="text-[#FFBF0F]">Help</span>
            </h1>
            <p className="mt-[14px] md:mt-4 text-[14px] md:text-base lg:text-lg text-white leading-[140%]">
              Tell us what happened. A member of our team will review your
              situation and follow up with you directly. The first conversation
              is free.
            </p>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-[#FFBF0F] py-3 md:py-4 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-x-8 gap-y-2">
          {[
            "Free case evaluation",
            "Confidential",
            "No obligation",
            "No fee unless you win",
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  text-center align-middle  text-[#122D56]"
            >
              <span className="h-2 w-2 rounded-full bg-[#122D56]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Form section */}
      <section className="py-[30px] md:py-[60px] lg:py-[80px] bg-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid lg:grid-cols-2 gap-[20px] md:gap-12 lg:gap-20">
            {/* Left: reassurance copy */}
            <div>
              <h2 className="text-center md:text-left heading font-bold text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] text-[#122D56] tracking-tight">
                You do not need to <span className="text-[#FFBF0F]">have everything </span> figured out.
              </h2>
              <p className="text-center md:text-left mt-[14px] md:mt-4 lg:mt-6  font-normal text-[14px] md:text-base lg:text-lg leading-[140%] text-[#546885]">
                Most people who reach out are not sure where to start. That is
                okay. Share what you are comfortable sharing and we will take it
                from there.
              </p>
              <p className="text-center md:text-left  mt-[14px] md:mt-4 text-[14px] font-normal md:text-base lg:text-lg leading-[140%] text-[#546885]">
                Someone from our team reviews every inquiry and follows up
                directly. We do not use automated systems.
              </p>

              <div className="mt-4 md:mt-6 lg:mt-10 space-y-4 lg:space-y-6">
                {[
                  {
                    step: "1",
                    title: "Submit the form",
                    description:
                      "Share what happened in your own words. There is no wrong way to start.",
                  },
                  {
                    step: "2",
                    title: "We review your situation",
                    description:
                      "A member of our team reads what you have shared and follows up with you directly.",
                  },
                  {
                    step: "3",
                    title: "You decide what comes next",
                    description:
                      "There is no pressure to move forward. When you are ready, we connect you with the right attorney.",
                  },
                ].map(({ step, title, description }) => (
                  <div key={step} className="flex gap-4">
                    <span className="flex w-[25px] h-[38px] border border-[#FFBF0F] rounded-[120px] shrink-0 items-center justify-center rounded-full font-semibold text-[18px] leading-[120%] align-middle text-[#132F55] ">
                      {step}
                    </span>
                    <div>
                      <h3 className="heading text-base font-semibold text-[#122D56]">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm text-[#546885] leading-[140%]">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div>
              <div className="rounded-[12px] lg:rounded-2xl bg-white border border-navy-100 p-4 md:p-8 sm:p-10 shadow-xl">
                <h3 className="text-center md:text-left heading text-[22px] md:text-[34px] lg:text-[42px] font-bold text-[#122D56] leading-[120%] mb-[14px]">
                  Request a Private Case Review
                </h3>
                <p className="text-center md:text-left text-[14px] md:text-base lg:text-lg text-[#546885] leading-[140%] mb-[14px]">
                  All information is confidential and will not be shared without
                  your consent.
                </p>
                <GetLegalHelpForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
