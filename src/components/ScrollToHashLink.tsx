"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, type ReactNode } from "react";

type Props = {
  href: `#${string}` | `/${string}#${string}`;
  className?: string;
  children: ReactNode;
};

function getHash(href: string): string | null {
  const idx = href.indexOf("#");
  if (idx === -1) return null;
  const hash = href.slice(idx + 1);
  return hash ? hash : null;
}

export function ScrollToHashLink({ href, className, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const hash = getHash(href);
    if (!hash) return;

    // If this is a same-page hash, always perform a manual smooth scroll
    // (clicking the same hash twice normally does nothing).
    const isSamePageHash = href.startsWith("#") || href.startsWith(`${pathname}#`);
    if (!isSamePageHash) return;

    e.preventDefault();
    const el = document.getElementById(hash);
    if (el) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      // Keep URL in sync without forcing a navigation.
      window.history.replaceState(null, "", `#${hash}`);
      return;
    }

    // Fallback: if element isn't on the page yet, navigate normally.
    router.push(href);
  };

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

