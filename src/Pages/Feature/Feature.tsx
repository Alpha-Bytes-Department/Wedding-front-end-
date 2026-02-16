import { useEffect, useState } from "react";
import { Buttons } from "../Home/Ceremony";
import ContactForm from "../Home/ContactForm";
import { marriageLicenseData } from "./feature/marriageLicenseData";
import type { StateName } from "./feature/marriageLicenseData";
import ImageCollage from "./feature/ImageCollage";
import FeatureCard from "./feature/FeatureCard";
import MarriageLicenseModal from "./feature/MarriageLicenseModal";

const Feature = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<StateName | null>(null);

  const openModal = (state: StateName) => {
    setSelectedState(state);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedState(null);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="pt-24 md:pt-30 text-black">
      <h1 className="text-2xl sm:text-3xl font-bold md:text-[55px] px-5 pt-5 md:pt-20 font-primary text-center mb-16">
        Make It
        <span className="text-primary">Yours </span>
      </h1>

      {/* First Feature */}
      <div className="flex items-center justify-around px-8 gap-12">
        <div className="flex flex-col items-center justify-around lg:flex-row gap-12">
          <FeatureCard
            title="Stress-Free Ceremony Planning "
            description="With Erie Wedding Officiants, every moment of your ceremony is personalized to reflect your unique love story and personality. Your love, our guidance."
          />
          <ImageCollage />
        </div>
      </div>

      {/* Second Feature */}
      <div className="flex items-center justify-around lg:flex-row px-8 gap-12">
        <div className="flex flex-col items-center justify-around lg:flex-row gap-12">
          <ImageCollage className="lg:block hidden" />
          <FeatureCard
            title="Seamless Collaboration "
            description="With Erie Wedding Officiants, every moment of your ceremony is personalized to reflect your unique love story and personality. Your love, our guidance."
          />
          <ImageCollage />
        </div>
      </div>

      {/* Third Feature */}
      <div className="flex items-center justify-around lg:flex-row px-8 gap-12">
        <div className="flex flex-col items-center justify-around lg:flex-row gap-12">
          <FeatureCard
            title="Organized & Accessible "
            description="Your love story is unique, and your ceremony should be too. Our experienced officiants work closely with you to craft a ceremony that truly represents your journey together, ensuring every detail is perfect."
          />
          <ImageCollage />
        </div>
      </div>

      <div className="max-w-6xl mx-auto my-10 px-6 py-8 bg-gradient-to-r from-white via-pink-50 to-white text-center">
        <h3 className="text-xl md:text-3xl lg:text-4xl xl:text-6xl font-semibold mb-4 font-primary">
          Personalized Ceremonies Tailored to Your Love Story
        </h3>

        <p className="md:text-xl text-gray-700 leading-relaxed mb-4">
          With years of experience, we specialize in creating
          <span className="text-primary font-semibold">
            {" "}
            personalized wedding ceremonies{" "}
          </span>
          that reflect your <span className="italic">unique love story</span>.
          Whether you prefer a<span className="font-medium"> traditional </span>{" "}
          or <span className="font-medium">modern</span> ceremony, we are here
          to make your special day unforgettable.
        </p>

        <p className="text-lg md:text-xl md:text- text-gray-600 mb-6">
          We understand the importance of finding the right officiant to
          officiate your wedding, and we are dedicated to ensuring that your
          ceremony is exactly how you envision it.
        </p>
        <p className="text-lg pb-6 md:-base text-gray-700 mr-2">
          Guidance on marriage licenses:
        </p>
        <div className="inline-flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
          <button
            onClick={() => openModal("pennsylvania")}
            className="px-3 py-1 rounded-lg bg-primary text-white text-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
          >
            Pennsylvania
          </button>
          <button
            onClick={() => openModal("ohio")}
            className="px-3 py-1 rounded-lg bg-primary/90 text-white text-lg font-semibold hover:bg-primary transition-colors duration-200"
          >
            Ohio
          </button>
          <button
            onClick={() => openModal("newyork")}
            className="px-3 py-1 rounded-lg bg-primary/80 text-white text-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
          >
            New York
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between items-center md:items-start gap-4 my-10 px-5 md:px-10 lg:px-20">
        <div className="text-start flex flex-col justify-start gap-4">
          <h1 className="text-3xl lg:text-[55px] font-primary text-black font-bold">
            Start Building <span className="text-primary">Your Ceremony</span>{" "}
          </h1>
          <p className="text-xl font-secondary text-text font-normal">
            Join us today and create the wedding ceremony you've always dreamed
            of with ease.
          </p>{" "}
          <Buttons />
        </div>
        <img src="/shake.jpg" alt="" className="md:w-1/3 rounded-md" />
      </div>
      <ContactForm />

      <MarriageLicenseModal
        isOpen={isModalOpen}
        selectedState={selectedState}
        data={marriageLicenseData}
        onClose={closeModal}
      />
    </div>
  );
};

export default Feature;
