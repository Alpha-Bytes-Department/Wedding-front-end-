import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface CustomDropdownProps {
  name: string;
  options: string[];
  value: string;
  placeholder: string;
  isOpen: boolean;
  onToggle: (name: string) => void;
  onSelect: (name: string, value: string) => void;
}

const CustomDropdown = ({
  name,
  options,
  value,
  placeholder,
  isOpen,
  onToggle,
  onSelect,
}: CustomDropdownProps) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onToggle(name)}
        className="w-full px-4 py-3 border border-primary rounded-lg bg-white text-left flex items-center justify-between focus:outline-none "
      >
        <span
          className={value === placeholder ? "text-gray-400" : "text-gray-900"}
        >
          {value || placeholder}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(name, option)}
              className={`w-full px-4 py-3 text-left hover:bg-[#D4AF37] hover:text-white ${
                value === option ? "bg-primary text-white" : "text-gray-900"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
