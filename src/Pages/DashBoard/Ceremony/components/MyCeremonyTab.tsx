import { useState } from "react";
import type { CeremonyData } from "../types";

interface MyCeremonyTabProps {
  ceremonies: CeremonyData[];
  onDeleteCeremony: (id: string) => void | Promise<void>;
  onCreateNew: () => void;
  loading?: boolean;
}

const MyCeremonyTab = ({
  ceremonies,
  onDeleteCeremony,
  onCreateNew,
  loading = false,
}: MyCeremonyTabProps) => {
  const [selectedCeremony, setSelectedCeremony] = useState<CeremonyData | null>(
    null
  );

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
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <span className="text-primary font-primary font-medium text-base md:text-lg">
                  Title :{" "}
                  <span className="font-medium text-black">
                    {ceremony.title}
                  </span>
                </span>
                <span
                  className={`p-1 border border-primary rounded-full px-2 text-center font-bold ${
                    ceremony.status === "approved"
                      ? "text-green-600"
                      : ceremony.status === "planned"
                      ? "text-yellow-600"
                      : ceremony.status === "submitted"
                      ? "text-gray-600"
                      : ceremony.status === "completed"
                      ? "text-blue-600"
                      : ceremony.status === "canceled" ||
                        ceremony.status === "cancelled"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {ceremony.status}
                </span>
              </div>
              <span className="text-xs text-primary font-secondary mt-2 md:mt-0">
                {new Date(ceremony.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Description */}
            <hr className="border-t border-primary mb-4" />
            <div className="text-gray-700 min-h-24 text-sm md:text-base mb-4">
              {ceremony.description || "No description provided"}
            </div>
            <hr className="border-t border-primary mb-4" />

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() =>
                  onDeleteCeremony(ceremony.id || ceremony._id || "")
                }
                disabled={loading}
                className="px-6 py-2 border border-primary text-[#e0b94c] rounded-full font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => {
                  setSelectedCeremony(ceremony);
                  document.getElementById("ceremony_modal")?.showModal();
                }}
                className="px-6 py-2 border border-primary text-[#e0b94c] rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
              >
                View
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      <dialog id="ceremony_modal" className="modal">
        <div className="modal-box max-w-3xl bg-white text-gray-800 rounded-2xl shadow-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">
              ✕
            </button>
          </form>

          {selectedCeremony && (
            <>
              <h2 className="text-2xl font-bold text-[#e0b94c] mb-4">
                {selectedCeremony.title}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ceremony Type</p>
                  <p className="font-semibold">
                    {selectedCeremony.ceremonyType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vows Type</p>
                  <p className="font-semibold">
                    {selectedCeremony.vowsType || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Language</p>
                  <p className="font-semibold">
                    {selectedCeremony.language || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Event Date</p>
                  <p className="font-semibold">
                    {selectedCeremony.eventDate
                      ? new Date(
                          selectedCeremony.eventDate
                        ).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Event Time</p>
                  <p className="font-semibold">
                    {selectedCeremony.eventTime
                      ? new Date(selectedCeremony.eventTime).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">
                    {selectedCeremony.location || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Officiant</p>
                  <p className="font-semibold">
                    {selectedCeremony.officiantName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="px-3 py-1 text-sm rounded-full bg-[#e0b94c] text-white font-medium">
                    {selectedCeremony.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedCeremony.description}</p>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default MyCeremonyTab;
