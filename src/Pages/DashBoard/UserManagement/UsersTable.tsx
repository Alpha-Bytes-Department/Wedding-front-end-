import React, { useState, useMemo, useEffect } from "react";
import { FaUsers, FaEye, FaTrash, FaSearch, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import GlassSwal from "../../../utils/glassSwal";
import { useAxios } from "../../../Component/Providers/useAxios";
import type { User } from "./types";
// import { getProfileImageUrl } from "./types";
import Pagination from "./Pagination";
import { showUserDetailsModal } from "./UserDetailsModal";
import Avatar from "../../../Component/Shared/Avatar";

interface UsersTableProps {
  users: User[];
  onRefresh: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange: (page: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onRefresh,
  pagination,
  onPageChange,
}) => {
  const axios = useAxios();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [officiants, setOfficiants] = useState<any[]>([]);

  // Fetch officiants on mount
  useEffect(() => {
    const fetchOfficiants = async () => {
      try {
        const response = await axios.get("/users/officiants");
        setOfficiants(response.data.officiants || []);
      } catch (error) {
        console.error("Error fetching officiants:", error);
      }
    };
    fetchOfficiants();
  }, [axios]);

  const handleAssignOfficiant = async (user: User) => {
    // Validate user has accepted agreement
    if (!user.AgreementAccepted) {
      await GlassSwal.error(
        "Cannot Assign",
        "User must have an accepted agreement before assigning an officiant."
      );
      return;
    }

    const officiantOptions = officiants
      .map(
        (off) =>
          `<option value="${off._id}" ${!off.availability ? "disabled" : ""}>${
            off.name
          }${!off.availability ? " (Unavailable)" : ""}</option>`
      )
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Assign Officiant",
      html: `
        <div class="text-left space-y-4">
          <p class="text-sm text-gray-600 mb-4">
            Assigning officiant to: <strong>${user.name || user.email}</strong>
          </p>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Officiant
            </label>
            <select id="officiantId" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none">
              <option value="">Choose an officiant...</option>
              ${officiantOptions}
            </select>
          </div>
          ${
            user.currentOfficiant?.officiantName
              ? `
            <div class="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
              <strong>Current Officiant:</strong> ${
                user.currentOfficiant.officiantName
              }
              <br/>
              <span class="text-gray-600">Assigned: ${new Date(
                user.currentOfficiant.assignedAt!
              ).toLocaleDateString()}</span>
            </div>
          `
              : ""
          }
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Assign Officiant",
      cancelButtonText: "Cancel",
      width: "500px",
      preConfirm: () => {
        const officiantId = (
          document.getElementById("officiantId") as HTMLSelectElement
        ).value;
        if (!officiantId) {
          Swal.showValidationMessage("Please select an officiant");
          return false;
        }
        const selectedOfficiant = officiants.find((o) => o._id === officiantId);
        return {
          officiantId,
          officiantName: selectedOfficiant?.name,
        };
      },
    });

    if (formValues) {
      try {
        await axios.post(`/users/assign-officiant/${user._id}`, formValues);
        await GlassSwal.success("Success", "Officiant assigned successfully!");
        onRefresh();
      } catch (error: any) {
        console.error("Error assigning officiant:", error);
        await GlassSwal.error(
          "Error",
          error.response?.data?.error || "Failed to assign officiant"
        );
      }
    }
  };

  const handleView = async (user: User) => {
    await showUserDetailsModal(user);
  };

  // const handleEdit = async (user: User) => {
  //   const { value: formValues } = await Swal.fire({
  //     title: "Edit User Information",
  //     html: `
  //       <div class="space-y-4 text-left">
  //         <div>
  //           <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
  //           <input id="name" class="swal2-input" placeholder="Full Name" value="${
  //             user.name || ""
  //           }">
  //         </div>
  //         <div>
  //           <label class="block text-sm font-medium text-gray-700 mb-1">Partner 1</label>
  //           <input id="partner1" class="swal2-input" placeholder="Partner 1" value="${
  //             user.partner_1 || ""
  //           }">
  //         </div>
  //         <div>
  //           <label class="block text-sm font-medium text-gray-700 mb-1">Partner 2</label>
  //           <input id="partner2" class="swal2-input" placeholder="Partner 2" value="${
  //             user.partner_2 || ""
  //           }">
  //         </div>
  //         <div>
  //           <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
  //           <input id="phone" class="swal2-input" placeholder="Phone Number" value="${
  //             user.phone || ""
  //           }">
  //         </div>
  //         <div>
  //           <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
  //           <input id="address" class="swal2-input" placeholder="Address" value="${
  //             user.address || ""
  //           }">
  //         </div>
  //         <div>
  //           <label class="block text-sm font-medium text-gray-700 mb-1">Wedding Date</label>
  //           <input id="weddingDate" type="date" class="swal2-input" value="${
  //             user.weddingDate
  //               ? new Date(user.weddingDate).toISOString().split("T")[0]
  //               : ""
  //           }">
  //         </div>
  //         <div>
  //           <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
  //           <input id="location" class="swal2-input" placeholder="Wedding Location" value="${
  //             user.location || ""
  //           }">
  //         </div>
  //       </div>
  //     `,
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Update User",
  //     cancelButtonText: "Cancel",
  //     width: "600px",
  //     preConfirm: () => {
  //       return {
  //         name: (document.getElementById("name") as HTMLInputElement).value,
  //         partner_1: (document.getElementById("partner1") as HTMLInputElement)
  //           .value,
  //         partner_2: (document.getElementById("partner2") as HTMLInputElement)
  //           .value,
  //         phone: (document.getElementById("phone") as HTMLInputElement).value,
  //         address: (document.getElementById("address") as HTMLInputElement)
  //           .value,
  //         weddingDate: (
  //           document.getElementById("weddingDate") as HTMLInputElement
  //         ).value,
  //         location: (document.getElementById("location") as HTMLInputElement)
  //           .value,
  //       };
  //     },
  //   });

  //   if (formValues) {
  //     try {
  //       await axios.patch(`/users/update/${user._id}`, formValues);
  //       GlassSwal.success("Success", "User updated successfully");
  //       onRefresh();
  //     } catch (error: any) {
  //       console.error("Error updating user:", error);
  //       GlassSwal.error(
  //         "Error",
  //         error.response?.data?.message || "Failed to update user"
  //       );
  //     }
  //   }
  // };

  const handleDelete = async (user: User) => {
    const result = await Swal.fire({
      title: "Delete User?",
      html: `Are you sure you want to delete <strong>${
        user.name || user.email
      }</strong>?<br/><br/>
             <span class="text-red-600">⚠️ This action cannot be undone!</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete User",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/users/delete-account/${user._id}`);
        GlassSwal.success("Deleted", "User deleted successfully");
        onRefresh();
      } catch (error: any) {
        console.error("Error deleting user:", error);
        GlassSwal.error(
          "Error",
          error.response?.data?.message || "Failed to delete user"
        );
      }
    }
  };

  // Filter users based on search term and status
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((user) => {
        // Get first event for searching
        const firstEvent =
          user.events && user.events.length > 0 ? user.events[0] : null;

        return (
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.contact?.partner_1?.toLowerCase().includes(searchLower) ||
          user.contact?.partner_2?.toLowerCase().includes(searchLower) ||
          user.address?.toLowerCase().includes(searchLower) ||
          user.location?.toLowerCase().includes(searchLower) ||
          firstEvent?.title?.toLowerCase().includes(searchLower) ||
          firstEvent?.location?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => {
        const firstEvent =
          user.events && user.events.length > 0 ? user.events[0] : null;

        if (statusFilter === "no-ceremony") {
          return !firstEvent || !firstEvent.status;
        }
        return firstEvent?.status?.toLowerCase() === statusFilter;
      });
    }

    return filtered;
  }, [users, searchTerm, statusFilter]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Search and Filter Section */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, partners, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Ceremonies</option>
              <option value="no-ceremony">No Ceremony</option>
              <option value="planned">Planned</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        {(searchTerm || statusFilter !== "all") && (
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                Clear search
              </button>
            )}
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <FaUsers className="mx-auto text-gray-400 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">No users found</p>
          <p className="text-gray-400 text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wedding Info
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Officiant
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ceremony Status
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  // Get the first event from the events array
                  const firstEvent =
                    user.events && user.events.length > 0
                      ? user.events[0]
                      : null;

                  return (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Avatar
                              src={user.profilePicture}
                              name={user.name || user.partner_1 || user.email}
                              size="md"
                            />
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-[200px]">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-6 py-4">
                        <div className="text-xs sm:text-sm text-gray-900">
                          <p>{user.contact?.partner_1 || "N/A"}</p>
                          <p>{user.contact?.partner_2 || "N/A"}</p>
                        </div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {user.location || "N/A"}
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-6 py-4">
                        <div className="text-xs sm:text-sm text-gray-900">
                          {firstEvent ? (
                            <p className=" text-base ">{firstEvent.title}</p>
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {firstEvent?.location || "N/A"}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        {user.currentOfficiant?.officiantName ? (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 text-sm">
                                  ✓
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {user.currentOfficiant.officiantName}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Assigned:{" "}
                                {new Date(
                                  user.currentOfficiant.assignedAt!
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            {user.AgreementAccepted && (
                              <button
                                onClick={() => handleAssignOfficiant(user)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="Change Officiant"
                              >
                                <FaEdit className="text-sm" />
                              </button>
                            )}
                          </div>
                        ) : user.AgreementAccepted ? (
                          <button
                            onClick={() => handleAssignOfficiant(user)}
                            className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Assign Officiant
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            No agreement
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4 cursor-pointer">
                        {firstEvent?.status ? (
                          (() => {
                            const status = (
                              firstEvent.status || ""
                            ).toLowerCase();
                            const map: Record<string, string> = {
                              planned: "bg-blue-100 text-blue-800",
                              submitted: "bg-yellow-100 text-yellow-800",
                              approved: "bg-indigo-100 text-indigo-800",
                              completed: "bg-green-100 text-green-800",
                              canceled: "bg-red-100 text-red-800",
                            };
                            const classes =
                              map[status] ?? "bg-gray-100 text-gray-800";
                            return (
                              <p
                                className={`py-1 px-2 text-center rounded-xl ${classes}`}
                              >
                                {firstEvent.status}
                              </p>
                            );
                          })()
                        ) : (
                          <p className="text-center px-2 py-1 bg-gray-200 rounded-xl text-slate-400">
                            No ceremony
                          </p>
                        )}
                      </td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-right text-xs sm:text-sm font-medium">
                        <div className="flex space-x-1 sm:space-x-2 justify-end">
                          <button
                            onClick={() => handleView(user)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 sm:p-2 rounded hover:bg-indigo-50"
                            title="View Details"
                          >
                            <FaEye className="text-sm sm:text-base" />
                          </button>
                          {/* <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 sm:p-2 rounded hover:bg-blue-50"
                          title="Edit User"
                        >
                          <FaEdit className="text-sm sm:text-base" />
                        </button> */}
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-900 p-1 sm:p-2 rounded hover:bg-red-50"
                            title="Delete User"
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
        </>
      )}
    </div>
  );
};

export default UsersTable;
