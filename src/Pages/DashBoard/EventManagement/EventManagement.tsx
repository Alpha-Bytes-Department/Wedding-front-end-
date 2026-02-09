import { useEffect, useState } from "react";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useAxios } from "../../../Component/Providers/useAxios";
import { GlassSwal } from "../../../utils/glassSwal";

interface Event {
  _id: string;
  title: string;
  price?: number;
  description: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  status: string;
  userId: string;
  officiantId?: string;
  officiantName?: string;
  groomName?: string;
  brideName?: string;
  rehearsalDate?: string;
  createdAt: string;
}

interface Officiant {
  _id: string;
  name: string;
  email: string;
  availability: boolean;
  experience?: string;
}

const EventManagement = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const [events, setEvents] = useState<Event[]>([]);
  const [officiants, setOfficiants] = useState<Officiant[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user is admin
  const isAdmin =
    user?.email === "joysutradharaj@gmail.com" ||
    user?.email === "steve@erieweddingofficiants.com";

  useEffect(() => {
    if (isAdmin) {
      fetchEvents();
      fetchOfficiants();
    }
  }, [isAdmin]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/events/officiantAccess/all");
      console.log("Fetched events:", response.data);
      setEvents(response.data.events || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      await GlassSwal.error(
        "Error",
        error.response?.data?.error || "Failed to fetch events"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficiants = async () => {
    try {
      const response = await axiosSecure.get("/users/officiants");
      console.log("Fetched officiants:", response.data.officiants);
      setOfficiants(response.data.officiants || []);
    } catch (error: any) {
      console.error("Error fetching officiants:", error);
    }
  };

  const handleAssignOfficiant = async (
    status: string,
    eventId: string,
    officiantId: string
  ) => {
    if (status === "completed" || status === "canceled") {
      await GlassSwal.error(
        "Invalid Action",
        "Cannot assign an officiant to a completed or canceled event."
      );
      return;
    }
    const selectedOfficiant = officiants.find((o) => o._id === officiantId);
    if (!selectedOfficiant) return;

    if (!selectedOfficiant.availability) {
      await GlassSwal.error(
        "Unavailable",
        "This officiant is currently not available. Please select another officiant."
      );
      return;
    }

    const confirmed = await GlassSwal.confirm(
      "Assign Officiant",
      `Are you sure you want to assign ${selectedOfficiant.name} to this event?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await axiosSecure.post(`/events/assign-officiant/${eventId}`, {
        officiantId: selectedOfficiant._id,
        officiantName: selectedOfficiant.name,
      });

      await GlassSwal.success("Success", "Officiant assigned successfully!");
      fetchEvents(); // Refresh events
    } catch (error: any) {
      console.error("Error assigning officiant:", error);
      await GlassSwal.error(
        "Error",
        error.response?.data?.error || "Failed to assign officiant"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events
    .filter((event) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "assigned") return event.officiantId;
      if (filterStatus === "unassigned") return !event.officiantId;
      return event.status === filterStatus;
    })
    .filter((event) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        event.title?.toLowerCase().includes(search) ||
        event.groomName?.toLowerCase().includes(search) ||
        event.brideName?.toLowerCase().includes(search) ||
        event.officiantName?.toLowerCase().includes(search) ||
        event.location?.toLowerCase().includes(search)
      );
    });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Event Management Portal
          </h1>
          <p className="text-gray-600">
            Manage all events and assign officiants
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
                <option value="planned">Planned</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Events
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, names, location..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Assigned</p>
            <p className="text-2xl font-bold text-green-600">
              {events.filter((e) => e.officiantId).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Unassigned</p>
            <p className="text-2xl font-bold text-orange-600">
              {events.filter((e) => !e.officiantId).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Available Officiants</p>
            <p className="text-2xl font-bold text-blue-600">
              {officiants.filter((o) => o.availability).length}
            </p>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No events found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-100 to-yellow-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Event Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Officiant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">
                            {event.title}
                          </p>
                          {(event.groomName || event.brideName) && (
                            <p className="text-sm text-gray-600">
                              {event.groomName} & {event.brideName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      </td>
                      <td>{event?.price ? `$${event.price}` : "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {event.eventDate && (
                            <p className="text-gray-900">
                              📅{" "}
                              {new Date(event.eventDate).toLocaleDateString('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          )}
                          {event.eventTime && (
                            <p className="text-gray-600">
                              🕒{" "}
                              {new Date(event.eventTime).toLocaleTimeString(
                                'en-US',
                                { timeZone: 'America/New_York', hour: "2-digit", minute: "2-digit", hour12: true }
                              )}
                            </p>
                          )}
                          {event.location && (
                            <p className="text-gray-600">📍 {event.location}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : event.status === "approved"
                              ? "bg-blue-100 text-blue-800"
                              : event.status === "submitted"
                              ? "bg-yellow-100 text-yellow-800"
                              : event.status === "canceled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {event.officiantId ? (
                          <div className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            <span className="text-sm text-gray-900">
                              {event.officiantName}
                            </span>
                          </div>
                        ) : (
                          <select
                            onChange={(e) =>
                              handleAssignOfficiant(
                                event.status,
                                event._id,
                                e.target.value
                              )
                            }
                            defaultValue=""
                            className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="" disabled>
                              Select Officiant
                            </option>
                            {officiants.map((officiant) => (
                              <option
                                key={officiant._id}
                                value={officiant._id}
                                disabled={!officiant.availability}
                              >
                                {officiant.name}
                                {!officiant.availability && " (Unavailable)"}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="text-primary hover:text-primary-dark font-medium text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-[#2b2525b0] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-white">Event Details</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Title and Description */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedEvent.title}
                </h3>
                {selectedEvent.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                )}
              </div>

              {/* Couple Information */}
              {(selectedEvent.groomName || selectedEvent.brideName) && (
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    👰🤵 Couple Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedEvent.groomName && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Partner 1</p>
                        <p className="font-semibold text-gray-900">
                          {selectedEvent.groomName}
                        </p>
                      </div>
                    )}
                    {selectedEvent.brideName && (
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Partner 2</p>
                        <p className="font-semibold text-gray-900">
                          {selectedEvent.brideName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Event Schedule */}
              {(selectedEvent.eventDate ||
                selectedEvent.eventTime ||
                selectedEvent.rehearsalDate) && (
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    📅 Schedule
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEvent.eventDate && (
                      <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <span className="text-2xl">📅</span>
                        <div>
                          <p className="text-sm text-gray-600">Event Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(
                              selectedEvent.eventDate
                            ).toLocaleDateString("en-US", {
                              timeZone: "America/New_York",
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedEvent.eventTime && (
                      <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <span className="text-2xl">🕒</span>
                        <div>
                          <p className="text-sm text-gray-600">Event Time</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(
                              selectedEvent.eventTime
                            ).toLocaleTimeString("en-US", {
                              timeZone: "America/New_York",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedEvent.rehearsalDate && (
                      <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <span className="text-2xl">🎭</span>
                        <div>
                          <p className="text-sm text-gray-600">
                            Rehearsal Date
                          </p>
                          <p className="font-semibold text-gray-900">
                            {new Date(
                              selectedEvent.rehearsalDate
                            ).toLocaleDateString("en-US", {
                              timeZone: "America/New_York",
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location */}
              {selectedEvent.location && (
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    📍 Location
                  </h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>
              )}

              {/* Officiant Information */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  👔 Officiant
                </h4>
                <div
                  className={`p-4 rounded-lg ${
                    selectedEvent.officiantName ? "bg-green-50" : "bg-yellow-50"
                  }`}
                >
                  {selectedEvent.officiantName ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 text-xl">✓</span>
                      <p className="font-semibold text-gray-900">
                        {selectedEvent.officiantName}
                      </p>
                      {selectedEvent.officiantId && (
                        <span className="text-xs text-gray-500">
                          (ID: {selectedEvent.officiantId})
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600 text-xl">⚠️</span>
                      <p className="text-gray-700">No officiant assigned yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Financial */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  💼 Event Status & Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span
                      className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                        selectedEvent.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedEvent.status === "approved"
                          ? "bg-blue-100 text-blue-800"
                          : selectedEvent.status === "submitted"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedEvent.status === "canceled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedEvent.status}
                    </span>
                  </div>
                  {selectedEvent.price !== undefined && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Price</p>
                      <p className="text-xl font-bold text-green-600">
                        ${selectedEvent.price}
                      </p>
                    </div>
                  )}
                  {selectedEvent.createdAt && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Created On</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {new Date(selectedEvent.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            timeZone: "America/New_York",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* IDs Section */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  🔑 Reference IDs
                </h4>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Event ID:</span>
                    <code className="text-xs bg-white px-2 py-1 rounded border font-mono">
                      {selectedEvent._id}
                    </code>
                  </div>
                  {selectedEvent.userId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">User ID:</span>
                      <code className="text-xs bg-white px-2 py-1 rounded border font-mono">
                        {selectedEvent.userId}
                      </code>
                    </div>
                  )}
                  {selectedEvent.officiantId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Officiant ID:
                      </span>
                      <code className="text-xs bg-white px-2 py-1 rounded border font-mono">
                        {selectedEvent.officiantId}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-3 rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all font-semibold shadow-lg"
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

export default EventManagement;
