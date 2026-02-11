import { useState } from "react";
import type { CeremonyFormData } from "../types";
import type { UseFormRegister } from "react-hook-form";
import { useCeremonyContext } from "../contexts/CeremonyContext";
import {
  chargeOptions,
  pledgeOptions,
  vowIntroOptions,
  vowOptions,
  readingOptions,
  ringIntroOptions,
  ringBlessingOptions,
  ringExchangeGroomOptions,
  ringExchangeBrideOptions,
  prayerOptions,
  replaceNames,
  getOptionsForField,
} from "./vowsStep/vowOptionsData";
import VowOptionSection from "./vowsStep/VowOptionSection";
import VowPreviewModal from "./vowsStep/VowPreviewModal";

interface VowsStepProps {
  register: UseFormRegister<CeremonyFormData>;
  watch: (name: keyof CeremonyFormData) => string;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

const VowsStep = ({
  watch,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: VowsStepProps) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const { partner1Name, partner2Name } = useCeremonyContext();

  // Individual toggle states for each field
  const [chargeReversed, setChargeReversed] = useState(false);
  const [pledgeReversed, setPledgeReversed] = useState(false);
  const [vowIntroReversed, setVowIntroReversed] = useState(false);
  const [vowReversed, setVowReversed] = useState(false);
  const [ringIntroReversed, setRingIntroReversed] = useState(false);
  const [ringBlessingReversed, setRingBlessingReversed] = useState(false);
  const [prayerReversed, setPrayerReversed] = useState(false);

  const p1 = partner1Name || "Partner 1";
  const p2 = partner2Name || "Partner 2";

  // Get names based on each field's toggle state
  const getNames = (reversed: boolean) =>
    reversed ? { first: p1, second: p2 } : { first: p2, second: p1 };

  const chargeNames = getNames(chargeReversed);
  const pledgeNames = getNames(pledgeReversed);
  const vowIntroNames = getNames(vowIntroReversed);
  const vowNames = getNames(vowReversed);
  const ringIntroNames = getNames(ringIntroReversed);
  const ringBlessingNames = getNames(ringBlessingReversed);
  const prayerNames = getNames(prayerReversed);

  const handleSelection = (fieldName: string, optionId: string) => {
    const options = getOptionsForField(fieldName);
    const option = options.find((opt) => opt.id === optionId);
    if (option) {
      const content = replaceNames(
        option.content,
        partner1Name || "Partner 1's Name",
        partner2Name || "Partner 2's Name"
      );
      onSelectDropdown(fieldName, content);
    }
  };

  return (
    <div className="space-y-6">
      {/* Charge to Groom and Bride */}
      <VowOptionSection
        label={`Charge to ${chargeNames.first} and ${chargeNames.second}`}
        fieldName="chargeToGroomAndBride"
        options={chargeOptions}
        placeholder="Select charge option"
        watch={watch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelectOption={handleSelection}
        onOpenModal={setSelectedModal}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        showSwitch
        onToggleReversed={() => setChargeReversed(!chargeReversed)}
        switchTitle={`Switch to ${chargeReversed ? p2 : p1} and ${chargeReversed ? p1 : p2}`}
      />

      {/* Pledge */}
      <VowOptionSection
        label={`Pledge from ${pledgeNames.first} and ${pledgeNames.second}`}
        fieldName="pledge"
        options={pledgeOptions}
        placeholder="Select pledge option"
        watch={watch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelectOption={handleSelection}
        onOpenModal={setSelectedModal}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        showSwitch
        onToggleReversed={() => setPledgeReversed(!pledgeReversed)}
        switchTitle={`Switch to ${pledgeReversed ? p2 : p1} and ${pledgeReversed ? p1 : p2}`}
      />

      {/* Introduction to Exchange of Vows */}
      <VowOptionSection
        label={`Introduction to Exchange of Vows (${vowIntroNames.first} & ${vowIntroNames.second})`}
        fieldName="introductionToExchangeOfVows"
        options={vowIntroOptions}
        placeholder="Select vow introduction option"
        watch={watch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelectOption={handleSelection}
        onOpenModal={setSelectedModal}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        showSwitch
        onToggleReversed={() => setVowIntroReversed(!vowIntroReversed)}
        switchTitle={`Switch to ${vowIntroReversed ? p2 : p1} & ${vowIntroReversed ? p1 : p2}`}
      />

      {/* Vows */}
      <VowOptionSection
        label={`Vows from ${vowNames.first} to ${vowNames.second}`}
        fieldName="vows"
        options={vowOptions}
        placeholder="Select vow option"
        watch={watch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelectOption={handleSelection}
        onOpenModal={setSelectedModal}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        showSwitch
        onToggleReversed={() => setVowReversed(!vowReversed)}
        switchTitle={`Switch to ${vowReversed ? p2 : p1} to ${vowReversed ? p1 : p2}`}
      />

      {/* Readings */}
      <VowOptionSection
        label="Readings (Optional)"
        fieldName="readings"
        options={readingOptions}
        placeholder="Select reading option"
        watch={watch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelectOption={handleSelection}
        onOpenModal={setSelectedModal}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
      />

      {/* Introduction to Exchange of Rings */}
      <VowOptionSection
        label={`Introduction to Exchange of Rings (${ringIntroNames.first} & ${ringIntroNames.second})`}
        fieldName="introductionToExchangeOfRings"
        options={ringIntroOptions}
        placeholder="Select ring introduction option"
        watch={watch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelectOption={handleSelection}
        onOpenModal={setSelectedModal}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        showSwitch
        onToggleReversed={() => setRingIntroReversed(!ringIntroReversed)}
        switchTitle={`Switch to ${ringIntroReversed ? p2 : p1} & ${ringIntroReversed ? p1 : p2}`}
      />

      {/* Blessings of Rings */}
      <VowOptionSection
        label={`Blessings of Rings for ${ringBlessingNames.first} & ${ringBlessingNames.second}`}
        fieldName="blessingsOfRings"
        options={ringBlessingOptions}
        placeholder="Select ring blessing option"
        watch={watch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelectOption={handleSelection}
        onOpenModal={setSelectedModal}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        showSwitch
        onToggleReversed={() => setRingBlessingReversed(!ringBlessingReversed)}
        switchTitle={`Switch to ${ringBlessingReversed ? p2 : p1} & ${ringBlessingReversed ? p1 : p2}`}
      />

      {/* Exchange of Rings - Groom */}
      <VowOptionSection
        label={`Exchange of Rings - ${p1} to ${p2}`}
        fieldName="exchangeOfRingsGroom"
        options={ringExchangeGroomOptions}
        placeholder="Select groom's ring exchange option"
        watch={watch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelectOption={handleSelection}
        onOpenModal={setSelectedModal}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
      />

      {/* Exchange of Rings - Bride */}
      <VowOptionSection
        label={`Exchange of Rings - ${p2} to ${p1}`}
        fieldName="exchangeOfRingsBride"
        options={ringExchangeBrideOptions}
        placeholder="Select bride's ring exchange option"
        watch={watch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelectOption={handleSelection}
        onOpenModal={setSelectedModal}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
      />

      {/* Prayer on the New Union */}
      <VowOptionSection
        label={`Prayer for ${prayerNames.first} & ${prayerNames.second}'s Union`}
        fieldName="prayerOnTheNewUnion"
        options={prayerOptions}
        placeholder="Select prayer option"
        watch={watch}
        openDropdowns={openDropdowns}
        onToggleDropdown={onToggleDropdown}
        onSelectOption={handleSelection}
        onOpenModal={setSelectedModal}
        partner1Name={partner1Name || "Partner 1's Name"}
        partner2Name={partner2Name || "Partner 2's Name"}
        showSwitch
        onToggleReversed={() => setPrayerReversed(!prayerReversed)}
        switchTitle={`Switch to ${prayerReversed ? p2 : p1} & ${prayerReversed ? p1 : p2}`}
      />

      {/* Modal for Option Preview */}
      {selectedModal && (
        <VowPreviewModal
          selectedModal={selectedModal}
          partner1Name={partner1Name || "Partner 1's Name"}
          partner2Name={partner2Name || "Partner 2's Name"}
          onClose={() => setSelectedModal(null)}
          onSelect={handleSelection}
        />
      )}
    </div>
  );
};

export default VowsStep;
