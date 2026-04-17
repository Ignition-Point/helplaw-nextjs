import { CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QualificationChecklistProps {
  headline?: string;
  items: string[];
  ctaText?: string;
  ctaHref?: string;
  variant?: "light" | "dark";
}

export function QualificationChecklist({
  headline,
  items,
  ctaText = "See If You Qualify",
  ctaHref = "#form",
  variant = "light",
}: QualificationChecklistProps) {
  const isDark = variant === "dark";

  return (
    <section className={cn("py-[40px] md:py-[60px] lg:py-[80px]", isDark ? "bg-navy-900" : "bg-white")}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {headline && (
          <h2 className={cn("text-2xl heading sm:text-3xl font-bold tracking-tight mb-8", isDark ? "text-white" : "text-[#122D56]")}>
            {headline}
          </h2>
        )}
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={i}
              className={cn(
                "flex items-start gap-3 rounded-lg p-4",
                isDark ? "bg-navy-800/40 border border-navy-700/40" : "bg-navy-50/50 border border-navy-100"
              )}
            >
              <CheckCircle className={cn("h-5 w-5 shrink-0 mt-0.5", isDark ? "text-[#FFBF0F]" : "text-[#122D56]")} />
              <span className={cn("text-base", isDark ? "text-navy-100" : "text-[#122D56]")}>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-[#122D56] font-semibold text-[14px] md:text-[16px] lg:text-[18px] leading-[100%]  px-[24px] py-[16px] text-white transition-all hover:bg-[#1A365E]"
          >
            {ctaText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
