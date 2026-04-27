import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "How Our Free Case Review Works | Help Law Group",
  description:
    "Four simple steps: tell us what happened, get a free attorney review, understand your options, decide when you are ready. No cost unless you win.",
  alternates: { canonical: "https://helplaw.com/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "How It Works" },
        ]}
      />

      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            How It Works
          </h1>
        </div>
      </section>
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose-helplaw">
          <p>Content to be ported from Lovable.</p>
        </div>
      </section>
    </>
  );
}
