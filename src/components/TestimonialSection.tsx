"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    rating: 5,
    description:
      "I had no idea where to start with my situation, but their guidance was clear, patient, and incredibly professional. They truly made a stressful process feel manageable.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Ashwin Santiago",
    role: "Worker",
  },
  {
    rating: 5,
    description:
      "I had no idea where to start with my situation, but their guidance was clear, patient, and incredibly professional. They truly made a stressful process feel manageable.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Ashwin Santiago",
    role: "Worker",
  },
  {
    rating: 5,
    description:
      "I had no idea where to start with my situation, but their guidance was clear, patient, and incredibly professional. They truly made a stressful process feel manageable.",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    name: "Ashwin Santiago",
    role: "Worker",
  },
];

export function TestimonialSection() {
  return (
    <section className="relative overflow-hidden bg-[#09162A] py-[40px] md:py-[60px] lg:py-[80px]">
      <div className="relative mx-auto max-w-7xl px-5">
        <button className="testimonial-prev absolute left-[20px] top-1/2 z-10 flex h-[48px] w-[48px] md:h-[58px] md:w-[58px] lg:h-[72px] lg:w-[72px] -translate-y-1/2 items-center justify-center rounded-full border border-[#14253D] text-white/80 transition hover:bg-white/10 md:left-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="19"
            viewBox="0 0 12 19"
            fill="none"
          >
            <path
              d="M4.073 9.16413L11.2007 2.03646L9.16421 0L0.000105858 9.16413L9.16421 18.3281L11.2007 16.2917L4.073 9.16413Z"
              fill="white"
            />
          </svg>
        </button>

        <button className="testimonial-next absolute right-[20px] top-1/2 z-10 flex h-[48px] w-[48px] md:h-[58px] md:w-[58px] lg:h-[72px] lg:w-[72px] -translate-y-1/2 items-center justify-center rounded-full border border-[#14253D] text-white transition hover:bg-[#122036] md:right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="19"
            viewBox="0 0 12 19"
            fill="none"
          >
            <path
              d="M7.12768 9.16413L0 2.03646L2.03648 0L11.2006 9.16413L2.03648 18.3281L0 16.2917L7.12768 9.16413Z"
              fill="white"
            />
          </svg>
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".testimonial-next",
            prevEl: ".testimonial-prev",
          }}
          loop={true}
          slidesPerView={1}
          className="testimonialSlider"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="mx-auto flex max-w-[940px] flex-col items-center text-center">
                <div className="mb-[14px] md:mb-[16px] lg:mb-[20px] flex items-center justify-center gap-[6px]">
                  {Array.from({ length: item.rating }).map((_, starIndex) => (
                    <svg
                      key={starIndex}
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      className="h-[24px] w-[24px]"
                      fill="none"
                    >
                      <path
                        d="M12.1224 19.4048L18.0015 22.9606C19.0782 23.6123 20.3957 22.649 20.1124 21.4306L18.554 14.744L23.7532 10.239C24.7024 9.41729 24.1924 7.85896 22.9457 7.75979L16.1032 7.17896L13.4257 0.860625C12.944 -0.286875 11.3007 -0.286875 10.819 0.860625L8.14152 7.16479L1.29902 7.74563C0.0523565 7.84479 -0.457644 9.40312 0.491523 10.2248L5.69069 14.7298L4.13236 21.4165C3.84902 22.6348 5.16652 23.5981 6.24319 22.9465L12.1224 19.4048Z"
                        fill="#FFBF0F"
                      />
                    </svg>
                  ))}
                </div>

                <p className="font-normal  text-[18px] md:text-[20px] lg:text-[24px] leading-[152%] tracking-[-0.05em] text-center text-white mb-[20px] md:mb-[30px] lg:mb-[40px]">
                  “{item.description}”
                </p>

                <div className="flex flex-col items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[65px] w-[65px] rounded-full object-cover"
                  />

                  <h4 className="mt-[10px] lg:font-medium text-[16px] md:text-[18px] lg:text-[22px] leading-[90%] tracking-[-1.5px] text-center text-white">
                    {item.name}
                  </h4>

                  <span className="mt-[12px] font-medium text-[16px] md:text-[18px] leading-[90%] tracking-[-0.03em] text-center text-[#9DA2AA]">
                    {item.role}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
