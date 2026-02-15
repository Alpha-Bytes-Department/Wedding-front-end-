import { BsPatchCheck } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

interface BioStatsProps {
  officiantDetails: any;
}

const BioStats = ({ officiantDetails }: BioStatsProps) => {
  return (
    <div className="col-span-2 flex flex-col lg:items-start items-center lg:gap-8 h-full">
      <p className="anim-fade-left anim-delay-3 text-lg md:text-xl lg:text-2xl lg:pt-0 pt-10 lg:px-4 xl:px-0 text-text font-secondary text-center lg:text-start leading-relaxed">
        {officiantDetails.bio ||
          `Erie Wedding Officiants is a team of wedding officiants
          headquartered in Erie, PA, that also serves the Pittsburgh,
          Cleveland, and Buffalo areas. We are dedicated to making your
          special day memorable. Whether your wedding ceremony or renewal is
          large or small, inside or out, next week or next year, our team of
          experts can provide the direction you need to create the wedding
          ceremony of your dreams.`}
      </p>

      <div className="anim-fade-left anim-delay-4 lg:px-4 xl:px-0 mt-6 lg:mt-0">
        <div className="flex flex-col gap-5 lg:pt-0 pt-4 lg:gap-10 md:flex-row mx-auto lg:mx-0">
          <div className="flex items-center gap-3 bg-[#faf8f0] border border-[#f5f0d9] rounded-2xl px-5 py-3 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
            <BsPatchCheck className="text-primary text-xl flex-shrink-0" />
            <p className="text-text text-base md:text-lg font-secondary font-medium">
              {(() => {
                const diffYears = officiantDetails.experience;
                const years =
                  Math.floor(diffYears) < 1 ? 1 : Math.floor(diffYears);
                return `${years} year${years > 1 ? "s" : ""} in business`;
              })()}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#faf8f0] border border-[#f5f0d9] rounded-2xl px-5 py-3 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
            <HiOutlineChatBubbleLeftRight className="text-primary text-xl flex-shrink-0" />
            <p className="text-text text-base md:text-lg font-secondary font-medium">
              Speaks: {officiantDetails.languages?.join(", ") || "English"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#faf8f0] border border-[#f5f0d9] rounded-2xl px-5 py-3 mt-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 w-fit mx-auto lg:mx-0">
          <HiOutlineUsers className="text-primary text-xl flex-shrink-0" />
          <p className="text-text text-base md:text-lg font-secondary font-medium">
            5 Team Members
          </p>
        </div>
      </div>
    </div>
  );
};

export default BioStats;
