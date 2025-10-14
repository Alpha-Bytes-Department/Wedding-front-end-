/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaArrowRight, FaUserTie } from "react-icons/fa6";
import ContactForm from "../../Home/ContactForm";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useCallback, useEffect, useState } from "react";

const Officiant = () => {
  const axios = useAxios();
  const [officiants, setOfficiants] = useState<Array<{
    id: string | number;
    name: string;
    image: string;
    role: string;
    description: string;
  }>>([]);

  // Track which images have failed to load
  const [failedImages, setFailedImages] = useState<Set<string | number>>(new Set());

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

  useEffect(() => {
     window.scrollTo({
       top: 0,
       left: 0,
       behavior: "smooth",
     });
    fetchOfficiants();
  }, [fetchOfficiants]);

  const navigate = useNavigate();
  const NavigateToDetail = (officiantId: string | number): void => {
    navigate(`/officiant/${officiantId}`);
  };

  const handleImageError = (officiantId: string | number) => {
    setFailedImages(prev => new Set(prev).add(officiantId));
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
              {officiant.description.length > 100 ? (
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
      </div>
      <ContactForm />
    </div>
  );
};

export default Officiant;