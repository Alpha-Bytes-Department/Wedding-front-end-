import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { BsPatchCheck } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";
import { HiOutlineSpeakerphone, HiOutlineUsers } from "react-icons/hi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { PiCheckLight } from "react-icons/pi";
import { BsFillStarFill } from "react-icons/bs";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/AxiosProvider";
import { FaUserTie } from "react-icons/fa6";

const OfficiantDetail = () => {
  const { officiantId } = useParams<{ officiantId: string }>();
  console.log("Officiant ID from URL:", officiantId);
  const axios = useAxios();
  const [officiantDetails, setOfficiantDetails] = useState<any>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  const fetchOfficiantDetails = async () => {
    try {
      const response = await axios.get(`/users/officiants/${officiantId}`);
      console.log("Officiant Details:", response.data.officiant);
      setOfficiantDetails(response.data.officiant);
      // Reset image error when new data is loaded
      setImageError(false);
    } catch (error) {
      console.error("Error fetching officiant details:", error);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchOfficiantDetails();
  }, [officiantId]);

  const [screenSize, setScreenSize] = useState<"sm" | "md" | "lg" | "xl">("lg");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("sm");
      else if (width < 768) setScreenSize("md");
      else if (width < 1024) setScreenSize("lg");
      else setScreenSize("xl");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);


interface BookingPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
}

  const testimonials = [
    {
      id: 1,
      name: "Ariana H.",
      role: "Verified",
      review:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Michael R.",
      role: "Verified",
      review:
        "John made our wedding ceremony absolutely perfect! His professionalism and attention to detail were outstanding. He took the time to understand our vision and delivered exactly what we wanted.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Sarah M.",
      role: "Verified",
      review:
        "Amazing experience from start to finish! The ceremony was beautiful and everything went smoothly. Highly recommend John for anyone looking for a professional officiant.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "David L.",
      role: "Verified",
      review:
        "Professional, friendly, and made our special day even more memorable. The personalized vows assistance was incredibly helpful. Thank you for making our wedding perfect!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Emma K.",
      role: "Verified",
      review:
        "We couldn't have asked for a better officiant. John was so accommodating and helped make our ceremony exactly what we dreamed of. Absolutely wonderful service!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 6,
      name: "James T.",
      role: "Verified",
      review:
        "Exceptional service and truly professional. The ceremony coordination was flawless and John made sure everything went according to plan. Highly recommended!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const handleImageError = () => {
    setImageError(true);
  };

  const shouldShowImage = () => {
    return officiantDetails?.profilePicture && !imageError;
  };

  // Don't render anything until officiantDetails is loaded
  if (!officiantDetails) {
    return (
      <div className="pt-24 md:pt-30 px-5 md:px-10 lg:px-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text">Loading officiant details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-30 px-5 md:px-10 lg:px-20">
      <h1 className="md:pt-5 lg:pt-10 text-xl md:text-2xl lg:text-4xl text-text font-primary font-medium">
        About this Officiant
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 items-start py-10">
        <div className="max-w-md text-center flex flex-col items-center gap-4 p-10 border-2 border-primary rounded-2xl shadow-lg">
          <div className="p-2 rounded-full border-2 border-primary overflow-hidden size-38 flex items-center justify-center">
            {shouldShowImage() ? (
              <img
                src={officiantDetails.profilePicture}
                alt={officiantDetails.name || "Officiant"}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <FaUserTie size={60} className="text-gray-400" />
            )}
          </div>
          <h1 className="text-xl font-bold font-primary lg:text-2xl">
            {officiantDetails.name || "Officiant"}
          </h1>
          <p className="text-text text-base tracking-widest font-bold font-secondary">
            OFFICIANT
          </p>
          <div
            onClick={() => navigate("/dashboard/ceremony")}
            className="cursor-pointer text-white bg-primary text-lg w-full rounded-xl py-1.5 font-secondary"
          >
            <p>Book Now</p>
          </div>
        </div>
        <div className="col-span-2 flex flex-col lg:items-start items-center lg:gap-10 h-full">
          <p className="text-lg md:text-xl lg:text-2xl lg:pt-0 pt-10 lg:px-4 xl:px-0 text-text font-secondary text-center lg:text-start">
            {officiantDetails.bio ||
              `Erie Wedding Officiants is a team of wedding officiants
                        headquartered in Erie, PA, that also serves the Pittsburgh,
                        Cleveland, and Buffalo areas. We are dedicated to making your
                        special day memorable. Whether your wedding ceremony or renewal is
                        large or small, inside or out, next week or next year, our team of
                        experts can provide the direction you need to create the wedding
                        ceremony of your dreams.`}
          </p>

          <div className="lg:px-4 xl:px-0">
            <div className="flex flex-col gap-5 lg:pt-0 pt-10 lg:gap-16 md:flex-row mx-auto lg:mx-0">
              <div className="text-text text-base md:text-lg lg:text-xl font-secondary gap-3 font-normal flex">
                <p>
                  {(() => {
                    const createdDate = new Date(officiantDetails.createdAt);
                    const today = new Date();
                    const diffYears =
                      (today.getTime() - createdDate.getTime()) /
                      (1000 * 60 * 60 * 24 * 365.25);
                    const years =
                      Math.floor(diffYears) < 1 ? 1 : Math.floor(diffYears);
                    return `${years} year${years > 1 ? "s" : ""} in business`;
                  })()}
                </p>
              </div>
              <div className="text-text text-base md:text-lg lg:text-xl font-secondary gap-3 font-normal flex">
                <HiOutlineChatBubbleLeftRight size={27} />{" "}
                <p>Speaks {officiantDetails.languages.join(", ")}</p>
              </div>
            </div>
            <div className="text-text text-base md:text-lg lg:text-xl font-secondary gap-3 font-normal flex pt-5">
              <HiOutlineUsers size={32} /> <p>5 Team Members</p>
            </div>
          </div>
        </div>
      </div>
      <h1 className="md:pt-5 lg:pt-10 text-xl md:text-2xl lg:text-4xl text-text font-primary font-medium">
        Prices & Packages
      </h1>
      <div className="flex justify-center">
        <div className="flex flex-col lg:flex-row gap-5 py-5 lg:py-10">
        

        {officiantDetails.bookingPackage.map((pkg: BookingPackage) => (
            <div
                key={pkg.id}
                className="border-2 border-primary rounded-2xl max-w-sm w-full p-5"
            >
                <h2 className="lg:text-2xl text-base md:text-lg font-primary font-medium">
                    {pkg.name}
                </h2>
                <p className="text-black text-xl font-bold py-2.5">
                    ${pkg.price}
                    <span className="text-xs text-gray-500">Starting price</span>
                </p>
                <hr className="border border-primary" />
                <ul className="list-disc list-inside py-2">
                    <li className="flex gap-2 items-center pb-2">
                        <CiClock2 size={30} className="text-primary" />{" "}
                        <span className="text-text font-secondary text:sm md:text-lg">
                            Contact for event or ceremony
                        </span>
                    </li>
                    {pkg.features.map((feat: string, idx: number) => (
                        <li key={idx} className="flex gap-2 items-center pb-2">
                            <PiCheckLight size={30} className="text-primary" />{" "}
                            <span className="text-text font-secondary text:sm md:text-lg">
                                {feat}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
        </div>
      </div>
      <div className="flex gap-2 items-center pb-6">
        <HiOutlineSpeakerphone size={30} className="text-primary" />{" "}
        <span className="text-text font-secondary text:sm md:text-lg">
          Starting prices may not include all fees a vendor may charge.
        </span>
      </div>
      <div className="flex gap-2 items-center pb-2">
        <BsPatchCheck size={30} className="text-primary" />{" "}
        <span className="text-text font-secondary text:sm md:text-lg">
          Couples usually spend ${officiantDetails.bookingMoney} on average for
          officiant services.
        </span>
      </div>
      <div className="text-center py-8 my-5 border-2 shadow-lg border-primary rounded-2xl">
        <h1 className="text-xl md:text-2xl lg:text-4xl text-text font-primary font-bold">
          Are you interested?
        </h1>
        <p className="text-sm lg:text-base pb-8 pt-3 tracking-widest text-text font-medium">
          Reach out and share your wedding details.
        </p>
        <div
          onClick={() => navigate("/dashboard/discussions")}
          className="text-base cursor-pointer py-3 rounded-2xl text-white bg-primary font-secondary font-bold w-10/12 lg:w-1/3 mx-auto"
        >
          Book Now
        </div>
      </div>
      <h1 className="md:pt-5 lg:pt-10 text-xl md:text-2xl text-center lg:text-4xl text-text font-primary font-medium">
        Reviews
      </h1>

      {/* testimonial carousel */}
      <div className="relative py-10">
        <Swiper
          slidesPerView={getSwiperConfig().slidesPerView}
          spaceBetween={getSwiperConfig().spaceBetween}
          loop={testimonials.length > 3}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: prevBtnRef.current,
            nextEl: nextBtnRef.current,
          }}
          onInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevBtnRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextBtnRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          modules={[Navigation, Pagination, Autoplay]}
          className="testimonial-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="flex flex-col items-start max-w-sm mx-auto">
                <div className="relative bg-white border-2 border-primary rounded-2xl p-6 mb-6 shadow-lg">
                  <p className="text-gray-700 font-secondary text-sm leading-relaxed mb-4 text-center">
                    "{testimonial.review}"
                  </p>

                  <div className="flex justify-end gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <BsFillStarFill
                        key={i}
                        className={
                          i < testimonial.rating
                            ? "text-yellow-500 text-lg"
                            : "text-yellow-500 text-lg opacity-50"
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-md mb-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-primary font-bold text-gray-800 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="italic text-sm font-primary">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          ref={prevBtnRef}
          className="absolute left-1/3 lg:left-4 lg:top-1/2 transform -translate-y-1/2 z-10 bg-[#F6EED5] hover:bg-yellow-600 w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex justify-center items-center hover:scale-105"
          aria-label="Previous"
        >
          <AiOutlineDoubleLeft size={20} className="text-black" />
        </button>
        <button
          ref={nextBtnRef}
          className="absolute right-1/3 lg:right-4 lg:top-1/2 transform -translate-y-1/2 z-10 bg-[#F6EED5] hover:bg-yellow-600 w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex justify-center items-center hover:scale-105"
          aria-label="Next"
        >
          <AiOutlineDoubleRight size={20} className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default OfficiantDetail;
