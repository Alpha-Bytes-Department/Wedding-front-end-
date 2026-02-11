import React from "react";
import {
  getAllOptions,
  getOptionsArrayForId,
  getOptionContent,
} from "./ritualOptionsData";

interface RitualPreviewModalProps {
  selectedModal: string;
  partner1Name: string;
  partner2Name: string;
  onClose: () => void;
  onSelect: (optionId: string) => void;
}

const RitualPreviewModal: React.FC<RitualPreviewModalProps> = ({
  selectedModal,
  partner1Name,
  partner2Name,
  onClose,
  onSelect,
}) => {
  const allOptions = getAllOptions();
  const modalLabel =
    allOptions.find((opt) => opt.id === selectedModal)?.label || "Preview";

  const optionsArray = getOptionsArrayForId(selectedModal);
  const content = getOptionContent(
    optionsArray,
    selectedModal,
    partner2Name,
    partner1Name
  );

  return (
    <div className="fixed inset-0 bg-[#6851134d] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {modalLabel} Preview
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {content}
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onSelect(selectedModal);
                onClose();
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Select This Option
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RitualPreviewModal;
