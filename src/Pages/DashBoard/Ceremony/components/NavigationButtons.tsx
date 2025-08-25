import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface NavigationButtonsProps {
  currentStep: number;
  maxStep: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

const NavigationButtons = ({
  currentStep,
  maxStep,
  onPrevStep,
  onNextStep,
  onSaveDraft,
  onSubmit,
}: NavigationButtonsProps) => {
  return (
    <div>
      <div className="flex justify-between mt-8">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onPrevStep}
              className="px-3 py-2 flex items-center gap-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Previous
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {currentStep > 1 && 
            <button
              type="button"
              onClick={onSaveDraft}
              className="px-6 py-2 hidden md:block border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Save Progress
          </button>}
          {currentStep < maxStep ? (
            <button
              type="button"
              onClick={onNextStep}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Next
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Send To Officiant
            </button>
          )}
        </div>
      </div>
      {currentStep>1&&<button
        type="button"
        onClick={onSaveDraft}
        className="px-6 mx-auto mt-6 py-2 block md:hidden border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
      >
        Save Progress
      </button>}
    </div>
  );
};

export default NavigationButtons;
