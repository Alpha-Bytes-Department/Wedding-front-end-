import { BsPatchCheck } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaUserTie } from "react-icons/fa6";
import { PiFlowerTulipBold } from "react-icons/pi";

interface ProfileCardProps {
  officiantDetails: any;
  shouldShowImage: boolean;
  profileImageUrl: string;
  onImageError: () => void;
  onBookNow: () => void;
}

const ProfileCard = ({
  officiantDetails,
  shouldShowImage,
  profileImageUrl,
  onImageError,
  onBookNow,
}: ProfileCardProps) => {
  return (
    <div className="anim-scale-in anim-delay-2 max-w-md text-center flex flex-col items-center gap-4 p-8 bg-white border border-[#f5f0d9] hover:border-primary/40 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-primary/15 transition-all duration-500 mx-auto w-full">
      {/* Profile image */}
      <div className="relative p-1 rounded-full border-2 border-primary overflow-hidden size-38 flex items-center justify-center group">
        {shouldShowImage ? (
          <img
            src={profileImageUrl}
            alt={officiantDetails.name}
            className="w-full h-full rounded-full object-cover detail-profile-img"
            onError={onImageError}
          />
        ) : (
          <FaUserTie size={60} className="text-primary/30" />
        )}
        {/* Sparkle on hover */}
        <div className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <HiOutlineSparkles className="text-primary text-sm" />
        </div>
      </div>

      {/* Gold accent line */}
      <div className="flex items-center gap-2 w-full">
        <div className="h-px flex-1 bg-gradient-to-r from-primary/60 to-transparent" />
        <PiFlowerTulipBold className="text-primary text-sm" />
        <div className="h-px flex-1 bg-gradient-to-l from-primary/60 to-transparent" />
      </div>

      <h1 className="text-xl font-bold font-primary lg:text-2xl text-text">
        {officiantDetails.name || "Officiant"}
      </h1>

      {/* Role badge */}
      <div className="flex items-center gap-1.5">
        <BsPatchCheck className="text-primary text-sm" />
        <p className="text-primary text-sm tracking-widest font-bold font-secondary uppercase">
          Officiant
        </p>
      </div>

      <div
        onClick={onBookNow}
        className="cursor-pointer text-white bg-gradient-to-r from-[#d4af37] to-[#b8961e] text-lg w-full rounded-full py-2 font-secondary font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
      >
        <p>Book Now</p>
      </div>
    </div>
  );
};

export default ProfileCard;
