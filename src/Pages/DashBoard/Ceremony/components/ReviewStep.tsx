import { useState } from "react";
import type { CeremonyFormData } from "../types";
import { useCeremonyContext } from "../contexts/CeremonyContext";
import ReviewSection from "./reviewStep/ReviewSection";
import ReviewField from "./reviewStep/ReviewField";
import ContentPreviewModal from "./reviewStep/ContentPreviewModal";
import { formatDate, formatTime } from "./reviewStep/helpers";

interface ReviewStepProps {
  watch: (name: keyof CeremonyFormData) => string;
  setValue: (name: keyof CeremonyFormData, value: string) => void;
}

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
      <ReviewSection stepNumber={1} title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReviewField
            label="Description"
            value={watch("description") || "No description provided"}
            isTextArea
          />
        </div>
      </ReviewSection>

      {/* Greetings Section */}
      <ReviewSection stepNumber={2} title="Greetings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <ReviewField label="Partner 1's Name" value={watch("groomName")} />
            <ReviewField label="Partner 2's Name" value={watch("brideName")} />
            <ReviewField label="Language" value={watch("language")} />
            <ReviewField
              label="Greeting Speech"
              value={watch("greetingSpeech")}
              category="greetingSpeech"
              onPreview={() =>
                openModal("greetingSpeech", watch("greetingSpeech"))
              }
            />
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">
                Presentation of Bride:
              </span>
              <div className="space-y-2">
                <ReviewField
                  label=""
                  value={watch("presentationOfBride")}
                  category="presentationOfBride"
                  isTextArea
                />
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
                <ReviewField
                  label=""
                  value={watch("questionForPresentation")}
                  category="questionForPresentation"
                  isTextArea
                />
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
                <ReviewField
                  label=""
                  value={watch("responseToQuestion")}
                  category="responseToQuestion"
                  isTextArea
                />
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
                <ReviewField
                  label=""
                  value={watch("invocation")}
                  category="invocation"
                  isTextArea
                />
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
      </ReviewSection>

      {/* Vows Section */}
      <ReviewSection stepNumber={3} title="Vows">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <ReviewField
              label="Charge to Partner 1 and Partner 2"
              value={watch("chargeToGroomAndBride")}
              category="chargeToGroomAndBride"
              onPreview={() =>
                openModal(
                  "chargeToGroomAndBride",
                  watch("chargeToGroomAndBride")
                )
              }
            />
            <ReviewField
              label="Pledge"
              value={watch("pledge")}
              category="pledge"
              onPreview={() => openModal("pledge", watch("pledge"))}
            />
            <ReviewField
              label="Introduction to Exchange of Vows"
              value={watch("introductionToExchangeOfVows")}
              category="introductionToExchangeOfVows"
              onPreview={() =>
                openModal(
                  "introductionToExchangeOfVows",
                  watch("introductionToExchangeOfVows")
                )
              }
            />
            <ReviewField
              label="Vows"
              value={watch("vows")}
              category="vows"
              onPreview={() => openModal("vows", watch("vows"))}
            />
            <ReviewField
              label="Readings"
              value={watch("readings")}
              category="readings"
              onPreview={() => openModal("readings", watch("readings"))}
            />
          </div>
          <div className="space-y-3">
            <ReviewField
              label="Introduction to Exchange of Rings"
              value={watch("introductionToExchangeOfRings")}
              category="introductionToExchangeOfRings"
              onPreview={() =>
                openModal(
                  "introductionToExchangeOfRings",
                  watch("introductionToExchangeOfRings")
                )
              }
            />
            <ReviewField
              label="Blessings of Rings"
              value={watch("blessingsOfRings")}
              category="blessingsOfRings"
              onPreview={() =>
                openModal("blessingsOfRings", watch("blessingsOfRings"))
              }
            />
            <ReviewField
              label="Exchange of Rings - Partner 1"
              value={watch("exchangeOfRingsGroom")}
              category="exchangeOfRingsGroom"
              onPreview={() =>
                openModal("exchangeOfRingsGroom", watch("exchangeOfRingsGroom"))
              }
            />
            <ReviewField
              label="Exchange of Rings - Partner 2"
              value={watch("exchangeOfRingsBride")}
              category="exchangeOfRingsBride"
              onPreview={() =>
                openModal("exchangeOfRingsBride", watch("exchangeOfRingsBride"))
              }
            />
            <ReviewField
              label="Prayer on the New Union"
              value={watch("prayerOnTheNewUnion")}
              category="prayerOnTheNewUnion"
              onPreview={() =>
                openModal("prayerOnTheNewUnion", watch("prayerOnTheNewUnion"))
              }
            />
          </div>
        </div>
      </ReviewSection>

      {/* Rituals Section */}
      <ReviewSection stepNumber={4} title="Rituals" usePrimaryBg={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <ReviewField
              label="Ritual Selection"
              value={watch("ritualsSelection")}
            />
            <ReviewField
              label="Ritual Option"
              value={watch("ritualsOption")}
              category="ritualsOption"
              onPreview={() =>
                openModal("ritualsOption", watch("ritualsOption"))
              }
            />
            <ReviewField
              label="Closing Statement"
              value={watch("closingStatement")}
              category="closingStatement"
              onPreview={() =>
                openModal("closingStatement", watch("closingStatement"))
              }
            />
          </div>
          <div className="space-y-3">
            <ReviewField
              label="Pronouncing"
              value={watch("pronouncing")}
              category="pronouncing"
              onPreview={() =>
                openModal("pronouncing", watch("pronouncing"))
              }
            />
            <ReviewField
              label="Kiss"
              value={watch("kiss")}
              category="kiss"
              onPreview={() => openModal("kiss", watch("kiss"))}
            />
            <ReviewField
              label="Introduction of Couple"
              value={watch("introductionOfCouple")}
              category="introductionOfCouple"
              onPreview={() =>
                openModal(
                  "introductionOfCouple",
                  watch("introductionOfCouple")
                )
              }
            />
          </div>
        </div>
      </ReviewSection>

      {/* Schedule Section */}
      <ReviewSection stepNumber={5} title="Schedule & Location" usePrimaryBg={false}>
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
          </div>
        </div>
      </ReviewSection>

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
        <ContentPreviewModal
          category={selectedModal.category}
          optionId={selectedModal.optionId}
          partner1Name={
            watch("groomName") || partner1Name || "Partner 1's Name"
          }
          partner2Name={
            watch("brideName") || partner2Name || "Partner 2's Name"
          }
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ReviewStep;
