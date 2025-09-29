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
  "Unity Candle Ceremony",
  "Sand Ceremony",
  "Handfasting Ceremony",
  "Wine/Cup Ceremony",
  "Rose Ceremony",
  "Ring Warming Ceremony",
  "Tree Planting Ceremony",
  "Stone Ceremony",
  "Oathing Stone Ceremony",
  "Cord of Three Strands",
];

// Sand Ceremony Options
const sandCeremonyOptions: RitualOption[] = [
  {
    id: "sand1",
    label: "Traditional Sand Ceremony",
    content:
      "{groom_name} and {bride_name}, today you are making a life-long commitment to share the rest of your lives with each other. The two separate bottles of sand represent your lives until this moment—individual and unique. As you each hold your sand, remember that they represent everything you were, everything you are, and everything you will ever be. Now, as you pour your sand together, your lives also join together as one. Just as these grains of sand can never be separated and poured again into individual containers, so will your marriage be—an inseparable union of two lives joined in love.",
  },
  {
    id: "sand2",
    label: "Family Sand Ceremony",
    content:
      "{groom_name} and {bride_name}, the sand you hold represents not only yourselves, but also your families, your friends, and all who have shaped you into the people you are today. As you pour your sand together, you unite not just two lives, but two histories, two families, and two futures. This blended sand can never be separated, just as your union will be permanent and unbreakable.",
  },
  {
    id: "sand3",
    label: "Symbolic Sand Ceremony",
    content:
      "Each grain of sand brings to this mixture a lasting beauty that forever enriches the combination. {groom_name}, as you pour your sand, you bring your strength, your dreams, and your love. {bride_name}, as you pour your sand, you bring your grace, your wisdom, and your devotion. Together, you create something entirely new and beautiful—a symbol of your united love that will endure through all the seasons of your life together.",
  },
  {
    id: "sand4",
    label: "Spiritual Sand Ceremony",
    content:
      "Like countless grains of sand on the shore, your love is infinite and eternal. {groom_name} and {bride_name}, as you combine these individual containers of sand, remember that just as the ocean shapes the shore over time, your love will continue to shape and strengthen your marriage through all the years to come. May this blended sand remind you that you are stronger together than you could ever be apart.",
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
    label: "Traditional Unity Candle",
    content:
      "{groom_name} and {bride_name}, the two candles you brought from your families represent your lives before today. Lighting the center candle represents the joining of your two lives to one. As you light the unity candle together, the two of you now share one light. This represents that you are joined together in love, yet remain two individuals.",
  },
  {
    id: "candle2",
    label: "Family Unity Candle",
    content:
      "The outer candles represent {groom_name} and {bride_name} as individuals and the love, wisdom, and strength they have received from their families. Together they will light the center candle, representing their commitment to one another and the new family they are creating today.",
  },
  {
    id: "candle3",
    label: "Spiritual Unity Candle",
    content:
      "From every human being there rises a light that reaches straight to heaven. And when two souls that are destined for each other find one another, their streams of light flow together and a single brighter light goes forth from their united being. {groom_name} and {bride_name}, may the light of your love burn brightly, and may it light the way for others.",
  },
  {
    id: "candle4",
    label: "Modern Unity Candle",
    content:
      "{groom_name} and {bride_name}, you have each lit a candle representing your individual lives, your individual personalities and your individual dreams. Together you will light the center unity candle. The individual candles remain lit, showing that while you are now united as one, you have not lost your individuality. Let this unity candle be a symbol of your commitment to each other and to your marriage.",
  },
];

// Handfasting Ceremony Options
const handfastingOptions: RitualOption[] = [
  {
    id: "handfasting1",
    label: "Traditional Handfasting",
    content:
      "{groom_name} and {bride_name}, please join hands. The handfasting ceremony is an ancient tradition that symbolizes your union. As we bind your hands, we bind your lives. Let this cord represent the ties that will hold you together through all of life's joys and challenges. You are bound not to restrict each other, but to support and strengthen one another.",
  },
  {
    id: "handfasting2",
    label: "Celtic Handfasting",
    content:
      "The tradition of handfasting comes from ancient Celtic customs. {groom_name} and {bride_name}, as your hands are joined, so your lives become one. The cords we place around your hands represent the invisible bonds of love that unite you. These bonds are not made of rope or cord, but of love, trust, and mutual respect.",
  },
  {
    id: "handfasting3",
    label: "Modern Handfasting",
    content:
      "{groom_name} and {bride_name}, this cord represents the ties that bind you together. Unlike the bonds that restrict, these are bonds that liberate—freeing you to be your truest selves while joined in love. As we tie this knot, remember that your love is a choice you make each day, and these bonds grow stronger with each act of kindness and understanding.",
  },
];

// Wine/Cup Ceremony Options
const wineCeremonyOptions: RitualOption[] = [
  {
    id: "wine1",
    label: "Traditional Wine Ceremony",
    content:
      "{groom_name} and {bride_name}, this cup of wine represents the fullness of life. As you share from this cup, you share the sweet and the bitter moments that life will offer. By drinking together, you acknowledge that from this day forward, your lives will be intimately joined, and whatever life brings, you will face together.",
  },
  {
    id: "wine2",
    label: "Unity Cup Ceremony",
    content:
      "This ceremonial cup represents life—both the bitter and the sweet. {groom_name} and {bride_name}, as you drink from this shared cup, remember that from this moment forward, you will share all that life has to offer. The joy will be doubled because you share it, and any sorrow will be halved because your partner bears it with you.",
  },
  {
    id: "wine3",
    label: "Blessing Cup Ceremony",
    content:
      "May this cup be a symbol of your new life together. {groom_name} and {bride_name}, as you drink from this cup, may your love be as rich and enduring as fine wine, growing more precious with each passing year. Let this shared cup remind you that in marriage, two lives become one, sharing in all joys and sorrows.",
  },
];

// Ring Warming Ceremony Options
const ringWarmingOptions: RitualOption[] = [
  {
    id: "ringwarming1",
    label: "Traditional Ring Warming",
    content:
      "We invite you all to take a moment to hold {groom_name} and {bride_name}'s wedding rings. As you hold them, please offer a silent prayer, blessing, or good wish for their marriage. These rings will carry not only their promises to each other, but also the love and blessings of everyone here today.",
  },
  {
    id: "ringwarming2",
    label: "Community Ring Warming",
    content:
      "These rings represent {groom_name} and {bride_name}'s unending love for each other. By passing these rings among their family and friends, each of you adds your love, your prayers, and your blessings to these symbols. When they wear these rings, they will carry with them the support and love of this entire community.",
  },
];

// Tree Planting Ceremony Options
const treePlantingOptions: RitualOption[] = [
  {
    id: "tree1",
    label: "Unity Tree Planting",
    content:
      "{groom_name} and {bride_name}, this tree you plant together represents your marriage. Like your love, it will grow stronger and more beautiful with each passing season. Its roots will deepen just as your love deepens, and its branches will reach skyward just as your hopes and dreams reach toward the future. May this tree flourish as your marriage flourishes.",
  },
  {
    id: "tree2",
    label: "Family Tree Planting",
    content:
      "This tree represents the new family you are creating today. {groom_name} and {bride_name}, as you plant this tree together, remember that like any growing thing, your marriage will need care, attention, and nurturing. But with love and dedication, it will grow strong and provide shelter and beauty for generations to come.",
  },
];

// Stone Ceremony Options
const stoneCeremonyOptions: RitualOption[] = [
  {
    id: "stone1",
    label: "Unity Stone Ceremony",
    content:
      "{groom_name} and {bride_name}, these stones represent the solid foundation of your love. As you place your stones together, you create a strong foundation for your marriage. Just as these stones will endure through time and weather, may your love endure through all of life's seasons.",
  },
  {
    id: "stone2",
    label: "Wishing Stone Ceremony",
    content:
      "Friends and family, you each received a stone as you arrived today. Please take a moment to hold your stone and make a wish or say a prayer for {groom_name} and {bride_name}. These stones, blessed with your love and good wishes, will become the foundation of a garden that will remind them always of this day and your love for them.",
  },
];

// Oathing Stone Ceremony Options
const oathingStoneOptions: RitualOption[] = [
  {
    id: "oathingstone1",
    label: "Traditional Oathing Stone",
    content:
      "{groom_name} and {bride_name}, this ancient stone has witnessed countless promises through the ages. As you place your hands upon it together, you join your promises to all those who came before you. May this stone remind you that your vows are sacred and enduring, as solid and permanent as the stone itself.",
  },
  {
    id: "oathingstone2",
    label: "Sacred Oathing Stone",
    content:
      "This oathing stone represents the permanence and strength of the commitment you make today. {groom_name} and {bride_name}, as you touch this stone together, remember that your marriage, like this stone, is meant to withstand the tests of time. Let its strength remind you of the strength you find in each other.",
  },
];

// Cord of Three Strands Options
const cordOfThreeStrandsOptions: RitualOption[] = [
  {
    id: "cord1",
    label: "Traditional Cord of Three Strands",
    content:
      "{groom_name} and {bride_name}, this cord is made of three strands. Two strands represent each of you—your individual strengths, your unique gifts, and your separate identities. The third strand represents God (or your shared faith/values), who joins you together. A cord of three strands is not easily broken. When woven together, these three strands create something stronger than any individual strand could be alone.",
  },
  {
    id: "cord2",
    label: "Unity Cord of Three Strands",
    content:
      "As we braid these three cords together, we symbolize the joining of {groom_name}, {bride_name}, and the divine presence in your marriage. Each strand maintains its own strength and character, but together they create an unbreakable bond. May your marriage be strengthened by this three-fold cord that cannot be easily broken.",
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
    content: "May your first act as a married couple be one of love. You may now kiss each other for the first time as husband and wife!",
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
      case "Unity Candle Ceremony":
        return unityCandleOptions;
      case "Handfasting Ceremony":
        return handfastingOptions;
      case "Wine/Cup Ceremony":
        return wineCeremonyOptions;
      case "Ring Warming Ceremony":
        return ringWarmingOptions;
      case "Tree Planting Ceremony":
        return treePlantingOptions;
      case "Stone Ceremony":
        return stoneCeremonyOptions;
      case "Oathing Stone Ceremony":
        return oathingStoneOptions;
      case "Cord of Three Strands":
        return cordOfThreeStrandsOptions;
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
                   {option.label}
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
                 {option.label}
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
                 {option.label}
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
                 {option.label}
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
                 {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Option Preview */}
      {selectedModal && (
        <div className="fixed inset-0 bg-[#6851134d] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {(() => {
                    const allOptions = [
                      ...sandCeremonyOptions,
                      ...roseCeremonyOptions,
                      ...unityCandleOptions,
                      ...handfastingOptions,
                      ...wineCeremonyOptions,
                      ...ringWarmingOptions,
                      ...treePlantingOptions,
                      ...stoneCeremonyOptions,
                      ...oathingStoneOptions,
                      ...cordOfThreeStrandsOptions,
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
                      handfastingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        handfastingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      wineCeremonyOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        wineCeremonyOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      ringWarmingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        ringWarmingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      treePlantingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        treePlantingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      stoneCeremonyOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        stoneCeremonyOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      oathingStoneOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        oathingStoneOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      cordOfThreeStrandsOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        cordOfThreeStrandsOptions,
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
                      unityCandleOptions.find((opt) => opt.id === selectedModal) ||
                      handfastingOptions.find((opt) => opt.id === selectedModal) ||
                      wineCeremonyOptions.find((opt) => opt.id === selectedModal) ||
                      ringWarmingOptions.find((opt) => opt.id === selectedModal) ||
                      treePlantingOptions.find((opt) => opt.id === selectedModal) ||
                      stoneCeremonyOptions.find((opt) => opt.id === selectedModal) ||
                      oathingStoneOptions.find((opt) => opt.id === selectedModal) ||
                      cordOfThreeStrandsOptions.find((opt) => opt.id === selectedModal)
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
