import { useState } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { CeremonyFormData } from "../types";
import CustomDropdown from "./CustomDropdown";
import { useCeremonyContext } from "../contexts/CeremonyContext";

interface RitualsStepProps {
  register: UseFormRegister<CeremonyFormData>;
  watch: (name: keyof CeremonyFormData) => string;
  setValue: (name: keyof CeremonyFormData, value: string) => void;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

interface RitualOption {
  id: string;
  label: string;
  content: string;
}

// Ritual Types
const ritualTypes = [
  "Sand Ceremony",
  "Rose Ceremony",
  "Unity Candle",
  "Ring Warming",
  "Handfasting",
  "Wine Ceremony",
];

// Sand Ceremony Options
const sandCeremonyOptions: RitualOption[] = [
  {
    id: "sand1",
    label: "Sand Ceremony Option 1",
    content:
      "{groom_name} and {bride_name}, today you are making a life-long commitment to share the rest of your lives with each other. Your relationship is symbolized through the pouring of these two individual containers of sand.",
  },
  {
    id: "sand2",
    label: "Sand Ceremony Option 2",
    content:
      "{groom_name} and {bride_name}, the two separate bottles of sand represent your lives until this moment; individual and unique. As you now combine your sand together, your lives also join together as one.",
  },
  {
    id: "sand3",
    label: "Sand Ceremony Option 3",
    content:
      "{groom_name} and {bride_name}, today you are making a life-long commitment to share the rest of your lives with each other. Your relationship is symbolized through the pouring of these two individual containers of sand; one, representing you, {groom_name} (he pours a portion of his sand in vase) and all that you were, all that you are, and all that you will ever be, and the other representing you, {bride_name}, (she pours a portion of her sand on top {groom_name}'s sand) and all that you were and all that you are, and all that you will ever be. Each one holds its own unique beauty, strength, and character. They can stand on their own and be whole, without the need of anything else. When the two are blended together they represent an entirely new and extraordinary love relationship. Each grain of sand brings to the mixture a lasting beauty that forever enriches the combination. (Both {groom_name} & {bride_name} together pour their remaining sand in the central vase) As you each hold your sand the separate containers of sand represent your lives to this moment; individual and unique. As you now combine your sand together, your lives also join together as one. The life that each of you have experienced until now, individually, will hereafter be inseparably united, for the two shall become one. Just as these grains of sand can never be separated and poured again into the individual containers, so will your union be.",
  },
];

// Rose Ceremony Options
const roseCeremonyOptions: RitualOption[] = [
  {
    id: "rose1",
    label: "Rose Ceremony Option 1",
    content:
      "{groom_name} and {bride_name}, you have given and received a rose. This is your first gift as a married couple. In the future, whenever you give or receive a bouquet of roses, remember this moment and the love you pledged today.",
  },
  {
    id: "rose2",
    label: "Rose Ceremony Option 2",
    content:
      "The rose is a symbol of love, beauty, and new beginnings. {groom_name} and {bride_name}, as you exchange these roses, you exchange your promise to love, honor, and cherish each other.",
  },
  {
    id: "rose3",
    label: "Rose Ceremony Option 3",
    content:
      "{groom_name} and {bride_name}, the red rose is a symbol of love and passion. By exchanging these roses, you are giving each other your first gift as a married couple and promising that even in times of difficulty, you will remember this love.",
  },
];

// Unity Candle Options
const unityCandleOptions: RitualOption[] = [
  {
    id: "candle1",
    label: "Unity Candle Option 1",
    content:
      "{groom_name} and {bride_name}, the two candles you each hold represent your individual lives, your families, and your friends. When you light the center candle together, you are joining your lives, but not extinguishing your individuality.",
  },
  {
    id: "candle2",
    label: "Unity Candle Option 2",
    content:
      "The lighting of the Unity Candle symbolizes the joining of {groom_name} and {bride_name}'s lives. As you light this candle together, may the light of your love shine brightly for all to see.",
  },
  {
    id: "candle3",
    label: "Unity Candle Option 3",
    content:
      "{groom_name} and {bride_name}, from every human being there rises a light that reaches straight to heaven. When two souls that are destined for each other find one another, their streams of light flow together and a single brighter light goes forth from their united being.",
  },
];

// Closing Statement Options
const closingOptions: RitualOption[] = [
  {
    id: "closing1",
    label: "Traditional Closing",
    content:
      "May your marriage be filled with love, laughter, and happiness. May you always find in each other your best friend and your greatest love.",
  },
  {
    id: "closing2",
    label: "Blessing Closing",
    content:
      "May the love that has brought {groom_name} and {bride_name} together continue to grow and flourish throughout their married life. May they always support each other and find joy in their union.",
  },
  {
    id: "closing3",
    label: "Heartfelt Closing",
    content:
      "{groom_name} and {bride_name}, as you begin this wonderful journey together, remember that love is not just a feeling, but a choice you make each day. Choose love, choose kindness, and choose each other.",
  },
];

// Pronouncing Options
const pronouncingOptions: RitualOption[] = [
  {
    id: "pronounce1",
    label: "Traditional Pronouncement",
    content:
      "By the power vested in me, I now pronounce you husband and wife. What God has joined together, let no one separate.",
  },
  {
    id: "pronounce2",
    label: "Modern Pronouncement",
    content:
      "By the authority vested in me, and in the presence of your family and friends, I now pronounce you married. You are now husband and wife.",
  },
  {
    id: "pronounce3",
    label: "Heartfelt Pronouncement",
    content:
      "{groom_name} and {bride_name}, having pledged your love and commitment to each other before these witnesses, I am delighted to pronounce you husband and wife.",
  },
];

// Kiss Options
const kissOptions: RitualOption[] = [
  {
    id: "kiss1",
    label: "Traditional Kiss",
    content: "You may now kiss your bride!",
  },
  {
    id: "kiss2",
    label: "Modern Kiss",
    content: "You may now kiss each other as married partners!",
  },
  {
    id: "kiss3",
    label: "Romantic Kiss",
    content: "{groom_name}, you may now kiss {bride_name}, your wife!",
  },
];

// Introduction of Couple Options
const introductionOptions: RitualOption[] = [
  {
    id: "intro1",
    label: "Traditional Introduction",
    content:
      "Ladies and gentlemen, it is my great pleasure to present to you for the first time as a married couple, Mr. and Mrs. {groom_name} {bride_name}!",
  },
  {
    id: "intro2",
    label: "Modern Introduction",
    content:
      "Family and friends, please join me in celebrating the newly married couple, {groom_name} and {bride_name}!",
  },
  {
    id: "intro3",
    label: "Casual Introduction",
    content:
      "Everyone, please give a warm welcome to the happy couple, {groom_name} and {bride_name}!",
  },
];

const RitualsStep = ({
  register,
  watch,
  setValue,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: RitualsStepProps) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const { groomName, brideName } = useCeremonyContext();

  const openModal = (optionId: string) => {
    setSelectedModal(optionId);
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  const handleRitualSelection = (ritualType: string) => {
    // Use setValue for proper React Hook Form integration
    setValue("ritualsSelection", ritualType);
    onSelectDropdown("ritualsSelection", ritualType);
    // Clear the ritual option when a different ritual is selected
    setValue("ritualsOption", "");
    onSelectDropdown("ritualsOption", "");
  };

  const handleSelection = (fieldName: string, optionId: string) => {
    // Find the option and get its content with name replacements
    let options: RitualOption[] = [];
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
    }
    
    const option = options.find(opt => opt.id === optionId);
    if (option) {
      const currentBrideName = brideName || "Bride's Name";
      const currentGroomName = groomName || "Groom's Name";
      const content = option.content
        .replace(/{bride_name}/g, currentBrideName)
        .replace(/{groom_name}/g, currentGroomName);
      
      // Use setValue for proper React Hook Form integration
      setValue(fieldName as keyof CeremonyFormData, content);
      onSelectDropdown(fieldName, content);
    }
  };

  const getOptionContent = (
    options: RitualOption[],
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

  // Get the current ritual selection to determine which options to show
  const currentRitual = watch("ritualsSelection");

  const getRitualOptions = (ritualType: string): RitualOption[] => {
    switch (ritualType) {
      case "Sand Ceremony":
        return sandCeremonyOptions;
      case "Rose Ceremony":
        return roseCeremonyOptions;
      case "Unity Candle":
        return unityCandleOptions;
      default:
        return [];
    }
  };

  const currentRitualOptions = getRitualOptions(currentRitual || "");

  return (
    <div className="space-y-6">
      {/* Ritual Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Ritual Selection
        </label>
        {/* Hidden input for form registration */}
        <input
          type="hidden"
          {...register("ritualsSelection")}
        />
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
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            {currentRitual} Options
          </label>
          <div className="space-y-3">
            {/* Hidden input for form registration */}
            <input
              type="hidden"
              {...register("ritualsOption")}
            />
            <CustomDropdown
              name="ritualsOption"
              options={currentRitualOptions.map((opt) => opt.label)}
              value={(() => {
                const currentContent = watch("ritualsOption");
                if (!currentContent) return "";
                const currentBrideName = brideName || "Bride's Name";
                const currentGroomName = groomName || "Groom's Name";
                const currentOption = currentRitualOptions.find((opt) => {
                  const optionContent = opt.content
                    .replace(/{bride_name}/g, currentBrideName)
                    .replace(/{groom_name}/g, currentGroomName);
                  return optionContent === currentContent;
                });
                return currentOption?.label || "";
              })()}
              placeholder={`Select ${currentRitual.toLowerCase()} option`}
              isOpen={openDropdowns.ritualsOption || false}
              onToggle={() => onToggleDropdown("ritualsOption")}
              onSelect={(_name, value) => {
                const option = currentRitualOptions.find(
                  (opt) => opt.label === value
                );
                if (option) handleSelection("ritualsOption", option.id);
              }}
            />
            <div className="flex gap-2 flex-wrap">
              {currentRitualOptions.map((option) => (
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
      )}

      {/* Closing Statement */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Closing Statement
        </label>
        <div className="space-y-3">
          {/* Hidden input for form registration */}
          <input
            type="hidden"
            {...register("closingStatement")}
          />
          <CustomDropdown
            name="closingStatement"
            options={closingOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("closingStatement");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = closingOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select closing statement"
            isOpen={openDropdowns.closingStatement || false}
            onToggle={() => onToggleDropdown("closingStatement")}
            onSelect={(_name, value) => {
              const option = closingOptions.find((opt) => opt.label === value);
              if (option) handleSelection("closingStatement", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {closingOptions.map((option) => (
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

      {/* Pronouncing */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Pronouncing
        </label>
        <div className="space-y-3">
          {/* Hidden input for form registration */}
          <input
            type="hidden"
            {...register("pronouncing")}
          />
          <CustomDropdown
            name="pronouncing"
            options={pronouncingOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("pronouncing");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = pronouncingOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select pronouncement option"
            isOpen={openDropdowns.pronouncing || false}
            onToggle={() => onToggleDropdown("pronouncing")}
            onSelect={(_name, value) => {
              const option = pronouncingOptions.find(
                (opt) => opt.label === value
              );
              if (option) handleSelection("pronouncing", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {pronouncingOptions.map((option) => (
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

      {/* Kiss */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Kiss
        </label>
        <div className="space-y-3">
          {/* Hidden input for form registration */}
          <input
            type="hidden"
            {...register("kiss")}
          />
          <CustomDropdown
            name="kiss"
            options={kissOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("kiss");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = kissOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select kiss option"
            isOpen={openDropdowns.kiss || false}
            onToggle={() => onToggleDropdown("kiss")}
            onSelect={(_name, value) => {
              const option = kissOptions.find((opt) => opt.label === value);
              if (option) handleSelection("kiss", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {kissOptions.map((option) => (
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

      {/* Introduction of Couple */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Introduction of Couple
        </label>
        <div className="space-y-3">
          {/* Hidden input for form registration */}
          <input
            type="hidden"
            {...register("introductionOfCouple")}
          />
          <CustomDropdown
            name="introductionOfCouple"
            options={introductionOptions.map((opt) => opt.label)}
            value={(() => {
              const currentContent = watch("introductionOfCouple");
              if (!currentContent) return "";
              const currentBrideName = brideName || "Bride's Name";
              const currentGroomName = groomName || "Groom's Name";
              const currentOption = introductionOptions.find((opt) => {
                const optionContent = opt.content
                  .replace(/{bride_name}/g, currentBrideName)
                  .replace(/{groom_name}/g, currentGroomName);
                return optionContent === currentContent;
              });
              return currentOption?.label || "";
            })()}
            placeholder="Select couple introduction option"
            isOpen={openDropdowns.introductionOfCouple || false}
            onToggle={() => onToggleDropdown("introductionOfCouple")}
            onSelect={(_name, value) => {
              const option = introductionOptions.find(
                (opt) => opt.label === value
              );
              if (option) handleSelection("introductionOfCouple", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {introductionOptions.map((option) => (
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

      {/* Modal for Option Preview */}
      {selectedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {(() => {
                    const allOptions = [
                      ...sandCeremonyOptions,
                      ...roseCeremonyOptions,
                      ...unityCandleOptions,
                      ...closingOptions,
                      ...pronouncingOptions,
                      ...kissOptions,
                      ...introductionOptions,
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
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {(() => {
                    const currentBrideName =
                      watch("brideName") || brideName || "";
                    const currentGroomName =
                      watch("groomName") || groomName || "";

                    // Check which option type this is and get content
                    if (
                      sandCeremonyOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        sandCeremonyOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      roseCeremonyOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        roseCeremonyOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      unityCandleOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        unityCandleOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      closingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        closingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      pronouncingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        pronouncingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      kissOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        kissOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      introductionOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        introductionOptions,
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
                    // Determine which field this option belongs to and select it
                    if (
                      sandCeremonyOptions.find(
                        (opt) => opt.id === selectedModal
                      ) ||
                      roseCeremonyOptions.find(
                        (opt) => opt.id === selectedModal
                      ) ||
                      unityCandleOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("ritualsOption", selectedModal);
                    } else if (
                      closingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("closingStatement", selectedModal);
                    } else if (
                      pronouncingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("pronouncing", selectedModal);
                    } else if (
                      kissOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("kiss", selectedModal);
                    } else if (
                      introductionOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      handleSelection("introductionOfCouple", selectedModal);
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

export default RitualsStep;
