import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GetLegalHelpForm } from "@/components/GetLegalHelpForm";

export const metadata: Metadata = {
  title: "Get Legal Help",
  description:
    "Tell us what happened. A member of our team will review your situation and follow up with you directly. The first conversation is free.",
};

export default function GetLegalHelpPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Get Legal Help" },
        ]}
      />

      {/* Hero */}
      <section className="bg-[#1A365E] py-[40px] md:py-[60px] lg:py-[80px]">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <h1 className="heading font-bold text-[32px] md:text-[42px] lg:text-[56px] leading-[1.2] align-middle capitalize text-white tracking-normal">
              Get Legal <span className="text-[#FFBF0F]">Help</span>
            </h1>
            <p className="mt-4 mt-4 text-sm md:text-base lg:text-lg text-white leading-relaxed">
              Tell us what happened. A member of our team will review your
              situation and follow up with you directly. The first conversation
              is free.
            </p>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-[#FFBF0F] py-4 ">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-x-8 gap-y-2">
          {[
            "Free case evaluation",
            "Confidential",
            "No obligation",
            "No fee unless you win",
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 font-medium text-[16px] lg:text-[18px] leading-[100%]  text-center align-middle  text-[#122D56]"
            >
              <span className="h-2 w-2 rounded-full bg-[#122D56]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Form section */}
      <section className="py-[40px] md:py-[60px] lg:py-[80px] bg-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
            {/* Left: reassurance copy */}
            <div>
              <h2 className="heading font-bold text-[28px] md:text-[34px] lg:text-[42px] text-[#122D56] leading-[1.2] tracking-tight">
                You do not need to <span className="text-[#FFBF0F]">have everything</span> figured out.
              </h2>
              <p className="mt-4 lg:mt-6 text-base sm:text-lg leading-[140%] text-[#546885] leading-relaxed">
                Most people who reach out are not sure where to start. That is
                okay. Share what you are comfortable sharing and we will take it
                from there.
              </p>
              <p className="mt-4 text-base sm:text-lg leading-[140%] text-[#546885] leading-relaxed">
                Someone from our team reviews every inquiry and follows up
                directly. We do not use automated systems.
              </p>

              <div className="mt-10 space-y-6">
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
                      <p className="mt-1 text-sm text-[#546885] leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div>
              <div className="rounded-[12px] lg:rounded-2xl bg-white border border-navy-100 p-6 md:p-8 sm:p-10 shadow-xl">
                <h3 className="text-2xl font-bold text-[#122D56] mb-2">
                  Request a Private Case Review
                </h3>
                <p className="text-sm text-[#546885] mb-6">
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
