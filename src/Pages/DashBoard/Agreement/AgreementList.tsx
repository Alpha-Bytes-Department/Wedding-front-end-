import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import GlassSwal from "../../../utils/glassSwal";

interface AgreementSummary {
  _id: string;
  userId: string;
  officiantId: string;
  officiantName?: string;
  eventDate?: Date;
  partner1Name?: string;
  partner2Name?: string;
  location?: string;
  price?: number;
  travelFee?: number;
  status: string;
  isUsedForCeremony?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-700",
    bg: "bg-yellow-100 border-yellow-300",
  },
  officiant_filled: {
    label: "Ready to Sign",
    color: "text-blue-700",
    bg: "bg-blue-100 border-blue-300",
  },
  user_signed: {
    label: "Signed",
    color: "text-indigo-700",
    bg: "bg-indigo-100 border-indigo-300",
  },
  payment_requested: {
    label: "Payment Requested",
    color: "text-orange-700",
    bg: "bg-orange-100 border-orange-300",
  },
  payment_completed: {
    label: "Payment Done",
    color: "text-teal-700",
    bg: "bg-teal-100 border-teal-300",
  },
  officiant_signed: {
    label: "Completed",
    color: "text-green-700",
    bg: "bg-green-100 border-green-300",
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bg: "bg-green-100 border-green-300",
  },
  used: {
    label: "Used",
    color: "text-gray-600",
    bg: "bg-gray-100 border-gray-300",
  },
};

const AgreementList: React.FC = () => {
  const navigate = useNavigate();
  const axios = useAxios();
  const { user } = useAuth();
  const [agreements, setAgreements] = useState<AgreementSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchAgreements();
    }
  }, [user?._id]);

  const fetchAgreements = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const response = await axios.get(`/agreements/user/${user._id}/all`);
      setAgreements(response.data.agreements || []);
    } catch (error: any) {
      console.error("Error fetching agreements:", error);
      if (error.response?.status !== 404) {
        GlassSwal.error(
          "Error",
          error.response?.data?.message || "Failed to load agreements",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Not Set";
    return new Date(date).toLocaleDateString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusInfo = (status: string) => {
    return (
      statusConfig[status] || {
        label: status.replace(/_/g, " "),
        color: "text-gray-700",
        bg: "bg-gray-100 border-gray-300",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Agreements</h1>
          <p className="text-gray-600 mt-2">
            View and manage your ceremony agreements
          </p>
        </div>

        {agreements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Agreements Yet
            </h2>
            <p className="text-gray-500">
              Your officiant will create an agreement when you're ready to
              proceed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {agreements.map((agreement) => {
              const statusInfo = getStatusInfo(agreement.status);
              return (
                <div
                  key={agreement._id}
                  onClick={() =>
                    navigate(`/dashboard/agreement/${agreement._id}`)
                  }
                  className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-primary/40 p-6 cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {agreement.partner1Name && agreement.partner2Name
                            ? `${agreement.partner1Name} & ${agreement.partner2Name}`
                            : "Pending Details"}
                        </h3>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${statusInfo.bg} ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(agreement.eventDate)}
                        </span>
                        {agreement.location && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {agreement.location}
                          </span>
                        )}
                        {agreement.officiantName && (
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Officiant: {agreement.officiantName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Price & Arrow */}
                    <div className="flex items-center gap-4">
                      {(agreement.price ?? 0) > 0 && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            $
                            {(
                              (agreement.price || 0) +
                              (agreement.travelFee || 0)
                            ).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                      )}
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgreementList;
