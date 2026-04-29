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
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#122D56] text-white mb-[58px] md:mb-[0px]">
      {/* Gold accent line */}

      <div className="mx-auto max-w-7xl px-5">
        {/* Main footer grid */}
        <div className="flex flex-wrap items-center justify-center gap-[0] md:gap-[10px] lg:gap-[40px] py-[15px] lg:pt-[14px] lg:py-[8px]">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo variant="light" />
            {/* <p className="mt-4 text-sm leading-relaxed text-navy-300 max-w-xs">
              Connecting individuals and families with attorneys who handle
              serious harm, including abuse, unsafe products, and platform harm.
            </p> */}
            {/* <a
              href="tel:1-800-HELP-LAW"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              1-800-HELP-LAW
            </a> */}
          </div>

          {/* Navigation */}
          <div>
            {/* <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-400 mb-4">
              Navigate
            </h3> */}
            <ul className="flex flex-wrap items-center justify-center gap-y-[6px] gap-[14px] md:gap-[20px] lg:gap-[24px]">
              {NAV_LINKS.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  <Link
                    href={link.href}
                    className="font-normal text-[14px] md:text-[16px] lg:text-[18px] leading-[120%] tracking-[0%] text-white hover:text-[#FFBF0F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-normal text-[14px] md:text-[16px] lg:text-[18px] leading-[120%] tracking-[0%] text-white hover:text-[#FFBF0F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          {/* <div>
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
          </div> */}
        </div>

        {/* Copyright */}
        <div className="border-t border-[#596C89]">
          <p className="font-normal text-[14px] lg:text-[16px] leading-[26px] tracking-[0%] py-[15px] lg:py-[20px] text-white text-center">
            &copy; {currentYear} Help Law Group. All rights reserved.
          </p>
        </div>
      </div>
      {/* Disclaimer bar */}
        <div className="bg-[#000000] py-[20px]">
          <div className="mx-auto max-w-7xl px-5">
          <p className="text-center md:text-left font-normal text-[10px] md:text-[10px] lg:text-[10px] leading-[140%] tracking-[0%] text-white">
            <strong className="font-medium">DISCLAIMER:</strong> This website is for informational purposes only and constitutes a paid legal advertisement. The information provided does not constitute legal or medical advice, and no attorney-client relationship is formed by use of this website. Results are not guaranteed. Information may not be complete or up to date. You should consult a licensed attorney regarding your specific legal situation and a qualified medical professional regarding any medical concerns. Do not disregard professional advice based on information found on this site. Some content on this website, including certain images, may be AI-generated, simulated, or illustrative only and may not depict actual Help Law Group offices, personnel, or events. Help Law Group is not responsible for actions taken based on the content of this website. Our goal is to help connect individuals with information and legal resources to fight for their rights.
          </p>
          </div>
        </div>
    </footer>
  );
}
