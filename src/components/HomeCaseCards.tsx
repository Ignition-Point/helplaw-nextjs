"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const caseCategories = [
  {
    title: "Clergy and Religious Institution Abuse",
    description:
      "Sexual abuse committed by clergy members or within religious organizations, including cases from years ago.",
    image: "https://image2url.com/r2/default/images/1774552039582-b0bffe85-1f5b-4ac2-b69f-ca27d547b0d1.blob",
    href: "/cases",
  },
  {
    title: "Medical Abuse",
    description:
      "Sexual abuse or misconduct by a doctor, nurse, or other healthcare provider.",
    image: "https://image2url.com/r2/default/images/1774552561697-7d36c54a-8062-4f0c-b63a-8132e487e7b5.blob",
    href: "/cases",
  },
  {
    title: "Online Platform Harm",
    description:
      "Sexual exploitation or serious harm facilitated by platforms like Snapchat, Roblox, or Instagram.",
    image: "https://image2url.com/r2/default/images/1774974529709-8e6ba685-6dff-4161-af7d-0f17aa87ab3c.blob",
    href: "/cases",
  },
  {
    title: "Unsafe Products",
    description:
      "Injuries caused by a product that failed or was never safe to begin with.",
    image: "https://image2url.com/r2/default/images/1774982512600-cab39edf-fc3c-45b2-865d-d15b6a47df91.blob",
    href: "/cases",
  },
  {
    title: "NYC Clergy Abuse Lawsuits",
    description:
      "Active settlement efforts are underway across NYC dioceses. If you were abused by clergy in New York, your options may still be open.",
    image: "https://image2url.com/r2/default/images/1774970847331-c7150745-13b2-456f-bb18-6e6322d30896.blob",
    href: "/cases",
  },
  {
    title: "NYC Juvenile Detention Abuse",
    description:
      "Survivors of abuse at Spofford, Horizon, Crossroads, or Rikers youth housing may have legal options under recent legislation.",
    image: "https://image2url.com/r2/default/images/1771448909507-e07abe58-e17e-40c9-9dd5-3de9db2ac054.jpg",
    href: "/cases",
  },
];

export function HomeCaseCards() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
            Cases We Are Currently Reviewing
          </h2>
          <p className="mt-4 text-base text-slate-warm-500 leading-relaxed">
            Attorneys in our network are actively reviewing cases in these areas.
            If you or someone you know experienced this kind of harm, you may
            have legal options.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseCategories.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative rounded-2xl border border-navy-100 bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:border-navy-200 hover:-translate-y-0.5"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-navy-900 leading-snug group-hover:text-navy-700">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-slate-warm-500 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 group-hover:text-gold-600 transition-colors">
                  Check Eligibility
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 rounded-full border-2 border-navy-200 px-7 py-3 text-sm font-semibold text-navy-700 hover:border-navy-400 hover:bg-navy-50 transition-all"
          >
            See All Cases
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
