import { useEffect, useState, useCallback } from "react";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import GlassSwal from "../../../utils/glassSwal";

interface CeremonyEvent {
  _id: string;
  title: string;
  description: string;
  ceremonyType: string;
  groomName?: string;
  brideName?: string;
  language?: string;
  greetingSpeech?: string;
  presentationOfBride?: string;
  questionForPresentation?: string;
  responseToQuestion?: string;
  invocation?: string;
  chargeToGroomAndBride?: string;
  pledge?: string;
  introductionToExchangeOfVows?: string;
  vows?: string;
  readings?: string;
  introductionToExchangeOfRings?: string;
  blessingsOfRings?: string;
  exchangeOfRingsGroom?: string;
  exchangeOfRingsBride?: string;
  prayerOnTheNewUnion?: string;
  ritualsSelection?: string;
  ritualsOption?: string;
  closingStatement?: string;
  pronouncing?: string;
  kiss?: string;
  introductionOfCouple?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  rehearsalDate?: string;
  officiantId?: string;
  officiantName?: string;
  userId: string;
  status: "planned" | "submitted" | "approved" | "completed" | "canceled" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

const CeremonyReview = () => {
  const [events, setEvents] = useState<CeremonyEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CeremonyEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const axios = useAxios();
  const { user } = useAuth();

  const fetchEvents = useCallback(async () => {
    if (!user?._id) return;
    setFetchLoading(true);
    try {
      const { data } = await axios.get(`/events/by-role/${user._id}/${user?.role}`);
      console.log("API Response:", data);
      // Ensure data is an array
      if (Array.isArray(data)) {
        setEvents(data);
      } else if (data && Array.isArray(data.events)) {
        // In case the API returns { events: [...] }
        setEvents(data.events);
      } else {
        console.warn("API did not return an array:", data);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]); // Set empty array on error
    } finally {
      setFetchLoading(false);
    }
  }, [user?._id, user?.role, axios]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateEventStatus = async (eventId: string, newStatus: "approved" | "canceled" | "completed") => {
    setLoading(true);
    try {
      const willUpdate = await GlassSwal.confirm(
        "Are you sure?",
        `Are you sure you want to ${newStatus} this event?`
      );
      console.log("User confirmation result:", willUpdate);
      if (willUpdate.isConfirmed) {
        await axios.patch(`/events/update/${eventId}`, { status: newStatus });
        // Update the local state
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event._id === eventId
              ? { ...event, status: newStatus }
              : event
          )
        );
        console.log(`Event ${eventId} status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error(`Error updating event status to ${newStatus}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (eventId: string) => {
    updateEventStatus(eventId, "approved");
  };

  const handleCancel = (eventId: string) => {
    updateEventStatus(eventId, "canceled");
  };

  const openViewModal = (event: CeremonyEvent) => {
    setSelectedEvent(event);
    (document.getElementById("ceremony_view_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-primary font-bold text-gray-900 mb-8">
        Ceremony Review
      </h1>

      {fetchLoading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">Loading ceremonies...</p>
        </div>
      ) : !Array.isArray(events) || events.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">
            No ceremonies found for review.
          </p>
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-2xl border border-primary p-4 md:p-6 shadow-xl w-full flex flex-col"
          >
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <span className="text-primary font-primary font-medium text-base md:text-lg">
                  Title:{" "}
                  <span className="font-medium text-black">{event.title}</span>
                </span>
                <span
                  className={`p-1 border border-primary rounded-full px-2 text-center font-bold ${
                    event.status === "approved"
                      ? "text-green-600"
                      : event.status === "planned"
                      ? "text-yellow-600"
                      : event.status === "submitted"
                      ? "text-blue-600"
                      : event.status === "completed"
                      ? "text-blue-600"
                      : event.status === "canceled" ||
                        event.status === "cancelled"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <span className="text-xs text-primary font-secondary mt-2 md:mt-0">
                {new Date(event.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* User Information */}
            <hr className="border-t border-primary mb-4" />
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-primary font-medium">Couple:</span>
                  <span className="text-gray-700 ml-2">
                    {event.groomName && event.brideName
                      ? `${event.groomName} & ${event.brideName}`
                      : "Names not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-primary font-medium">Event Date:</span>
                  <span className="text-gray-700 ml-2">
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString()
                      : "Date not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-primary font-medium">Location:</span>
                  <span className="text-gray-700 ml-2">
                    {event.location || "Location not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-primary font-medium">Officiant:</span>
                  <span className="text-gray-700 ml-2">
                    {event.officiantName || "Officiant not specified"}
                  </span>
                </div>
              </div>
            </div>
 
            {/* Description */}
            <hr className="border-t border-primary mb-4" />
            <div className="text-gray-700 min-h-24 text-sm md:text-base mb-4">
              {event.description || "No description provided"}
            </div>
            <hr className="border-t border-primary mb-4" />

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              {event.status !== "canceled" && event.status !== "completed" && (
                <button
                  onClick={() => handleCancel(event._id)}
                  disabled={loading}
                  className="px-6 py-2 border border-red-500 text-red-500 rounded-full font-medium hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Cancel"}
                </button>
              )}
              {event.status == "approved" && (
                <button
                  onClick={() => updateEventStatus(event._id, "completed")}
                  disabled={loading}
                  className="px-6 py-2 border border-blue-300 text-blue-500 rounded-full font-medium hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Complete"}
                </button>
              )}
              {event.status !== "approved" && event.status !== "completed" && (
                <button
                  onClick={() => handleApprove(event._id)}
                  disabled={loading}
                  className="px-6 py-2 border border-green-500 text-green-500 rounded-full font-medium hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Approve"}
                </button>
              )}
              <button
                onClick={() => openViewModal(event)}
                className="px-6 py-2 border border-primary text-[#e0b94c] rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
              >
                View
              </button>
            </div>
          </div>
        ))
      )}

      {/* View Modal */}
      <dialog id="ceremony_view_modal" className="modal">
        <div className="modal-box max-w-5xl bg-white text-gray-800 rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-10">
              ✕
            </button>
          </form>

          {selectedEvent && (
            <>
              <h2 className="text-2xl font-bold text-[#e0b94c] mb-6 pr-8">
                {selectedEvent.title}
              </h2>

              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Ceremony Type</p>
                    <p className="font-semibold">
                      {selectedEvent.ceremonyType || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Language</p>
                    <p className="font-semibold">
                      {selectedEvent.language || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Event Date</p>
                    <p className="font-semibold">
                      {selectedEvent.eventDate
                        ? new Date(selectedEvent.eventDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Event Time</p>
                    <p className="font-semibold">
                      {selectedEvent.eventTime
                        ? new Date(selectedEvent.eventTime).toLocaleTimeString(
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
                      {selectedEvent.location || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Officiant</p>
                    <p className="font-semibold">
                      {selectedEvent.officiantName || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rehearsal Date</p>
                    <p className="font-semibold">
                      {selectedEvent.rehearsalDate
                        ? new Date(
                            selectedEvent.rehearsalDate
                          ).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className="px-3 py-1 text-sm rounded-full bg-[#e0b94c] text-white font-medium">
                      {selectedEvent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Couple Information */}
              {(selectedEvent.groomName || selectedEvent.brideName) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                    Couple
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedEvent.groomName && (
                      <div>
                        <p className="text-sm text-gray-500">Groom's Name</p>
                        <p className="font-semibold">
                          {selectedEvent.groomName}
                        </p>
                      </div>
                    )}
                    {selectedEvent.brideName && (
                      <div>
                        <p className="text-sm text-gray-500">Bride's Name</p>
                        <p className="font-semibold">
                          {selectedEvent.brideName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedEvent.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                    Description
                  </h3>
                  <p className="font-medium text-gray-700 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Greeting Elements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  Greeting Elements
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Greeting Speech", key: "greetingSpeech" },
                    {
                      label: "Presentation of Bride",
                      key: "presentationOfBride",
                    },
                    {
                      label: "Question for Presentation",
                      key: "questionForPresentation",
                    },
                    {
                      label: "Response to Question",
                      key: "responseToQuestion",
                    },
                    { label: "Invocation", key: "invocation" },
                  ].map((item) => {
                    const content = selectedEvent[
                      item.key as keyof CeremonyEvent
                    ] as string;
                    return content ? (
                      <div key={item.key}>
                        <p className="text-sm text-gray-500 font-medium">
                          {item.label}
                        </p>
                        <p className="font-medium text-gray-700 mt-1">
                          {content}
                        </p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Vows Elements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  Vows Elements
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Charge to Groom and Bride",
                      key: "chargeToGroomAndBride",
                    },
                    { label: "Pledge", key: "pledge" },
                    {
                      label: "Introduction to Exchange of Vows",
                      key: "introductionToExchangeOfVows",
                    },
                    { label: "Vows", key: "vows" },
                    { label: "Readings", key: "readings" },
                    {
                      label: "Introduction to Exchange of Rings",
                      key: "introductionToExchangeOfRings",
                    },
                    { label: "Blessings of Rings", key: "blessingsOfRings" },
                    {
                      label: "Exchange of Rings (Groom)",
                      key: "exchangeOfRingsGroom",
                    },
                    {
                      label: "Exchange of Rings (Bride)",
                      key: "exchangeOfRingsBride",
                    },
                    {
                      label: "Prayer on the New Union",
                      key: "prayerOnTheNewUnion",
                    },
                  ].map((item) => {
                    const content = selectedEvent[
                      item.key as keyof CeremonyEvent
                    ] as string;
                    return content ? (
                      <div key={item.key}>
                        <p className="text-sm text-gray-500 font-medium">
                          {item.label}
                        </p>
                        <p className="font-medium text-gray-700 mt-1">
                          {content}
                        </p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Ritual Elements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  Ritual Elements
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Rituals Selection", key: "ritualsSelection" },
                    { label: "Rituals Option", key: "ritualsOption" },
                    { label: "Closing Statement", key: "closingStatement" },
                    { label: "Pronouncing", key: "pronouncing" },
                    { label: "Kiss", key: "kiss" },
                    {
                      label: "Introduction of Couple",
                      key: "introductionOfCouple",
                    },
                  ].map((item) => {
                    const content = selectedEvent[
                      item.key as keyof CeremonyEvent
                    ] as string;
                    return content ? (
                      <div key={item.key}>
                        <p className="text-sm text-gray-500 font-medium">
                          {item.label}
                        </p>
                        <p className="font-medium text-gray-700 mt-1">
                          {content}
                        </p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Timestamps */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Created: </span>
                    {new Date(
                      selectedEvent.createdAt
                    ).toLocaleDateString()} at{" "}
                    {new Date(selectedEvent.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated: </span>
                    {new Date(
                      selectedEvent.updatedAt
                    ).toLocaleDateString()} at{" "}
                    {new Date(selectedEvent.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}

export default CeremonyReview