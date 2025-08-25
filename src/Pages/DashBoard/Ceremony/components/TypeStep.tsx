import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CeremonyFormData } from "../types";
import CustomDropdown from "./CustomDropdown";

interface TypeStepProps {
  register: UseFormRegister<CeremonyFormData>;
  errors: FieldErrors<CeremonyFormData>;
  watch: (name: keyof CeremonyFormData) => string;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

const TypeStep = ({
  register,
  errors,
  watch,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: TypeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Ceremony Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            type="text"
            placeholder="e.g., Garden Vows - Sunset"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none  "
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Ceremony Type
          </label>
          <CustomDropdown
            name="type"
            options={["Classic", "Modern", "Minimal", "Rustic", "Traditional"]}
            value={watch("type")}
            placeholder="Classic"
            isOpen={openDropdowns.type || false}
            onToggle={onToggleDropdown}
            onSelect={onSelectDropdown}
          />
        </div>
      </div>
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Short description of your ceremony vision..."
          rows={4}
          className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none   resize-none"
        />
      </div>
    </div>
  );
};

export default TypeStep;
