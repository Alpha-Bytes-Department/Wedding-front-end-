/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaArrowRight, FaUserTie } from "react-icons/fa6";
import ContactForm from "../../Home/ContactForm";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OfficiantEnroleForm, {
  type OfficiantFormData,
} from "./OfficiantEnroleForm";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import GlassSwal from "../../../utils/glassSwal";
import Swal from "sweetalert2";

const Officiant = () => {
  const axios = useAxios();
  const [officiants, setOfficiants] = useState<
    Array<{
      id: string | number;
      name: string;
      image: string;
      role: string;
      description: string;
    }>
  >([]);

  const { user } = useAuth();
  // const axios = useAxios();

  // Track which images have failed to load
  const [failedImages, setFailedImages] = useState<Set<string | number>>(
    new Set()
  );
  // ================= Fetch Officiants =================
  const fetchOfficiants = useCallback(async () => {
    try {
      const response = await axios.get("/users/officiants");
      console.log("Officiants:", response.data);
      const objectarray = response.data.officiants.map((officiant: any) => ({
        id: officiant._id,
        name: officiant.name,
        image: officiant.profilePicture,
        role: officiant.specialization,
        description: officiant.bio,
      }));
      setOfficiants(objectarray);
    } catch (error) {
      console.error("Error fetching officiants:", error);
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
          "You are already registered as an officiant."
        );
        return;
      }

      if (!user || !user._id) {
        (document.getElementById("JoiningForm") as HTMLDialogElement)?.close();

        GlassSwal.error(
          "Not Logged In",
          "Please log in to submit the officiant application."
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
          "Your officiant application has been submitted successfully. We will review it and get back to you soon."
        );
      } else {
        Swal.close(); 
        (document.getElementById("JoiningForm") as HTMLDialogElement)?.close(); // Close loading dialog
        GlassSwal.error(
          "Submission Failed",
          response.data.message ||
            "Failed to submit your application. Please try again."
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
      <img
        src="/flower.png"
        alt=""
        className="size-16 mx-5 lg:mx-20 md:mt-10 lg:mt-20"
      />
      <div className="flex text-center gap-6 lg:text-start flex-col lg:flex-row justify-between px-5 md:px-10 lg:px-20">
        <h1 className="text-2xl md:text-3xl lg:text-[55px] text-black font-primary font-bold">
          Meet Our Officiants for Perfect{" "}
          <span className="text-primary">Ceremony Guide</span>{" "}
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-text">
          Our officiants are dedicated to crafting personalized ceremonies that
          reflect your unique love story. With professionalism and warmth, they
          ensure your special day is memorable and meaningful.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-5 md:px-10 lg:px-20 xl:gap-14 mt-8 mb-10 lg:mb-20 justify-between">
        {officiants.map((officiant) => (
          <div
            key={officiant.id}
            className="bg-white p-2 group rounded-2xl shadow-xl shadow-[#00000040] border-2 max-w-80 border-primary mx-auto flex flex-col h-full"
          >
            <div className="flex h-60 justify-center items-center min-h-[160px]">
              {shouldShowImage(officiant) ? (
                <img
                  src={officiant.image}
                  alt={officiant.name}
                  className="w-58 mx-auto"
                  onError={() => handleImageError(officiant.id)}
                />
              ) : (
                <FaUserTie className="text-gray-400 size-36 " />
              )}
            </div>

            <h2 className="text-text font-secondary text-center font-bold text-2xl py-5">
              {officiant.name}
            </h2>
            <p className="text-lg text-center pb-5 text-text">
              {officiant.role}
            </p>
            <p className="pb-8 text-[16px] text-center text-black-web flex-1">
              {officiant.description?.length > 100 ? (
                <>
                  {officiant.description.slice(0, 100)}
                  <span className="text-gray-400">.... </span>
                  <span
                    className="text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={() => NavigateToDetail(officiant.id)}
                  >
                    see more
                  </span>
                </>
              ) : (
                officiant.description
              )}
            </p>

            <div
              onClick={() => NavigateToDetail(officiant.id)}
              className="mt-auto text-primary cursor-pointer flex items-center justify-center gap-2 font-secondary font-bold text-[16px] underline"
            >
              VIEW MORE{" "}
              <FaArrowRight
                size={18}
                className="group-hover:translate-x-3 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
        <div className="bg-white p-2 group rounded-2xl shadow-xl shadow-[#00000040] border-2 max-w-80 border-primary mx-auto flex flex-col h-full">
          <div className="flex h-60 justify-center items-center min-h-[160px]">
            <FaUserTie className="text-gray-400 size-36 " />
          </div>

          <h2 className="text-text font-secondary text-center font-bold text-2xl py-5">
            This Could Be You
          </h2>
          <p className="text-lg  text-center pb-5 text-text">Join the Team</p>
          <p className="pb-8 text-[16px] text-center text-black-web flex-1">
            Erie wedding officiants always welcome passionate individuals to
            join our team.
          </p>

          <div
            onClick={() =>
              (
                document.getElementById("JoiningForm") as HTMLDialogElement
              ).showModal()
            }
            className="mt-auto text-primary cursor-pointer flex items-center justify-center gap-2 font-secondary font-bold text-[16px] underline"
          >
            Join Now{" "}
          </div>
        </div>
      </div>
      <ContactForm />
      <dialog id="JoiningForm" className="modal">
        <div className="modal-box bg-white">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
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
