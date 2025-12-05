import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CeremonyFormData } from "../types";
import { useCeremonyContext } from "../contexts/CeremonyContext";
import { useAuth } from "../../../../Component/Providers/AuthProvider";
import { useState, useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";

interface TypeStepProps {
  register: UseFormRegister<CeremonyFormData>;
  errors: FieldErrors<CeremonyFormData>;
  watch: (name: keyof CeremonyFormData) => string;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

const TypeStep = ({ register }: TypeStepProps) => {
  const { setGroomName, setBrideName } = useCeremonyContext();
  const { user } = useAuth();
  const [selectedGroom, setSelectedGroom] = useState<string>("");
  const [selectedBride, setSelectedBride] = useState<string>("");

  const partner1 = user?.partner_1 || "Partner 1";
  const partner2 = user?.partner_2 || "Partner 2";

  useEffect(() => {
    // Set default values on mount
    if (!selectedGroom && !selectedBride) {
      setSelectedGroom(partner1);
      setSelectedBride(partner2);
      setGroomName(partner1);
      setBrideName(partner2);
    }
  }, [partner1, partner2]);

  const handleGroomChange = (value: string) => {
    setSelectedGroom(value);
    setGroomName(value);
    // Automatically set bride to the other partner
    const otherPartner = value === partner1 ? partner2 : partner1;
    setSelectedBride(otherPartner);
    setBrideName(otherPartner);
  };

  const handleTogglePartners = () => {
    // Swap groom and bride
    const tempGroom = selectedGroom;
    const tempBride = selectedBride;
    setSelectedGroom(tempBride);
    setSelectedBride(tempGroom);
    setGroomName(tempBride);
    setBrideName(tempGroom);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who is the Groom?
          </label>
          <select
            {...register("groomName", {
              required: "Please select who is the groom",
            })}
            value={selectedGroom}
            onChange={(e) => handleGroomChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">Select partner...</option>
            <option value={partner1}>{partner1}</option>
            <option value={partner2}>{partner2}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who is the Bride?
          </label>
          <div className="relative">
            <input
              {...register("brideName")}
              type="text"
              value={selectedBride}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              Auto-selected
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      {selectedGroom && selectedBride && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleTogglePartners}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            <FaExchangeAlt />
            <span>Switch Partners</span>
          </button>
        </div>
      )}

      {/* Display Current Selection */}
      {selectedGroom && selectedBride && (
        <div className="bg-amber-50 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-primary">Groom:</span>{" "}
            {selectedGroom}
            <span className="mx-2 text-gray-400">•</span>
            <span className="font-medium text-primary">Bride:</span>{" "}
            {selectedBride}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Short description of your ceremony vision..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
};

export default TypeStep;
