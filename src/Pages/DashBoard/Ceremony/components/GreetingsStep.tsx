import { useState } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { CeremonyFormData } from "../types";
import CustomDropdown from "./CustomDropdown";
import { useCeremonyContext } from "../contexts/CeremonyContext";

interface GreetingsStepProps {
  register: UseFormRegister<CeremonyFormData>;
  watch: (field: keyof CeremonyFormData) => any;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

interface GreetingOption {
  id: string;
  label: string;
  content: string;
}

const greetingOptions: GreetingOption[] = [
  {
    id: "option1",
    label: "Option 1",
    content:
      "We gather here today to celebrate one of life's greatest moments, to give recognition to the worth and beauty of love, and to add our best wishes to the words which shall unite {bride_name} and {groom_name} in their marriage",
  },
  {
    id: "option2",
    label: "Option 2",
    content:
      "Friends and family, we are gathered here today to witness and celebrate the union of {bride_name} and {groom_name} in marriage. Today marks the beginning of their journey as husband and wife.",
  },
  {
    id: "option3",
    label: "Option 3",
    content:
      "Dearly beloved, we have come together in the presence of family and friends to join {bride_name} and {groom_name} in holy matrimony, which is an honorable estate, instituted by God.",
  },
];

const presentationOptions: GreetingOption[] = [
  {
    id: "presentation1",
    label: "Traditional",
    content: "Who gives {bride_name} to be married to {groom_name}?",
  },
  {
    id: "presentation2",
    label: "Modern",
    content: "Who presents {bride_name} to marry {groom_name} today?",
  },
  {
    id: "presentation3",
    label: "Family Support",
    content: "Who supports {bride_name} in her decision to marry {groom_name}?",
  },
];

const questionOptions: GreetingOption[] = [
  {
    id: "question1",
    label: "Traditional Question",
    content:
      "Do you, representing {bride_name}'s family, give your blessing for this union?",
  },
  {
    id: "question2",
    label: "Support Question",
    content:
      "Do you promise to support {bride_name} and {groom_name} in their marriage?",
  },
  {
    id: "question3",
    label: "Blessing Question",
    content:
      "Do you offer your love and support to this couple as they begin their married life?",
  },
];

const responseOptions: GreetingOption[] = [
  {
    id: "response1",
    label: "Traditional Response",
    content: "I do, with love and blessing.",
  },
  {
    id: "response2",
    label: "Family Response",
    content: "We do, with all our love and support.",
  },
  {
    id: "response3",
    label: "Heartfelt Response",
    content: "Yes, with joy in our hearts and confidence in their love.",
  },
];

const invocationOptions: GreetingOption[] = [
  {
    id: "invocation1",
    label: "Traditional Prayer",
    content:
      "Let us pray: Heavenly Father, we ask for your blessing upon {bride_name} and {groom_name} as they unite in marriage. May their love be strengthened by your grace and their bond be blessed with happiness, understanding, and faith. Amen.",
  },
  {
    id: "invocation2",
    label: "Universal Blessing",
    content:
      "May the love that brings {bride_name} and {groom_name} together today be blessed with joy, peace, and understanding. May their commitment to each other grow stronger with each passing day.",
  },
  {
    id: "invocation3",
    label: "Modern Invocation",
    content:
      "We gather with grateful hearts to witness the union of {bride_name} and {groom_name}. May this ceremony be filled with love, joy, and the promise of a bright future together.",
  },
];

const GreetingsStep = ({
  register,
  watch,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: GreetingsStepProps) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const { groomName, brideName, setGroomName, setBrideName } =
    useCeremonyContext();

  const openModal = (optionId: string) => {
    setSelectedModal(optionId);
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  const handleSelection = (fieldName: string, optionId: string) => {
    // Find the option and get its content with name replacements
    let options: GreetingOption[] = [];
    switch (fieldName) {
      case "greetingSpeech":
        options = greetingOptions;
        break;
      case "presentationOfBride":
        options = presentationOptions;
        break;
      case "questionForPresentation":
        options = questionOptions;
        break;
      case "responseToQuestion":
        options = responseOptions;
        break;
      case "invocation":
        options = invocationOptions;
        break;
    }
    
    const option = options.find(opt => opt.id === optionId);
    if (option) {
      const currentBrideName = brideName || "Bride's Name";
      const currentGroomName = groomName || "Groom's Name";
      const content = option.content
        .replace(/{bride_name}/g, currentBrideName)
        .replace(/{groom_name}/g, currentGroomName);
      onSelectDropdown(fieldName, content);
    }
  };

  const getOptionContent = (
    options: GreetingOption[],
    optionId: string,
    brideNameVal: string,
    groomNameVal: string
  ) => {
    const option = options.find((opt) => opt.id === optionId);
    if (!option) return "";

    return option.content
      .replace(/{bride_name}/g, brideNameVal || "Bride's Name")
      .replace(/{groom_name}/g, groomNameVal || "Groom's Name");
  };

  const handleNameChange = (field: "groom" | "bride", value: string) => {
    if (field === "groom") {
      setGroomName(value);
    } else {
      setBrideName(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Names Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Groom's Name
          </label>
          <input
            {...register("groomName", {
              onChange: (e) => handleNameChange("groom", e.target.value),
            })}
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
            })}
            type="text"
            placeholder="Enter bride's name"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none"
          />
        </div>
      </div>

      {/* Language Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Language
        </label>
        <CustomDropdown
          name="language"
          options={[
            "English",
            "French",
          ]}
          value={watch("language") || ""}
          placeholder="Select language"
          isOpen={openDropdowns.language || false}
          onToggle={() => onToggleDropdown("language")}
          onSelect={(name, value) => onSelectDropdown(name, value)}
        />
      </div>

      {/* Greeting Speech Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Greeting Speech
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="greetingSpeech"
            options={greetingOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("greetingSpeech");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = greetingOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select greeting option"
            isOpen={openDropdowns.greetingSpeech || false}
            onToggle={() => onToggleDropdown("greetingSpeech")}
            onSelect={(value) => {
              const option = greetingOptions.find((opt) => opt.label === value);
              if (option) handleSelection("greetingSpeech", option.id);
            }}
          />

          {/* Modal Buttons for Preview */}
          <div className="flex gap-2 flex-wrap">
            {greetingOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => openModal(option.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                Preview {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Greeting Elements */}
      <div className="grid grid-cols-1 gap-6">
        {/* Presentation of Bride */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Presentation of Bride
          </label>
          <div className="space-y-3">
            <CustomDropdown
              name="presentationOfBride"
              options={presentationOptions.map((opt) => opt.label)}
              value={(() => {
                const currentContent = watch("presentationOfBride");
                if (!currentContent) return "";
                const currentBrideName = brideName || "Bride's Name";
                const currentGroomName = groomName || "Groom's Name";
                const currentOption = presentationOptions.find((opt) => {
                  const optionContent = opt.content
                    .replace(/{bride_name}/g, currentBrideName)
                    .replace(/{groom_name}/g, currentGroomName);
                  return optionContent === currentContent;
                });
                return currentOption?.label || "";
              })()}
              placeholder="Select presentation option"
              isOpen={openDropdowns.presentationOfBride || false}
              onToggle={() => onToggleDropdown("presentationOfBride")}
              onSelect={(value) => {
                const option = presentationOptions.find(
                  (opt) => opt.label === value
                );
                if (option) handleSelection("presentationOfBride", option.id);
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {presentationOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedModal(option.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Preview {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question for Presentation */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Question for Presentation of Bride
          </label>
          <div className="space-y-3">
            <CustomDropdown
              name="questionForPresentation"
              options={questionOptions.map((opt) => opt.label)}
              value={(() => {
                const currentContent = watch("questionForPresentation");
                if (!currentContent) return "";
                const currentBrideName = brideName || "Bride's Name";
                const currentGroomName = groomName || "Groom's Name";
                const currentOption = questionOptions.find((opt) => {
                  const optionContent = opt.content
                    .replace(/{bride_name}/g, currentBrideName)
                    .replace(/{groom_name}/g, currentGroomName);
                  return optionContent === currentContent;
                });
                return currentOption?.label || "";
              })()}
              placeholder="Select question option"
              isOpen={openDropdowns.questionForPresentation || false}
              onToggle={() => onToggleDropdown("questionForPresentation")}
              onSelect={(value) => {
                const option = questionOptions.find(
                  (opt) => opt.label === value
                );
                if (option)
                  handleSelection("questionForPresentation", option.id);
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {questionOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedModal(option.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Preview {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Response to Question */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Response to the Question
          </label>
          <div className="space-y-3">
            <CustomDropdown
              name="responseToQuestion"
              options={responseOptions.map((opt) => opt.label)}
              value={(() => {
                const currentContent = watch("responseToQuestion");
                if (!currentContent) return "";
                const currentBrideName = brideName || "Bride's Name";
                const currentGroomName = groomName || "Groom's Name";
                const currentOption = responseOptions.find((opt) => {
                  const optionContent = opt.content
                    .replace(/{bride_name}/g, currentBrideName)
                    .replace(/{groom_name}/g, currentGroomName);
                  return optionContent === currentContent;
                });
                return currentOption?.label || "";
              })()}
              placeholder="Select response option"
              isOpen={openDropdowns.responseToQuestion || false}
              onToggle={() => onToggleDropdown("responseToQuestion")}
              onSelect={(value) => {
                const option = responseOptions.find(
                  (opt) => opt.label === value
                );
                if (option) handleSelection("responseToQuestion", option.id);
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {responseOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedModal(option.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Preview {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Invocation */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Invocation (Opening Prayer)
          </label>
          <div className="space-y-3">
            <CustomDropdown
              name="invocation"
              options={invocationOptions.map((opt) => opt.label)}
              value={(() => {
                const currentContent = watch("invocation");
                if (!currentContent) return "";
                const currentBrideName = brideName || "Bride's Name";
                const currentGroomName = groomName || "Groom's Name";
                const currentOption = invocationOptions.find((opt) => {
                  const optionContent = opt.content
                    .replace(/{bride_name}/g, currentBrideName)
                    .replace(/{groom_name}/g, currentGroomName);
                  return optionContent === currentContent;
                });
                return currentOption?.label || "";
              })()}
              placeholder="Select invocation option"
              isOpen={openDropdowns.invocation || false}
              onToggle={() => onToggleDropdown("invocation")}
              onSelect={(value) => {
                const option = invocationOptions.find(
                  (opt) => opt.label === value
                );
                if (option) handleSelection("invocation", option.id);
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {invocationOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedModal(option.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Preview {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Option Preview */}
      {selectedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {(() => {
                    const allOptions = [
                      ...greetingOptions,
                      ...presentationOptions,
                      ...questionOptions,
                      ...responseOptions,
                      ...invocationOptions,
                    ];
                    return (
                      allOptions.find((opt) => opt.id === selectedModal)
                        ?.label || "Preview"
                    );
                  })()}{" "}
                  Preview
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">
                  {(() => {
                    const currentBrideName =
                      watch("brideName") || brideName || "";
                    const currentGroomName =
                      watch("groomName") || groomName || "";

                    // Check which option type this is
                    if (
                      greetingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        greetingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      presentationOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        presentationOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      questionOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        questionOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      responseOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        responseOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      invocationOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        invocationOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    }
                    return "";
                  })()}
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Determine which field this option belongs to
                    if (
                      greetingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("greetingSpeech", selectedModal);
                    } else if (
                      presentationOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      handleSelection("presentationOfBride", selectedModal);
                    } else if (
                      questionOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("questionForPresentation", selectedModal);
                    } else if (
                      responseOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("responseToQuestion", selectedModal);
                    } else if (
                      invocationOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("invocation", selectedModal);
                    }
                    closeModal();
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Select This Option
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GreetingsStep;
