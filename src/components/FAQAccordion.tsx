"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FAQItem {
  q: string;
  a: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="border-navy-100"
        >
          <AccordionTrigger className="heading cursor-pointer text-small sm:text-base font-semibold text-[#122D56] hover:no-underline hover:text-navy-700">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-[14px] md:text-base leading-[140%] text-[#546885] leading-[140%]">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
