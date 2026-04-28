import { Phone } from "lucide-react";
import { LeadFormRenderer } from "@/components/LeadFormRenderer";
import { shouldUseDummyCases } from "@/lib/featureFlags";

interface HeroWithFormProps {
  backgroundImage?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  content?: string;
  leadFormId?: string;
  caseId: string;
  caseSlug: string;
  phoneNumber?: string;
  displayNumber?: string;
}

export function HeroWithForm({
  backgroundImage,
  eyebrow,
  headline,
  subheadline,
  content,
  leadFormId,
  caseId,
  caseSlug,
  phoneNumber = "1-800-HELP-LAW",
  displayNumber = "1-800-HELP-LAW",
}: HeroWithFormProps) {
  const shouldShowLeadForm = Boolean(leadFormId) || shouldUseDummyCases();

  return (
    <section className="relative overflow-hidden bg-[#1A365E] pt-0 pb-[30px] md:pt-[70px] md:pb-[72px] lg:pt-[100px] lg:pb-[92px]">
      {/* Background image layer */}
{backgroundImage && (
  <div
    className="
      relative md:absolute md:inset-0
      w-full aspect-video md:aspect-auto md:h-full
      bg-cover bg-center md:bg-center
    "
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="hidden md:block absolute inset-0 bg-[#122D56]/60" />
  </div>
)}
      {/* Gradient overlay */}
      
      <div className="absolute inset-0 bg-gradient-to-br from-bg-[#122D56]/40 via-bg-[#122D56]/20 to-bg-[#122D56]/60" />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid lg:grid-cols-5 gap-[18px] md:gap-12 lg:gap-16 items-start pt-[30px] md:pt-[0]">
          {/* Left: copy */}
          <div className="lg:col-span-3 md:pt-2 text-center md:text-left">
            {eyebrow && (
              <div className="flex items-center gap-2 mb-[14px] md:mb-5">
                <div className="hidden md:block h-px w-8 bg-[#FFBF0F]" />
                <span className="text-sm font-medium tracking-wider uppercase text-[#FFBF0F]">
                  {eyebrow}
                </span>
              </div>
            )}

            {headline && (
              <h1 className="heading text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] font-bold text-white tracking-tight">
                {headline}
              </h1>
            )}

            {subheadline && (
              <div
                className="mt-[12px] md:mt-4 text-[14px] md:text-base lg:text-lg text-white leading-[140%] max-w-xl font-normal tracking-normal [&_h3]:text-[14px] md:[&_h3]:text-[16px] lg:[&_h3]:text-lg  [&_h3]:font-medium [&_h3]:text-white [&_p]:text-white [&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: subheadline }}
              />
            )}

            {content && (
              <div
                className="mt-[14px] md:mt-4 lg:mt-6 text-[14px] md:text-base lg:text-lg text-white leading-[140%] max-w-xl prose-helplaw [&_h2]:!text-white [&_h3]:!text-navy-100 [&_p]:!text-white [&_a]:!text-gold-400 [&_strong]:!text-white [&_li]:!text-white"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Trust badges */}
            <div className="mt-[14px] md:mt-4 lg:mt-6 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-1.5 md:gap-y-3">
              {["Free Case Review", "No Fees Unless You Win", "Confidential"].map((text) => (
                <span key={text} className="inline-flex items-center gap-2 text-sm text-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBF0F] shrink-0" />
                  {text}
                </span>
              ))}
            </div>

            <div className="mt-[14px] md:mt-4 lg:mt-6 inline-flex items-center gap-2 rounded-full bg-white text-[#122D56] font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  px-[24px] py-[14px] transition-all hover:bg-navy-800 hover:text-white">
              <Phone className="h-4 w-4 " />
              <a
                href={`tel:${phoneNumber}`}
                className=""
              >
                {displayNumber}
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-2" id="form">
            <div className="rounded-xl bg-white p-6 sm:p-8 shadow-2xl shadow-navy-950/50">
              <h2 className="heading text-xl font-bold text-[#122D56] mb-1">
                Begin Your Free Case Review
              </h2>
              <p className="text-sm text-[#546885] mb-6">
                Fill out the form below to see if you qualify
              </p>
              {shouldShowLeadForm ? (
                <LeadFormRenderer
                  leadFormId={leadFormId || "__dummy_case_form__"}
                  caseId={caseId}
                  caseSlug={caseSlug}
                />
              ) : (
                <div className="rounded-lg border border-slate-200 text-[#546885] p-5 text-center">
                  <p className="text-sm font-medium text-navy-900">
                    Speak with our team for a free, confidential review.
                  </p>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-[#FFBF0F] px-5 py-3 text-sm font-semibold text-[#122D56] transition-all hover:bg-[#1A365E] hover:text-white"
                  >
                    Call {displayNumber}
                  </a>
                  <p className="mt-3 text-xs text-slate-warm-400">
                    No pressure. No obligation. No fee unless you win.
                  </p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center gap-4 text-xs text-[#546885]">
                <span className="inline-flex items-center gap-1.5"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>Secure</span>
                <span className="inline-flex items-center gap-1.5"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>Confidential</span>
                <span className="inline-flex items-center gap-1.5"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" /> */}
    </section>
  );
}
