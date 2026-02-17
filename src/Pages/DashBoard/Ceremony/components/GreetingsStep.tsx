import { useState } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { CeremonyFormData } from "../types";
import CustomDropdown from "./CustomDropdown";
import { useCeremonyContext } from "../contexts/CeremonyContext";
import { FaExchangeAlt } from "react-icons/fa";

import {
  greetingOptions,
  presentationOptions,
  questionOptions,
  responseOptions,
  invocationOptions,
} from "./greetingsStep/greetingOptionsData";
import type { GreetingOption } from "./greetingsStep/greetingOptionsData";
import OptionSection from "./greetingsStep/OptionSection";
import PreviewModal from "./greetingsStep/PreviewModal";

interface GreetingsStepProps {
  register: UseFormRegister<CeremonyFormData>;
  watch: (field: keyof CeremonyFormData) => any;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

const GreetingsStep = ({
  watch,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: GreetingsStepProps) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const { partner1Name, partner2Name } = useCeremonyContext();

  // Local state for individual field toggles
  const [presentationReversed, setPresentationReversed] = useState(false);
  const [questionReversed, setQuestionReversed] = useState(false);

  const currentPartner2Name = partner2Name || "Partner 2";
  const currentPartner1Name = partner1Name || "Partner 1";

  // Get presentation names based on toggle
  const getPresentationName = () =>
    presentationReversed ? currentPartner1Name : currentPartner2Name;
  const getQuestionName = () =>
    questionReversed ? currentPartner1Name : currentPartner2Name;

  const handleSelection = (fieldName: string, optionId: string) => {
    const optionMap: Record<string, GreetingOption[]> = {
      greetingSpeech: greetingOptions,
      presentationOfBride: presentationOptions,
      questionForPresentation: questionOptions,
      responseToQuestion: responseOptions,
      invocation: invocationOptions,
    };

    const options = optionMap[fieldName];
    const option = options?.find((opt) => opt.id === optionId);
    if (option) {
      const p2 = partner2Name || "Partner 2's Name";
      const p1 = partner1Name || "Partner 1's Name";
      const content = option.content
        .replace(/{bride_name}/g, p2)
        .replace(/{groom_name}/g, p1);
      onSelectDropdown(fieldName, content);
    }
  };

  const handleModalSelect = (fieldName: string, optionId: string) => {
    handleSelection(fieldName, optionId);
  };

  // Build switch button for presentation / question sections
  const buildSwitchButton = (
    isReversed: boolean,
    onToggle: () => void,
  ) => {
    if (
      !currentPartner1Name ||
      !currentPartner2Name ||
      currentPartner1Name === "Partner 1" ||
      currentPartner2Name === "Partner 2"
    )
      return undefined;

    return (
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
        title={`Switch to ${isReversed ? currentPartner2Name : currentPartner1Name}`}
      >
        <FaExchangeAlt className="text-xs" />
        <span>Switch</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Language
        </label>
        <CustomDropdown
          name="language"
          options={["English", "spanish"]}
          value={watch("language") || ""}
          placeholder="Select language"
          isOpen={openDropdowns.language || false}
          onToggle={() => onToggleDropdown("language")}
          onSelect={(name, value) => onSelectDropdown(name, value)}
        />
      </div>

      {/* Greeting Speech */}
      <OptionSection
        label="Greeting Speech"
        fieldName="greetingSpeech"
        options={greetingOptions}
        watchValue={watch("greetingSpeech") || ""}
        partner1Name={partner1Name}
        partner2Name={partner2Name}
        isOpen={openDropdowns.greetingSpeech || false}
        onToggle={() => onToggleDropdown("greetingSpeech")}
        onSelect={(optionId) => handleSelection("greetingSpeech", optionId)}
        onPreview={(optionId) => setSelectedModal(optionId)}
      />

      {/* Additional Greeting Elements */}
      <div className="grid grid-cols-1 gap-6">
        {/* Presentation */}
        <OptionSection
          label={`Presentation of ${getPresentationName()}`}
          fieldName="presentationOfBride"
          options={presentationOptions}
          watchValue={watch("presentationOfBride") || ""}
          partner1Name={partner1Name}
          partner2Name={partner2Name}
          isOpen={openDropdowns.presentationOfBride || false}
          onToggle={() => onToggleDropdown("presentationOfBride")}
          onSelect={(optionId) =>
            handleSelection("presentationOfBride", optionId)
          }
          onPreview={(optionId) => setSelectedModal(optionId)}
          headerRight={buildSwitchButton(presentationReversed, () =>
            setPresentationReversed(!presentationReversed),
          )}
        />

        {/* Question for Presentation */}
        <OptionSection
          label={`Question for Presentation of ${getQuestionName()}`}
          fieldName="questionForPresentation"
          options={questionOptions}
          watchValue={watch("questionForPresentation") || ""}
          partner1Name={partner1Name}
          partner2Name={partner2Name}
          isOpen={openDropdowns.questionForPresentation || false}
          onToggle={() => onToggleDropdown("questionForPresentation")}
          onSelect={(optionId) =>
            handleSelection("questionForPresentation", optionId)
          }
          onPreview={(optionId) => setSelectedModal(optionId)}
          headerRight={buildSwitchButton(questionReversed, () =>
            setQuestionReversed(!questionReversed),
          )}
        />

        {/* Response to Question */}
        <OptionSection
          label="Response to the Question"
          fieldName="responseToQuestion"
          options={responseOptions}
          watchValue={watch("responseToQuestion") || ""}
          partner1Name={partner1Name}
          partner2Name={partner2Name}
          isOpen={openDropdowns.responseToQuestion || false}
          onToggle={() => onToggleDropdown("responseToQuestion")}
          onSelect={(optionId) =>
            handleSelection("responseToQuestion", optionId)
          }
          onPreview={(optionId) => setSelectedModal(optionId)}
        />

        {/* Invocation */}
        <OptionSection
          label="Invocation (Opening Prayer)"
          fieldName="invocation"
          options={invocationOptions}
          watchValue={watch("invocation") || ""}
          partner1Name={partner1Name}
          partner2Name={partner2Name}
          isOpen={openDropdowns.invocation || false}
          onToggle={() => onToggleDropdown("invocation")}
          onSelect={(optionId) => handleSelection("invocation", optionId)}
          onPreview={(optionId) => setSelectedModal(optionId)}
        />
      </div>

      {/* Preview Modal */}
      {selectedModal && (
        <PreviewModal
          selectedModal={selectedModal}
          partner1Name={watch("groomName") || partner1Name || ""}
          partner2Name={watch("brideName") || partner2Name || ""}
          onClose={() => setSelectedModal(null)}
          onSelectOption={handleModalSelect}
        />
      )}
    </div>
  );
};

export default GreetingsStep;
