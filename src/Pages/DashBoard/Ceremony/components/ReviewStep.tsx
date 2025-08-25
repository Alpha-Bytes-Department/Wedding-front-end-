import type { CeremonyFormData } from "../types";

interface ReviewStepProps {
  watch: (name: keyof CeremonyFormData) => string;
}

const ReviewStep = ({ watch }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-primary font-bold text-gray-900 mb-6">
        Finalized Ceremony
      </h2>
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        {[
          { label: "Title", value: watch("title") },
          { label: "Type", value: watch("type") },
          { label: "Vows", value: watch("vowsType") },
          {
            label: "Rituals",
            value: `${watch("rituals")} (${watch("language")})`,
          },
          { label: "Schedule", value: watch("musicCue") || "none - No music" },
          { label: "Notes", value: watch("notes") || "Notes" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
          >
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="text-gray-600">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewStep;
