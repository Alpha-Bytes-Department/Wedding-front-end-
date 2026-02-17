import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import GlassSwal from "../../../utils/glassSwal";
import type { AgreementData } from "./agreement/types";
import StatusAlerts from "./agreement/StatusAlerts";
import AgreementDocument from "./agreement/AgreementDocument";
import SignaturesSection from "./agreement/SignaturesSection";
import PrintStyles from "./agreement/PrintStyles";

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
          const response = await axios.get("/users/get-user");
          const dbUser = response.data.user;

          if (dbUser.AgreementAccepted) {
            const updatedUser = { ...user, AgreementAccepted: true };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            GlassSwal.success(
              "Agreement Complete!",
              "You can now access the Ceremony Builder to create your ceremony.",
            );
          }
        } catch (error) {
          console.error("Error fetching user agreement status:", error);
          const updatedUser = { ...user, AgreementAccepted: true };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));

          GlassSwal.success(
            "Agreement Complete!",
            "You can now access the Ceremony Builder to create your ceremony.",
          );
        }
      }

      if (
        agreement?.isUsedForCeremony &&
        agreement?.status === "used" &&
        user &&
        !user.AgreementAccepted
      ) {
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
      setAgreement(response.data.agreement);

      try {
        const userResponse = await axios.get("/users/get-user");
        const dbUser = userResponse.data.user;

        if (user && user.AgreementAccepted !== dbUser.AgreementAccepted) {
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

    if (file.size > 1048576) {
      GlassSwal.error("File Too Large", "Signature must be less than 1MB");
      return;
    }

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

  const handleRemoveSignature = (partner: "partner1" | "partner2") => {
    if (partner === "partner1") {
      setPartner1Preview("");
      setPartner1SignatureFile(null);
    } else {
      setPartner2Preview("");
      setPartner2SignatureFile(null);
    }
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
  const isSigned =
    agreement.status !== "pending" && agreement.status !== "officiant_filled";

  const handlePayNow = () => {
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

  const handlePayLater = async () => {
    const result = await GlassSwal.fire({
      title: "Pay Later?",
      html: `<p>By choosing <strong>Pay Later</strong>, you agree to pay the total amount of <strong>$${(
        (agreement.price || 0) + (agreement.travelFee || 0)
      ).toFixed(
        2,
      )}</strong> to the officiant at a later date.</p><p class="mt-2 text-sm text-gray-600">This will be recorded in the agreement and the officiant will proceed to sign.</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay Later",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#f59e0b",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`/agreements/pay-later/${agreement._id}`);

      GlassSwal.success(
        "Pay Later Accepted",
        "The agreement has been updated. The officiant will now sign to complete the agreement.",
      );

      fetchAgreement();
    } catch (error: any) {
      console.error("Error accepting pay later:", error);
      GlassSwal.error(
        "Error",
        error.response?.data?.message || "Failed to accept pay later",
      );
    }
  };

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

        {/* Status Alerts */}
        <StatusAlerts
          agreement={agreement}
          onPayNow={handlePayNow}
          onPayLater={handlePayLater}
          onNavigate={navigate}
        />

        {/* Agreement Document */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <AgreementDocument agreement={agreement} />

          <div className="p-8">
            {/* Signatures Section */}
            <SignaturesSection
              agreement={agreement}
              canSign={canSign}
              isSigned={isSigned}
              partner1Preview={partner1Preview}
              partner2Preview={partner2Preview}
              uploading={uploading}
              onFileChange={handleFileChange}
              onRemoveSignature={handleRemoveSignature}
              onSubmitSignatures={handleSubmitSignatures}
            />

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
              <p>&copy; 2025 Erie Wedding Officiants. All rights reserved.</p>
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

      <PrintStyles />
    </div>
  );
};

export default Agreement;
