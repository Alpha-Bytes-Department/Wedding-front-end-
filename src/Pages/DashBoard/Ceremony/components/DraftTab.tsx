import type { CeremonyData } from "../types";

interface DraftTabProps {
  drafts: CeremonyData[];
  onContinueDraft: (draft: CeremonyData) => void;
  onDeleteDraft: (id: string) => void;
  onCreateNew: () => void;
}

const DraftTab = ({
  drafts,
  onContinueDraft,
  onDeleteDraft,
  onCreateNew,
}: DraftTabProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-primary font-bold text-gray-900 mb-8">
        Draft Ceremonies
      </h1>
      {drafts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">No draft ceremonies found.</p>
          <button
            onClick={onCreateNew}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create New Ceremony
          </button>
        </div>
      ) : (
        drafts.map((draft) => (
          <div
            key={draft.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-primary font-semibold text-gray-900 mb-2 break-words">
                  {draft.title || "Untitled Ceremony"}
                </h3>
                <p className="text-sm sm:text-base font-primary text-gray-600 mb-2">
                  Type: {draft.type}
                </p>
                <p className="text-sm sm:text-base font-primary text-gray-600 mb-4">
                  Last updated: {draft.updatedAt}
                </p>
                {draft.description && (
                  <p className="text-sm sm:text-base font-primary text-gray-700 mb-4 break-words">
                    {draft.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-4 w-full sm:w-auto">
                <button
                  onClick={() => onContinueDraft(draft)}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-primary font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
                >
                  Continue
                </button>
                <button
                  onClick={() => onDeleteDraft(draft.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-primary font-medium hover:bg-red-600 transition-colors text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DraftTab;
