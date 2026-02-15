import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/useAxios";
import { BsPatchCheck } from "react-icons/bs";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaHeart } from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";
import { PiFlowerTulipBold } from "react-icons/pi";
import BookingPackage from "./BookingPackage";
import DetailSkeleton from "./DetailSkeleton";
import DetailAnimationStyles from "./DetailAnimationStyles";
import ProfileCard from "./ProfileCard";
import BioStats from "./BioStats";
import FeaturedVideo from "./FeaturedVideo";
import CTASection from "./CTASection";
import TestimonialCarousel from "./TestimonialCarousel";

const OfficiantDetail = () => {
  const { officiantId } = useParams<{ officiantId: string }>();
  console.log("Officiant ID from URL:", officiantId);
  const axios = useAxios();
  const navigate = useNavigate();
  const [officiantDetails, setOfficiantDetails] = useState<any>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [screenSize, setScreenSize] = useState<"sm" | "md" | "lg" | "xl">("lg");

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
      setImageError(false);
    } catch (error) {
      console.error("Error fetching officiant details:", error);
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
      setTestimonials(dummyTestimonials);
    }
  };

  // ======================Handle first render====================
  useEffect(() => {
    fetchOfficiantDetails();
    fetchTestimonial();
  }, [officiantId]);

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

  // ======================Handle hash scroll====================
  useEffect(() => {
    if (location.hash === "#client-review") {
      setTimeout(() => {
        const element = document.getElementById("client-review");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);

  // ======================Image helpers====================
  const shouldShowImage = officiantDetails?.profilePicture && !imageError;

  const getProfileImageUrl = () => {
    if (!officiantDetails?.profilePicture) return "";
    if (officiantDetails.profilePicture.startsWith("http")) {
      return officiantDetails.profilePicture;
    }
    return `/${officiantDetails.profilePicture}`;
  };

  // Don't render anything until officiantDetails is loaded
  if (!officiantDetails) {
    return <DetailSkeleton />;
  }

  const isSteve =
    officiantDetails.email?.toLowerCase() === "steve@erieweddingofficiants.com";

  return (
    <div className="pt-24 md:pt-30 px-5 md:px-10 lg:px-20">
      <DetailAnimationStyles />

      {/* ===== Section Title ===== */}
      <div className="anim-fade-up flex items-center gap-3 md:pt-5 lg:pt-10">
        <PiFlowerTulipBold className="text-primary text-2xl" />
        <h1 className="text-xl md:text-2xl lg:text-4xl text-text font-primary font-medium">
          About this Officiant
        </h1>
      </div>

      {/* ===== Decorative divider ===== */}
      <div className="flex items-center justify-center gap-3 mt-4 mb-8 anim-fade-up anim-delay-1">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
        <GiDiamondRing className="text-primary text-xl float-icon" />
        <FaHeart
          className="text-primary/60 text-sm float-icon"
          style={{ animationDelay: "0.5s" }}
        />
        <GiDiamondRing
          className="text-primary text-xl float-icon"
          style={{ animationDelay: "1s" }}
        />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
      </div>

      {/* ===== Profile Card + Bio ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-8 py-4">
        <ProfileCard
          officiantDetails={officiantDetails}
          shouldShowImage={shouldShowImage}
          profileImageUrl={getProfileImageUrl()}
          onImageError={() => setImageError(true)}
          onBookNow={() => navigate("/dashboard/ceremony")}
        />
        <BioStats officiantDetails={officiantDetails} />
      </div>

      {/* ===== Featured Video (Steve only) ===== */}
      {isSteve && <FeaturedVideo />}

      {/* ===== Packages Section ===== */}
      <div className="anim-fade-up anim-delay-3 flex items-center gap-3 md:pt-5 lg:pt-16">
        <PiFlowerTulipBold className="text-primary text-2xl" />
        <h1 className="text-xl md:text-2xl lg:text-4xl text-text font-primary font-medium">
          Prices & Packages
        </h1>
      </div>

      <div className="flex justify-center">
        <BookingPackage />
      </div>

      {/* Info badges */}
      <div className="flex gap-3 items-center pb-6 bg-[#faf8f0] border border-[#f5f0d9] rounded-2xl px-5 py-3 shadow-sm">
        <HiOutlineSpeakerphone
          size={24}
          className="text-primary flex-shrink-0"
        />
        <span className="text-text font-secondary text-sm md:text-lg">
          Starting prices may not include all fees a vendor may charge.
        </span>
      </div>
      <div className="flex gap-3 items-center mt-3 bg-[#faf8f0] border border-[#f5f0d9] rounded-2xl px-5 py-3 shadow-sm">
        <BsPatchCheck size={24} className="text-primary flex-shrink-0" />
        <span className="text-text font-secondary text-sm md:text-lg">
          Couples usually spend ${officiantDetails.bookingMoney} on average for
          officiant services.
        </span>
      </div>

      {/* ===== CTA Section ===== */}
      <CTASection onBookNow={() => navigate("/dashboard/discussions")} />

      {/* ===== Reviews Section ===== */}
      <TestimonialCarousel
        testimonials={testimonials}
        officiantName={officiantDetails.name}
        screenSize={screenSize}
      />
    </div>
  );
};

export default OfficiantDetail;
