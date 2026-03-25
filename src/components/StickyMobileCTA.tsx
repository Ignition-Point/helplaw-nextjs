"use client";

import { useEffect, useState } from "react";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 500);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 md:hidden h-[60px] bg-navy-950 shadow-[0_-2px_8px_rgba(0,0,0,0.25)] flex items-center justify-between px-4 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Tap-to-call */}
      <a
        href="tel:+18005551234"
        className="flex items-center gap-2 text-white font-medium"
        aria-label="Call us"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-gold-400"
        >
          <path
            fillRule="evenodd"
            d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm">Call Now</span>
      </a>

      {/* Free Case Review button */}
      <a
        href="#get-help"
        className="bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold text-sm px-5 py-2.5 rounded-md transition-colors"
      >
        Free Case Review
      </a>
    </div>
  );
}
