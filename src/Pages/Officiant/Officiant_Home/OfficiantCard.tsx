import { FaArrowRight, FaUserTie } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { BsPatchCheck } from "react-icons/bs";
import { PiFlowerTulipBold } from "react-icons/pi";
import { HiOutlineSparkles } from "react-icons/hi";
import type { RefCallback } from "react";

export interface OfficiantData {
  id: string | number;
  name: string;
  image: string;
  role: string;
  description: string;
}

interface OfficiantCardProps {
  officiant: OfficiantData;
  index: number;
  isVisible: boolean;
  shouldShowImage: boolean;
  cardRef: RefCallback<HTMLDivElement>;
  onNavigate: (id: string | number) => void;
  onImageError: (id: string | number) => void;
}

const OfficiantCard = ({
  officiant,
  index,
  isVisible,
  shouldShowImage,
  cardRef,
  onNavigate,
  onImageError,
}: OfficiantCardProps) => {
  return (
    <div
      ref={cardRef}
      data-index={index}
      onClick={() => onNavigate(officiant.id)}
      className={`officiant-card group bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 overflow-hidden max-w-sm mx-auto w-full cursor-pointer border border-[#f5f0d9] hover:border-primary/40 transition-all duration-500 flex flex-col h-full ${
        isVisible ? "officiant-card-visible" : "officiant-card-hidden"
      }`}
    >
      {/* Cover Image Area */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#faf8f0] to-[#f5f0d9]">
        {shouldShowImage ? (
          <img
            src={officiant.image}
            alt={officiant.name}
            loading="lazy"
            decoding="async"
            className="officiant-card-img w-full h-full object-cover"
            onError={() => onImageError(officiant.id)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <FaUserTie className="text-[#d4af37]/30 text-8xl" />
          </div>
        )}

        {/* Gold gradient overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/80 to-transparent" />

        {/* Decorative corner sparkle */}
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <HiOutlineSparkles className="text-primary text-lg" />
        </div>
      </div>

      {/* Card Content */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        {/* Gold accent line */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-primary/60 to-transparent" />
          <PiFlowerTulipBold className="text-primary text-sm" />
          <div className="h-px flex-1 bg-gradient-to-l from-primary/60 to-transparent" />
        </div>

        {/* Name */}
        <h2 className="text-text font-primary text-center font-bold text-xl leading-snug">
          {officiant.name}
        </h2>

        {/* Role Badge */}
        <div className="flex items-center justify-center gap-1.5 mt-2 mb-3">
          <BsPatchCheck className="text-primary text-sm" />
          <span className="text-sm font-secondary text-primary font-semibold tracking-wide uppercase">
            {officiant.role}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-center text-black-web flex-1 leading-relaxed">
          {officiant.description && officiant.description.length > 110 ? (
            <>
              {officiant.description.slice(0, 110)}
              <span className="text-primary/50">... </span>
            </>
          ) : (
            officiant.description
          )}
        </p>

        {/* View More Button */}
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8961e] text-white font-secondary font-semibold text-sm tracking-wide group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
            <FaStar className="text-xs opacity-80" />
            VIEW PROFILE
            <FaArrowRight
              size={14}
              className="group-hover:translate-x-1.5 transition-transform duration-300"
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfficiantCard;
