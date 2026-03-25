import Image from "next/image";
import { cn } from "@/lib/utils";

interface NarrativeSideImageProps {
  eyebrow?: string;
  headline?: string;
  content?: string;
  imageUrl?: string;
  imagePosition?: "left" | "right";
  mobileLayout?: "overlay" | "stack";
  variant?: "light" | "dark";
}

export function NarrativeSideImage({
  eyebrow,
  headline,
  content,
  imageUrl,
  imagePosition = "right",
  variant = "light",
}: NarrativeSideImageProps) {
  const isDark = variant === "dark";

  return (
    <section className={cn("py-20 sm:py-28", isDark ? "bg-navy-900" : "bg-white")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn("grid lg:grid-cols-2 gap-10 lg:gap-16 items-center", imagePosition === "left" && "lg:[direction:rtl] lg:[&>*]:[direction:ltr]")}>
          {/* Text */}
          <div>
            {eyebrow && (
              <span className={cn("text-sm font-medium tracking-wider uppercase", isDark ? "text-gold-400" : "text-gold-600")}>
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className={cn("mt-2 text-2xl sm:text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-navy-900")}>
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
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={imageUrl}
                alt={headline || ""}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
