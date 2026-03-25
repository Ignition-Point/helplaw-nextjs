import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headline?: string;
  items: { label: string; anchor: string }[];
  variant?: "light" | "dark";
}

export function TableOfContents({
  headline = "Table of Contents",
  items,
  variant = "light",
}: TableOfContentsProps) {
  const isDark = variant === "dark";

  if (!items.length) return null;

  return (
    <section className={cn("py-10 sm:py-12", isDark ? "bg-navy-900" : "bg-navy-50")}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <nav
          className={cn(
            "rounded-xl border p-6 sm:p-8",
            isDark ? "bg-navy-800/60 border-navy-700/50" : "bg-white border-navy-100 shadow-sm"
          )}
          aria-label="Table of contents"
        >
          <h2
            className={cn(
              "text-lg font-semibold mb-4",
              isDark ? "text-white" : "text-navy-900"
            )}
          >
            {headline}
          </h2>
          <ol className="space-y-2 list-decimal list-inside">
            {items.map((item, i) => (
              <li key={i}>
                <a
                  href={`#${item.anchor}`}
                  className={cn(
                    "text-sm font-medium underline-offset-2 hover:underline transition-colors",
                    isDark ? "text-navy-200 hover:text-gold-400" : "text-navy-600 hover:text-gold-600"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
