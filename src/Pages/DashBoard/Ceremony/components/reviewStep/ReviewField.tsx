import React from "react";
import { getOptionLabel } from "./optionMappings";

interface ReviewFieldProps {
  label: string;
  value: string;
  category?: string;
  onPreview?: () => void;
  isTextArea?: boolean;
}

const ReviewField: React.FC<ReviewFieldProps> = ({
  label,
  value,
  category,
  onPreview,
  isTextArea = false,
}) => {
  const displayValue = category
    ? getOptionLabel(value, category)
    : value || "Not specified";

  const hasPreview = onPreview && value && value !== "Not specified";

  if (isTextArea) {
    return (
      <div>
        <span className="font-medium text-gray-700 block">{label}:</span>
        <div className="text-gray-900 bg-white px-3 py-2 rounded border border-primary min-h-[80px]">
          {displayValue}
        </div>
      </div>
    );
  }

  if (hasPreview) {
    return (
      <div>
        <span className="font-medium text-gray-700 block">{label}:</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
            {displayValue}
          </span>
          <button
            type="button"
            onClick={onPreview}
            className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
          >
            Preview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="font-medium text-gray-700 block">{label}:</span>
      <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary block">
        {displayValue}
      </span>
    </div>
  );
};

export default ReviewField;
