import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { HomeCaseCards } from "@/components/HomeCaseCards";
import { HomeBlogCards } from "@/components/HomeBlogCards";
import { HomeLeadForm } from "@/components/HomeLeadForm";

export const revalidate = 60;

export default async function HomePage() {

  return (
    <>
      {/* ─── Scrolling Trust Bar ─── */}
      <div className="bg-navy-900 py-3 overflow-hidden">
        <div className="animate-scroll-x flex whitespace-nowrap gap-12">
          {[...Array(4)].flatMap((_, setIdx) =>
            ["Free Case Evaluation", "No Fee Unless You Win", "Confidential", "Attorneys Available Nationwide", "No Obligation"].map((item, i) => (
              <span key={`${setIdx}-${i}`} className="inline-flex items-center gap-2 text-sm text-white/90 font-medium shrink-0">
                <Check className="h-4 w-4 text-gold-400 shrink-0" />
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ─── Hero: "You Deserve Answers" ─── */}
      <section className="relative overflow-hidden">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/alt/section-1-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay to keep text legible */}
        <div className="absolute inset-0 bg-white/60" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-28 sm:py-36 lg:py-44 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold text-navy-900 tracking-tight leading-[1.1]">
            You Deserve Answers.
            <br />
            We Can Help You Find Them.
          </h1>

          <p className="mt-7 text-lg sm:text-xl text-slate-warm-500 leading-relaxed max-w-2xl mx-auto font-normal">
            If you were harmed by a person, company, or institution, you have legal options. We can help you understand what they are.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cases"
              className="inline-flex items-center justify-center rounded-full border-2 border-navy-800 bg-white px-8 py-3.5 text-base font-semibold text-navy-900 transition-all hover:bg-navy-800 hover:text-white"
            >
              Get a Free Case Evaluation
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border-2 border-navy-200 px-8 py-3.5 text-base font-semibold text-navy-700 transition-all hover:border-navy-400 hover:bg-navy-50"
            >
              See How It Works
            </Link>
          </div>

          {/* Attorney avatar row */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <div className="flex -space-x-3">
              {["sarah-mitchell", "michael-chen", "jennifer-rodriguez", "david-park"].map((name) => (
                <Image
                  key={name}
                  src={`/assets/attorneys/${name}.jpg`}
                  alt="Attorney"
                  width={44}
                  height={44}
                  className="rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-slate-warm-500">
              Attorneys in our network handle cases across the country.
            </p>
          </div>
        </div>
      </section>

      {/* ─── "When You Are Ready. We Are Here." ─── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundImage: "url(/assets/alt/section-2-image.png)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              When You Are Ready.
              <br />
              <span className="text-gold-400">We Are Here.</span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-navy-200 leading-relaxed">
              Something happened that should not have — abuse, a serious injury, harm caused by a company or platform. You have the right to know what can be done about it.
            </p>
            <p className="mt-4 text-base sm:text-lg text-navy-200 leading-relaxed">
              We connect you with attorneys who take on the companies, institutions, and individuals responsible for that harm.
            </p>
            <p className="mt-4 text-base sm:text-lg text-navy-200 leading-relaxed">
              The first conversation is free. You decide if and when to move forward.
            </p>

            <Link
              href="/cases"
              className="mt-8 inline-flex items-center justify-center rounded-full border-2 border-white/80 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white hover:text-navy-900"
            >
              Tell Us What Happened
            </Link>

            <p className="mt-4 text-sm text-navy-400">
              Free review &bull; Private &amp; confidential &bull; No cost unless you win
            </p>
          </div>
        </div>
      </section>

      {/* ─── "Guidance You Can Trust" ─── */}
      <section className="bg-white overflow-hidden">
        <div className="grid lg:grid-cols-[55%_45%]">
          {/* Image — left side with fade */}
          <div className="relative min-h-[400px] lg:min-h-[600px]">
            <Image
              src="/assets/alt/section-3-image.png"
              alt="Help Law Group Team"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            {/* Fade-out gradient on right edge */}
            <div className="hidden lg:block absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white to-transparent" />
            {/* Fade-out gradient on bottom for mobile */}
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
          </div>

          {/* Copy — right side */}
          <div className="flex items-center px-8 sm:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 lg:py-24">
            <div className="max-w-lg">
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy-900 tracking-tight leading-[1.15]">
                Guidance{" "}
                <span className="text-gold-500">You Can Trust</span>
              </h2>
              <p className="mt-2 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy-900 tracking-tight leading-[1.15]">
                No Guesswork.
              </p>
              <p className="mt-2 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy-900 tracking-tight leading-[1.15]">
                No Pressure.
              </p>

              <p className="mt-8 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
                We review your situation and connect you with an attorney whose practice covers your type of case.
              </p>
              <p className="mt-4 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
                The evaluation is free. Attorneys in our network take cases on a contingency basis, meaning their fee comes from what your case recovers.
              </p>
              <p className="mt-4 text-base sm:text-lg text-slate-warm-600 leading-relaxed">
                You decide if and when to move forward. What you share is confidential and is not shared without your consent.
              </p>

              <Link
                href="/cases"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-navy-800 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-navy-700 shadow-sm"
              >
                Start a Confidential Review
              </Link>

              <p className="mt-3 text-sm text-slate-warm-400">
                &bull; Free review &bull; Private &amp; confidential &bull; No obligation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundImage: "url(/assets/alt/section-4-image.png)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-slate-warm-50/95" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
              How It Works
            </h2>
            <p className="mt-3 text-base text-slate-warm-500">
              You don&apos;t need to have everything figured out before you reach out.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                step: "1",
                title: "Tell Us What Happened",
                description: "Most people who reach out are not sure where to start. That is okay. You do not need to have it all figured out.",
              },
              {
                step: "2",
                title: "An Attorney Reviews Your Case",
                description: "An experienced attorney in our network listens and explains whether legal options or compensation could be available.",
              },
              {
                step: "3",
                title: "You Understand Your Options",
                description: "You will leave the conversation with a clear picture of what is possible and what the next steps would involve.",
              },
              {
                step: "4",
                title: "You Decide",
                description: "There is no pressure to move forward. When you are ready, we connect you with the right attorney.",
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="flex gap-4 p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-navy-100 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
                  {step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
                  <p className="mt-1.5 text-sm text-slate-warm-600 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/cases"
              className="inline-flex items-center justify-center rounded-full bg-navy-800 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-navy-700"
            >
              Speak With Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Cases We Are Currently Reviewing ─── */}
      <HomeCaseCards />

      {/* ─── Information That Can Help (Blog) ─── */}
      <HomeBlogCards />

      {/* ─── What Help Law Group Can Do For You + Lead Form ─── */}
      <section className="py-20 sm:py-28 bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Left: value props */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-[1.15]">
                What <span className="text-gold-400">Help Law Group</span>
                <br />
                Can Do for You
              </h2>

              <div className="mt-10 space-y-6">
                {[
                  {
                    title: "We Match You With the Right Attorney",
                    description: "We review your situation and find an attorney with direct experience in your type of case.",
                  },
                  {
                    title: "We Walk You Through Every Step",
                    description: "Your attorney explains what is happening and what comes next throughout the entire process.",
                  },
                  {
                    title: "We Are in Your Corner",
                    description: "From your first call through resolution, you have people who understand what you are going through.",
                  },
                  {
                    title: "We Fight for Accountability",
                    description: "We take on corporations, institutions, and individuals who caused serious harm, including those who believe they are above consequences.",
                  },
                  {
                    title: "We Work on Contingency",
                    description: "There are no upfront costs. Our fee comes from what your case recovers.",
                  },
                ].map(({ title, description }) => (
                  <div key={title} className="border-b border-navy-800 pb-5">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-1.5 text-sm text-navy-300 leading-relaxed">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Lead form */}
            <div>
              <div className="rounded-2xl bg-white p-8 sm:p-10 shadow-2xl">
                <h3 className="text-2xl font-bold text-navy-900 mb-6">
                  Request a Private Case Review
                </h3>
                <HomeLeadForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
