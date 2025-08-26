import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useRef } from "react";
import type { SwiperRef } from "swiper/react";

import "swiper/swiper-bundle.css";
import { Link } from "react-router-dom";

const Slider = () => {
  const swiperRef = useRef<SwiperRef>(null);

  const texts = [
    {
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus placerat velit. Donec in porttitor elit. Suspendisse accumsan iaculis tincidunt. ",
      title: "Effortless Ceremony Planning  💍",
    },
    {
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus placerat velit. Donec in porttitor elit. Suspendisse accumsan iaculis tincidunt. ",
      title: "Seamless Collaboration 📜",
    },
    {
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dapibus placerat velit. Donec in porttitor elit. Suspendisse accumsan iaculis tincidunt. ",
      title: "Organized & Accessible  🔔",
    },
  ];


  return (
    <div className="min-h-screen bg-white py-16">
      <h1 className="text-2xl sm:text-3xl font-bold md:text-[55px] px-5  font-primary text-center mb-16">
        What We Serve To Plan Your <br />
        <span className="text-primary">Best Wedding</span>
      </h1>

      <div className="flex items-center justify-center" id="slidercontainer">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 ">
          <Swiper
            
            ref={swiperRef}
            modules={[Autoplay, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            className="wedding-slider"
          >
            {texts.map((text, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col lg:flex-row items-center justify-between min-h-[600px] gap-12">
                  {/* Left side - Content */}
                  <div className="flex-1 max-w-lg">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative">
                      {/* Service icon */}
                      <div className="mb-6">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-700"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        </div>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 leading-tight">
                        {text.title}
                      </h2>

                      <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8">
                        {text.description}
                      </p>

                      <Link to="/dashboard" className="bg-primary group hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                        Book for consult
                        <svg
                          className="w-4 h-4 group-hover:translate-x-4 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Right side - Image collage */}
                  <div className="flex-1 relative">
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      {/* Top left - Wedding rings */}
                      <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                        <img
                          src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&h=300&fit=crop&crop=center"
                          alt="Wedding rings"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Top right - Happy couple */}
                      <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8">
                        <img
                          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop&crop=faces"
                          alt="Happy wedding couple"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Bottom left - Wedding party */}
                      <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300 -mt-4">
                        <img
                          src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop&crop=center"
                          alt="Wedding party celebration"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Bottom right - Table setting */}
                      <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300 mt-4">
                        <img
                          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop&crop=center"
                          alt="Elegant table setting"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Slider;
