import type { StateName, MarriageLicenseInfo } from "./marriageLicenseData";

interface MarriageLicenseModalProps {
  isOpen: boolean;
  selectedState: StateName | null;
  data: Record<StateName, MarriageLicenseInfo>;
  onClose: () => void;
}

const MarriageLicenseModal = ({
  isOpen,
  selectedState,
  data,
  onClose,
}: MarriageLicenseModalProps) => {
  if (!isOpen || !selectedState) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/90 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold font-primary">
            {data[selectedState].title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 group"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200"
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
            {data[selectedState].sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-6 shadow-sm border border-pink-100"
              >
                <h3 className="text-xl md:text-2xl font-bold font-primary text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    {sectionIndex + 1}
                  </div>
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed font-secondary">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          {selectedState !== "pennsylvania" && (
            <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 rounded-r-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-amber-800 font-primary">
                    Important Notice
                  </h4>
                  <p className="text-amber-700 font-secondary">
                    Requirements and procedures may vary by county. Always
                    verify current information and requirements with the local
                    office before applying for your marriage license.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold font-secondary transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarriageLicenseModal;
