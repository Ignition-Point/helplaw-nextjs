import { cn } from "@/lib/utils";

interface WhatYouNeedToKnowProps {
  headline?: string;
  content?: string;
  variant?: "light" | "dark";
}

export function WhatYouNeedToKnow({
  headline = "What You Need to Know",
  content,
  variant = "light",
}: WhatYouNeedToKnowProps) {
  const isDark = variant === "dark";

  return (
    <section className={cn("py-20 sm:py-28", isDark ? "bg-navy-900" : "bg-white")}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className={cn("text-2xl sm:text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-navy-900")}>
          {headline}
        </h2>
        {content && (
          <div
            className={cn(
              "mt-6 prose-helplaw",
              isDark && "[&_p]:!text-navy-200 [&_h2]:!text-white [&_h3]:!text-navy-100 [&_h4]:!text-navy-200 [&_strong]:!text-white [&_li]:!text-navy-200 [&_a]:!text-gold-400"
            )}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}
