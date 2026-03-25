import { Shield, Scale, Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBannerProps {
  items?: { icon?: string; text: string }[];
  variant?: "gold" | "dark" | "light";
}

const DEFAULT_ITEMS = [
  { icon: "shield", text: "No Fee Unless You Win" },
  { icon: "scale", text: "Free Consultation" },
  { icon: "award", text: "Experienced Trial Attorneys" },
  { icon: "check", text: "24/7 Support" },
];

const ICON_MAP: Record<string, typeof Shield> = {
  shield: Shield,
  scale: Scale,
  award: Award,
  check: CheckCircle,
};

export function TrustBanner({ items, variant = "gold" }: TrustBannerProps) {
  const trustItems = items?.length ? items : DEFAULT_ITEMS;

  return (
    <section
      className={cn(
        "py-4 sm:py-5",
        variant === "gold" && "bg-gold-500",
        variant === "dark" && "bg-navy-900 border-y border-navy-800",
        variant === "light" && "bg-navy-50 border-y border-navy-100"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustItems.map((item, i) => {
            const IconComp = ICON_MAP[item.icon || "shield"] || Shield;
            return (
              <div key={i} className="flex items-center gap-2">
                <IconComp
                  className={cn(
                    "h-4 w-4 shrink-0",
                    variant === "gold" && "text-navy-900",
                    variant === "dark" && "text-gold-400",
                    variant === "light" && "text-gold-600"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    variant === "gold" && "text-navy-950",
                    variant === "dark" && "text-navy-100",
                    variant === "light" && "text-navy-800"
                  )}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
