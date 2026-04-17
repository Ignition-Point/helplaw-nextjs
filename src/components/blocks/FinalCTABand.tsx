import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinalCTABandProps {
  headline?: string;
  content?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
  variant?: "dark" | "light";
}

export function FinalCTABand({
  headline,
  content,
  ctaText = "Start Your Free Case Review",
  ctaHref = "#form",
  backgroundImage,
  variant = "dark",
}: FinalCTABandProps) {
  const isDark = variant === "dark";

  return (
    <section className="relative overflow-hidden">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className={cn("absolute inset-0", isDark ? "bg-[#122D56]/65" : "bg-white/90")} />
        </div>
      )}
      <div className={cn("relative py-[40px] md:py-[60px] lg:py-[80px]", !backgroundImage && (isDark ? "bg-navy-900" : "bg-navy-50"))}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          {headline && (
            <h2 className={cn("heading text-2xl sm:text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-navy-900")}>
              {headline}
            </h2>
          )}
          {content && (
            <div
              className={cn("mt-4 text-base", isDark ? "[&_p]:text-white" : "[&_p]:text-slate-warm-600")}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
          <div className="mt-8">
            <a
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full bg-white text-[#122D56] font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  px-[24px] py-[16px] transition-all hover:bg-navy-800 hover:text-white"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
