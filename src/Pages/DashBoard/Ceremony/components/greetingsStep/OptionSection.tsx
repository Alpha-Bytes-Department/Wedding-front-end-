import type { GreetingOption } from "./greetingOptionsData";
import CustomDropdown from "../CustomDropdown";

interface OptionSectionProps {
  label: string;
  fieldName: string;
  options: GreetingOption[];
  watchValue: string;
  partner1Name: string;
  partner2Name: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (optionId: string) => void;
  onPreview: (optionId: string) => void;
  headerRight?: React.ReactNode;
}

const OptionSection = ({
  label,
  fieldName,
  options,
  watchValue,
  partner1Name,
  partner2Name,
  isOpen,
  onToggle,
  onSelect,
  onPreview,
  headerRight,
}: OptionSectionProps) => {
  const currentLabel = (() => {
    if (!watchValue) return "";
    const p2 = partner2Name || "Partner 2's Name";
    const p1 = partner1Name || "Partner 1's Name";
    const match = options.find((opt) => {
      const content = opt.content
        .replace(/{bride_name}/g, p2)
        .replace(/{groom_name}/g, p1);
      return content === watchValue;
    });
    return match?.label || "";
  })();

  return (
    <div>
      {headerRight ? (
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {headerRight}
        </div>
      ) : (
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          {label}
        </label>
      )}
      <div className="space-y-3">
        <CustomDropdown
          name={fieldName}
          options={options.map((opt) => opt.label)}
          value={currentLabel}
          placeholder={`Select ${label.toLowerCase()} option`}
          isOpen={isOpen}
          onToggle={onToggle}
          onSelect={(value) => {
            const option = options.find((opt) => opt.label === value);
            if (option) onSelect(option.id);
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

export default OptionSection;
