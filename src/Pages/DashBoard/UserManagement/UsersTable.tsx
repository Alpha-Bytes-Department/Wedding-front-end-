import React from "react";
import { FaUsers, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import GlassSwal from "../../../utils/glassSwal";
import { useAxios } from "../../../Component/Providers/useAxios";
import type { User } from "./types";
import { getProfileImageUrl } from "./types";
import Pagination from "./Pagination";

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

  const handleView = async (user: User) => {
    const weddingInfo = user.weddingDate
      ? `Wedding Date: ${new Date(
          user.weddingDate
        ).toLocaleDateString()}<br/>Location: ${user.location || "N/A"}`
      : "No wedding information available";

    await Swal.fire({
      title: `${
        user.name || `${user.partner_1 || ""} & ${user.partner_2 || ""}`.trim()
      }`,
      html: `
        <div class="text-left space-y-2">
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone || "N/A"}</p>
          <p><strong>Address:</strong> ${user.address || "N/A"}</p>
          <p><strong>Status:</strong> ${
            user.isVerified ? "✅ Verified" : "⚠️ Unverified"
          }</p>
          <p><strong>Joined:</strong> ${new Date(
            user.createdAt
          ).toLocaleDateString()}</p>
          <div class="mt-4">
            <strong>Wedding Information:</strong><br/>
            ${weddingInfo}
          </div>
        </div>
      `,
      width: "500px",
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#3B82F6",
    });
  };

  const handleEdit = async (user: User) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit User Information",
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input id="name" class="swal2-input" placeholder="Full Name" value="${
              user.name || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Partner 1</label>
            <input id="partner1" class="swal2-input" placeholder="Partner 1" value="${
              user.partner_1 || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Partner 2</label>
            <input id="partner2" class="swal2-input" placeholder="Partner 2" value="${
              user.partner_2 || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input id="phone" class="swal2-input" placeholder="Phone Number" value="${
              user.phone || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input id="address" class="swal2-input" placeholder="Address" value="${
              user.address || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Wedding Date</label>
            <input id="weddingDate" type="date" class="swal2-input" value="${
              user.weddingDate
                ? new Date(user.weddingDate).toISOString().split("T")[0]
                : ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input id="location" class="swal2-input" placeholder="Wedding Location" value="${
              user.location || ""
            }">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update User",
      cancelButtonText: "Cancel",
      width: "600px",
      preConfirm: () => {
        return {
          name: (document.getElementById("name") as HTMLInputElement).value,
          partner_1: (document.getElementById("partner1") as HTMLInputElement)
            .value,
          partner_2: (document.getElementById("partner2") as HTMLInputElement)
            .value,
          phone: (document.getElementById("phone") as HTMLInputElement).value,
          address: (document.getElementById("address") as HTMLInputElement)
            .value,
          weddingDate: (
            document.getElementById("weddingDate") as HTMLInputElement
          ).value,
          location: (document.getElementById("location") as HTMLInputElement)
            .value,
        };
      },
    });

    if (formValues) {
      try {
        await axios.patch(`/users/update/${user._id}`, formValues);
        GlassSwal.success("Success", "User updated successfully");
        onRefresh();
      } catch (error: any) {
        console.error("Error updating user:", error);
        GlassSwal.error(
          "Error",
          error.response?.data?.message || "Failed to update user"
        );
      }
    }
  };

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

  const toggleVerification = async (user: User) => {
    const action = user.isVerified ? "unverify" : "verify";
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User?`,
      text: `Are you sure you want to ${action} ${user.name || user.email}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: user.isVerified ? "#EF4444" : "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Yes, ${
        action.charAt(0).toUpperCase() + action.slice(1)
      }`,
    });
      console.log("Result of verification toggle:", user);
    if (result.isConfirmed) {
      try {
        const res = await axios.patch(`/users/update/${user._id}`, {
          isVerified: !user.isVerified,
        });
        console.log("Result of verification toggle:", res.data);
        GlassSwal.success("Success", `User ${action}ed successfully`);
        onRefresh();

      } catch (error: any) {
        console.error("Error updating verification:", error);
        GlassSwal.error(
          "Error",
          error.response?.data?.message || "Failed to update verification"
        );
      }
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <FaUsers className="mx-auto text-gray-400 text-5xl mb-4" />
        <p className="text-gray-500 text-lg">No users found</p>
        <p className="text-gray-400 text-sm">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                Status
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
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                      {user.profilePicture ? (
                        <img
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                          src={getProfileImageUrl(user.profilePicture)}
                          alt=""
                        />
                      ) : (
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <FaUsers className="text-gray-600 text-xs sm:text-base" />
                        </div>
                      )}
                    </div>
                    <div className="ml-2 sm:ml-4">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                        {user.name ||
                          `${user.partner_1 || ""} & ${
                            user.partner_2 || ""
                          }`.trim()}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-[200px]">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-3 sm:px-6 py-4">
                  <div className="text-xs sm:text-sm text-gray-900">
                    {user.phone || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 max-w-xs truncate">
                    {user.address || "N/A"}
                  </div>
                </td>
                <td className="hidden lg:table-cell px-3 sm:px-6 py-4">
                  <div className="text-xs sm:text-sm text-gray-900">
                    {user.weddingDate
                      ? new Date(user.weddingDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 max-w-xs truncate">
                    {user.location || "N/A"}
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4">
                  <button
                    onClick={() => toggleVerification(user)}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                      user.isVerified
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                  >
                    {user.isVerified ? "Verified" : "Unverified"}
                  </button>
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
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900 p-1 sm:p-2 rounded hover:bg-blue-50"
                      title="Edit User"
                    >
                      <FaEdit className="text-sm sm:text-base" />
                    </button>
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
            ))}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
};

export default UsersTable;
