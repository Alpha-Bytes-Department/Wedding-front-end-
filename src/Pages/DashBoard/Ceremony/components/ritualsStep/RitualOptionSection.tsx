import React from "react";
import type { UseFormRegister } from "react-hook-form";
import type { CeremonyFormData } from "../../types";
import type { RitualOption } from "./ritualOptionsData";
import { replaceNames } from "./ritualOptionsData";
import CustomDropdown from "../CustomDropdown";
import { FaExchangeAlt } from "react-icons/fa";

interface RitualOptionSectionProps {
  label: string;
  fieldName: keyof CeremonyFormData;
  options: RitualOption[];
  register: UseFormRegister<CeremonyFormData>;
  watch: (name: keyof CeremonyFormData) => string;
  partner1Name: string;
  partner2Name: string;
  firstName: string;
  secondName: string;
  isReversed: boolean;
  onToggleReverse: () => void;
  showSwitch: boolean;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelect: (fieldName: string, optionId: string) => void;
  onPreview: (optionId: string) => void;
  placeholder: string;
  labelVariant?: "default" | "large";
}

const RitualOptionSection: React.FC<RitualOptionSectionProps> = ({
  label,
  fieldName,
  options,
  register,
  watch,
  partner1Name,
  partner2Name,
  firstName,
  secondName,
  isReversed: _isReversed,
  onToggleReverse,
  showSwitch,
  openDropdowns,
  onToggleDropdown,
  onSelect,
  onPreview,
  placeholder,
  labelVariant = "default",
}) => {
  // Find the current option by matching content
  const getCurrentLabel = (): string => {
    const currentContent = watch(fieldName);
    if (!currentContent) return "";
    const currentOption = options.find((opt) => {
      const optionContent = replaceNames(opt.content, partner1Name, partner2Name);
      return optionContent === currentContent;
    });
    return currentOption?.label || "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label
          className={
            labelVariant === "large"
              ? "block text-lg font-semibold text-gray-900"
              : "block text-sm font-medium text-gray-700"
          }
        >
          {label} {labelVariant !== "large" && `${firstName} & ${secondName}`}
        </label>
        {showSwitch && (
          <button
            type="button"
            onClick={onToggleReverse}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
            title={`Switch names`}
          >
            <FaExchangeAlt className="text-xs" />
            <span>Switch</span>
          </button>
        )}
      </div>
      <div className="space-y-3">
        <input type="hidden" {...register(fieldName)} />
        <CustomDropdown
          name={fieldName}
          options={options.map((opt) => opt.label)}
          value={getCurrentLabel()}
          placeholder={placeholder}
          isOpen={openDropdowns[fieldName] || false}
          onToggle={() => onToggleDropdown(fieldName)}
          onSelect={(_name, value) => {
            const option = options.find((opt) => opt.label === value);
            if (option) onSelect(fieldName, option.id);
          }}
        />
        <div className="flex gap-2 flex-wrap">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onPreview(option.id)}
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

export default RitualOptionSection;
