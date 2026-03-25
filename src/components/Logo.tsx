import Link from "next/link";
import Image from "next/image";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <Link href="/" className="flex items-center" aria-label="Help Law Group - Home">
      <Image
        src="/assets/logo-dark.png"
        alt="Help Law Group"
        width={120}
        height={48}
        className={variant === "light" ? "brightness-0 invert" : ""}
        priority
      />
    </Link>
  );
}
