import { cn } from "@/lib/utils";

interface NarrativeWithImageProps {
  eyebrow?: string;
  headline?: string;
  content?: string;
  backgroundImage?: string;
  variant?: "light" | "dark";
}

export function NarrativeWithImage({
  eyebrow,
  headline,
  content,
  backgroundImage,
  variant = "dark",
}: NarrativeWithImageProps) {
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
      <div className={cn("relative py-[40px] md:py-[60px] lg:py-[80px]", !backgroundImage && (isDark ? "bg-[#122D56]" : "bg-slate-warm-50"))}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {eyebrow && (
            <span className={cn("text-sm font-medium tracking-wider uppercase", isDark ? "text-[#FFBF0F]" : "text-[#FFBF0F]")}>
              {eyebrow}
            </span>
          )}
          {headline && (
            <h2 className={cn("mt-2 heading text-2xl sm:text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-navy-900")}>
              {headline}
            </h2>
          )}
          {content && (
            <div
              className={cn(
                "mt-4 prose-helplaw",
                isDark && "[&_p]:!text-white [&_h2]:!text-white [&_h3]:!text-navy-100 [&_h4]:!text-navy-200 [&_strong]:!text-white [&_li]:!text-navy-200 [&_a]:!text-gold-400"
              )}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
