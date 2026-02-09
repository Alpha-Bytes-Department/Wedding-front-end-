import { useState } from "react";
import type { CeremonyFormData } from "../types";
import { useCeremonyContext } from "../contexts/CeremonyContext";

interface ReviewStepProps {
  watch: (name: keyof CeremonyFormData) => string;
  setValue: (name: keyof CeremonyFormData, value: string) => void;
}

// Option mappings for displaying labels instead of IDs
const getOptionLabel = (optionId: string, category: string): string => {
  const optionMappings: { [key: string]: { [key: string]: string } } = {
    language: {
      English: "English",
      Spanish: "Spanish",
      French: "French",
      German: "German",
      Italian: "Italian",
    },
    greetingSpeech: {
      greeting1: "Traditional Welcome",
      greeting2: "Modern Welcome",
      greeting3: "Heartfelt Welcome",
    },
    presentationOfBride: {
      presentation1: "Traditional Presentation",
      presentation2: "Modern Presentation",
      presentation3: "Family Presentation",
    },
    questionForPresentation: {
      question1: "Traditional Question",
      question2: "Modern Question",
      question3: "Personal Question",
    },
    responseToQuestion: {
      response1: "Traditional Response",
      response2: "Modern Response",
      response3: "Personal Response",
    },
    invocation: {
      invocation1: "Traditional Invocation",
      invocation2: "Modern Invocation",
      invocation3: "Personal Invocation",
    },
    chargeToGroomAndBride: {
      charge1: "Traditional Charge",
      charge2: "Modern Charge",
      charge3: "Personal Charge",
    },
    pledge: {
      pledge1: "Traditional Pledge",
      pledge2: "Modern Pledge",
      pledge3: "Personal Pledge",
    },
    introductionToExchangeOfVows: {
      intro_vows1: "Traditional Introduction",
      intro_vows2: "Modern Introduction",
      intro_vows3: "Personal Introduction",
    },
    vows: {
      vows1: "Traditional Vows",
      vows2: "Modern Vows",
      vows3: "Personal Vows",
    },
    readings: {
      reading1: "Traditional Reading",
      reading2: "Modern Reading",
      reading3: "Personal Reading",
    },
    introductionToExchangeOfRings: {
      intro_rings1: "Traditional Ring Introduction",
      intro_rings2: "Modern Ring Introduction",
      intro_rings3: "Personal Ring Introduction",
    },
    blessingsOfRings: {
      blessing1: "Traditional Blessing",
      blessing2: "Modern Blessing",
      blessing3: "Personal Blessing",
    },
    exchangeOfRingsGroom: {
      exchange_groom1: "Traditional Groom Exchange",
      exchange_groom2: "Modern Groom Exchange",
      exchange_groom3: "Personal Groom Exchange",
    },
    exchangeOfRingsBride: {
      exchange_bride1: "Traditional Bride Exchange",
      exchange_bride2: "Modern Bride Exchange",
      exchange_bride3: "Personal Bride Exchange",
    },
    prayerOnTheNewUnion: {
      prayer1: "Traditional Prayer",
      prayer2: "Modern Prayer",
      prayer3: "Personal Prayer",
    },
    ritualsOption: {
      sand1: "Sand Ceremony Option 1",
      sand2: "Sand Ceremony Option 2",
      sand3: "Sand Ceremony Option 3",
      rose1: "Rose Ceremony Option 1",
      rose2: "Rose Ceremony Option 2",
      rose3: "Rose Ceremony Option 3",
      candle1: "Unity Candle Option 1",
      candle2: "Unity Candle Option 2",
      candle3: "Unity Candle Option 3",
    },
    closingStatement: {
      closing1: "Traditional Closing",
      closing2: "Blessing Closing",
      closing3: "Heartfelt Closing",
    },
    pronouncing: {
      pronounce1: "Traditional Pronouncement",
      pronounce2: "Modern Pronouncement",
      pronounce3: "Heartfelt Pronouncement",
    },
    kiss: {
      kiss1: "Traditional Kiss",
      kiss2: "Modern Kiss",
      kiss3: "Romantic Kiss",
    },
    introductionOfCouple: {
      intro1: "Traditional Introduction",
      intro2: "Modern Introduction",
      intro3: "Casual Introduction",
    },
  };

  return optionMappings[category]?.[optionId] || optionId || "Not specified";
};

// Content mappings for modal previews
const getOptionContent = (
  optionId: string,
  category: string,
  partner1Name: string,
  partner2Name: string
): string => {
  const contentMappings: { [key: string]: { [key: string]: string } } = {
    greetingSpeech: {
      greeting1: `We are gathered here today to witness and celebrate the union of ${
        partner1Name || "Partner 1's Name"
      } and ${
        partner2Name || "Partner 2's Name"
      }. Today, they will make a commitment to each other that will last a lifetime.`,
      greeting2: `Welcome everyone! We're here to celebrate the love between ${
        partner1Name || "Partner 1's Name"
      } and ${
        partner2Name || "Partner 2's Name"
      } as they begin their journey together as husband and wife.`,
      greeting3: `Dear family and friends, thank you for gathering here today to witness ${
        partner1Name || "Partner 1's Name"
      } and ${
        partner2Name || "Partner 2's Name"
      } as they exchange vows and begin their new life together.`,
    },
    presentationOfBride: {
      presentation1: `Who gives this woman to be married to this man?`,
      presentation2: `Who supports ${
        partner2Name || "Partner 2's Name"
      } in her marriage to ${partner1Name || "Partner 1's Name"}?`,
      presentation3: `${
        partner2Name || "Partner 2's Name"
      }, who walks with you today and gives you their blessing?`,
    },
    questionForPresentation: {
      question1: `Do you give your blessing to this union?`,
      question2: `Do you support ${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      } in their marriage?`,
      question3: `Will you continue to love and support this couple?`,
    },
    responseToQuestion: {
      response1: `I do.`,
      response2: `We do, with love and pride.`,
      response3: `Yes, we will always support them.`,
    },
    invocation: {
      invocation1: `Let us pray. Heavenly Father, we ask for your blessing on ${
        partner1Name || "Partner 1's Name"
      } and ${
        partner2Name || "Partner 2's Name"
      } as they unite in marriage. Guide them in love and happiness. Amen.`,
      invocation2: `We invoke the presence of love and commitment as ${
        partner1Name || "Partner 1's Name"
      } and ${partner2Name || "Partner 2's Name"} join their lives together.`,
      invocation3: `May the love that has brought ${
        partner1Name || "Partner 1's Name"
      } and ${
        partner2Name || "Partner 2's Name"
      } together continue to grow and flourish throughout their married life.`,
    },
    // Vows content mappings
    chargeToGroomAndBride: {
      charge1: `${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      }, you have come here today to be united in marriage. This is a sacred commitment that should not be entered into lightly.`,
      charge2: `Today, ${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      }, you are choosing to bind your lives together in marriage. This is a beautiful commitment built on love, trust, and mutual respect.`,
      charge3: `${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      }, marriage is a partnership of two people who love each other and choose to walk through life together.`,
    },
    pledge: {
      pledge1: `Do you, ${partner1Name || "Partner 1's Name"}, take ${
        partner2Name || "Partner 2's Name"
      } to be your wife, to love and to cherish, in sickness and in health, for richer or poorer, for better or worse, for as long as you both shall live?`,
      pledge2: `${
        partner1Name || "Partner 1's Name"
      }, do you promise to love, honor, and respect ${
        partner2Name || "Partner 2's Name"
      } as your partner in marriage?`,
      pledge3: `${partner1Name || "Partner 1's Name"}, will you take ${
        partner2Name || "Partner 2's Name"
      } as your wife and promise to stand by her through all of life's joys and challenges?`,
    },
    introductionToExchangeOfVows: {
      intro_vows1: `${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      } will now exchange the vows they have written for each other.`,
      intro_vows2: `Now, ${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      } would like to share their personal promises to each other.`,
      intro_vows3: `At this time, ${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      } will speak the words that come from their hearts.`,
    },
    vows: {
      vows1: `I, ${partner1Name || "Partner 1's Name"}, take you, ${
        partner2Name || "Partner 2's Name"
      }, to be my wife. I promise to love you, honor you, and cherish you for all the days of my life.`,
      vows2: `${
        partner2Name || "Partner 2's Name"
      }, I choose you to be my partner in life. I promise to support you, encourage you, and love you unconditionally.`,
      vows3: `Today I give myself to you, ${
        partner2Name || "Partner 2's Name"
      }. I promise to be your faithful companion and to build our dreams together.`,
    },
    readings: {
      reading1: `Love is patient, love is kind. It does not envy, it does not boast, it is not proud. Love never fails.`,
      reading2: `Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up.`,
      reading3: `Set me as a seal upon your heart, as a seal upon your arm; for love is as strong as death.`,
    },
    introductionToExchangeOfRings: {
      intro_rings1: `The wedding rings are an outward and visible sign of an inward and spiritual bond which unites two hearts in endless love.`,
      intro_rings2: `${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      } will now exchange rings as a symbol of their eternal commitment.`,
      intro_rings3: `These rings represent the unbroken circle of love. ${
        partner1Name || "Partner 1's Name"
      } and ${partner2Name || "Partner 2's Name"}, please exchange your rings.`,
    },
    blessingsOfRings: {
      blessing1: `May these rings be blessed as the symbol of this affectionate unity. Let them remind you always of the vows you have taken here today.`,
      blessing2: `Bless these rings, O Lord, that they who wear them may live in your peace and continue in your favor all the days of their lives.`,
      blessing3: `These rings are symbols of the wholeness and endless love you share. May they remind you of the promises you make today.`,
    },
    exchangeOfRingsGroom: {
      exchange_groom1: `${
        partner2Name || "Partner 2's Name"
      }, I give you this ring as a symbol of my love and commitment to you. Wear it as a reminder of the vows we have spoken today.`,
      exchange_groom2: `With this ring, I thee wed. ${
        partner2Name || "Partner 2's Name"
      }, this ring represents my promise to love and honor you always.`,
      exchange_groom3: `${
        partner2Name || "Partner 2's Name"
      }, this ring is a circle, representing our eternal love. I place it on your finger as a symbol of my devotion to you.`,
    },
    exchangeOfRingsBride: {
      exchange_bride1: `${
        partner1Name || "Partner 1's Name"
      }, I give you this ring as a symbol of my love and commitment to you. Wear it as a reminder of the vows we have spoken today.`,
      exchange_bride2: `With this ring, I thee wed. ${
        partner1Name || "Partner 1's Name"
      }, this ring represents my promise to love and honor you always.`,
      exchange_bride3: `${
        partner1Name || "Partner 1's Name"
      }, this ring is a circle, representing our eternal love. I place it on your finger as a symbol of my devotion to you.`,
    },
    prayerOnTheNewUnion: {
      prayer1: `Lord, we ask your blessing upon ${
        partner1Name || "Partner 1's Name"
      } and ${
        partner2Name || "Partner 2's Name"
      } as they begin their married life together. Guide them in love and grant them happiness all their days.`,
      prayer2: `May ${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      } be blessed with love, joy, and peace in their marriage. May they always find strength in each other.`,
      prayer3: `We pray for ${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      }, that their love may continue to grow stronger each day and that they may find joy in their journey together.`,
    },
    ritualsOption: {
      sand1: `${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      }, today you are making a life-long commitment to share the rest of your lives with each other. Your relationship is symbolized through the pouring of these two individual containers of sand.`,
      sand2: `${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      }, the two separate bottles of sand represent your lives until this moment; individual and unique. As you now combine your sand together, your lives also join together as one.`,
      sand3: `${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      }, today you are making a life-long commitment to share the rest of your lives with each other. Your relationship is symbolized through the pouring of these two individual containers of sand.`,
    },
    closingStatement: {
      closing1:
        "May your marriage be filled with love, laughter, and happiness. May you always find in each other your best friend and your greatest love.",
      closing2: `May the love that has brought ${
        partner1Name || "Partner 1's Name"
      } and ${
        partner2Name || "Partner 2's Name"
      } together continue to grow and flourish throughout their married life.`,
      closing3: `${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      }, as you begin this wonderful journey together, remember that love is not just a feeling, but a choice you make each day.`,
    },
    pronouncing: {
      pronounce1:
        "By the power vested in me, I now pronounce you husband and wife. What God has joined together, let no one separate.",
      pronounce2:
        "By the authority vested in me, and in the presence of your family and friends, I now pronounce you married. You are now husband and wife.",
      pronounce3: `${partner1Name || "Partner 1's Name"} and ${
        partner2Name || "Partner 2's Name"
      }, having pledged your love and commitment to each other before these witnesses, I am delighted to pronounce you husband and wife.`,
    },
    kiss: {
      kiss1: "You may now kiss your bride!",
      kiss2: "You may now kiss each other as married partners!",
      kiss3: `${partner1Name || "Partner 1's Name"}, you may now kiss ${
        partner2Name || "Partner 2's Name"
      }, your wife!`,
    },
    introductionOfCouple: {
      intro1: `Ladies and gentlemen, it is my great pleasure to present to you for the first time as a married couple, Mr. and Mrs. ${
        partner1Name || "Partner 1's Name"
      } ${partner2Name || "Partner 2's Name"}!`,
      intro2: `Family and friends, please join me in celebrating the newly married couple, ${
        partner1Name || "Partner 1's Name"
      } and ${partner2Name || "Partner 2's Name"}!`,
      intro3: `Everyone, please give a warm welcome to the happy couple, ${
        partner1Name || "Partner 1's Name"
      } and ${partner2Name || "Partner 2's Name"}!`,
    },
  };

  return contentMappings[category]?.[optionId] || "Content not available";
};

const ReviewStep = ({ watch }: ReviewStepProps) => {
  const [selectedModal, setSelectedModal] = useState<{
    category: string;
    optionId: string;
  } | null>(null);
  const { partner1Name, partner2Name } = useCeremonyContext();

  const openModal = (category: string, optionId: string) => {
    if (optionId && optionId !== "Not specified") {
      setSelectedModal({ category, optionId });
    }
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return "Not specified";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-primary font-bold text-gray-900 mb-2">
          Ceremony Review
        </h2>
        <p className="text-gray-600">
          Please review all the information below before submitting your
          ceremony
        </p>
      </div>

      {/* Basic Information Section */}
      <div className="bg-[#e0b84c1c]  rounded-xl p-6 ">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            1
          </span>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-700 block">
              Description:
            </span>
            <div className="text-gray-900 bg-white px-3 py-2 rounded border border-primary min-h-[80px]">
              {watch("description") || "No description provided"}
            </div>
          </div>
        </div>
      </div>

      {/* Greetings Section */}
      <div className="bg-[#e0b84c1c] rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            2
          </span>
          Greetings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">
                Partner 1's Name:
              </span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary block">
                {watch("groomName") || "Not specified"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Partner 2's Name:
              </span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary block">
                {watch("brideName") || "Not specified"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">Language:</span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary block">
                {watch("language") || "Not specified"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Greeting Speech:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(watch("greetingSpeech"), "greetingSpeech")}
                </span>
                {watch("greetingSpeech") &&
                  watch("greetingSpeech") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal("greetingSpeech", watch("greetingSpeech"))
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">
                Presentation of Bride:
              </span>
              <div className="space-y-2">
                <div className="text-gray-900 bg-white px-3 py-2 rounded border border-primary min-h-[60px]">
                  {getOptionLabel(
                    watch("presentationOfBride"),
                    "presentationOfBride"
                  )}
                </div>
                {watch("presentationOfBride") &&
                  watch("presentationOfBride") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          "presentationOfBride",
                          watch("presentationOfBride")
                        )
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
                    >
                      Preview Content
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Question for Presentation:
              </span>
              <div className="space-y-2">
                <div className="text-gray-900 bg-white px-3 py-2 rounded border border-primary min-h-[60px]">
                  {getOptionLabel(
                    watch("questionForPresentation"),
                    "questionForPresentation"
                  )}
                </div>
                {watch("questionForPresentation") &&
                  watch("questionForPresentation") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          "questionForPresentation",
                          watch("questionForPresentation")
                        )
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
                    >
                      Preview Content
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Response to Question:
              </span>
              <div className="space-y-2">
                <div className="text-gray-900 bg-white px-3 py-2 rounded border border-primary min-h-[60px]">
                  {getOptionLabel(
                    watch("responseToQuestion"),
                    "responseToQuestion"
                  )}
                </div>
                {watch("responseToQuestion") &&
                  watch("responseToQuestion") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          "responseToQuestion",
                          watch("responseToQuestion")
                        )
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
                    >
                      Preview Content
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Invocation (Opening Prayer):
              </span>
              <div className="space-y-2">
                <div className="text-gray-900 bg-white px-3 py-2 rounded border border-primary min-h-[60px]">
                  {getOptionLabel(watch("invocation"), "invocation")}
                </div>
                {watch("invocation") &&
                  watch("invocation") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal("invocation", watch("invocation"))
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
                    >
                      Preview Content
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vows Section */}
      <div className="bg-[#e0b84c1c]  rounded-xl p-6 ">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            3
          </span>
          Vows
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">
                Charge to Partner 1 and Partner 2:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(
                    watch("chargeToGroomAndBride"),
                    "chargeToGroomAndBride"
                  )}
                </span>
                {watch("chargeToGroomAndBride") &&
                  watch("chargeToGroomAndBride") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          "chargeToGroomAndBride",
                          watch("chargeToGroomAndBride")
                        )
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">Pledge:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(watch("pledge"), "pledge")}
                </span>
                {watch("pledge") && watch("pledge") !== "Not specified" && (
                  <button
                    type="button"
                    onClick={() => openModal("pledge", watch("pledge"))}
                    className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                  >
                    Preview
                  </button>
                )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Introduction to Exchange of Vows:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(
                    watch("introductionToExchangeOfVows"),
                    "introductionToExchangeOfVows"
                  )}
                </span>
                {watch("introductionToExchangeOfVows") &&
                  watch("introductionToExchangeOfVows") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          "introductionToExchangeOfVows",
                          watch("introductionToExchangeOfVows")
                        )
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">Vows:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(watch("vows"), "vows")}
                </span>
                {watch("vows") && watch("vows") !== "Not specified" && (
                  <button
                    type="button"
                    onClick={() => openModal("vows", watch("vows"))}
                    className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                  >
                    Preview
                  </button>
                )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">Readings:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(watch("readings"), "readings")}
                </span>
                {watch("readings") && watch("readings") !== "Not specified" && (
                  <button
                    type="button"
                    onClick={() => openModal("readings", watch("readings"))}
                    className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                  >
                    Preview
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">
                Introduction to Exchange of Rings:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(
                    watch("introductionToExchangeOfRings"),
                    "introductionToExchangeOfRings"
                  )}
                </span>
                {watch("introductionToExchangeOfRings") &&
                  watch("introductionToExchangeOfRings") !==
                    "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          "introductionToExchangeOfRings",
                          watch("introductionToExchangeOfRings")
                        )
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Blessings of Rings:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(
                    watch("blessingsOfRings"),
                    "blessingsOfRings"
                  )}
                </span>
                {watch("blessingsOfRings") &&
                  watch("blessingsOfRings") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal("blessingsOfRings", watch("blessingsOfRings"))
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Exchange of Rings - Partner 1:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(
                    watch("exchangeOfRingsGroom"),
                    "exchangeOfRingsGroom"
                  )}
                </span>
                {watch("exchangeOfRingsGroom") &&
                  watch("exchangeOfRingsGroom") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          "exchangeOfRingsGroom",
                          watch("exchangeOfRingsGroom")
                        )
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Exchange of Rings - Partner 2:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(
                    watch("exchangeOfRingsBride"),
                    "exchangeOfRingsBride"
                  )}
                </span>
                {watch("exchangeOfRingsBride") &&
                  watch("exchangeOfRingsBride") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          "exchangeOfRingsBride",
                          watch("exchangeOfRingsBride")
                        )
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Prayer on the New Union:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(
                    watch("prayerOnTheNewUnion"),
                    "prayerOnTheNewUnion"
                  )}
                </span>
                {watch("prayerOnTheNewUnion") &&
                  watch("prayerOnTheNewUnion") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          "prayerOnTheNewUnion",
                          watch("prayerOnTheNewUnion")
                        )
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rituals Section */}
      <div className="bg-[#e0b84c1c] rounded-xl p-6 ">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-[#e0b84c] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            4
          </span>
          Rituals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">
                Ritual Selection:
              </span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary block">
                {watch("ritualsSelection") || "Not specified"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Ritual Option:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(watch("ritualsOption"), "ritualsOption")}
                </span>
                {watch("ritualsOption") &&
                  watch("ritualsOption") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal("ritualsOption", watch("ritualsOption"))
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Closing Statement:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(
                    watch("closingStatement"),
                    "closingStatement"
                  )}
                </span>
                {watch("closingStatement") &&
                  watch("closingStatement") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal("closingStatement", watch("closingStatement"))
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">
                Pronouncing:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(watch("pronouncing"), "pronouncing")}
                </span>
                {watch("pronouncing") &&
                  watch("pronouncing") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal("pronouncing", watch("pronouncing"))
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">Kiss:</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(watch("kiss"), "kiss")}
                </span>
                {watch("kiss") && watch("kiss") !== "Not specified" && (
                  <button
                    type="button"
                    onClick={() => openModal("kiss", watch("kiss"))}
                    className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                  >
                    Preview
                  </button>
                )}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Introduction of Couple:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary flex-1">
                  {getOptionLabel(
                    watch("introductionOfCouple"),
                    "introductionOfCouple"
                  )}
                </span>
                {watch("introductionOfCouple") &&
                  watch("introductionOfCouple") !== "Not specified" && (
                    <button
                      type="button"
                      onClick={() =>
                        openModal(
                          "introductionOfCouple",
                          watch("introductionOfCouple")
                        )
                      }
                      className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm whitespace-nowrap"
                    >
                      Preview
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-[#e0b84c1c] rounded-xl p-6 ">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-[#e0b84c] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            5
          </span>
          Schedule & Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">
                Event Date:
              </span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border block">
                {formatDate(watch("eventDate"))}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Event Time:
              </span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border block">
                {formatTime(watch("eventTime"))}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Rehearsal Date:
              </span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border block">
                {formatDate(watch("rehearsalDate"))}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">Location:</span>
              <div className="text-gray-900 bg-white px-3 py-2 rounded border min-h-[80px]">
                {watch("location") || "Location not specified"}
              </div>
            </div>
            {/* <div>
              <span className="font-medium text-gray-700 block mb-2">
                Select Officiant:
              </span>
              <select
                className="w-full px-3 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                value={watch("officiantId") || ""}
                onChange={(e) => {
                  const selectedOfficiant = officiant.find(off => off.id === e.target.value);
                  if (selectedOfficiant) {
                    // Store both officiantId and officiantName
                    setValue("officiantId", selectedOfficiant.id);
                    setValue("officiantName", selectedOfficiant.name);
                  } else {
                    // Clear values if no officiant selected
                    setValue("officiantId", "");
                    setValue("officiantName", "");
                  }
                }}
              >
                <option value="">Choose an officiant...</option>
                {officiant.length > 0 ? (
                  officiant.map((off) => (
                    <option key={off.id} value={off.id}>
                      
                      {off.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Please book a officiant first ...
                  </option>
                )}
              </select>
              {watch("officiantName") && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-sm text-green-800">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Selected Officiant: <span className="font-medium ml-1">{watch("officiantName")}</span>
                  </div>
                </div>
              )}
              {officiant.length === 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center text-sm text-yellow-800">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    No officiants found. Please contact support.
                  </div>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>

      {/* Submission Notice */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-amber-800">
              Ready to Submit?
            </h4>
            <p className="text-amber-700 mt-1">
              Please ensure all information is correct. Once submitted, your
              ceremony details will be sent to the officiant for review and
              approval.
            </p>
            <p className="text-sm text-amber-600 mt-2 font-medium">
              Required fields: Title, Description, Ceremony Type, Vows Type,
              Language, Event Date, Event Time, Location, and Officiant Name
              must be filled to submit.
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Content Preview */}
      {selectedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {getOptionLabel(
                    selectedModal.optionId,
                    selectedModal.category
                  )}{" "}
                  - Preview
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
                  {getOptionContent(
                    selectedModal.optionId,
                    selectedModal.category,
                    watch("groomName") || partner1Name || "Partner 1's Name",
                    watch("brideName") || partner2Name || "Partner 2's Name"
                  )}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
