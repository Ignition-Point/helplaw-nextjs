import { cn } from "@/lib/utils";

interface NarrativeSectionProps {
  eyebrow?: string;
  headline?: string;
  content?: string;
  quote?: { text: string; attribution?: string };
  variant?: "light" | "dark";
}

export function NarrativeSection({
  eyebrow,
  headline,
  content,
  quote,
  variant = "light",
}: NarrativeSectionProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={cn(
        "py-[30px] md:py-[40px] lg:py-[60px]",
        isDark ? "bg-[#1A365E]" : "bg-white border-b"
      )}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <span
            className={cn(
              "text-sm font-medium tracking-wider uppercase",
              isDark ? "text-[#FFBF0F]" : "text-[#FFBF0F]"
            )}
          >
            {eyebrow}
          </span>
        )}
        {headline && (
          <h2
            className={cn(
              "heading mt-2 heading text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] font-bold tracking-tight",
              isDark ? "text-white" : "text-[#122D56]"
            )}
          >
            {headline}
          </h2>
        )}
        {content && (
          <div
            className={cn(
              "prose-helplaw",
              isDark && "[&_p]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_strong]:!text-white [&_li]:!text-white [&_a]:!text-[#FFBF0F]"
            )}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        {quote && (
          <blockquote className="mt-8 border-l-4 border-[#FFBF0F] pl-5 py-2">
            <p className={cn("text-lg italic", isDark ? "text-[#5C6F8B]" : "text-slate-warm-600")}>
              &ldquo;{quote.text}&rdquo;
            </p>
            {quote.attribution && (
              <cite className={cn("mt-2 block text-sm not-italic", isDark ? "text-[#5C6F8B]" : "text-slate-warm-400")}>
                &mdash; {quote.attribution}
              </cite>
            )}
          </blockquote>
        )}
      </div>
    </section>
  );
}
