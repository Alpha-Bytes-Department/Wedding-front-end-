import { FaHeart } from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";

interface CTASectionProps {
  onBookNow: () => void;
}

const CTASection = ({ onBookNow }: CTASectionProps) => {
  return (
    <div className="text-center py-10 my-8 bg-gradient-to-br from-white to-[#faf8f0] border border-[#f5f0d9] hover:border-primary/40 shadow-lg hover:shadow-2xl hover:shadow-primary/10 rounded-3xl transition-all duration-500">
      {/* Decorative icons */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <GiDiamondRing className="text-primary/40 text-lg float-icon" />
        <FaHeart
          className="text-primary/30 text-sm float-icon"
          style={{ animationDelay: "0.6s" }}
        />
        <GiDiamondRing
          className="text-primary/40 text-lg float-icon"
          style={{ animationDelay: "1.2s" }}
        />
      </div>
      <h1 className="text-xl md:text-2xl lg:text-4xl text-text font-primary font-bold">
        Are you interested?
      </h1>
      <p className="text-sm lg:text-base pb-8 pt-3 tracking-widest text-text font-medium">
        Reach out and share your wedding details.
      </p>
      <div
        onClick={onBookNow}
        className="text-base cursor-pointer py-3 rounded-full text-white bg-gradient-to-r from-[#d4af37] to-[#b8961e] font-secondary font-bold w-10/12 lg:w-1/3 mx-auto hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
      >
        Book Now
      </div>
    </div>
  );
};

export default CTASection;
