"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "About Us", href: "/about" },
  { label: "Our Cases", href: "/cases" },
  { label: "Resources", href: "/resources" },
  { label: "Your Rights", href: "/your-rights" },
  { label: "FAQs", href: "/faq" },
  { label: "Get Legal Help", href: "/get-legal-help" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-100/60 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo variant="dark" />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={`${item.href}-${i}`}
              href={item.href}
              className="px-3.5 py-2 text-sm font-medium text-navy-700 rounded-md transition-colors hover:text-navy-900 hover:bg-navy-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center">
          <a
            href="tel:+1-800-000-0000"
            className="inline-flex items-center justify-center rounded-full border-2 border-navy-800 px-6 py-2 text-sm font-semibold text-navy-800 transition-all hover:bg-navy-800 hover:text-white"
          >
            Call Now
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-navy-700 hover:bg-navy-50"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-navy-100/60 bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={`${item.href}-${i}`}
                href={item.href}
                className="block rounded-md px-3 py-2.5 text-base font-medium text-navy-700 hover:bg-navy-50 hover:text-navy-900"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-navy-100">
              <a
                href="tel:+1-800-000-0000"
                className="block w-full rounded-full border-2 border-navy-800 px-6 py-3 text-center text-sm font-semibold text-navy-800"
                onClick={() => setMobileOpen(false)}
              >
                Call Now
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
