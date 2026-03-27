"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface StickyTableOfContentsProps {
  headings: Heading[];
}

export function StickyTableOfContents({ headings }: StickyTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = useCallback((id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile: collapsible dropdown */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-navy-800 bg-slate-50 border border-slate-200 rounded-lg"
        >
          Table of Contents
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <nav className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <ul className="space-y-1.5">
              {headings.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => handleClick(h.id)}
                    className={`block w-full text-left text-sm py-1 transition-colors ${
                      h.level > 2 ? "pl-4" : ""
                    } ${activeId === h.id ? "text-navy-800 font-semibold" : "text-slate-500 hover:text-navy-600"}`}
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop: sticky sidebar */}
      <nav className="hidden lg:block sticky top-24 self-start">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          On this page
        </p>
        <ul className="space-y-1 border-l border-slate-200">
          {headings.map((h, idx) => (
            <li key={`${h.id}-${idx}`}>
              <button
                onClick={() => handleClick(h.id)}
                className={`block w-full text-left text-sm py-1 transition-colors border-l-2 -ml-px ${
                  h.level > 2 ? "pl-6" : "pl-4"
                } ${
                  activeId === h.id
                    ? "border-gold-500 text-navy-800 font-semibold"
                    : "border-transparent text-slate-400 hover:text-navy-600 hover:border-slate-300"
                }`}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
