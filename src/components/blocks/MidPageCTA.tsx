import { Phone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MidPageCTAProps {
  headline?: string;
  subheadline?: string;
  content?: string;
  ctaText?: string;
  ctaHref?: string;
  phoneNumber?: string;
  displayNumber?: string;
  variant?: "gold" | "dark" | "light";
}

export function MidPageCTA({
  headline,
  subheadline,
  content,
  ctaText = "Start Your Free Case Review",
  ctaHref = "#form",
  phoneNumber = "1-800-HELP-LAW",
  displayNumber = "1-800-HELP-LAW",
  variant = "gold",
}: MidPageCTAProps) {
  return (
    <section
      className={cn(
        "py-[30px] md:py-[40px] lg:py-[60px]",
        variant === "gold" && "bg-[#FFBF0F]",
        variant === "dark" && "bg-navy-900",
        variant === "light" && "bg-navy-50"
      )}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        {headline && (
          <h2
            className={cn(
              "heading text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] font-bold tracking-tight",
              variant === "gold" && "text-[#122D56]",
              variant === "dark" && "text-[#122D56]",
              variant === "light" && "text-navy-900"
            )}
          >
            {headline}
          </h2>
        )}
        {subheadline && (
          <p
            className={cn(
              "mt-3 text-base",
              variant === "gold" && "text-[#122D56]",
              variant === "dark" && "text-[#122D56]",
              variant === "light" && "text-slate-warm-600"
            )}
          >
            {subheadline}
          </p>
        )}
        {content && (
          <div
            className={cn(
              "mt-4 text-[16px] lg:text-[18px] ",
              variant === "gold" && "[&_p]:text-[#122D56]",
              variant === "dark" && "[&_p]:text-[#122D56]",
            )}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={ctaHref}
            className={cn(
              "inline-flex items-center justify-center rounded-full font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  px-[24px] py-[16px]  transition-all",
              variant === "gold" && "bg-white text-[#122D56] hover:bg-navy-800 hover:text-white",
              variant === "dark" && "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-lg",
              variant === "light" && "bg-navy-800 text-white hover:bg-navy-700 shadow-lg"
            )}
          >
            {ctaText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
          <a
            href={`tel:${phoneNumber}`}
            className={cn(
              "inline-flex items-center justify-center rounded-full font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  px-[24px] py-[16px]  transition-all",
              variant === "gold" && "border-2 border-[#122D56] hover:border-white text-[#122D56] transition-all hover:bg-white hover:text-[#122D56]",
              variant === "dark" && "text-navy-300 hover:text-white",
              variant === "light" && "text-navy-600 hover:text-navy-800"
            )}
          >
            <Phone className="h-4 w-4" />
            {displayNumber}
          </a>
        </div>
      </div>
    </section>
  );
}
