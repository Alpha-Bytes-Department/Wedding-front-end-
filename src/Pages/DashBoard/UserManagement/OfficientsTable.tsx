import React, { useState, useMemo } from "react";
import {
  FaUser,
  FaEye,
  FaEdit,
  FaTrash,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import Swal from "sweetalert2";
import GlassSwal from "../../../utils/glassSwal";
import { useAxios } from "../../../Component/Providers/useAxios";
import type { Officiant } from "./types";
import { getProfileImageUrl } from "./types";
import Pagination from "./Pagination";

interface OfficientsTableProps {
  officiants: Officiant[];
  onRefresh: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange: (page: number) => void;
}

type SortField = "events" | "totalRevenue" | "currentRevenue" | "none";
type SortOrder = "asc" | "desc";

const OfficientsTable: React.FC<OfficientsTableProps> = ({
  officiants,
  onRefresh,
  pagination,
  onPageChange,
}) => {
  const axios = useAxios();
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Calculate total revenue and current bookings
  const calculateFinancials = (events: any[] = []) => {
    const completedEvents = events.filter(
      (e) => e.status?.toLowerCase() === "completed"
    );
    const currentBookings = events.filter(
      (e) =>
        e.status?.toLowerCase() !== "completed" &&
        e.status?.toLowerCase() !== "canceled"
    );

    const totalRevenue = completedEvents.reduce(
      (sum, event) => sum + (event.price || 0),
      0
    );
    const currentBookingsValue = currentBookings.reduce(
      (sum, event) => sum + (event.price || 0),
      0
    );

    return {
      totalRevenue,
      currentBookingsValue,
      currentBookings,
      completedEvents,
    };
  };

  const handleView = async (officiant: Officiant) => {
    const certifications =
      officiant.certifications && officiant.certifications.length > 0
        ? officiant.certifications
            .map((cert: string) => `• ${cert}`)
            .join("<br/>")
        : "No certifications listed";

    const { totalRevenue, currentBookingsValue, currentBookings } =
      calculateFinancials(officiant.events || []);

    // Build events table HTML
    const eventsTableHTML =
      officiant.events && officiant.events.length > 0
        ? `
      <div class="mt-4">
        <strong class="text-base">Events (${
          officiant.events.length
        } total):</strong><br/>
        <div class="text-sm max-h-96 overflow-y-auto mt-3">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-100 sticky top-0">
              <tr>
                <th class="border border-gray-300 px-3 py-2 text-sm font-semibold">Title</th>
                <th class="border border-gray-300 px-3 py-2 text-sm font-semibold">Status</th>
                <th class="border border-gray-300 px-3 py-2 text-sm font-semibold">Value</th>
                <th class="border border-gray-300 px-3 py-2 text-sm font-semibold">Couple</th>
                <th class="border border-gray-300 px-3 py-2 text-sm font-semibold">Date</th>
                <th class="border border-gray-300 px-3 py-2 text-sm font-semibold">Location</th>
              </tr>
            </thead>
            <tbody>
              ${officiant.events
                .map((event: any) => {
                  const statusColors: Record<string, string> = {
                    planned: "bg-blue-100 text-blue-800",
                    submitted: "bg-yellow-100 text-yellow-800",
                    approved: "bg-indigo-100 text-indigo-800",
                    completed: "bg-green-100 text-green-800",
                    canceled: "bg-red-100 text-red-800",
                  };
                  const statusClass =
                    statusColors[event.status?.toLowerCase()] ||
                    "bg-gray-100 text-gray-800";

                  return `
                  <tr class="hover:bg-gray-50">
                    <td class="border border-gray-300 px-3 py-2 text-sm">${
                      event.title || "N/A"
                    }</td>
                    <td class="border border-gray-300 px-3 py-2 text-sm">
                      <span class="px-2 py-1 rounded ${statusClass} text-xs font-medium">${
                    event.status || "N/A"
                  }</span>
                    </td>
                    <td class="border border-gray-300 px-3 py-2 text-sm font-semibold">$${
                      event.price || 0
                    }</td>
                    <td class="border border-gray-300 px-3 py-2 text-sm">${
                      event.groomName || ""
                    } & ${event.brideName || ""}</td>
                    <td class="border border-gray-300 px-3 py-2 text-sm">${
                      event.eventDate
                        ? new Date(event.eventDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )
                        : "N/A"
                    }</td>
                    <td class="border border-gray-300 px-3 py-2 text-sm">${
                      event.location || "N/A"
                    }</td>
                  </tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `
        : `
      <div class="mt-4 text-center py-4 bg-gray-50 rounded">
        <p class="text-gray-500 text-sm">No events found</p>
      </div>
    `;

    await Swal.fire({
      title: officiant.name,
      html: `
        <div class="text-left space-y-2">
          <p><strong>Email:</strong> ${officiant.email}</p>
          <p><strong>Phone:</strong> ${officiant.phone || "N/A"}</p>
          <p><strong>Location:</strong> ${officiant.location || "N/A"}</p>
          <p><strong>Experience:</strong> ${officiant.experience || 0} years</p>
          <p><strong>Rate:</strong> $${officiant.bookingMoney || 0}/ceremony</p>
          <p><strong>Rating:</strong> ${
            officiant.rating ? `⭐ ${officiant.rating.toFixed(1)}` : "Not rated"
          }</p>
          <p><strong>Status:</strong> ${
            officiant.isVerified ? "✅ Verified" : "⚠️ Unverified"
          }</p>
          
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="bg-green-50 border border-green-200 rounded p-3 text-center">
              <div class="text-xs text-green-600 font-semibold uppercase mb-1">Total Revenue</div>
              <div class="text-2xl font-bold text-green-700">$${totalRevenue.toLocaleString()}</div>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded p-3 text-center">
              <div class="text-xs text-blue-600 font-semibold uppercase mb-1">Current Bookings</div>
              <div class="text-2xl font-bold text-blue-700">$${currentBookingsValue.toLocaleString()}</div>
              <div class="text-xs text-blue-600 mt-1">(${
                currentBookings.length
              } events)</div>
            </div>
          </div>
          
          <div class="mt-4">
            <strong>Bio:</strong><br/>
            <div class="text-sm text-gray-600 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded mt-1">
              ${officiant.bio || "No bio provided"}
            </div>
          </div>
          <div class="mt-4">
            <strong>Certifications:</strong><br/>
            <div class="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1">
              ${certifications}
            </div>
          </div>
          
          ${eventsTableHTML}
          
          <p class="text-sm text-gray-500 mt-4"><strong>Joined:</strong> ${new Date(
            officiant.createdAt
          ).toLocaleDateString('en-US', { timeZone: 'America/New_York' })}</p>
        </div>
      `,
      width: "900px",
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#3B82F6",
    });
  };

  const handleEdit = async (officiant: Officiant) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Officiant Information",
      html: `
        <div class="space-y-4 text-left max-h-96 [scrollbar-width:none] overflow-y-auto">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input id="name" class="px-3 focus:outline-none w-full py-2 border border-gray-300 rounded-md" placeholder="Full Name" value="${
              officiant.name || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input id="phone" class="px-3 focus:outline-none w-full py-2 border border-gray-300 rounded-md" placeholder="Phone Number" value="${
              officiant.phone || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input id="location" class="px-3 focus:outline-none w-full py-2 border border-gray-300 rounded-md" placeholder="Location" value="${
              officiant.location || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
            <input id="experience" type="number" class="px-3 focus:outline-none w-full py-2 border border-gray-300 rounded-md" placeholder="Years of experience" value="${
              officiant.experience || 0
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Booking Money ($)</label>
            <input id="rate" type="number" class="px-3 focus:outline-none w-full py-2 border border-gray-300 rounded-md" placeholder="Rate per ceremony" value="${
              officiant.bookingMoney || 0
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea id="bio" class="px-3  focus:outline-none w-full py-2 border border-gray-300 rounded-md" placeholder="Biography" rows="4">${
              officiant.bio || ""
            }</textarea>
          </div>

          
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update Officiant",
      cancelButtonText: "Cancel",
      width: "700px",
      preConfirm: () => {
        // Helper to safely get input/textarea values
        const getVal = (id: string) => {
          const el = document.getElementById(id) as
            | HTMLInputElement
            | HTMLTextAreaElement
            | null;
          return el ? (el.value ?? "").toString().trim() : "";
        };

        const payload: any = {};
        const name = getVal("name");
        if (name) payload.name = name;
        const phone = getVal("phone");
        if (phone) payload.phone = phone;
        const location = getVal("location");
        if (location) payload.location = location;
        const expStr = getVal("experience");
        if (expStr) {
          const n = parseInt(expStr, 10);
          if (!isNaN(n)) payload.experience = n;
        }
        const rateStr = getVal("rate");
        if (rateStr) {
          const r = parseFloat(rateStr);
          if (!isNaN(r)) payload.bookingMoney = r;
        }
        const bio = getVal("bio");
        if (bio) payload.bio = bio;

        return payload;
      },
    });

    if (formValues) {
      try {
        const res = await axios.patch(
          `/users/update/${officiant._id}`,
          formValues
        );
        console.log("Update response:", res);

        GlassSwal.success("Success", "Officiant updated successfully");
        onRefresh();
      } catch (error: any) {
        console.error("Error updating officiant:", error);
        GlassSwal.error(
          "Error",
          error.response?.data?.message || "Failed to update officiant"
        );
      }
    }
  };

  const handleDelete = async (officiant: Officiant) => {
    const result = await Swal.fire({
      title: "Delete Officiant?",
      html: `Are you sure you want to delete <strong>${officiant.name}</strong>?<br/><br/>
             <span class="text-red-600">⚠️ This will also delete all their bookings and reviews!</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete Officiant",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/users/delete-account/${officiant._id}`);
        GlassSwal.success("Deleted", "Officiant deleted successfully");
        onRefresh();
      } catch (error: any) {
        console.error("Error deleting officiant:", error);
        GlassSwal.error(
          "Error",
          error.response?.data?.message || "Failed to delete officiant"
        );
      }
    }
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Sort officiants based on current sort field and order
  const sortedOfficiants = useMemo(() => {
    if (sortField === "none") return officiants;

    return [...officiants].sort((a, b) => {
      const aFinancials = calculateFinancials(a.events || []);
      const bFinancials = calculateFinancials(b.events || []);

      let comparison = 0;

      switch (sortField) {
        case "events":
          comparison = (a.events?.length || 0) - (b.events?.length || 0);
          break;
        case "totalRevenue":
          comparison = aFinancials.totalRevenue - bFinancials.totalRevenue;
          break;
        case "currentRevenue":
          comparison =
            aFinancials.currentBookingsValue - bFinancials.currentBookingsValue;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [officiants, sortField, sortOrder]);

  // Calculate max revenue for progress bars
  const maxTotalRevenue = useMemo(() => {
    return Math.max(
      ...sortedOfficiants.map(
        (off) => calculateFinancials(off.events || []).totalRevenue
      ),
      1
    );
  }, [sortedOfficiants]);

  const maxCurrentRevenue = useMemo(() => {
    return Math.max(
      ...sortedOfficiants.map(
        (off) => calculateFinancials(off.events || []).currentBookingsValue
      ),
      1
    );
  }, [sortedOfficiants]);

  if (officiants.length === 0) {
    return (
      <div className="text-center py-12">
        <FaUser className="mx-auto text-gray-400 text-5xl mb-4" />
        <p className="text-gray-500 text-lg">No officiants found</p>
        <p className="text-gray-400 text-sm">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "desc" ? (
      <FaSortAmountDown className="inline ml-1" />
    ) : (
      <FaSortAmountUp className="inline ml-1" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Sort Controls */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <button
            onClick={() => handleSort("events")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortField === "events"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Number of Events {getSortIcon("events")}
          </button>
          <button
            onClick={() => handleSort("totalRevenue")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortField === "totalRevenue"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Total Revenue {getSortIcon("totalRevenue")}
          </button>
          <button
            onClick={() => handleSort("currentRevenue")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortField === "currentRevenue"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Current Revenue {getSortIcon("currentRevenue")}
          </button>
          {sortField !== "none" && (
            <button
              onClick={() => setSortField("none")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition-colors"
            >
              Clear Sort
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Officiant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Bookings
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOfficiants.map((officiant) => {
              const { totalRevenue, currentBookingsValue, currentBookings } =
                calculateFinancials(officiant.events || []);

              return (
                <tr key={officiant._id} className="hover:bg-gray-50">
                  {/* Officiant info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {officiant.profilePicture ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={getProfileImageUrl(officiant.profilePicture)}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <FaUser className="text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {officiant.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {officiant.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Officiant contact info  */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {officiant.phone || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {officiant.location || "N/A"}
                    </div>
                  </td>
                  {/* Experience and Booking Money */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {officiant.experience || 0} years
                    </div>
                    <div className="text-sm text-gray-500">
                      ${officiant.bookingMoney || 0}/ceremony
                    </div>
                  </td>
                  {/* total revenue */}
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-green-700">
                        ${totalRevenue.toLocaleString()}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(totalRevenue / maxTotalRevenue) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        from completed
                      </div>
                    </div>
                  </td>
                  {/* current bookings */}
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-blue-700">
                        ${currentBookingsValue.toLocaleString()}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (currentBookingsValue / maxCurrentRevenue) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {currentBookings.length} event
                        {currentBookings.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </td>

                  {/* Officiant Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                          !officiant.availability
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }`}
                      >
                        {officiant.availability ? "Available" : "Unavailable"}
                      </div>
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(officiant)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded hover:bg-indigo-50"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(officiant)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                        title="Edit Officiant"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(officiant)}
                        className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                        title="Delete Officiant"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
};

export default OfficientsTable;
