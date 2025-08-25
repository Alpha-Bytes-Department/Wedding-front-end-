import type { UseFormRegister } from "react-hook-form";
import type { CeremonyFormData } from "../types";
import CustomDropdown from "./CustomDropdown";

interface RitualsStepProps {
  register: UseFormRegister<CeremonyFormData>;
  watch: (name: keyof CeremonyFormData) => string;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

const RitualsStep = ({
  register,
  watch,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: RitualsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Rituals
          </label>
          <CustomDropdown
            name="rituals"
            options={[
              "Sand ceremony",
              "Unity candle",
              "Ring warming",
              "Other / cultural",
            ]}
            value={watch("rituals")}
            placeholder="Unity candle"
            isOpen={openDropdowns.rituals || false}
            onToggle={onToggleDropdown}
            onSelect={onSelectDropdown}
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Music cue
          </label>
          <input
            {...register("musicCue")}
            type="text"
            placeholder="e.g., A Thousand Years - Piano"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none  "
          />
        </div>
      </div>
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Notes
        </label>
        <textarea
          {...register("notes")}
          placeholder="Additional notes..."
          rows={4}
          className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none   resize-none"
        />
      </div>
    </div>
  );
};

export default RitualsStep;
