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
        "py-14 sm:py-16",
        variant === "gold" && "bg-gold-500",
        variant === "dark" && "bg-navy-900",
        variant === "light" && "bg-navy-50"
      )}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        {headline && (
          <h2
            className={cn(
              "text-2xl sm:text-3xl font-bold tracking-tight",
              variant === "gold" && "text-navy-950",
              variant === "dark" && "text-white",
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
              variant === "gold" && "text-navy-800",
              variant === "dark" && "text-navy-200",
              variant === "light" && "text-slate-warm-600"
            )}
          >
            {subheadline}
          </p>
        )}
        {content && (
          <div
            className={cn(
              "mt-4 text-sm prose-helplaw",
              variant === "gold" && "[&_p]:text-navy-800",
              variant === "dark" && "[&_p]:text-navy-200",
            )}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={ctaHref}
            className={cn(
              "inline-flex items-center justify-center rounded-md px-7 py-3 text-base font-semibold transition-all",
              variant === "gold" && "bg-navy-900 text-white hover:bg-navy-800 shadow-lg",
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
              "inline-flex items-center gap-2 text-sm font-medium transition-colors",
              variant === "gold" && "text-navy-800 hover:text-navy-950",
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
