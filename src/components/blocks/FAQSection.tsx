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
    <section className={cn("py-[30px] md:py-[40px] lg:py-[60px]", isDark ? "bg-[#1A365E]" : "bg-slate-warm-50")}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {headline && (
          <h2 className={cn("heading text-[22px] md:text-[34px] lg:text-[42px] leading-[120%] font-bold tracking-tight mb-[14px] md:mb-8", isDark ? "text-white" : "text-[#122D56]")}>
            {headline}
          </h2>
        )}
        <Accordion type="single" collapsible className="">
          {items.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className={cn(
                "border-navy-100",
                isDark ? "border-navy-100" : "border-navy-100"
              )}
            >
              <AccordionTrigger
                className={cn(
                  "heading cursor-pointer text-small sm:text-base font-semibold text-[#122D56] hover:no-underline hover:text-navy-700",
                  isDark ? "text-[#122D56]" : "text-[#122D56]"
                )}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                className={cn(
                  "text-base leading-[140%]  leading-relaxed",
                  isDark ? "text-[#546885]" : "text-[#546885]"
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
