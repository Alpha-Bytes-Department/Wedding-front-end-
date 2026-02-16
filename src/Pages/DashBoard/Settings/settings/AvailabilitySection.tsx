interface AvailabilitySectionProps {
  privacy: { availability: boolean };
  setPrivacy: (value: { availability: boolean }) => void;
  onPrivacySave: () => void;
}

const AvailabilitySection = ({
  privacy,
  setPrivacy,
  onPrivacySave,
}: AvailabilitySectionProps) => {
  return (
    <div className="bg-white rounded-2xl w-full shadow-md border border-primary p-6">
      <h2 className="text-2xl font-primary font-bold text-gray-900 mb-6">
        Your Availability
      </h2>
      <div className="space-y-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <span className="text-gray-700 block">
              Adjust your availability as an officiant
            </span>
            <p className=" pt-5">
              Current status :{" "}
              {privacy.availability ? (
                <span className="py-1 px-2 rounded-full bg-amber-100 duration-500 ease-in text-amber-800 ml-6">
                  Available
                </span>
              ) : (
                <span className="py-1 px-3 rounded-full bg-gray-100 duration-500 ease-in text-slate-500 ml-6">
                  Not available
                </span>
              )}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              checked={privacy.availability}
              onChange={(e) =>
                setPrivacy({
                  ...privacy,
                  availability: e.target.checked,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
      <button
        onClick={onPrivacySave}
        className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Save Privacy Settings
      </button>
    </div>
  );
};

export default AvailabilitySection;
