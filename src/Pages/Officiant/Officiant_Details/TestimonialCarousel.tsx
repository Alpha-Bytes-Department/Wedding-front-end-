import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { BsPatchCheck } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import { BsFillStarFill } from "react-icons/bs";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { FaHeart, FaUserAlt } from "react-icons/fa";
import { PiFlowerTulipBold } from "react-icons/pi";
import Avatar from "../../../Component/Shared/Avatar";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
  avatar: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  officiantName: string;
  screenSize: "sm" | "md" | "lg" | "xl";
}

const TestimonialCarousel = ({
  testimonials,
  officiantName,
  screenSize,
}: TestimonialCarouselProps) => {
  const swiperRef = useRef<any>(null);

  const getSwiperConfig = () => {
    switch (screenSize) {
      case "sm":
      case "md":
        return { slidesPerView: 1, spaceBetween: 20 };
      case "lg":
      case "xl":
      default:
        return { slidesPerView: 3, spaceBetween: 30 };
    }
  };

  const onNextClick = () => swiperRef.current?.slideNext();
  const onPrevClick = () => swiperRef.current?.slidePrev();

  return (
    <>
      {/* ===== Reviews Header ===== */}
      <div className="flex items-center justify-center gap-3 md:pt-5 lg:pt-10">
        <PiFlowerTulipBold className="text-primary text-2xl" />
        <h1
          id="client-review"
          className="text-xl md:text-2xl lg:text-4xl text-text font-primary font-medium text-center"
        >
          Reviews
        </h1>
        <PiFlowerTulipBold className="text-primary text-2xl" />
      </div>

      {/* Decorative divider */}
      <div className="flex items-center justify-center gap-3 mt-3 mb-2">
        <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#d4af37]/40" />
        <FaHeart className="text-primary/40 text-xs" />
        <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#d4af37]/40" />
      </div>

      {/* Testimonial Carousel */}
      <div className="relative py-5">
        {testimonials?.length === 0 ? (
          <div className="text-center py-16">
            <FaUserAlt className="text-primary/20 text-5xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-secondary">
              No reviews found for {officiantName || "this officiant"}
            </p>
          </div>
        ) : (
          <>
            <Swiper
              slidesPerView={getSwiperConfig().slidesPerView}
              spaceBetween={getSwiperConfig().spaceBetween}
              loop={testimonials.length > 3}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Navigation, Pagination, Autoplay]}
              className="testimonial-swiper"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="flex flex-col items-start max-w-sm mx-auto">
                    <div className="relative bg-white border border-[#f5f0d9] hover:border-primary/40 rounded-3xl p-6 mb-6 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
                      {/* Decorative quote sparkle */}
                      <div className="absolute -top-3 -right-2 bg-white border border-[#f5f0d9] rounded-full p-2 shadow-sm">
                        <HiOutlineSparkles className="text-primary text-sm" />
                      </div>

                      <p className="text-gray-700 font-secondary text-sm leading-relaxed mb-4 text-center">
                        &ldquo;{testimonial.review}&rdquo;
                      </p>

                      <div className="flex justify-end gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <BsFillStarFill
                            key={i}
                            className={
                              i < testimonial.rating
                                ? "text-primary text-lg"
                                : "text-primary/30 text-lg"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/60 shadow-md">
                        <Avatar
                          src={testimonial.avatar}
                          name={testimonial.name}
                          size="lg"
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-primary font-bold text-text text-lg">
                          {testimonial.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <BsPatchCheck className="text-primary text-xs" />
                          <p className="italic text-sm font-secondary text-primary">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            {testimonials.length > 3 && (
              <>
                <button
                  onClick={onPrevClick}
                  className="absolute left-1/3 lg:left-4 lg:top-1/2 transform -translate-y-1/2 z-10 bg-white border border-[#f5f0d9] hover:border-primary hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-[#b8961e] hover:text-white w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex justify-center items-center hover:scale-105"
                  aria-label="Previous"
                >
                  <AiOutlineDoubleLeft size={20} />
                </button>
                <button
                  onClick={onNextClick}
                  className="absolute right-1/3 lg:right-4 lg:top-1/2 transform -translate-y-1/2 z-10 bg-white border border-[#f5f0d9] hover:border-primary hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-[#b8961e] hover:text-white w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex justify-center items-center hover:scale-105"
                  aria-label="Next"
                >
                  <AiOutlineDoubleRight size={20} />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TestimonialCarousel;
