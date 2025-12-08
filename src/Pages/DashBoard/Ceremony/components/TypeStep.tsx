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
  const { setPartner1Name, setPartner2Name } = useCeremonyContext();
  const { user } = useAuth();
  const [selectedPartner1, setSelectedPartner1] = useState<string>("");
  const [selectedPartner2, setSelectedPartner2] = useState<string>("");

  const partner1 = user?.partner_1 || "Partner 1";
  const partner2 = user?.partner_2 || "Partner 2";

  useEffect(() => {
    // Set default values on mount
    if (!selectedPartner1 && !selectedPartner2) {
      setSelectedPartner1(partner1);
      setSelectedPartner2(partner2);
      setPartner1Name(partner1);
      setPartner2Name(partner2);
    }
  }, [partner1, partner2]);

  const handlePartner1Change = (value: string) => {
    setSelectedPartner1(value);
    setPartner1Name(value);
    // Automatically set partner 2 to the other partner
    const otherPartner = value === partner1 ? partner2 : partner1;
    setSelectedPartner2(otherPartner);
    setPartner2Name(otherPartner);
  };

  const handleTogglePartners = () => {
    // Swap partner 1 and partner 2
    const temp1 = selectedPartner1;
    const temp2 = selectedPartner2;
    setSelectedPartner1(temp2);
    setSelectedPartner2(temp1);
    setPartner1Name(temp2);
    setPartner2Name(temp1);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Partner 1
          </label>
          <select
            {...register("groomName", {
              required: "Please select Partner 1",
            })}
            value={selectedPartner1}
            onChange={(e) => handlePartner1Change(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">Select partner...</option>
            <option value={partner1}>{partner1}</option>
            <option value={partner2}>{partner2}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Partner 2
          </label>
          <div className="relative">
            <input
              {...register("brideName")}
              type="text"
              value={selectedPartner2}
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
      {selectedPartner1 && selectedPartner2 && (
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
      {selectedPartner1 && selectedPartner2 && (
        <div className="bg-amber-50 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-primary">Partner 1:</span>{" "}
            {selectedPartner1}
            <span className="mx-2 text-gray-400">•</span>
            <span className="font-medium text-primary">Partner 2:</span>{" "}
            {selectedPartner2}
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
