"use client";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQSectionProps {
  headline?: string;
  items: { question: string; answer: string }[];
  variant?: "light" | "dark";
}

export function FAQSection({
  headline,
  items,
  variant = "light",
}: FAQSectionProps) {
  const isDark = variant === "dark";

  if (!items.length) return null;

  return (
    <section className={cn("py-20 sm:py-28", isDark ? "bg-navy-900" : "bg-slate-warm-50")}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {headline && (
          <h2 className={cn("text-2xl sm:text-3xl font-bold tracking-tight mb-8", isDark ? "text-white" : "text-navy-900")}>
            {headline}
          </h2>
        )}
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className={cn(
                "rounded-lg border px-5",
                isDark ? "bg-navy-800/40 border-navy-700/40" : "bg-white border-navy-100 shadow-sm"
              )}
            >
              <AccordionTrigger
                className={cn(
                  "text-left text-base font-medium hover:no-underline py-4",
                  isDark ? "text-white" : "text-navy-900"
                )}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                className={cn(
                  "text-base leading-relaxed pb-4",
                  isDark ? "text-navy-200" : "text-slate-warm-600"
                )}
              >
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
