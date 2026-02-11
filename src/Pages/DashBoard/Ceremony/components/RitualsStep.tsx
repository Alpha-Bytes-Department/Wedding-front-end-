import { useState } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { CeremonyFormData } from "../types";
import CustomDropdown from "./CustomDropdown";
import { useCeremonyContext } from "../contexts/CeremonyContext";
import {
  ritualTypes,
  closingOptions,
  pronouncingOptions,
  kissOptions,
  introductionOptions,
  getRitualOptions,
  replaceNames,
  getFieldForOptionId,
} from "./ritualsStep/ritualOptionsData";
import RitualOptionSection from "./ritualsStep/RitualOptionSection";
import RitualPreviewModal from "./ritualsStep/RitualPreviewModal";

interface RitualsStepProps {
  register: UseFormRegister<CeremonyFormData>;
  watch: (name: keyof CeremonyFormData) => string;
  setValue: (name: keyof CeremonyFormData, value: string) => void;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

const RitualsStep = ({
  register,
  watch,
  setValue,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: RitualsStepProps) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const { partner1Name, partner2Name } = useCeremonyContext();

  // Individual toggle states
  const [ritualReversed, setRitualReversed] = useState(false);
  const [closingReversed, setClosingReversed] = useState(false);
  const [pronouncingReversed, setPronouncingReversed] = useState(false);
  const [kissReversed, setKissReversed] = useState(false);

  const currentPartner2Name = partner2Name || "Partner 2";
  const currentPartner1Name = partner1Name || "Partner 1";

  // Get names based on toggle states
  const getRitualNames = () =>
    ritualReversed
      ? { first: currentPartner1Name, second: currentPartner2Name }
      : { first: currentPartner2Name, second: currentPartner1Name };
  const getClosingNames = () =>
    closingReversed
      ? { first: currentPartner1Name, second: currentPartner2Name }
      : { first: currentPartner2Name, second: currentPartner1Name };
  const getPronouncingNames = () =>
    pronouncingReversed
      ? { first: currentPartner1Name, second: currentPartner2Name }
      : { first: currentPartner2Name, second: currentPartner1Name };
  const getKissNames = () =>
    kissReversed
      ? { first: currentPartner1Name, second: currentPartner2Name }
      : { first: currentPartner2Name, second: currentPartner1Name };

  const showSwitch =
    currentPartner1Name !== "Partner 1" && currentPartner2Name !== "Partner 2";

  const handleRitualSelection = (ritualType: string) => {
    setValue("ritualsSelection", ritualType);
    onSelectDropdown("ritualsSelection", ritualType);
    setValue("ritualsOption", "");
    onSelectDropdown("ritualsOption", "");
  };

  const handleSelection = (fieldName: string, optionId: string) => {
    let options;
    switch (fieldName) {
      case "ritualsOption":
        options = currentRitualOptions;
        break;
      case "closingStatement":
        options = closingOptions;
        break;
      case "pronouncing":
        options = pronouncingOptions;
        break;
      case "kiss":
        options = kissOptions;
        break;
      case "introductionOfCouple":
        options = introductionOptions;
        break;
      default:
        return;
    }

    const option = options.find((opt) => opt.id === optionId);
    if (option) {
      const content = replaceNames(
        option.content,
        partner1Name || "Partner 1's Name",
        partner2Name || "Partner 2's Name"
      );
      setValue(fieldName as keyof CeremonyFormData, content);
      onSelectDropdown(fieldName, content);
    }
  };

  const handleModalSelect = (optionId: string) => {
    const fieldName = getFieldForOptionId(optionId);
    if (fieldName) {
      handleSelection(fieldName, optionId);
    }
  };

  const currentRitual = watch("ritualsSelection");
  const currentRitualOptions = getRitualOptions(currentRitual || "");

  return (
    <div className="space-y-6">
      {/* Ritual Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Ritual Selection
        </label>
        <input type="hidden" {...register("ritualsSelection")} />
        <CustomDropdown
          name="ritualsSelection"
          options={ritualTypes}
          value={watch("ritualsSelection")}
          placeholder="Select a ritual"
          isOpen={openDropdowns.ritualsSelection || false}
          onToggle={() => onToggleDropdown("ritualsSelection")}
          onSelect={(_name, value) => handleRitualSelection(value)}
        />
      </div>

      {/* Ritual Options - Only show if a ritual is selected */}
      {currentRitual && currentRitualOptions.length > 0 && (
        <RitualOptionSection
          label={`${currentRitual} for `}
          fieldName="ritualsOption"
          options={currentRitualOptions}
          register={register}
          watch={watch}
          partner1Name={partner1Name || "Partner 1's Name"}
          partner2Name={partner2Name || "Partner 2's Name"}
          firstName={getRitualNames().first}
          secondName={getRitualNames().second}
          isReversed={ritualReversed}
          onToggleReverse={() => setRitualReversed(!ritualReversed)}
          showSwitch={showSwitch}
          openDropdowns={openDropdowns}
          onToggleDropdown={onToggleDropdown}
          onSelect={handleSelection}
          onPreview={(id) => setSelectedModal(id)}
          placeholder={`Select ${currentRitual.toLowerCase()} option`}
        />
      )}

      {/* Closing Statement */}
      <RitualOptionSection
        label="Closing Statement for "
        fieldName="closingStatement"
        options={closingOptions}
        register={register}
        watch={watch}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        firstName={getClosingNames().first}
        secondName={getClosingNames().second}
        isReversed={closingReversed}
        onToggleReverse={() => setClosingReversed(!closingReversed)}
        showSwitch={showSwitch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelect={handleSelection}
        onPreview={(id) => setSelectedModal(id)}
        placeholder="Select closing statement"
      />

      {/* Pronouncing */}
      <RitualOptionSection
        label="Pronouncing "
        fieldName="pronouncing"
        options={pronouncingOptions}
        register={register}
        watch={watch}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        firstName={getPronouncingNames().first}
        secondName={getPronouncingNames().second}
        isReversed={pronouncingReversed}
        onToggleReverse={() => setPronouncingReversed(!pronouncingReversed)}
        showSwitch={showSwitch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelect={handleSelection}
        onPreview={(id) => setSelectedModal(id)}
        placeholder="Select pronouncement option"
      />

      {/* Kiss */}
      <RitualOptionSection
        label="Kiss between "
        fieldName="kiss"
        options={kissOptions}
        register={register}
        watch={watch}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        firstName={getKissNames().first}
        secondName={getKissNames().second}
        isReversed={kissReversed}
        onToggleReverse={() => setKissReversed(!kissReversed)}
        showSwitch={showSwitch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelect={handleSelection}
        onPreview={(id) => setSelectedModal(id)}
        placeholder="Select kiss option"
      />

      {/* Introduction of Couple */}
      <RitualOptionSection
        label="Introduction of Couple"
        fieldName="introductionOfCouple"
        options={introductionOptions}
        register={register}
        watch={watch}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        firstName=""
        secondName=""
        isReversed={false}
        onToggleReverse={() => {}}
        showSwitch={false}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelect={handleSelection}
        onPreview={(id) => setSelectedModal(id)}
        placeholder="Select couple introduction option"
        labelVariant="large"
      />

      {/* Modal for Option Preview */}
      {selectedModal && (
        <RitualPreviewModal
          selectedModal={selectedModal}
          partner1Name={watch("groomName") || partner1Name || ""}
          partner2Name={watch("brideName") || partner2Name || ""}
          onClose={() => setSelectedModal(null)}
          onSelect={handleModalSelect}
        />
      )}
    </div>
  );
};

export default RitualsStep;
