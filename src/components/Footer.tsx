import Link from "next/link";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Cases", href: "/cases" },
  { label: "Resources", href: "/resources" },
  { label: "Your Rights", href: "/your-rights" },
  { label: "FAQs", href: "/faq" },
  { label: "Get Legal Help", href: "/get-legal-help" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-navy-200">
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-navy-950 via-gold-500 to-navy-950" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-navy-300 max-w-xs">
              Connecting individuals and families with attorneys who handle
              serious harm, including abuse, unsafe products, and platform harm.
            </p>
            <a
              href="tel:1-800-HELP-LAW"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              1-800-HELP-LAW
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-400 mb-4">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-400 mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer bar */}
        <div className="border-t border-navy-800 py-6">
          <p className="text-xs leading-relaxed text-navy-400">
            <strong className="text-navy-300">Attorney Advertising.</strong>{" "}
            This website is designed for general information only. The information presented at this
            site should not be construed as formal legal advice nor the formation of an
            attorney-client relationship. Prior results do not guarantee a similar outcome.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-navy-800/50 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-navy-500">
            &copy; {currentYear} Help Law Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
