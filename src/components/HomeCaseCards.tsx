"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const caseCategories = [
  {
    title: "Clergy and Religious Institution Abuse",
    description:
      "Sexual abuse committed by clergy members or within religious organizations, including cases from years ago.",
    image: "/images/cases/clergy-religious-institution-abuse.jpg",
    href: "/cases",
  },
  {
    title: "Medical Abuse",
    description:
      "Sexual abuse or misconduct by a doctor, nurse, or other healthcare provider.",
    image: "/images/cases/medical-abuse.jpg",
    href: "/cases",
  },
  {
    title: "Online Platform Harm",
    description:
      "Sexual exploitation or serious harm facilitated by platforms like Snapchat, Roblox, or Instagram.",
    image: "/images/cases/online-platform-harm.jpg",
    href: "/cases",
  },
  {
    title: "Unsafe Products",
    description:
      "Injuries caused by a product that failed or was never safe to begin with.",
    image: "/images/cases/unsafe-products.jpg",
    href: "/cases",
  },
  {
    title: "NYC Clergy Abuse Lawsuits",
    description:
      "Active settlement efforts are underway across NYC dioceses. If you were abused by clergy in New York, your options may still be open.",
    image: "/images/cases/nyc-clergy-abuse.jpg",
    href: "/cases",
  },
  {
    title: "NYC Juvenile Detention Abuse",
    description:
      "Survivors of abuse at Spofford, Horizon, Crossroads, or Rikers youth housing may have legal options under recent legislation.",
    image: "/images/cases/nyc-juvenile-detention-abuse.jpg",
    href: "/cases",
  },
];

export function HomeCaseCards() {
  return (
    <section className="py-[80px]  bg-white">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto flex items-end justify-between gap-[30px] mb-[30px]">
          <div className="max-w-[950px] w-full">
            <h2 className="heading text-[42px] leading-[120%] font-bold tracking-[-0.04em] text-[#17335D]">
              Cases We Are{" "}
              <span className="text-[#FFBF0F]">Currently Reviewing</span>
            </h2>

            <p className="mt-[15px] text-[18px] leading-[140%] font-normal text-[#5C6F8B] max-w-[690px]">
              Attorneys in our network are actively reviewing cases in these
              areas. If you or someone you know experienced this kind of harm,
              you may have legal options.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 rounded-full font-medium text-[16px] leading-[100%] tracking-[0%] bg-[#122D56] px-[18px] py-[15px] text-white hover:bg-[#1A365E] transition-all"
            >
              See All Cases
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="transition-transform group-hover:translate-x-1"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.5 5.625C7.15482 5.625 6.875 5.34518 6.875 5C6.875 4.65482 7.15482 4.375 7.5 4.375H15C15.3452 4.375 15.625 4.65482 15.625 5V12.5C15.625 12.8452 15.3452 13.125 15 13.125C14.6548 13.125 14.375 12.8452 14.375 12.5V6.50888L5.44194 15.4419C5.19786 15.686 4.80214 15.686 4.55806 15.4419C4.31398 15.1979 4.31398 14.8021 4.55806 14.5581L13.4911 5.625H7.5Z"
                  fill="currentColor"
                />
              </svg>
              {/* <ArrowRight className="h-4 w-4" /> */}
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseCategories.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative overflow-hidden bg-white border border-[#F0F0F0] p-[18px] rounded-[20px] shadow-[0px_8px_80px_-12px_rgba(0,0,0,0.08)] transition-all"
            >
              <div className="relative h-44 overflow-hidden rounded-[14px]">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="pt-[10px]">
                <h3 className="font-bold text-[20px] leading-[1.2] tracking-[-0.04em] align-middle text-[#132F55] mb-2">
                  {c.title}
                </h3>
                <p className="font-normal text-[16px] leading-[140%] tracking-[-0.03em] line-clamp-2 overflow-hidden text-[#546885]">
                  {c.description}
                </p>
                <div className="mt-[20px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="350"
                    height="1"
                    viewBox="0 0 350 1"
                    fill="none"
                  >
                    <line
                      opacity="0.2"
                      y1="0.5"
                      x2="350"
                      y2="0.5"
                      stroke="url(#paint0_linear_391_46)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_391_46"
                        x1="0"
                        y1="1.5"
                        x2="350"
                        y2="1.5"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="white" />
                        <stop offset="0.504808" stop-color="#1C385F" />
                        <stop offset="1" stop-color="white" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="mt-[15px] inline-flex items-center gap-1 font-medium text-[16px] leading-[100%] tracking-[0%] text-[#D4AD4A] group-hover:text-[#132F55] transition-colors">
                  Check Eligibility
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.5 5.625C7.15482 5.625 6.875 5.34518 6.875 5C6.875 4.65482 7.15482 4.375 7.5 4.375H15C15.3452 4.375 15.625 4.65482 15.625 5V12.5C15.625 12.8452 15.3452 13.125 15 13.125C14.6548 13.125 14.375 12.8452 14.375 12.5V6.50888L5.44194 15.4419C5.19786 15.686 4.80214 15.686 4.55806 15.4419C4.31398 15.1979 4.31398 14.8021 4.55806 14.5581L13.4911 5.625H7.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  {/* <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /> */}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
