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
import { useAxios } from "../../../Component/Providers/useAxios";
import { FaUserTie } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";

const OfficiantDetail = () => {
  const { officiantId } = useParams<{ officiantId: string }>();
  console.log("Officiant ID from URL:", officiantId);
  const axios = useAxios();
  const [officiantDetails, setOfficiantDetails] = useState<any>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  // ======================Dummy data for testimonials if API fails=====================
  const dummyTestimonials = [
    {
      id: "64b2f0c1f5a2b12345678911",
      name: "Emily Carter",
      role: "verified",
      review:
        "The officiant was amazing! The ceremony felt personal, heartfelt, and beautifully done.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: "64b2f0c1f5a2b12345678912",
      name: "Michael Johnson",
      role: "verified",
      review:
        "Very professional and kind. Everything was smooth and organized, highly recommend.",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: "64b2f0c1f5a2b12345678913",
      name: "Sophia Martinez",
      role: "verified",
      review:
        "Absolutely wonderful officiant. The ceremony was tailored perfectly to us!",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  // ======================Fetching officiant details====================
  const fetchOfficiantDetails = async () => {
    try {
      const response = await axios.get(`/users/officiants/${officiantId}`);
      console.log("Officiant Details:", response.data.officiant);
      setOfficiantDetails(response.data.officiant);
      // Reset image error when new data is loaded
      setImageError(false);
    } catch (error) {
      console.error("Error fetching officiant details:", error);
      // Fallback to dummy data if API call fails
    }
  };

  // ======================Fetching testimonial details====================
  const fetchTestimonial = async () => {
    try {
      const response = await axios.get(`/reviews/public/${officiantId}`);
      console.log("Testimonial Details:", response.data.reviews);
      const transferItems = response.data.reviews.map((review: any) => ({
        id: review._id,
        name: review.userName,
        role: "verified",
        review: review.ratingDescription,
        rating: review.rating,
        avatar: review.userImageUrl,
      }));
      setTestimonials(transferItems);
    } catch (error) {
      console.error("Error fetching testimonial details:", error);
      // Fallback to dummy data if API call fails
      setTestimonials(dummyTestimonials);
    }
  };
  const navigate = useNavigate();
  // ======================Handle first render====================
  useEffect(() => {
    fetchOfficiantDetails();
    fetchTestimonial();
  }, [officiantId]);

  const [screenSize, setScreenSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
  // ======================Handle screen resize====================
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

  useEffect(() => {
    if (location.hash === "#client-review") {
      // Small delay to ensure the component is rendered
      setTimeout(() => {
        const element = document.getElementById("client-review");
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300); // Slightly longer delay for components to fully render
    } else {
      // Scroll to top if no hash
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [location]);

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
  const swiperRef = useRef<any>(null);

  interface BookingPackage {
    id: string;
    name: string;
    price: number;
    features: string[];
  }

  const onNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };
  const onPrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const shouldShowImage = () => {
    return officiantDetails?.profilePicture && !imageError;
  };

  const getProfileImageUrl = () => {
    if (!officiantDetails?.profilePicture) return "";
    // Check if it's already a complete URL
    if (officiantDetails.profilePicture.startsWith("http")) {
      return officiantDetails.profilePicture;
    }
    // For images in the public folder, construct the URL relative to the app root
    return `/${officiantDetails.profilePicture}`;
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
                src={getProfileImageUrl()}
                alt={officiantDetails.name}
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
                    const diffYears = officiantDetails.experience;

                    const years =
                      Math.floor(diffYears) < 1 ? 1 : Math.floor(diffYears);
                    return `${years} year${years > 1 ? "s" : ""} in business`;
                  })()}
                </p>
              </div>
              <div className="text-text text-base md:text-lg lg:text-xl font-secondary gap-3 font-normal flex">
                <HiOutlineChatBubbleLeftRight size={27} />{" "}
                <p>Speaks : {officiantDetails.languages.join(", ")}</p>
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
        <div className=" flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5  py-5 lg:py-10">
            {officiantDetails.bookingPackage.sort((a:any, b:any) => a.price - b.price).map((pkg: BookingPackage) => (
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

      <div className="relative py-5">
        {testimonials?.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg font-secondary">
              No reviews found for {officiantDetails.name || "this officiant"}
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
                // store swiper instance for programmatic control
                // @ts-ignore
                swiperRef.current = swiper;
              }}
              modules={[Navigation, Pagination, Autoplay]}
              className="testimonial-swiper "
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
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaUserAlt size={26} className="text-gray-400" />
                          </div>
                        )}
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

            {/* Navigation Buttons - only show if more than 3 testimonials */}
            {testimonials.length > 3 && (
              <>
                <button
                  ref={prevBtnRef}
                  onClick={onPrevClick}
                  className="absolute left-1/3 lg:left-4 lg:top-1/2 transform -translate-y-1/2 z-10 bg-[#F6EED5] hover:bg-yellow-600 w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex justify-center items-center hover:scale-105"
                  aria-label="Previous"
                >
                  <AiOutlineDoubleLeft size={20} className="text-black" />
                </button>
                <button
                  ref={nextBtnRef}
                  onClick={onNextClick}
                  className="absolute right-1/3 lg:right-4 lg:top-1/2 transform -translate-y-1/2 z-10 bg-[#F6EED5] hover:bg-yellow-600 w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex justify-center items-center hover:scale-105"
                  aria-label="Next"
                >
                  <AiOutlineDoubleRight size={20} className="text-black" />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OfficiantDetail;
