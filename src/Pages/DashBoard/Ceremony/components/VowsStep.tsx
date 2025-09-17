import type { CeremonyFormData } from "../types";
import type { UseFormRegister } from "react-hook-form";
import CustomDropdown from "./CustomDropdown";

interface VowsStepProps {
  register: UseFormRegister<CeremonyFormData>;
  watch: (name: keyof CeremonyFormData) => string;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

const VowsStep = ({
  register,
  watch,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: VowsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Vows Type
          </label>
          <CustomDropdown
            name="vowsType"
            options={["Prepared Script", "Hybrid", "Custom Vows"]}
            value={watch("vowsType")}
            placeholder="Custom Vows"
            isOpen={openDropdowns.vowsType || false}
            onToggle={onToggleDropdown}
            onSelect={onSelectDropdown}
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Language
          </label>
          <CustomDropdown
            name="language"
            options={["English", "Bangla", "Spanish", "French"]}
            value={watch("language")}
            placeholder="English"
            isOpen={openDropdowns.language || false}
            onToggle={onToggleDropdown}
            onSelect={onSelectDropdown}
          />
        </div>
      </div>
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Vows Description
        </label>
        <textarea
          {...register("vowDescription")}
          placeholder="Additional details about your vows..."
          rows={4}
          className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};

export default VowsStep;
