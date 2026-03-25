import { Phone, ArrowRight } from "lucide-react";

interface InlineCTAProps {
  content: {
    headline?: string;
    button_text?: string;
    button_url?: string;
    phone_number?: string;
  };
}

export function InlineCTA({ content }: InlineCTAProps) {
  const headline =
    content.headline || "Think you may have a case? Find out if you qualify.";
  const buttonText = content.button_text || "Free Case Review";
  const buttonUrl = content.button_url || "#get-help";
  const phoneNumber = content.phone_number;

  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-slate-100 px-6 py-10 sm:py-12 text-center shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-navy-900">
            {headline}
          </h2>

          <div className="mt-6 flex flex-col items-center gap-4">
            <a
              href={buttonUrl}
              className="inline-flex items-center justify-center rounded-md bg-gold-500 px-7 py-3 text-base font-semibold text-navy-950 shadow-lg transition-all hover:bg-gold-400"
            >
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>

            {phoneNumber && (
              <a
                href={`tel:${phoneNumber}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-navy-600 transition-colors hover:text-navy-800"
              >
                <Phone className="h-4 w-4" />
                {phoneNumber}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
