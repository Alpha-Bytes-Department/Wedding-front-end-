import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface NavigationButtonsProps {
  currentStep: number;
  maxStep: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSaveDraft: () => void | Promise<void>;
  onSubmit: () => void | Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
  validateForSubmission?: () => string[];
}

const NavigationButtons = ({
  currentStep,
  maxStep,
  onPrevStep,
  onNextStep,
  onSaveDraft,
  onSubmit,
  isLoading = false,
  isEditing = false,
  
}: NavigationButtonsProps) => {
  const handleSubmitClick = () => {
    onSubmit();
  };

  return (
    <div>
      <div className="flex justify-between mt-8">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onPrevStep}
              className="px-4 py-2 flex items-center gap-2 border border-primary text-[#e0b94c] rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Previous
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isLoading}
              className="px-6 py-2 hidden md:block border border-primary text-[#e0b94c] rounded-lg font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update Progress"
                : "Save Progress"}
            </button>
          )}
          {currentStep < maxStep ? (
            <button
              type="button"
              onClick={onNextStep}
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitClick}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r flex items-center from-orange-500 to-amber-600 text-white rounded-lg font-semibold hover:from-amber-500 hover:to-orange-500 duration-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isEditing ? "Updating..." : "Submitting..."}
                </div>
              ) : (
                <>
                  {isEditing ? "Update & Send to Officiant" : "Submit Ceremony"}
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isLoading}
          className="px-6 mx-auto mt-6 py-2 block md:hidden border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
            ? "Update Progress"
            : "Save Progress"}
        </button>
      )}

      {/* Help text for draft saving */}
      {currentStep > 1 && currentStep < maxStep && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            💡 You can save your progress at any time and continue later
          </p>
        </div>
      )}

      {/* Submission requirements notice */}
      {currentStep === maxStep && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg
              className="w-5 h-5 text-amber-500 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-yellow-800 font-medium">
                Before submitting, please ensure all required fields are filled:
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Title, Description, Ceremony Type, Vows Type, Language, Event
                Date, Event Time, Location, and Officiant Name
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationButtons;
