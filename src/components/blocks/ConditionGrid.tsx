import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConditionGridProps {
  headline?: string;
  subheadline?: string;
  conditions: string[];
  variant?: "light" | "dark";
}

export function ConditionGrid({
  headline,
  subheadline,
  conditions,
  variant = "dark",
}: ConditionGridProps) {
  const isDark = variant === "dark";

  return (
    <section className={cn("py-20 sm:py-28", isDark ? "bg-navy-900" : "bg-slate-warm-50")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {headline && (
          <h2 className={cn("text-2xl sm:text-3xl font-bold tracking-tight text-center", isDark ? "text-white" : "text-navy-900")}>
            {headline}
          </h2>
        )}
        {subheadline && (
          <p className={cn("mt-3 text-base text-center max-w-2xl mx-auto", isDark ? "text-navy-300" : "text-slate-warm-600")}>
            {subheadline}
          </p>
        )}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {conditions.map((condition, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 rounded-lg p-4 transition-colors",
                isDark
                  ? "bg-navy-800/60 border border-navy-700/50"
                  : "bg-white border border-navy-100 shadow-sm"
              )}
            >
              <AlertCircle
                className={cn(
                  "h-5 w-5 shrink-0 mt-0.5",
                  isDark ? "text-gold-400" : "text-gold-600"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium leading-snug",
                  isDark ? "text-navy-100" : "text-navy-800"
                )}
              >
                {condition}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
