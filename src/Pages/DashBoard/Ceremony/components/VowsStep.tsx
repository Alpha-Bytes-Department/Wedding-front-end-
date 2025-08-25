import type { CeremonyFormData } from "../types";
import CustomDropdown from "./CustomDropdown";

interface VowsStepProps {
  watch: (name: keyof CeremonyFormData) => string;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

const VowsStep = ({
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
    </div>
  );
};

export default VowsStep;
