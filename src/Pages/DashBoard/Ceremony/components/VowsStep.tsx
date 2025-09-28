import { useState } from "react";
import type { CeremonyFormData } from "../types";
import type { UseFormRegister } from "react-hook-form";
import CustomDropdown from "./CustomDropdown";
import { useCeremonyContext } from "../contexts/CeremonyContext";

interface VowsStepProps {
  register: UseFormRegister<CeremonyFormData>;
  watch: (name: keyof CeremonyFormData) => string;
  openDropdowns: { [key: string]: boolean };
  onToggleDropdown: (name: string) => void;
  onSelectDropdown: (name: string, value: string) => void;
}

interface VowOption {
  id: string;
  label: string;
  content: string;
}

// Option definitions
const chargeOptions: VowOption[] = [
  {
    id: "charge1",
    label: "Traditional Charge",
    content:
      "{groom_name} and {bride_name}, you have come here today of your own free will and in the presence of family and friends, to unite in the bonds of marriage.",
  },
  {
    id: "charge2",
    label: "Modern Charge",
    content:
      "{groom_name} and {bride_name}, marriage is a commitment to life, to the best that two people can find and bring out in each other.",
  },
  {
    id: "charge3",
    label: "Spiritual Charge",
    content:
      "{groom_name} and {bride_name}, you stand before us today to be joined in holy matrimony, a sacred covenant blessed by love and witnessed by those who care about you.",
  },
];

const pledgeOptions: VowOption[] = [
  {
    id: "pledge1",
    label: "Traditional Pledge",
    content:
      "Do you {groom_name}, take {bride_name} to be your wedded wife, to have and to hold from this day forward, for better, for worse, for richer, for poorer, in sickness and in health, to love and to cherish, till death do you part?",
  },
  {
    id: "pledge2",
    label: "Modern Pledge",
    content:
      "Do you {groom_name}, promise to love, honor, and cherish {bride_name}, to support her dreams, and to build a life of shared happiness together?",
  },
  {
    id: "pledge3",
    label: "Personal Pledge",
    content:
      "{groom_name}, do you take {bride_name} as your partner in life, promising to stand by her side through all of life's adventures?",
  },
];

const vowIntroOptions: VowOption[] = [
  {
    id: "vowIntro1",
    label: "Classic Introduction",
    content:
      "Please join hands and speak your vows to one another. {groom_name}, you may begin.",
  },
  {
    id: "vowIntro2",
    label: "Heartfelt Introduction",
    content:
      "{groom_name} and {bride_name}, please look into each other's eyes and share the promises that come from your hearts.",
  },
  {
    id: "vowIntro3",
    label: "Simple Introduction",
    content:
      "Now {groom_name} and {bride_name} will exchange the vows they have written for each other.",
  },
];

const vowOptions: VowOption[] = [
  {
    id: "vow1",
    label: "Traditional Vows",
    content:
      "I, {groom_name}, take you, {bride_name}, to be my wedded wife, to have and to hold from this day forward, for better, for worse, for richer, for poorer, in sickness and in health, to love and to cherish, till death us do part.",
  },
  {
    id: "vow2",
    label: "Modern Vows",
    content:
      "I, {groom_name}, choose you, {bride_name}, to be my partner, my best friend, and my love. I promise to support your dreams, celebrate your successes, and love you unconditionally.",
  },
  {
    id: "vow3",
    label: "Personal Vows",
    content:
      "{bride_name}, I promise to love you, to be honest with you, to respect and trust you, and to stand by your side through whatever life may bring us.",
  },
];

const readingOptions: VowOption[] = [
  {
    id: "reading1",
    label: "Love is Patient (1 Corinthians 13)",
    content:
      "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
  },
  {
    id: "reading2",
    label: "Apache Wedding Blessing",
    content:
      "Now you will feel no rain, for each of you will be shelter to the other. Now you will feel no cold, for each of you will be warmth to the other. Now there is no more loneliness, for each of you will be companion to the other.",
  },
  {
    id: "reading3",
    label: "Rumi Quote",
    content:
      "Love is the bridge between two hearts. In your light I learn how to love. In your beauty, how to make poems. You dance inside my chest where no one sees you, but sometimes I do, and that sight becomes this art, this music, this form.",
  },
];

const ringIntroOptions: VowOption[] = [
  {
    id: "ringIntro1",
    label: "Traditional Ring Introduction",
    content:
      "The wedding ring is a symbol of eternity. It is an outward sign of an inward and spiritual bond which unites two hearts in endless love.",
  },
  {
    id: "ringIntro2",
    label: "Modern Ring Introduction",
    content:
      "These rings represent your promise to each other. They are circles of love, symbols of the eternal bond you share.",
  },
  {
    id: "ringIntro3",
    label: "Simple Ring Introduction",
    content:
      "{groom_name} and {bride_name} will now exchange rings as a symbol of their love and commitment.",
  },
];

const ringBlessingOptions: VowOption[] = [
  {
    id: "blessing1",
    label: "Traditional Blessing",
    content:
      "Bless, O Lord, these rings to be signs of the vows by which this man and this woman have bound themselves to each other.",
  },
  {
    id: "blessing2",
    label: "Universal Blessing",
    content:
      "May these rings remind you always of the love you share and the promises you make to each other today.",
  },
  {
    id: "blessing3",
    label: "Simple Blessing",
    content:
      "Let these rings be blessed symbols of your union, worn with love and pride.",
  },
];

const ringExchangeGroomOptions: VowOption[] = [
  {
    id: "groomRing1",
    label: "Traditional Exchange",
    content:
      "With this ring I thee wed, and with all my worldly goods I thee endow. In the name of the Father, and of the Son, and of the Holy Spirit.",
  },
  {
    id: "groomRing2",
    label: "Modern Exchange",
    content:
      "{bride_name}, I give you this ring as a symbol of my love and commitment to you. Wear it as a sign of my promise to love you always.",
  },
  {
    id: "groomRing3",
    label: "Personal Exchange",
    content:
      "{bride_name}, this ring represents my promise to love, honor, and cherish you for all the days of my life.",
  },
];

const ringExchangeBrideOptions: VowOption[] = [
  {
    id: "brideRing1",
    label: "Traditional Exchange",
    content:
      "With this ring I thee wed, and with all my worldly goods I thee endow. In the name of the Father, and of the Son, and of the Holy Spirit.",
  },
  {
    id: "brideRing2",
    label: "Modern Exchange",
    content:
      "{groom_name}, I give you this ring as a symbol of my love and commitment to you. Wear it as a sign of my promise to love you always.",
  },
  {
    id: "brideRing3",
    label: "Personal Exchange",
    content:
      "{groom_name}, this ring represents my promise to love, honor, and cherish you for all the days of my life.",
  },
];

const prayerOptions: VowOption[] = [
  {
    id: "prayer1",
    label: "Traditional Prayer",
    content:
      "Heavenly Father, we ask your blessing upon {groom_name} and {bride_name}. May their love continue to grow, may they support each other through all of life's challenges, and may their union be blessed with joy, peace, and happiness. Amen.",
  },
  {
    id: "prayer2",
    label: "Universal Prayer",
    content:
      "May {groom_name} and {bride_name} be blessed with a lifetime of love, laughter, and happiness. May they always find strength in each other and joy in their shared journey.",
  },
  {
    id: "prayer3",
    label: "Modern Prayer",
    content:
      "We celebrate the love between {groom_name} and {bride_name}. May their marriage be filled with understanding, respect, and endless love as they begin this beautiful journey together.",
  },
];

const VowsStep = ({
  register,
  watch,
  openDropdowns,
  onToggleDropdown,
  onSelectDropdown,
}: VowsStepProps) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const { groomName, brideName } = useCeremonyContext();

  const openModal = (optionId: string) => {
    setSelectedModal(optionId);
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  const handleSelection = (fieldName: string, optionId: string) => {
    onSelectDropdown(fieldName, optionId);
  };

  const getOptionContent = (
    options: VowOption[],
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

  return (
    <div className="space-y-6">
      {/* Charge to Groom and Bride */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Charge to Groom and Bride
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="chargeToGroomAndBride"
            options={chargeOptions.map((opt) => opt.label)}
            value={watch("chargeToGroomAndBride")}
            placeholder="Select charge option"
            isOpen={openDropdowns.chargeToGroomAndBride || false}
            onToggle={() => onToggleDropdown("chargeToGroomAndBride")}
            onSelect={(value) => {
              const option = chargeOptions.find((opt) => opt.label === value);
              if (option) handleSelection("chargeToGroomAndBride", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {chargeOptions.map((option) => (
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

      {/* Pledge */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Pledge
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="pledge"
            options={pledgeOptions.map((opt) => opt.label)}
            value={watch("pledge")}
            placeholder="Select pledge option"
            isOpen={openDropdowns.pledge || false}
            onToggle={() => onToggleDropdown("pledge")}
            onSelect={(value) => {
              const option = pledgeOptions.find((opt) => opt.label === value);
              if (option) handleSelection("pledge", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {pledgeOptions.map((option) => (
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

      {/* Introduction to Exchange of Vows */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Introduction to Exchange of Vows
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="introductionToExchangeOfVows"
            options={vowIntroOptions.map((opt) => opt.label)}
            value={watch("introductionToExchangeOfVows")}
            placeholder="Select vow introduction option"
            isOpen={openDropdowns.introductionToExchangeOfVows || false}
            onToggle={() => onToggleDropdown("introductionToExchangeOfVows")}
            onSelect={(value) => {
              const option = vowIntroOptions.find((opt) => opt.label === value);
              if (option)
                handleSelection("introductionToExchangeOfVows", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {vowIntroOptions.map((option) => (
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

      {/* Vows */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Vows
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="vows"
            options={vowOptions.map((opt) => opt.label)}
            value={watch("vows")}
            placeholder="Select vow option"
            isOpen={openDropdowns.vows || false}
            onToggle={() => onToggleDropdown("vows")}
            onSelect={(value) => {
              const option = vowOptions.find((opt) => opt.label === value);
              if (option) handleSelection("vows", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {vowOptions.map((option) => (
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

      {/* Readings */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Readings
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="readings"
            options={readingOptions.map((opt) => opt.label)}
            value={watch("readings")}
            placeholder="Select reading option"
            isOpen={openDropdowns.readings || false}
            onToggle={() => onToggleDropdown("readings")}
            onSelect={(value) => {
              const option = readingOptions.find((opt) => opt.label === value);
              if (option) handleSelection("readings", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {readingOptions.map((option) => (
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

      {/* Introduction to Exchange of Rings */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Introduction to Exchange of Rings
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="introductionToExchangeOfRings"
            options={ringIntroOptions.map((opt) => opt.label)}
            value={watch("introductionToExchangeOfRings")}
            placeholder="Select ring introduction option"
            isOpen={openDropdowns.introductionToExchangeOfRings || false}
            onToggle={() => onToggleDropdown("introductionToExchangeOfRings")}
            onSelect={(value) => {
              const option = ringIntroOptions.find(
                (opt) => opt.label === value
              );
              if (option)
                handleSelection("introductionToExchangeOfRings", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {ringIntroOptions.map((option) => (
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

      {/* Blessings of Rings */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Blessings of Rings
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="blessingsOfRings"
            options={ringBlessingOptions.map((opt) => opt.label)}
            value={watch("blessingsOfRings")}
            placeholder="Select ring blessing option"
            isOpen={openDropdowns.blessingsOfRings || false}
            onToggle={() => onToggleDropdown("blessingsOfRings")}
            onSelect={(value) => {
              const option = ringBlessingOptions.find(
                (opt) => opt.label === value
              );
              if (option) handleSelection("blessingsOfRings", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {ringBlessingOptions.map((option) => (
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

      {/* Exchange of Rings - Groom */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Exchange of Rings - Groom to Bride
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="exchangeOfRingsGroom"
            options={ringExchangeGroomOptions.map((opt) => opt.label)}
            value={watch("exchangeOfRingsGroom")}
            placeholder="Select groom's ring exchange option"
            isOpen={openDropdowns.exchangeOfRingsGroom || false}
            onToggle={() => onToggleDropdown("exchangeOfRingsGroom")}
            onSelect={(value) => {
              const option = ringExchangeGroomOptions.find(
                (opt) => opt.label === value
              );
              if (option) handleSelection("exchangeOfRingsGroom", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {ringExchangeGroomOptions.map((option) => (
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

      {/* Exchange of Rings - Bride */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Exchange of Rings - Bride to Groom
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="exchangeOfRingsBride"
            options={ringExchangeBrideOptions.map((opt) => opt.label)}
            value={watch("exchangeOfRingsBride")}
            placeholder="Select bride's ring exchange option"
            isOpen={openDropdowns.exchangeOfRingsBride || false}
            onToggle={() => onToggleDropdown("exchangeOfRingsBride")}
            onSelect={(value) => {
              const option = ringExchangeBrideOptions.find(
                (opt) => opt.label === value
              );
              if (option) handleSelection("exchangeOfRingsBride", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {ringExchangeBrideOptions.map((option) => (
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

      {/* Prayer on the New Union */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Prayer on the New Union
        </label>
        <div className="space-y-3">
          <CustomDropdown
            name="prayerOnTheNewUnion"
            options={prayerOptions.map((opt) => opt.label)}
            value={watch("prayerOnTheNewUnion")}
            placeholder="Select prayer option"
            isOpen={openDropdowns.prayerOnTheNewUnion || false}
            onToggle={() => onToggleDropdown("prayerOnTheNewUnion")}
            onSelect={(value) => {
              const option = prayerOptions.find((opt) => opt.label === value);
              if (option) handleSelection("prayerOnTheNewUnion", option.id);
            }}
          />
          <div className="flex gap-2 flex-wrap">
            {prayerOptions.map((option) => (
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
                      ...chargeOptions,
                      ...pledgeOptions,
                      ...vowIntroOptions,
                      ...vowOptions,
                      ...readingOptions,
                      ...ringIntroOptions,
                      ...ringBlessingOptions,
                      ...ringExchangeGroomOptions,
                      ...ringExchangeBrideOptions,
                      ...prayerOptions,
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

                    // Check which option type this is and get content
                    if (chargeOptions.find((opt) => opt.id === selectedModal)) {
                      return getOptionContent(
                        chargeOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      pledgeOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        pledgeOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      vowIntroOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        vowIntroOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      vowOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        vowOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      readingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        readingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      ringIntroOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        ringIntroOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      ringBlessingOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        ringBlessingOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      ringExchangeGroomOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        ringExchangeGroomOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      ringExchangeBrideOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      return getOptionContent(
                        ringExchangeBrideOptions,
                        selectedModal,
                        currentBrideName,
                        currentGroomName
                      );
                    } else if (
                      prayerOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      return getOptionContent(
                        prayerOptions,
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
                    if (chargeOptions.find((opt) => opt.id === selectedModal)) {
                      handleSelection("chargeToGroomAndBride", selectedModal);
                    } else if (
                      pledgeOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("pledge", selectedModal);
                    } else if (
                      vowIntroOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection(
                        "introductionToExchangeOfVows",
                        selectedModal
                      );
                    } else if (
                      vowOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("vows", selectedModal);
                    } else if (
                      readingOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("readings", selectedModal);
                    } else if (
                      ringIntroOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection(
                        "introductionToExchangeOfRings",
                        selectedModal
                      );
                    } else if (
                      ringBlessingOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      handleSelection("blessingsOfRings", selectedModal);
                    } else if (
                      ringExchangeGroomOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      handleSelection("exchangeOfRingsGroom", selectedModal);
                    } else if (
                      ringExchangeBrideOptions.find(
                        (opt) => opt.id === selectedModal
                      )
                    ) {
                      handleSelection("exchangeOfRingsBride", selectedModal);
                    } else if (
                      prayerOptions.find((opt) => opt.id === selectedModal)
                    ) {
                      handleSelection("prayerOnTheNewUnion", selectedModal);
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

export default VowsStep;
