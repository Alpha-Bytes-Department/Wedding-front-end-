import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import GlassSwal from "../../../utils/glassSwal";

interface AgreementData {
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
  ceremonySubmittedAt?: Date;
  partner1Signature?: string;
  partner2Signature?: string;
  officiantSignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

const Agreement: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const axios = useAxios();
  const { user, setUser } = useAuth();

  const [agreement, setAgreement] = useState<AgreementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [partner1SignatureFile, setPartner1SignatureFile] =
    useState<File | null>(null);
  const [partner2SignatureFile, setPartner2SignatureFile] =
    useState<File | null>(null);
  const [partner1Preview, setPartner1Preview] = useState<string>("");
  const [partner2Preview, setPartner2Preview] = useState<string>("");

  useEffect(() => {
    if (eventId) {
      fetchAgreement();
    }
  }, [eventId]);

  // Refresh agreement data when component becomes visible (user returns to page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && eventId) {
        // console.log("Page became visible, refreshing agreement data...");
        fetchAgreement();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [eventId]);

  // Update user's AgreementAccepted status when agreement is completed
  useEffect(() => {
    const updateUserAgreementStatus = async () => {
      if (
        agreement?.status === "officiant_signed" &&
        user &&
        !user.AgreementAccepted
      ) {
        try {
          // Fetch fresh user data from database to verify AgreementAccepted status
          const response = await axios.get("/users/get-user");

          const dbUser = response.data.user;
          // console.log("Fetched user from DB:", dbUser);

          // Check if database confirms AgreementAccepted is true
          if (dbUser.AgreementAccepted) {
            // Update user context with database value
            const updatedUser = { ...user, AgreementAccepted: true };
            setUser(updatedUser);
            // Update localStorage
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // Show success message
            GlassSwal.success(
              "Agreement Complete!",
              "You can now access the Ceremony Builder to create your ceremony.",
            );
          }
        } catch (error) {
          console.error("Error fetching user agreement status:", error);
          // Even if fetch fails, we can trust the agreement status
          // since backend sets it when officiant signs
          const updatedUser = { ...user, AgreementAccepted: true };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));

          GlassSwal.success(
            "Agreement Complete!",
            "You can now access the Ceremony Builder to create your ceremony.",
          );
        }
      }

      // Show warning if agreement was used for ceremony
      if (
        agreement?.isUsedForCeremony &&
        agreement?.status === "used" &&
        user &&
        !user.AgreementAccepted
      ) {
        // console.log("Agreement is used - showing warning");
        GlassSwal.fire({
          title: "Agreement Already Used",
          text: "This agreement was used to submit a ceremony. You need a new agreement to create another ceremony.",
          icon: "info",
          confirmButtonText: "I Understand",
          confirmButtonColor: "#f97316",
        });
      }
    };

    if (agreement && user) {
      updateUserAgreementStatus();
    }
  }, [
    agreement?.status,
    agreement?.isUsedForCeremony,
    user?.AgreementAccepted,
  ]);

  const fetchAgreement = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      const response = await axios.get(`/agreements/${eventId}`);
      // console.log("Fetched agreement:", response.data.agreement);
      setAgreement(response.data.agreement);

      // Also refresh user data to get latest AgreementAccepted status
      try {
        const userResponse = await axios.get("/users/get-user");
        const dbUser = userResponse.data.user;

        if (user && user.AgreementAccepted !== dbUser.AgreementAccepted) {
          // console.log(
          //   "User AgreementAccepted status changed, updating context"
          // );
          const updatedUser = {
            ...user,
            AgreementAccepted: dbUser.AgreementAccepted,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (userError) {
        console.error("Error refreshing user data:", userError);
      }
    } catch (error: any) {
      console.error("Error fetching agreement:", error);
      if (error.response?.status === 404) {
        // No agreement exists yet
        setAgreement(null);
      } else {
        GlassSwal.error(
          "Error",
          error.response?.data?.message || "Failed to load agreement",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    partner: "partner1" | "partner2",
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB = 1,048,576 bytes)
    if (file.size > 1048576) {
      GlassSwal.error("File Too Large", "Signature must be less than 1MB");
      return;
    }

    // Validate file type - accept common image formats
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type.toLowerCase())) {
      GlassSwal.error(
        "Invalid File",
        "Only image files (JPG, PNG, GIF, WebP) are allowed",
      );
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (partner === "partner1") {
        setPartner1Preview(reader.result as string);
        setPartner1SignatureFile(file);
      } else {
        setPartner2Preview(reader.result as string);
        setPartner2SignatureFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitSignatures = async () => {
    if (!partner1SignatureFile || !partner2SignatureFile) {
      GlassSwal.error(
        "Missing Signatures",
        "Both partner signatures are required",
      );
      return;
    }

    if (!agreement?._id) {
      GlassSwal.error("Error", "Agreement not found");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("partner1Signature", partner1SignatureFile);
      formData.append("partner2Signature", partner2SignatureFile);

      await axios.post(
        `/agreements/upload-user-signatures/${agreement._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      GlassSwal.success(
        "Signatures Submitted",
        "Your signatures have been uploaded successfully. The officiant will now send a payment request.",
      );

      // Refresh agreement data
      fetchAgreement();
    } catch (error: any) {
      console.error("Error uploading signatures:", error);
      GlassSwal.error(
        "Upload Failed",
        error.response?.data?.message || "Failed to upload signatures",
      );
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Not Set";
    return new Date(date).toLocaleDateString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Agreement Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            No agreement exists for this event yet.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const canSign =
    agreement.status === "officiant_filled" && user?.role === "user";
  const isPending = agreement.status === "pending";
  const isPaymentRequested = agreement.status === "payment_requested";
  const isPaymentCompleted = agreement.status === "payment_completed";
  const isSigned =
    agreement.status !== "pending" && agreement.status !== "officiant_filled";

  // console.log("Agreement status:", agreement.status);
  // console.log("Status checks:", {
  //   isSigned,
  //   isUsedForCeremony: agreement.isUsedForCeremony,
  // });

  const handlePayNow = () => {
    // Redirect to payment page with agreement details
    const totalAmount = (agreement.price || 0) + (agreement.travelFee || 0);
    navigate(
      `/dashboard/payment?` +
        `agreementId=${agreement._id}&` +
        `amount=${totalAmount}&` +
        `price=${agreement.price || 0}&` +
        `travelFee=${agreement.travelFee || 0}&` +
        `partner1Name=${encodeURIComponent(agreement.partner1Name || "")}&` +
        `partner2Name=${encodeURIComponent(agreement.partner2Name || "")}&` +
        `officiantName=${encodeURIComponent(
          agreement.officiantName || "Erie Wedding Officiants",
        )}&` +
        `eventDate=${agreement.eventDate}&` +
        `location=${encodeURIComponent(agreement.location || "")}&` +
        `userId=${agreement.userId}&` +
        `officiantId=${agreement.officiantId}`,
    );
  };
  //  console.log("agreement data:", agreement);
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-primary hover:text-primary/80 font-medium mb-4 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Wedding Ceremony Agreement
          </h1>
          <p className="text-gray-600 mt-2">
            Status:{" "}
            <span className="font-semibold capitalize text-primary">
              {agreement.status.replace(/_/g, " ")}
            </span>
          </p>
        </div>

        {/* Agreement Used Alert - Show when ceremony was submitted */}
        {agreement.isUsedForCeremony && agreement.status === "used" && (
          <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-orange-600 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-900">
                  Agreement Already Used
                </h3>
                <p className="text-sm text-orange-800 mt-2">
                  This agreement was used to submit a ceremony on{" "}
                  <span className="font-semibold">
                    {agreement.ceremonySubmittedAt
                      ? formatDate(agreement.ceremonySubmittedAt)
                      : "a previous date"}
                  </span>
                  .
                </p>
                <p className="text-sm text-orange-800 mt-2">
                  <strong>To create another ceremony, you need to:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-orange-800 mt-2 space-y-1 ml-4">
                  <li>Contact your officiant to create a new agreement</li>
                  <li>Complete the new agreement process (sign & pay)</li>
                  <li>
                    Then you'll be able to access the Ceremony Builder again
                  </li>
                </ul>
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/dashboard/schedule")}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors inline-flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Contact Officiant for New Agreement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Alert */}
        {isPending && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Waiting for Officiant
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  The officiant will fill in the ceremony details and pricing.
                  You'll be notified when it's ready for your review.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Request Alert */}
        {isPaymentRequested && (
          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <svg
                  className="w-6 h-6 text-blue-600 mt-0.5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-blue-900">
                    Payment Requested
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    You have signed the agreement. Please proceed with payment
                    to finalize.
                  </p>
                  <p className="text-2xl font-bold text-blue-900 mt-2">
                    Total Amount: $
                    {(
                      (agreement.price || 0) + (agreement.travelFee || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={handlePayNow}
                className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Payment Completed Alert */}
        {isPaymentCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start flex-1">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    Payment Completed
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your payment has been received. Waiting for the officiant to
                    sign and complete the agreement.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/dashboard/bills")}
                className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                View Invoice
              </button>
            </div>
          </div>
        )}

        {/* Agreement Completed - Ready to Create Ceremony */}
        {agreement.status === "officiant_signed" &&
          !agreement.isUsedForCeremony && (
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-600 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900">
                    🎉 Agreement Complete!
                  </h3>
                  <p className="text-sm text-green-800 mt-2">
                    Your agreement has been fully signed and completed. You can
                    now access the <strong>Ceremony Builder</strong> to create
                    your personalized wedding ceremony.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => navigate("/dashboard/ceremony")}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create Your Ceremony
                    </button>
                    <button
                      onClick={() => navigate("/dashboard/bills")}
                      className="bg-white border-2 border-green-600 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Agreement Document */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Document Header - Professional Letterhead Style */}
          <div className="bg-gradient-to-r from-primary to-yellow-600 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  ERIE WEDDING OFFICIANTS
                </h2>
                <p className="text-yellow-100 text-sm">
                  Professional Wedding Ceremony Services
                </p>
              </div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <img src="/image.png" alt="Logo" className="w-12 h-12" />
              </div>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-8 space-y-6">
            {/* Agreement Title */}
            <div className="text-center border-b-2 border-gray-200 pb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                WEDDING CEREMONY SERVICE AGREEMENT
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Agreement Date: {formatDate(agreement.createdAt)}
              </p>
            </div>

            {/* Agreement Introduction */}
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                This agreement for wedding officiant services ("Agreement") is
                entered on{" "}
                <span className="font-semibold">
                  {formatDate(agreement.createdAt)}
                </span>{" "}
                and between{" "}
                <span className="font-semibold">
                  {agreement.partner1Name || "[Partner One's Name]"}
                </span>{" "}
                and{" "}
                <span className="font-semibold">
                  {agreement.partner2Name || "[Partner Two's Name]"}
                </span>{" "}
                ("Clients") and the undersigned officiant{" "}
                <span className="font-semibold">
                  {agreement.officiantName || "[Officiant's Name]"}
                </span>{" "}
                ("Officiant").
              </p>
              <p className="text-gray-700 font-semibold">
                Client and Officiant agree:
              </p>
            </div>

            {/* Parties Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2">
                PARTIES
              </h4>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Officiant
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {agreement.officiantName || "Erie Wedding Officiants"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Partner 1
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {agreement.partner1Name || "To Be Determined"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Partner 2
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {agreement.partner2Name || "To Be Determined"}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2">
                CEREMONY DETAILS
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Event Date:</span>
                  <span className="text-gray-900 font-semibold">
                    {formatDate(agreement.eventDate)}
                  </span>
                </div>
                <div className="flex justify-between items-start py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Location:</span>
                  <span className="text-gray-900 font-semibold text-right max-w-xs">
                    {agreement.location || "To Be Determined"}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Terms Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2">
                FINANCIAL TERMS
              </h4>
              <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">
                    Ceremony Fee:
                  </span>
                  <span className="text-gray-900 font-semibold">
                    ${agreement.price?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Travel Fee:</span>
                  <span className="text-gray-900 font-semibold">
                    ${agreement.travelFee?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-yellow-200">
                  <span className="text-gray-900 font-bold text-lg">
                    Total Amount:
                  </span>
                  <span className="text-primary font-bold text-xl">
                    $
                    {(
                      (agreement.price || 0) + (agreement.travelFee || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2">
                TERMS AND CONDITIONS
              </h4>
              <div className="prose prose-sm text-gray-700 space-y-3">
                <p>
                  This agreement is entered into between Erie Wedding Officiants
                  and the couple named above for professional wedding ceremony
                  services.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    The officiant agrees to perform the ceremony on the date and
                    location specified above.
                  </li>
                  <li>
                    The couple agrees to pay the total amount listed above
                    according to the payment terms.
                  </li>
                  <li>
                    A non-refundable deposit may be required to secure the date.
                  </li>
                  <li>
                    The ceremony will include personalized elements as discussed
                    and agreed upon.
                  </li>
                  <li>
                    Filing of marriage license and all legal documentation will
                    be completed promptly.
                  </li>
                  <li>
                    Any changes to the agreement must be made in writing and
                    agreed upon by both parties.
                  </li>
                </ul>
              </div>
            </div>

            {/* Signatures Section */}
            <div className="space-y-6 pt-6 border-t-2 border-gray-300">
              <h4 className="text-lg font-semibold text-gray-900">
                SIGNATURES
              </h4>

              {/* Partner Signatures */}
              {canSign && (
                <div className="space-y-4 bg-blue-50 p-6 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    Please upload both partners' signatures to accept this
                    agreement:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Partner 1 Signature */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {agreement.partner1Name || "Partner 1"} Signature
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {partner1Preview ? (
                          <div>
                            <img
                              src={partner1Preview}
                              alt="Partner 1 Signature"
                              className="max-h-32 mx-auto mb-2"
                            />
                            <button
                              onClick={() => {
                                setPartner1Preview("");
                                setPartner1SignatureFile(null);
                              }}
                              className="text-red-600 text-sm hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <div className="flex flex-col items-center">
                              <svg
                                className="w-12 h-12 text-gray-400 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              <span className="text-sm text-gray-600">
                                Click to upload (max 1MB)
                              </span>
                            </div>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              onChange={(e) => handleFileChange("partner1", e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Partner 2 Signature */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {agreement.partner2Name || "Partner 2"} Signature
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {partner2Preview ? (
                          <div>
                            <img
                              src={partner2Preview}
                              alt="Partner 2 Signature"
                              className="max-h-32 mx-auto mb-2"
                            />
                            <button
                              onClick={() => {
                                setPartner2Preview("");
                                setPartner2SignatureFile(null);
                              }}
                              className="text-red-600 text-sm hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <div className="flex flex-col items-center">
                              <svg
                                className="w-12 h-12 text-gray-400 mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              <span className="text-sm text-gray-600">
                                Click to upload (max 1MB)
                              </span>
                            </div>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              onChange={(e) => handleFileChange("partner2", e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitSignatures}
                    disabled={
                      !partner1SignatureFile ||
                      !partner2SignatureFile ||
                      uploading
                    }
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploading ? "Uploading..." : "Submit Signatures"}
                  </button>
                </div>
              )}

              {/* Display Signed Signatures */}
              {(isSigned || agreement.status === "officiant_signed") && (
                <div className="space-y-6">
                  <p className="text-sm font-medium text-gray-700">
                    By signing below, the parties acknowledge and agree to the
                    terms stated in this agreement:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {agreement.partner1Signature && (
                      <div className="signature-block">
                        <div className="border-2 border-gray-300 rounded-lg p-3 bg-white">
                          <img
                            src={agreement.partner1Signature}
                            alt="Partner 1 Signature"
                            className="max-h-24 w-full object-contain"
                          />
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-400">
                          <p className="text-sm font-semibold text-gray-900">
                            {agreement.partner1Name}
                          </p>
                          <p className="text-xs text-gray-600">Partner 1</p>
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Signed
                          </p>
                        </div>
                      </div>
                    )}

                    {agreement.partner2Signature && (
                      <div className="signature-block">
                        <div className="border-2 border-gray-300 rounded-lg p-3 bg-white">
                          <img
                            src={agreement.partner2Signature}
                            alt="Partner 2 Signature"
                            className="max-h-24 w-full object-contain"
                          />
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-400">
                          <p className="text-sm font-semibold text-gray-900">
                            {agreement.partner2Name}
                          </p>
                          <p className="text-xs text-gray-600">Partner 2</p>
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Signed
                          </p>
                        </div>
                      </div>
                    )}

                    {agreement.officiantSignature && (
                      <div className="signature-block">
                        <div className="border-2 border-gray-300 rounded-lg p-3 bg-white">
                          <img
                            src={agreement.officiantSignature}
                            alt="Officiant Signature"
                            className="max-h-24 w-full object-contain"
                          />
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-400">
                          <p className="text-sm font-semibold text-gray-900">
                            {agreement.officiantName ||
                              "Erie Wedding Officiants"}
                          </p>
                          <p className="text-xs text-gray-600">Officiant</p>
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Signed
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Signature placeholders for missing signatures */}
                  {!agreement.officiantSignature &&
                    (agreement.partner1Signature ||
                      agreement.partner2Signature) && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> Waiting for officiant to sign
                          the agreement.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
              <p>© 2025 Erie Wedding Officiants. All rights reserved.</p>
              <p className="mt-1">
                This is a legally binding agreement. Please read carefully
                before signing.
              </p>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Agreement
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          /* Hide everything except the agreement */
          body * {
            visibility: hidden;
          }
          
          /* Show only the agreement document */
          .bg-white.shadow-lg, 
          .bg-white.shadow-lg * {
            visibility: visible;
          }
          
          .bg-white.shadow-lg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            margin: 0;
            padding: 0;
          }
          
          /* Hide buttons and interactive elements */
          button {
            display: none !important;
          }
          
          /* Ensure proper page breaks */
          .signature-block {
            page-break-inside: avoid;
          }
          
          /* Print-specific styling */
          .bg-gradient-to-r {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          /* Maintain colors in print */
          .bg-blue-50,
          .bg-gray-50,
          .bg-yellow-50 {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          /* Signature borders */
          .signature-block .border-2 {
            border: 2px solid #000 !important;
          }
          
          /* Text styling for print */
          body {
            font-size: 11pt;
            line-height: 1.5;
          }
          
          h3, h4 {
            color: #000 !important;
          }
          
          /* Ensure signature images print */
          img {
            max-width: 100%;
            page-break-inside: avoid;
          }
          
          /* Professional spacing */
          .space-y-6 > * + *,
          .space-y-4 > * + *,
          .space-y-3 > * + * {
            margin-top: 1rem;
          }
          
          /* Page margins */
          @page {
            margin: 1in;
          }
        }
      `}</style>
    </div>
  );
};

export default Agreement;
