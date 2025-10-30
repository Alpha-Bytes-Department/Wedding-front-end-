import React from "react";
import { FaUser, FaEye, FaEdit, FaTrash, FaStar } from "react-icons/fa";
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

const OfficientsTable: React.FC<OfficientsTableProps> = ({
  officiants,
  onRefresh,
  pagination,
  onPageChange,
}) => {
  const axios = useAxios();

  const handleView = async (officiant: Officiant) => {
    const certifications =
      officiant.certifications && officiant.certifications.length > 0
        ? officiant.certifications
            .map((cert: string) => `• ${cert}`)
            .join("<br/>")
        : "No certifications listed";

    await Swal.fire({
      title: officiant.name,
      html: `
        <div class="text-left space-y-2">
          <p><strong>Email:</strong> ${officiant.email}</p>
          <p><strong>Phone:</strong> ${officiant.phone || "N/A"}</p>
          <p><strong>Location:</strong> ${officiant.location || "N/A"}</p>
          <p><strong>Experience:</strong> ${officiant.experience || 0} years</p>
          <p><strong>Rate:</strong> $${officiant.rate || 0}/ceremony</p>
          <p><strong>Rating:</strong> ${
            officiant.rating ? `⭐ ${officiant.rating.toFixed(1)}` : "Not rated"
          }</p>
          <p><strong>Status:</strong> ${
            officiant.isVerified ? "✅ Verified" : "⚠️ Unverified"
          }</p>
          <p><strong>Availability:</strong> ${
            officiant.availability ? "✅ Available" : "❌ Not Available"
          }</p>
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
          <p class="text-sm text-gray-500 mt-4"><strong>Joined:</strong> ${new Date(
            officiant.createdAt
          ).toLocaleDateString()}</p>
        </div>
      `,
      width: "600px",
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#3B82F6",
    });
  };

  const handleEdit = async (officiant: Officiant) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Officiant Information",
      html: `
        <div class="space-y-4 text-left max-h-96 overflow-y-auto">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input id="name" class="swal2-input" placeholder="Full Name" value="${
              officiant.name || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input id="phone" class="swal2-input" placeholder="Phone Number" value="${
              officiant.phone || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input id="location" class="swal2-input" placeholder="Location" value="${
              officiant.location || ""
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
            <input id="experience" type="number" class="swal2-input" placeholder="Years of experience" value="${
              officiant.experience || 0
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rate ($)</label>
            <input id="rate" type="number" class="swal2-input" placeholder="Rate per ceremony" value="${
              officiant.rate || 0
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea id="bio" class="swal2-textarea" placeholder="Biography" rows="4">${
              officiant.bio || ""
            }</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Certifications (one per line)</label>
            <textarea id="certifications" class="swal2-textarea" placeholder="Enter certifications, one per line" rows="3">${
              officiant.certifications
                ? officiant.certifications.join("\n")
                : ""
            }</textarea>
          </div>
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input type="checkbox" id="availability" ${
                officiant.availability ? "checked" : ""
              }> 
              <span class="ml-2 text-sm">Available for bookings</span>
            </label>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update Officiant",
      cancelButtonText: "Cancel",
      width: "700px",
      preConfirm: () => {
        const certText = (
          document.getElementById("certifications") as HTMLTextAreaElement
        ).value;
        const certifications = certText
          .split("\n")
          .filter((cert) => cert.trim() !== "");

        return {
          name: (document.getElementById("name") as HTMLInputElement).value,
          phone: (document.getElementById("phone") as HTMLInputElement).value,
          location: (document.getElementById("location") as HTMLInputElement)
            .value,
          experience:
            parseInt(
              (document.getElementById("experience") as HTMLInputElement).value
            ) || 0,
          rate:
            parseFloat(
              (document.getElementById("rate") as HTMLInputElement).value
            ) || 0,
          bio: (document.getElementById("bio") as HTMLTextAreaElement).value,
          certifications: certifications,
          availability: (
            document.getElementById("availability") as HTMLInputElement
          ).checked,
        };
      },
    });

    if (formValues) {
      try {
        await axios.patch(`/officiants/update/${officiant._id}`, formValues);
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
        await axios.delete(`/officiants/delete/${officiant._id}`);
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

  const toggleVerification = async (officiant: Officiant) => {
    const action = officiant.isVerified ? "unverify" : "verify";
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Officiant?`,
      text: `Are you sure you want to ${action} ${officiant.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: officiant.isVerified ? "#EF4444" : "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Yes, ${
        action.charAt(0).toUpperCase() + action.slice(1)
      }`,
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`/officiants/toggle-verification/${officiant._id}`, {
          isVerified: !officiant.isVerified,
        });
        GlassSwal.success("Success", `Officiant ${action}ed successfully`);
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

  return (
    <div className="bg-white rounded-lg shadow">
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
                Rating
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
            {officiants.map((officiant) => (
              <tr key={officiant._id} className="hover:bg-gray-50">
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {officiant.phone || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {officiant.location || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {officiant.experience || 0} years
                  </div>
                  <div className="text-sm text-gray-500">
                    ${officiant.rate || 0}/ceremony
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-900">
                      {officiant.rating ? officiant.rating.toFixed(1) : "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleVerification(officiant)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                        officiant.isVerified
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }`}
                    >
                      {officiant.isVerified ? "Verified" : "Unverified"}
                    </button>
                   
                    
                  </div>
                </td>
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
            ))}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
};

export default OfficientsTable;
