import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { BsFillStarFill } from "react-icons/bs";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { useAxios } from "../../Component/Providers/useAxios";
import { FaRegUserCircle } from "react-icons/fa";

const ClientReview = () => {
  const [screenSize, setScreenSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
const axios = useAxios();
type PublicReview = {
  _id?: string;
  userName?: string;
  userImageUrl?: string | null;
  rating?: number;
  ratingDescription?: string;
};

const [publicReviews, setPublicReviews] = useState<PublicReview[]>([]);


const handleResize = () => {
  const width = window.innerWidth;
  if (width < 640) setScreenSize("sm");
  else if (width < 768) setScreenSize("md");
  else if (width < 1024) setScreenSize("lg");
  else setScreenSize("xl");
};
  useEffect(() => {
   const getPublicReviews = async () => {
  try {
    const response = await axios.get("/reviews/public");
    // console.log("Public Reviews:", response.data.reviews);

    const visibleReviews: PublicReview[] = response.data.reviews.map((review: any) => ({
      _id: review._id,
      userName: review.userName,
      userImageUrl: review.userImageUrl,
      rating: review.rating,
      ratingDescription: review.ratingDescription,
    }));

    setPublicReviews(visibleReviews);
  } catch (error) {
    console.error("Error fetching public reviews:", error);

    // fallback dummy data (no images)
    const dummyReviews: PublicReview[] = [
      {
        _id: "1",
        userName: "Alice Johnson",
        userImageUrl: null,
        rating: 5,
        ratingDescription: "Absolutely wonderful experience! Highly recommended.",
      },
      {
        _id: "2",
        userName: "Michael Smith",
        userImageUrl: null,
        rating: 4,
        ratingDescription: "Very professional and kind, made everything smooth.",
      },
      {
        _id: "3",
        userName: "Sophia Williams",
        userImageUrl: null,
        rating: 5,
        ratingDescription: "Exceeded expectations — everything was perfect.",
      },
    ];

    setPublicReviews(dummyReviews);
  }
};

    getPublicReviews();
    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [axios]);


  


  const getSwiperConfig = () => {
    switch (screenSize) {
      case "sm":
        return { slidesPerView: 1, spaceBetween: 40, iconSize: 14 };
      case "md":
        return { slidesPerView: 1, spaceBetween: 60, iconSize: 16 };
      case "lg":
        return { slidesPerView: 1, spaceBetween: 80, iconSize: 18 };
      case "xl":
      default:
        return { slidesPerView: 2, spaceBetween: 120, iconSize: 20 };
    }
  };
  // Refs for navigation buttons
  const upBtnRef = useRef<HTMLButtonElement>(null);
  const downBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      id="client-review"
      className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-around items-center px-4 sm:px-6 md:px-8 lg:px-0"
    >
      <div className="bg-gradient-to-b from-[#fcf8ec] to-[#fdedb8] my-4 sm:my-6 md:my-8 lg:my-10 xl:my-20 ml-0 sm:ml-2 md:ml-4 lg:ml-8 xl:ml-20 py-6 sm:py-8 md:py-12 lg:py-16 xl:py-40 flex justify-center">
        <div className="bg-white rounded-sm w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 lg:p-10 xl:p-14 shadow-xl">
          <img
            src="/flower.png"
            alt="Flower"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
          />
          <h1 className=" text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[55px] font-primary font-bold text-start leading-tight">
            Client <span className="text-primary">Review</span> to our service
          </h1>
          <p className="text-sm sm:text-base md:text-lg xl:text-xl text-start font-normal font-secondary text-black-web mt-2 sm:mt-3 md:mt-4">
            Hear what our satisfied clients have to say about their experience
            with Erie Wedding Officiants. Your feedback inspires us to create
            unforgettable ceremonies.
          </p>
        </div>
      </div>
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
        <Swiper
          direction="vertical"
          slidesPerView={getSwiperConfig().slidesPerView}
          spaceBetween={getSwiperConfig().spaceBetween}
          loop={publicReviews.length > 1}
          mousewheel={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: upBtnRef.current,
            nextEl: downBtnRef.current,
          }}
          onInit={(swiper) => {
            // @ts-expect-error - Swiper typing issue
            swiper.params.navigation.prevEl = upBtnRef.current;
            // @ts-expect-error - Swiper typing issue
            swiper.params.navigation.nextEl = downBtnRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          modules={[Pagination, Mousewheel, Autoplay, Navigation]}
          className="h-[300px] sm:h-[500px]  lg:h-[600px]"
        >
         {publicReviews?.map((item) => (
  <SwiperSlide key={item._id}>
    <div className="flex flex-col items-start bg-white py-3 sm:py-4 md:py-5 px-2 sm:px-3 gap-2 sm:gap-3 md:gap-4 w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-sm lg:px-5 shadow-xl mx-auto xl:ml-40">
      <div className="flex justify-between items-center w-full">
        <div>
          <p className="text-base sm:text-lg font-secondary mb-1 sm:mb-2">
            "{item.userName}"
          </p>
          <div className="flex gap-1">
            {Array.from({ length: item.rating || 0 }).map((_, i) => (
              <BsFillStarFill
                key={i}
                className="text-yellow-600 text-sm sm:text-base"
              />
            ))}
          </div>
        </div>
        <div className=" size-12 border-2 rounded-full border-primary flex justify-center items-center ">
          {item?.userImageUrl ? (
            <img src={item.userImageUrl} className="size-12" alt={item.userName} />
          ) : (
            <FaRegUserCircle  className="size-10 text-primary" />
          )}
        </div>
      </div>
      <div className="border-t w-full border-[#BEBEBE]" />
      <span className="font-normal text-text text-xs sm:text-sm leading-relaxed">
        {item.ratingDescription}
      </span>
    </div>
  </SwiperSlide>
))}

        </Swiper>
        {/* Up/Down Buttons */}
        <div className="absolute sm:right-2 bottom-6 sm:-bottom-8 md:bottom-10 left-0 xl:pl-6 2xl:-left-80 sm:-left-20 md:-left-32 w-8 sm:w-10 md:w-13 flex flex-col gap-1 sm:gap-2 z-10">
          <button
            ref={upBtnRef}
            className="bg-[#D4AF37] w-8 h-8 sm:w-10 sm:h-10 md:w-13 md:h-13 rounded-full shadow p-1 sm:p-2 hover:bg-primary transition flex justify-center items-center"
            aria-label="Previous"
          >
            <FaArrowUp size={getSwiperConfig().iconSize} />
          </button>
          <button
            ref={downBtnRef}
            className="bg-[#D4AF37] w-8 h-8 sm:w-10 sm:h-10 md:w-13 md:h-13 mt-4 sm:mt-6 md:mt-10 rounded-full shadow p-1 sm:p-2 hover:bg-primary transition flex justify-center items-center"
            aria-label="Next"
          >
            <FaArrowDown size={getSwiperConfig().iconSize} />
          </button>
        </div>
        <div className="absolute w-full top-[70%] sm:top-[75%] md:top-[80%] 2xl:-left-48 lg:top-[82%] hidden lg:block ">
          <img
            src="/bride2.jpg"
            className="w-32 sm:w-40 md:w-48 lg:w-52 xl:w-60 absolute bottom-[150px] sm:bottom-[180px] md:bottom-[220px] lg:bottom-[180px] xl:bottom-[248px] -left-4 sm:-left-6 md:-left-8 lg:-left-4 xl:-left-10 shadow-xl"
            alt=""
          />
          <img
            src="/bridedress.jpg"
            className="w-32 sm:w-40 md:w-48 lg:w-52 xl:w-60 absolute -bottom-32 sm:-bottom-40 md:-bottom-48 lg:-bottom-36 xl:-bottom-56 -left-4 sm:-left-6 md:-left-8 lg:-left-4 xl:-left-10 shadow-xl"
            alt=""
          />
          <div className="w-48 sm:w-56 md:w-64 lg:w-60 xl:w-72 border-2 sm:border-3 left-24 sm:left-32 md:left-36 lg:left-28 xl:left-40 -top-16 sm:-top-20 md:-top-24 lg:-top-16 xl:-top-28 border-[#fac38dad] absolute -z-10 h-32 sm:h-40 md:h-48 lg:h-44 xl:h-60"></div>
          <div className="w-48 sm:w-56 md:w-64 lg:w-60 xl:w-72 border-2 sm:border-3 left-24 sm:left-32 md:left-36 lg:left-28 xl:left-40 bottom-48 sm:bottom-60 md:bottom-72 lg:bottom-56 xl:bottom-80 border-[#fac38dad] absolute -z-10 h-32 sm:h-40 md:h-48 lg:h-44 xl:h-60"></div>
        </div>
      </div>
    </div>
  );
};

export default ClientReview;
