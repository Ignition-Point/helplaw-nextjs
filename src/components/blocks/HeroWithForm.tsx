import { Phone } from "lucide-react";
import { LeadFormRenderer } from "@/components/LeadFormRenderer";

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
  return (
    <section className="relative overflow-hidden bg-navy-950">
      {/* Background image layer */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-navy-950/60" />
        </div>
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/40 via-navy-950/20 to-navy-950/60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Left: copy */}
          <div className="lg:col-span-3 pt-2">
            {eyebrow && (
              <div className="flex items-center gap-2 mb-5">
                <div className="h-px w-8 bg-gold-500" />
                <span className="text-sm font-medium tracking-wider uppercase text-gold-400">
                  {eyebrow}
                </span>
              </div>
            )}

            {headline && (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] sm:leading-[1.12]">
                {headline}
              </h1>
            )}

            {subheadline && (
              <div
                className="mt-6 text-lg sm:text-xl text-navy-100 leading-relaxed max-w-xl font-normal tracking-normal [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-white [&_p]:text-navy-100 [&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: subheadline }}
              />
            )}

            {content && (
              <div
                className="mt-6 text-base text-navy-300 leading-relaxed max-w-xl prose-helplaw [&_h2]:!text-white [&_h3]:!text-navy-100 [&_p]:!text-navy-200 [&_a]:!text-gold-400 [&_strong]:!text-white [&_li]:!text-navy-200"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              {["Free Case Review", "No Fees Unless You Win", "Confidential"].map((text) => (
                <span key={text} className="inline-flex items-center gap-2 text-sm text-white/90">
                  <span className="h-2.5 w-2.5 rounded-full bg-gold-400 shrink-0" />
                  {text}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold-400" />
              <a
                href={`tel:${phoneNumber}`}
                className="text-base font-semibold text-white hover:text-gold-400 transition-colors"
              >
                {displayNumber}
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white p-6 sm:p-8 shadow-2xl shadow-navy-950/50">
              <h2 className="text-xl font-bold text-navy-900 mb-1">
                Begin Your Free Case Review
              </h2>
              <p className="text-sm text-slate-warm-500 mb-6">
                Fill out the form below to see if you qualify
              </p>
              {leadFormId ? (
                <LeadFormRenderer leadFormId={leadFormId} caseId={caseId} caseSlug={caseSlug} />
              ) : (
                <p className="text-sm text-slate-warm-400 italic">No form configured.</p>
              )}
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center gap-4 text-xs text-slate-warm-400">
                <span className="inline-flex items-center gap-1.5"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>Secure</span>
                <span className="inline-flex items-center gap-1.5"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>Confidential</span>
                <span className="inline-flex items-center gap-1.5"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
    </section>
  );
}
