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
    <section className="py-[80px]  bg-[#1A365E]">
      <div className="mx-auto max-w-7xl px-5">
         <div className="mx-auto flex items-end justify-between gap-[30px] mb-[30px]">
          <div className="max-w-[796px] w-full">
           <h2 className="heading text-[42px] leading-[120%] font-bold tracking-[-0.04em] text-white">
              Information That  <span className="text-[#FFBF0F]">Can Help</span>
            </h2>

            <p className="mt-[7px] font-normal text-[18px] leading-[140%] tracking-[-0.03em] text-white">
             Our resources cover common questions about case eligibility, the legal process, and what to expect at each stage.
            </p>
          </div>

          <div className="shrink-0 ml-auto">

            <Link
              href="/resource"
              className="inline-flex items-center gap-2 rounded-full font-medium text-[16px] leading-[100%] tracking-[0%] bg-white px-[18px] py-[15px] text-[#122D56] hover:text-white hover:bg-[#152E51] transition-all"
            >
              View All
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
          <div>
 

          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderPosts.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="group border border-[#F0F0F0] p-[24px] rounded-[20px] transition-all bg-white hover:bg-[#F6F6F6] hover:border-[#D4AD4A] "
            >
              <div className="">
                <span className="heading font-normal text-[14px] leading-[100%] tracking-[0%] text-[#D4AD4A]">
                  {post.category}
                </span>
                <h3 className="mt-2 lg:min-h-[52px] font-bold text-[20px] leading-[26px] tracking-[-0.04em] align-middle text-[#132F55] group-hover:text-navy-700">
                  {post.title}
                </h3>
                <p className="mt-2 font-normal text-[16px] leading-[140%] tracking-[-0.03em] line-clamp-2 overflow-hidden text-[#546885]">
                  {post.description}
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
                  Learn More
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
