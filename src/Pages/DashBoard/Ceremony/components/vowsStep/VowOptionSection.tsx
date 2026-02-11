import type { CeremonyFormData } from "../../types";
import type { VowOption } from "./vowOptionsData";
import { replaceNames } from "./vowOptionsData";
import CustomDropdown from "../CustomDropdown";
import { FaExchangeAlt } from "react-icons/fa";

interface VowOptionSectionProps {
  label: string;
  fieldName: keyof CeremonyFormData;
  options: VowOption[];
  placeholder: string;
  watch: (name: keyof CeremonyFormData) => string;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectOption: (fieldName: string, optionId: string) => void;
  onOpenModal: (optionId: string) => void;
  partner1Name: string;
  partner2Name: string;
  showSwitch?: boolean;
  onToggleReversed?: () => void;
  switchTitle?: string;
}

const VowOptionSection = ({
  label,
  fieldName,
  options,
  placeholder,
  watch,
  openDropdowns,
  onToggleDropdown,
  onSelectOption,
  onOpenModal,
  partner1Name,
  partner2Name,
  showSwitch = false,
  onToggleReversed,
  switchTitle,
}: VowOptionSectionProps) => {
  const currentValue = (() => {
    const currentContent = watch(fieldName);
    if (!currentContent) return "";
    const currentOption = options.find((opt) => {
      const optionContent = replaceNames(
        opt.content,
        partner1Name,
        partner2Name,
      );
      return optionContent === currentContent;
    });
    return currentOption?.label || "";
  })();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {showSwitch &&
          partner1Name &&
          partner2Name &&
          partner1Name !== "Partner 1" &&
          partner2Name !== "Partner 2" && (
            <button
              type="button"
              onClick={onToggleReversed}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
              title={switchTitle}
            >
              <FaExchangeAlt className="text-xs" />
              <span>Switch</span>
            </button>
          )}
      </div>
      <div className="space-y-3">
        <CustomDropdown
          name={fieldName}
          options={options.map((opt) => opt.label)}
          value={currentValue}
          placeholder={placeholder}
          isOpen={openDropdowns[fieldName] || false}
          onToggle={() => onToggleDropdown(fieldName)}
          onSelect={(value) => {
            const option = options.find((opt) => opt.label === value);
            if (option) onSelectOption(fieldName, option.id);
          }}
        />
        <div className="flex gap-2 flex-wrap">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onOpenModal(option.id)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VowOptionSection;
