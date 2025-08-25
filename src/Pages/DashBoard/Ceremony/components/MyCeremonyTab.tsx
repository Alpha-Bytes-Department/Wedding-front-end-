import type { CeremonyData } from "../types";

interface MyCeremonyTabProps {
  ceremonies: CeremonyData[];
  onDeleteCeremony: (id: string) => void;
  onCreateNew: () => void;
}

const MyCeremonyTab = ({
  ceremonies,
  onDeleteCeremony,
  onCreateNew,
}: MyCeremonyTabProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-primary font-bold text-gray-900 mb-8">
        My Ceremonies
      </h1>
      {ceremonies.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">
            No completed ceremonies found.
          </p>
          <button
            onClick={onCreateNew}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create New Ceremony
          </button>
        </div>
      ) : (
        ceremonies.map((ceremony) => (
          <div
            key={ceremony.id}
            className="bg-white rounded-2xl border border-primary p-4 md:p-6 shadow-xl w-full flex flex-col"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <span className="text-primary font-primary font-medium text-base md:text-lg">
                  Title :{" "}
                  <span className="font-medium text-black">
                    {ceremony.title}
                  </span>
                </span>
              </div>
              <span className="text-xs text-primary font-secondary mt-2 md:mt-0">
                {ceremony.createdAt}
              </span>
            </div>
            <hr className="border-t border-primary mb-4" />
            <div className="text-gray-700 min-h-24 text-sm md:text-base mb-4">
              {
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever."}
            </div>
            <hr className="border-t border-primary mb-4" />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => onDeleteCeremony(ceremony.id)}
                className="px-6 py-2 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
              >
                Delete
              </button>
              <button className="px-6 py-2 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-colors">
                View
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyCeremonyTab;
