import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Attorney advertising disclaimer for Help Law Group. This website provides general information and is not a substitute for legal advice.",
};

export default function DisclaimerPage() {
  return (
    <>
      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Disclaimer
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
