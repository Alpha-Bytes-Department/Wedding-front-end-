import type { Step } from "../types";

interface StepIndicatorProps {
  steps: Step[];
}

const StepIndicator = ({ steps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center flex-wrap gap-4 justify-start mb-8 ">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`flex items-center justify-start rounded-xl py-1 px-3 border font-medium text-sm border-primary
            ${
              step.active
                ? "bg-primary text-white "
                : "bg-gray-100 text-primary "
            }`}
        >
          {step.number}.
          <span
            className={` text-sm lg:text-base font-normal
            ${step.active ? "text-white" : "text-primary"}`}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
