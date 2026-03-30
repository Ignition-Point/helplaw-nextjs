"use client";

import Link from "next/link";

const placeholderPosts = [
  {
    category: "Legal Guidance",
    title: "What Is Sexual Abuse?",
    description:
      "Understanding what sexual abuse includes is the first step toward knowing your rights.",
    href: "/resources",
  },
  {
    category: "Legal Guidance",
    title:
      "Can a Platform Like Snapchat or Roblox Be Held Legally Responsible?",
    description:
      "Platforms that fail to protect children from exploitation and predatory behavior face civil lawsuits. Here is what legal responsibility for platform harm looks like.",
    href: "/resources",
  },
  {
    category: "Legal Guidance",
    title: "What Is Grooming? How Abusers Build Trust Before They Cause Harm",
    description:
      "Grooming is deliberate and calculated. Understanding how it works is the first step toward recognizing it.",
    href: "/resources",
  },
];

export function HomeBlogCards() {
  return (
    <section className="py-20 sm:py-28 bg-slate-warm-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
              Information That Can Help
            </h2>
            <p className="mt-3 text-base text-slate-warm-500">
              Our resources cover common questions about case eligibility, the
              legal process, and what to expect at each stage.
            </p>
          </div>
          <Link
            href="/resources"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-navy-700 hover:text-gold-600 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderPosts.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="group rounded-2xl border border-navy-100 bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  {post.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-navy-900 leading-snug group-hover:text-navy-700">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-slate-warm-500 line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-navy-700 group-hover:text-gold-600 transition-colors">
                  Learn More
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/resources"
            className="text-sm font-semibold text-navy-700"
          >
            View All Resources
          </Link>
        </div>
      </div>
    </section>
  );
}
