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
      <section className="bg-navy-950 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Get Legal Help
            </h1>
            <p className="mt-4 text-lg text-navy-200 leading-relaxed">
              Tell us what happened. A member of our team will review your
              situation and follow up with you directly. The first conversation
              is free.
            </p>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-navy-900 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-x-8 gap-y-2">
          {[
            "Free case evaluation",
            "Confidential",
            "No obligation",
            "No fee unless you win",
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 text-sm text-white/90 font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-gold-500" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Form section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Left: reassurance copy */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
                You do not need to have everything figured out.
              </h2>
              <p className="mt-6 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
                Most people who reach out are not sure where to start. That is
                okay. Share what you are comfortable sharing and we will take it
                from there.
              </p>
              <p className="mt-4 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
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
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
                      {step}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-navy-900">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-warm-500 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div>
              <div className="rounded-2xl bg-white border border-navy-100 p-8 sm:p-10 shadow-xl">
                <h3 className="text-2xl font-bold text-navy-900 mb-2">
                  Request a Private Case Review
                </h3>
                <p className="text-sm text-slate-warm-500 mb-6">
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
