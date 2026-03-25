"use client";

import { useState, useEffect } from "react";
import { StickyTableOfContents } from "./StickyTableOfContents";

interface DesktopTocWrapperProps {
  headings: { id: string; text: string; level: number }[];
}

export function DesktopTocWrapper({ headings }: DesktopTocWrapperProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    let footerTop = Infinity;

    const updateFooterPos = () => {
      if (footer) {
        footerTop = footer.getBoundingClientRect().top + window.scrollY;
      }
    };
    updateFooterPos();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show after scrolling 600px (past the hero)
      const pastHero = scrollY > 600;

      // Hide when scroll reaches near the footer
      const nearFooter = scrollY + windowHeight > footerTop - 100;

      setVisible(pastHero && !nearFooter);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateFooterPos);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateFooterPos);
    };
  }, []);

  return (
    <div
      className={`hidden lg:block fixed right-[max(1.5rem,calc((100vw-80rem)/2))] top-28 w-56 xl:w-64 z-30 transition-all duration-300 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
      }`}
    >
      <StickyTableOfContents headings={headings} />
    </div>
  );
}
