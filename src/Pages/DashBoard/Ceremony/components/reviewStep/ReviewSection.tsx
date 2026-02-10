import React from "react";

interface ReviewSectionProps {
  stepNumber: number;
  title: string;
  children: React.ReactNode;
  usePrimaryBg?: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  stepNumber,
  title,
  children,
  usePrimaryBg = true,
}) => {
  return (
    <div className="bg-[#e0b84c1c] rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <span
          className={`w-8 h-8 ${
            usePrimaryBg ? "bg-primary" : "bg-[#e0b84c]"
          } text-white rounded-full flex items-center justify-center text-sm font-bold mr-3`}
        >
          {stepNumber}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
};

export default ReviewSection;
