/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaHeart } from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";
import ContactForm from "../../Home/ContactForm";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import OfficiantEnroleForm, {
  type OfficiantFormData,
} from "./OfficiantEnroleForm";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import GlassSwal from "../../../utils/glassSwal";
import Swal from "sweetalert2";
import OfficiantCardStyles from "./OfficiantCardStyles";
import SkeletonCard from "./SkeletonCard";
import OfficiantCard, { type OfficiantData } from "./OfficiantCard";
import JoinCard from "./JoinCard";

const Officiant = () => {
  const axios = useAxios();
  const [officiants, setOfficiants] = useState<OfficiantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  // Track which images have failed to load
  const [failedImages, setFailedImages] = useState<Set<string | number>>(
    new Set(),
  );

  // Track visible cards for staggered animation
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ================= Intersection Observer for card reveal =================
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            // Stagger the animation
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(index));
            }, index * 120);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [officiants, isLoading]);

  // ================= Fetch Officiants =================
  const HIDDEN_EMAILS = ["kosskobra@gmail.com", "joysutradharaj@gmail.com"];
  const PRIORITY_EMAIL = "steve@erieweddingofficiants.com";

  const fetchOfficiants = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/users/officiants");
      console.log("Officiants:", response.data);

      const filtered = response.data.officiants
        .filter((o: any) => !HIDDEN_EMAILS.includes(o.email?.toLowerCase()))
        .map((officiant: any) => ({
          id: officiant._id,
          name: officiant.name,
          image: officiant.profilePicture,
          role: officiant.specialization,
          description: officiant.bio,
          email: officiant.email,
        }))
        .sort((a: any, b: any) => {
          const aIsPriority = a.email?.toLowerCase() === PRIORITY_EMAIL;
          const bIsPriority = b.email?.toLowerCase() === PRIORITY_EMAIL;
          if (aIsPriority && !bIsPriority) return -1;
          if (!aIsPriority && bIsPriority) return 1;
          return 0;
        });

      setOfficiants(filtered);
    } catch (error) {
      console.error("Error fetching officiants:", error);
    } finally {
      setIsLoading(false);
    }
  }, [axios]);
  // ================= Officiant Enrole Form =================
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OfficiantFormData>();
  // ================= On Submit Officiant enrole Form =================
  const onsubmit = async (data: OfficiantFormData) => {
    try {
      if (user?.role === "officiant") {
        (document.getElementById("JoiningForm") as HTMLDialogElement)?.close();

        GlassSwal.error(
          "Already an Officiant",
          "You are already registered as an officiant.",
        );
        return;
      }

      if (!user || !user._id) {
        (document.getElementById("JoiningForm") as HTMLDialogElement)?.close();

        GlassSwal.error(
          "Not Logged In",
          "Please log in to submit the officiant application.",
        );
        return;
      }

      // Validate required fields
      if (!data.profilePicture || data.profilePicture.length === 0) {
        (document.getElementById("JoiningForm") as HTMLDialogElement)?.close();
        GlassSwal.error("Missing File", "Please upload a profile picture.");
        return;
      }

      if (!data.portfolio || data.portfolio.length === 0) {
        (document.getElementById("JoiningForm") as HTMLDialogElement)?.close();
        GlassSwal.error("Missing File", "Please upload your portfolio PDF.");
        return;
      }

      const formData = new FormData();
      const languages = data.language.split(",").map((lang) => lang.trim());

      // Add user data
      formData.append("userId", user._id);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("contactNo", data.contactNo);
      formData.append("address", data.address);
      formData.append("experience", data.experience.toString());
      formData.append("experience_details", data.experience_details);
      formData.append("speciality", data.speciality);
      formData.append("language", JSON.stringify(languages));

      // Add files
      formData.append("profilePicture", data.profilePicture[0]);
      formData.append("portfolio", data.portfolio[0]);

      // Show loading
      (document.getElementById("JoiningForm") as HTMLDialogElement)?.close();
      Swal.fire({
        title: "Submitting Application",
        text: "Please wait while we process your application...",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Submit the application
      const response = await axios.post("/applicants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Swal.close(); // Close loading dialog
        (document.getElementById("JoiningForm") as HTMLDialogElement)?.close();
        reset(); // Clear the form

        GlassSwal.success(
          "Application Submitted!",
          "Your officiant application has been submitted successfully. We will review it and get back to you soon.",
        );
      } else {
        Swal.close();
        (document.getElementById("JoiningForm") as HTMLDialogElement)?.close(); // Close loading dialog
        GlassSwal.error(
          "Submission Failed",
          response.data.message ||
            "Failed to submit your application. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);

      Swal.close(); // Close loading dialog

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 413) {
        errorMessage = "Files are too large. Please upload smaller files.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid file format or missing required fields.";
      }

      GlassSwal.error("Application Failed", errorMessage);
    }
  };

  useEffect(() => {
    fetchOfficiants();
  }, [fetchOfficiants]);
  // ================ Scroll to top on mount =================
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const navigate = useNavigate();
  const NavigateToDetail = (officiantId: string | number): void => {
    navigate(`/officiant/${officiantId}`);
  };

  const handleImageError = (officiantId: string | number) => {
    setFailedImages((prev) => new Set(prev).add(officiantId));
  };

  const shouldShowImage = (officiant: any) => {
    return officiant.image && !failedImages.has(officiant.id);
  };

  return (
    <div className="pt-24 md:pt-30">
      <OfficiantCardStyles />

      <img
        src="/flower.png"
        alt=""
        className="size-16 mx-5 lg:mx-20 md:mt-10 lg:mt-20"
      />

      {/* ===== Section Header ===== */}
      <div className="flex text-center gap-6 lg:text-start flex-col lg:flex-row justify-between px-5 md:px-10 lg:px-20">
        <h1 className="text-2xl md:text-3xl lg:text-[55px] text-black font-primary font-bold lg:leading-tight">
          Meet Our Officiants for Perfect{" "}
          <span className="text-primary">Ceremony Guide</span>{" "}
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-text lg:max-w-md">
          Our officiants are dedicated to crafting personalized ceremonies that
          reflect your unique love story. With professionalism and warmth, they
          ensure your special day is memorable and meaningful.
        </p>
      </div>

      {/* ===== Decorative divider ===== */}
      <div className="flex items-center justify-center gap-3 mt-8 px-5 md:px-10 lg:px-20">
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

      {/* ===== Cards Grid ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-5 md:px-10 lg:px-20 xl:gap-10 mt-10 mb-10 lg:mb-20">
        {isLoading && [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}

        {!isLoading &&
          officiants.map((officiant, index) => (
            <OfficiantCard
              key={officiant.id}
              officiant={officiant}
              index={index}
              isVisible={visibleCards.has(index)}
              shouldShowImage={shouldShowImage(officiant)}
              cardRef={(el) => {
                cardRefs.current[index] = el;
              }}
              onNavigate={NavigateToDetail}
              onImageError={handleImageError}
            />
          ))}

        {!isLoading && (
          <JoinCard
            index={officiants.length}
            isVisible={visibleCards.has(officiants.length)}
            cardRef={(el) => {
              cardRefs.current[officiants.length] = el;
            }}
          />
        )}
      </div>

      <ContactForm />

      <dialog id="JoiningForm" className="modal">
        <div className="modal-box bg-white">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <OfficiantEnroleForm
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onsubmit={onsubmit}
            isSubmitting={isSubmitting}
            reset={reset}
          />
        </div>
      </dialog>
    </div>
  );
};

export default Officiant;
