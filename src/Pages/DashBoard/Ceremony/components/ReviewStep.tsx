import type { CeremonyFormData } from "../types";

interface ReviewStepProps {
  watch: (name: keyof CeremonyFormData) => string;
}

const ReviewStep = ({ watch }: ReviewStepProps) => {
  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
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
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">Title:</span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary block">
                {watch("title") || "Not specified"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Ceremony Type:
              </span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary block">
                {watch("ceremonyType") || "Not specified"}
              </span>
            </div>
          </div>
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

      {/* Vows Section */}
      <div className="bg-[#e0b84c1c]  rounded-xl p-6 ">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            2
          </span>
          Vows & Language
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">
                Vows Type:
              </span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary block">
                {watch("vowsType") || "Not specified"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">Language:</span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border border-primary block">
                {watch("language") || "Not specified"}
              </span>
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700 block">
              Vows Description:
            </span>
            <div className="text-gray-900 bg-white px-3 py-2 rounded border border-primary min-h-[80px]">
              {watch("vowDescription") ||
                "No specific vows description provided"}
            </div>
          </div>
        </div>
      </div>

      {/* Rituals Section */}
      <div className="bg-[#e0b84c1c] rounded-xl p-6 ">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-[#e0b84c] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            3
          </span>
          Rituals & Music
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700 block">Rituals:</span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border block">
                {watch("rituals") || "No rituals specified"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 block">
                Music Cues:
              </span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border block">
                {watch("musicCues") || "No music cues specified"}
              </span>
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700 block">
              Rituals Description:
            </span>
            <div className="text-gray-900 bg-white px-3 py-2 rounded border min-h-[80px]">
              {watch("ritualsDescription") ||
                "No specific rituals description provided"}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-[#e0b84c1c] rounded-xl p-6 ">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-[#e0b84c] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            4
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
            <div>
              <span className="font-medium text-gray-700 block">
                Officiant:
              </span>
              <span className="text-gray-900 bg-white px-3 py-2 rounded border block">
                {watch("officiantName") || "Officiant not specified"}
              </span>
            </div>
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
    </div>
  );
};

export default ReviewStep;
