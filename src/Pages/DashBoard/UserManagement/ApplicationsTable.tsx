import React from "react";
import {
  FaFileAlt,
  FaEye,
  FaCheck,
  FaTimes,
  FaDownload,
  FaExternalLinkAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import GlassSwal from "../../../utils/glassSwal";
import { useAxios } from "../../../Component/Providers/useAxios";
import type { OfficiantApplication } from "./types";
import Pagination from "./Pagination";

interface ApplicationsTableProps {
  applications: OfficiantApplication[];
  onRefresh: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange: (page: number) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onRefresh,
  pagination,
  onPageChange,
}) => {
  const axios = useAxios();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleView = async (application: OfficiantApplication) => {
    const languages =
      application.language && application.language.length > 0
        ? application.language.join(", ")
        : "Not specified";

    const profilePic =
      application.profilePicture || application.profilePictureUrl;
    const portfolio = application.portfolio || application.portfolioUrl;
    const submittedDate = application.appliedAt || application.submittedAt;

    await Swal.fire({
      title: `${application.name}'s Application`,
      html: `
        <div class="text-left space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p><strong>Name:</strong> ${application.name}</p>
              <p><strong>Email:</strong> ${application.email}</p>
              <p><strong>Phone:</strong> ${application.contactNo}</p>
              <p><strong>Experience:</strong> ${
                application.experience
              } years</p>
              <p><strong>Speciality:</strong> ${application.speciality}</p>
              <p><strong>Languages:</strong> ${languages}</p>
            </div>
            <div>
              <p><strong>Address:</strong> ${application.address}</p>
              <p><strong>Status:</strong> 
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  application.status
                )}">
                  ${
                    application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)
                  }
                </span>
              </p>
              <p><strong>Submitted:</strong> ${new Date(
                submittedDate
              ).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <strong>Experience Details:</strong><br/>
            <div class="text-sm text-gray-600 max-h-32 overflow-y-auto bg-gray-50 p-3 rounded mt-1">
              ${
                application.experience_details ||
                "No experience details provided"
              }
            </div>
          </div>

          ${
            profilePic
              ? `
            <div class="mt-4">
              <strong>Profile Picture:</strong><br/>
              <img src="${profilePic}" alt="Profile" class="w-32 h-32 object-cover rounded-lg mt-2 mx-auto">
            </div>
          `
              : ""
          }

          ${
            portfolio
              ? `
            <div class="mt-4">
              <strong>Portfolio:</strong><br/>
              <a href="${portfolio}" target="_blank" class="inline-flex items-center text-blue-600 hover:text-blue-800 mt-1">
                <span class="mr-1">📄 View Portfolio PDF</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          `
              : ""
          }
        </div>
      `,
      width: "700px",
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#3B82F6",
    });
  };

  const handleApprove = async (application: OfficiantApplication) => {
    const result = await Swal.fire({
      title: "Approve Application?",
      html: `Are you sure you want to approve <strong>${application.name}</strong>'s application?<br/><br/>
             <span class="text-green-600">✅ This will change their role to officiant.</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        // Backend expects applicationId in params (as :id) and status + userId in body
        const response = await axios.patch(`/applicants/${application._id}`, {
          status: "approved",
          userId: application.userId,
        });
        GlassSwal.success(
          "Approved",
          response.data.message ||
            "Application approved successfully. User role updated to officiant."
        );
        onRefresh();
      } catch (error: any) {
        console.error("Error approving application:", error);
        GlassSwal.error(
          "Error",
          error.response?.data?.message || "Failed to approve application"
        );
      }
    }
  };

  const handleReject = async (application: OfficiantApplication) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Application?",
      html: `
        <p>Are you sure you want to reject <strong>${application.name}</strong>'s application?</p>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Reason for rejection (optional):</label>
          <textarea id="rejection-reason" class="swal2-textarea" placeholder="Enter reason for rejection..." rows="4"></textarea>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        return (
          document.getElementById("rejection-reason") as HTMLTextAreaElement
        ).value;
      },
    });

    if (reason !== undefined) {
      try {
        await axios.patch(`/applications/${application._id}`, {
          status: "rejected",
          userId: application.userId,
          rejectionReason: reason || "No reason provided",
        });
        GlassSwal.success("Rejected", "Application rejected successfully.");
        onRefresh();
      } catch (error: any) {
        console.error("Error rejecting application:", error);
        GlassSwal.error(
          "Error",
          error.response?.data?.message || "Failed to reject application"
        );
      }
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <FaFileAlt className="mx-auto text-gray-400 text-5xl mb-4" />
        <p className="text-gray-500 text-lg">No applications found</p>
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
                Applicant
              </th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
              <th className="hidden xl:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Speciality
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Files
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => {
              const profilePic =
                application.profilePicture || application.profilePictureUrl;
              const portfolio =
                application.portfolio || application.portfolioUrl;
              const submittedDate =
                application.appliedAt || application.submittedAt;

              return (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                        {profilePic ? (
                          <img
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                            src={profilePic}
                            alt=""
                          />
                        ) : (
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <FaFileAlt className="text-gray-600 text-xs sm:text-base" />
                          </div>
                        )}
                      </div>
                      <div className="ml-2 sm:ml-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                          {application.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none md:hidden">
                          {application.email}
                        </div>
                        <div className="hidden md:block text-xs sm:text-sm text-gray-500 truncate max-w-[200px]">
                          {application.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4">
                    <div className="text-xs sm:text-sm text-gray-900">
                      {application.contactNo}
                    </div>
                    <div className="text-xs text-gray-500 max-w-xs truncate">
                      {application.address}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-4">
                    <div className="text-xs sm:text-sm text-gray-900">
                      {application.experience} years
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">
                      {application.language?.join(", ") || "N/A"}
                    </div>
                  </td>
                  <td className="hidden xl:table-cell px-3 sm:px-6 py-4">
                    <div className="text-xs sm:text-sm text-gray-900 max-w-[200px] truncate">
                      {application.speciality}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                      {new Date(submittedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4">
                    <div className="flex space-x-2">
                      {profilePic && (
                        <button
                          onClick={() =>
                            downloadFile(
                              profilePic,
                              `${application.name}_profile.jpg`
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                          title="Download Profile Picture"
                        >
                          <FaDownload className="text-xs" />
                        </button>
                      )}
                      {portfolio && (
                        <a
                          href={portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View Portfolio PDF"
                        >
                          <FaExternalLinkAlt className="text-xs" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-right text-xs sm:text-sm font-medium">
                    <div className="flex space-x-1 sm:space-x-2 justify-end">
                      <button
                        onClick={() => handleView(application)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 sm:p-2 rounded hover:bg-indigo-50"
                        title="View Details"
                      >
                        <FaEye className="text-sm sm:text-base" />
                      </button>
                      {application.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(application)}
                            className="text-green-600 hover:text-green-900 p-1 sm:p-2 rounded hover:bg-green-50"
                            title="Approve Application"
                          >
                            <FaCheck className="text-sm sm:text-base" />
                          </button>
                          <button
                            onClick={() => handleReject(application)}
                            className="text-red-600 hover:text-red-900 p-1 sm:p-2 rounded hover:bg-red-50"
                            title="Reject Application"
                          >
                            <FaTimes className="text-sm sm:text-base" />
                          </button>
                        </>
                      )}
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

export default ApplicationsTable;
