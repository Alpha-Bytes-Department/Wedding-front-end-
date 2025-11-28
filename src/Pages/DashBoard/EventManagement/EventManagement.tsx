import { useEffect, useState } from "react";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useAxios } from "../../../Component/Providers/useAxios";
import { GlassSwal } from "../../../utils/glassSwal";

interface Event {
  _id: string;
  title: string;
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
      const response = await axiosSecure.get("/event/officiantAccess/all");
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
      const response = await axiosSecure.get("/user/officiants");
      setOfficiants(response.data || []);
    } catch (error: any) {
      console.error("Error fetching officiants:", error);
    }
  };

  const handleAssignOfficiant = async (
    eventId: string,
    officiantId: string
  ) => {
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
      await axiosSecure.post(`/event/assign-officiant/${eventId}`, {
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
                        <div>
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
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {event.eventDate && (
                            <p className="text-gray-900">
                              📅{" "}
                              {new Date(event.eventDate).toLocaleDateString()}
                            </p>
                          )}
                          {event.eventTime && (
                            <p className="text-gray-600">
                              🕒{" "}
                              {new Date(event.eventTime).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
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
                              handleAssignOfficiant(event._id, e.target.value)
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Event Details</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedEvent.title}
                </h3>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedEvent.groomName && (
                  <div>
                    <p className="text-sm text-gray-500">Groom</p>
                    <p className="font-medium">{selectedEvent.groomName}</p>
                  </div>
                )}
                {selectedEvent.brideName && (
                  <div>
                    <p className="text-sm text-gray-500">Bride</p>
                    <p className="font-medium">{selectedEvent.brideName}</p>
                  </div>
                )}
                {selectedEvent.eventDate && (
                  <div>
                    <p className="text-sm text-gray-500">Event Date</p>
                    <p className="font-medium">
                      {new Date(selectedEvent.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {selectedEvent.eventTime && (
                  <div>
                    <p className="text-sm text-gray-500">Event Time</p>
                    <p className="font-medium">
                      {new Date(selectedEvent.eventTime).toLocaleTimeString()}
                    </p>
                  </div>
                )}
                {selectedEvent.location && (
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{selectedEvent.location}</p>
                  </div>
                )}
                {selectedEvent.rehearsalDate && (
                  <div>
                    <p className="text-sm text-gray-500">Rehearsal Date</p>
                    <p className="font-medium">
                      {new Date(
                        selectedEvent.rehearsalDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">
                    {selectedEvent.status}
                  </p>
                </div>
                {selectedEvent.officiantName && (
                  <div>
                    <p className="text-sm text-gray-500">Assigned Officiant</p>
                    <p className="font-medium">{selectedEvent.officiantName}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-2 rounded-lg hover:from-orange-500 hover:to-yellow-500 transition-all"
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
