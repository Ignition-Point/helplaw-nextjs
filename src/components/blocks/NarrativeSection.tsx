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
        "py-[40px] md:py-[60px] lg:py-[80px]",
        isDark ? "bg-navy-900" : "bg-white"
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
              "heading mt-2 text-2xl sm:text-3xl font-bold tracking-tight",
              isDark ? "text-white" : "text-[#122D56]"
            )}
          >
            {headline}
          </h2>
        )}
        {content && (
          <div
            className={cn(
              "mt-6 prose-helplaw",
              isDark && "[&_p]:!text-navy-200 [&_h2]:!text-white [&_h3]:!text-navy-100 [&_h4]:!text-navy-200 [&_strong]:!text-white [&_li]:!text-navy-200 [&_a]:!text-gold-400"
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
