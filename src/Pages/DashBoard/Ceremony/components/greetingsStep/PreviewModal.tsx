import {
  allOptionArrays,
  findOptionField,
  getOptionContent,
} from "./greetingOptionsData";

interface PreviewModalProps {
  selectedModal: string;
  partner1Name: string;
  partner2Name: string;
  onClose: () => void;
  onSelectOption: (fieldName: string, optionId: string) => void;
}

const PreviewModal = ({
  selectedModal,
  partner1Name,
  partner2Name,
  onClose,
  onSelectOption,
}: PreviewModalProps) => {
  const allOptions = allOptionArrays.flatMap((g) => g.options);
  const selectedOption = allOptions.find((opt) => opt.id === selectedModal);
  const result = findOptionField(selectedModal);

  const content = (() => {
    if (!result) return "";
    const group = allOptionArrays.find(
      (g) => g.fieldName === result.fieldName,
    );
    if (!group) return "";
    return getOptionContent(
      group.options,
      selectedModal,
      partner2Name || "",
      partner1Name || "",
    );
  })();

  return (
    <div className="fixed inset-0 bg-[#6851134d] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedOption?.label || "Preview"} Preview
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
            <p className="text-gray-800 leading-relaxed">{content}</p>
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
                if (result) {
                  onSelectOption(result.fieldName, selectedModal);
                }
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

export default PreviewModal;
