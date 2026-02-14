import { FaArrowRight, FaUserTie } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";
import { PiFlowerTulipBold } from "react-icons/pi";
import { HiOutlineSparkles } from "react-icons/hi";
import type { RefCallback } from "react";

interface JoinCardProps {
  index: number;
  isVisible: boolean;
  cardRef: RefCallback<HTMLDivElement>;
}

const JoinCard = ({ index, isVisible, cardRef }: JoinCardProps) => {
  return (
    <div
      ref={cardRef}
      data-index={index}
      className={`officiant-card group bg-gradient-to-br from-white to-[#faf8f0] rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 overflow-hidden max-w-sm mx-auto w-full cursor-pointer border-2 border-dashed border-primary/40 hover:border-primary transition-all duration-500 flex flex-col h-full ${
        isVisible ? "officiant-card-visible" : "officiant-card-hidden"
      }`}
    >
      {/* Decorative top area */}
      <div className="relative h-64 overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#faf8f0] to-[#f5f0d9]">
        <div className="relative">
          <FaUserTie className="text-primary/20 text-8xl group-hover:text-primary/40 transition-colors duration-500" />
          {/* Floating decorative icons */}
          <FaHeart className="absolute -top-3 -right-4 text-primary/30 text-lg float-icon" />
          <GiDiamondRing
            className="absolute -bottom-2 -left-5 text-primary/30 text-xl float-icon"
            style={{ animationDelay: "0.7s" }}
          />
          <HiOutlineSparkles
            className="absolute -top-4 -left-3 text-primary/25 text-lg float-icon"
            style={{ animationDelay: "1.4s" }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/60 to-transparent" />
      </div>

      {/* Card Content */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
          <PiFlowerTulipBold className="text-primary/60 text-sm" />
          <div className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
        </div>

        <h2 className="text-text font-primary text-center font-bold text-xl">
          This Could Be You
        </h2>

        <div className="flex items-center justify-center gap-1.5 mt-2 mb-3">
          <HiOutlineSparkles className="text-primary text-sm" />
          <span className="text-sm font-secondary text-primary font-semibold tracking-wide uppercase">
            Join the Team
          </span>
        </div>

        <p className="text-sm text-center text-black-web flex-1 leading-relaxed">
          Erie wedding officiants always welcome passionate individuals to join
          our team. Start your journey today!
        </p>

        <div className="mt-4 flex justify-center">
          <span
            onClick={() =>
              (
                document.getElementById("JoiningForm") as HTMLDialogElement
              ).showModal()
            }
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-primary text-primary font-secondary font-semibold text-sm tracking-wide hover:bg-primary hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
          >
            <GiDiamondRing className="text-base" />
            JOIN NOW
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

export default JoinCard;
