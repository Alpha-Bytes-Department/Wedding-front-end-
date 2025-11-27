import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CeremonyFormData } from "../types";
import { useCeremonyContext } from "../contexts/CeremonyContext";

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
  
}: TypeStepProps) => {
  const {  setGroomName, setBrideName } =
    useCeremonyContext();
  const handleNameChange = (type: "groom" | "bride", value: string) => {
    if (type === "groom") {
      setGroomName(value);
    } else {
      setBrideName(value);
    }
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Groom's Name
          </label>
          <input
            {...register(
              "groomName",
              {
                onChange: (e) => handleNameChange("groom", e.target.value),
                required:"Groom's name is required",
              },
              
            )}
            type="text"
            placeholder="Enter groom's name"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Bride's Name
          </label>
          <input
            {...register("brideName", {
              onChange: (e) => handleNameChange("bride", e.target.value),
              required:"Bride's name is required",
            })}
            type="text"
            placeholder="Enter bride's name"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none"
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
