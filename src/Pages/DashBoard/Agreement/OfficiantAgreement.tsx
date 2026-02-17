import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/useAxios";
import GlassSwal from "../../../utils/glassSwal";
import {
  convertLocalDateToISO,
  formatDateForInput,
} from "../../../utils/dateUtils";

import type { AgreementData, AgreementFormData } from "./officiantAgreement/types";
import CreateAgreementView from "./officiantAgreement/CreateAgreementView";
import AgreementDetailsForm from "./officiantAgreement/AgreementDetailsForm";
import SignatureUpload from "./officiantAgreement/SignatureUpload";
import StatusTracker from "./officiantAgreement/StatusTracker";
import ActionCards from "./officiantAgreement/ActionCards";

const OfficiantAgreement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const agreementId = searchParams.get("agreementId");
  const navigate = useNavigate();
  const axios = useAxios();
  const [agreement, setAgreement] = useState<AgreementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [agreementNotFound, setAgreementNotFound] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AgreementFormData>({
    officiantName: "",
    eventDate: "",
    partner1Name: "",
    partner2Name: "",
    location: "",
    price: "",
    travelFee: "",
  });

  const [officiantSignatureFile, setOfficiantSignatureFile] =
    useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string>("");

  useEffect(() => {
    if (agreementId || userId) {
      fetchAgreement();
    }
  }, [agreementId, userId]);

  const fetchAgreement = async () => {
    if (!agreementId && !userId) return;

    try {
      setLoading(true);
      const url = agreementId
        ? `/agreements/${agreementId}`
        : `/agreements/user/${userId}`;
      const response = await axios.get(url);
      const data = response.data.agreement;
      setAgreement(data);
      setAgreementNotFound(false);

      // Populate form if data exists
      if (data) {
        setFormData({
          officiantName: data.officiantName || "",
          eventDate: data.eventDate ? formatDateForInput(data.eventDate) : "",
          partner1Name: data.partner1Name || "",
          partner2Name: data.partner2Name || "",
          location: data.location || "",
          price: data.price?.toString() || "",
          travelFee: data.travelFee?.toString() || "0",
        });
      }
    } catch (error: any) {
      console.error("Error fetching agreement:", error);
      if (error.response?.status === 404) {
        setAgreementNotFound(true);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveDetails = async () => {
    if (
      !formData.officiantName ||
      !formData.eventDate ||
      !formData.partner1Name ||
      !formData.partner2Name ||
      !formData.location ||
      !formData.price
    ) {
      GlassSwal.error(
        "Missing Information",
        "Please fill in all required fields",
      );
      return;
    }

    if (!userId && !agreement) {
      GlassSwal.error("Error", "User information not found");
      return;
    }

    try {
      setSaving(true);

      if (agreementNotFound || !agreement) {
        await axios.post(`/agreements/create`, {
          userId: userId,
          officiantName: formData.officiantName,
          eventDate: convertLocalDateToISO(formData.eventDate),
          partner1Name: formData.partner1Name,
          partner2Name: formData.partner2Name,
          location: formData.location,
          price: parseFloat(formData.price),
          travelFee: parseFloat(formData.travelFee) || 0,
        });

        GlassSwal.success(
          "Agreement Created",
          "Agreement has been created. The couple will be notified to review and sign.",
        );
      } else {
        await axios.put(`/agreements/update-details/${agreement._id}`, {
          officiantName: formData.officiantName,
          eventDate: convertLocalDateToISO(formData.eventDate),
          partner1Name: formData.partner1Name,
          partner2Name: formData.partner2Name,
          location: formData.location,
          price: parseFloat(formData.price),
          travelFee: parseFloat(formData.travelFee) || 0,
        });

        GlassSwal.success(
          "Details Saved",
          "Agreement details have been updated. The couple will be notified to review and sign.",
        );
      }

      fetchAgreement();
    } catch (error: any) {
      console.error("Error saving details:", error);
      GlassSwal.error(
        "Save Failed",
        error.response?.data?.message || "Failed to save agreement details",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSendPaymentRequest = async () => {
    if (!agreement) return;

    const total = (
      (parseFloat(formData.price) || 0) +
      (parseFloat(formData.travelFee) || 0)
    ).toFixed(2);

    const result = await GlassSwal.confirm(
      "Send Payment Request?",
      `This will notify the couple to pay $${total}`,
    );

    if (!result.isConfirmed) return;

    try {
      await axios.post(`/agreements/send-payment-request/${agreement._id}`);

      GlassSwal.success(
        "Payment Request Sent",
        "The couple has been notified and can now proceed with payment.",
      );

      fetchAgreement();
    } catch (error: any) {
      console.error("Error sending payment request:", error);
      GlassSwal.error(
        "Failed",
        error.response?.data?.message || "Failed to send payment request",
      );
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setSignaturePreview(reader.result as string);
      setOfficiantSignatureFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitSignature = async () => {
    if (!officiantSignatureFile || !agreement) {
      GlassSwal.error("Missing Signature", "Please upload your signature");
      return;
    }

    try {
      setUploading(true);

      const fd = new FormData();
      fd.append("officiantSignature", officiantSignatureFile);

      await axios.post(
        `/agreements/upload-officiant-signature/${agreement._id}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      GlassSwal.success(
        "Agreement Completed",
        "Your signature has been uploaded. The agreement is now complete!",
      );

      fetchAgreement();
    } catch (error: any) {
      console.error("Error uploading signature:", error);
      GlassSwal.error(
        "Upload Failed",
        error.response?.data?.message || "Failed to upload signature",
      );
    } finally {
      setUploading(false);
    }
  };

  // --- Loading state ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // --- Create form when agreement doesn't exist ---
  if (!agreement && agreementNotFound) {
    return (
      <CreateAgreementView
        formData={formData}
        saving={saving}
        onInputChange={handleInputChange}
        onSave={handleSaveDetails}
        onCancel={() => navigate("/dashboard/bookings")}
      />
    );
  }

  // --- Fallback ---
  if (!agreement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Unable to Load Agreement
          </h2>
          <button
            onClick={() => navigate("/dashboard/bookings")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Go to Bookings
          </button>
        </div>
      </div>
    );
  }

  // --- Derived status flags ---
  const lockedStatuses = [
    "user_signed",
    "payment_requested",
    "payment_completed",
    "pay_later_accepted",
    "officiant_signed",
    "completed",
    "used",
  ];
  const canEdit = !lockedStatuses.includes(agreement.status);
  const canSendPayment = agreement.status === "user_signed";
  const canSign =
    agreement.status === "payment_completed" ||
    agreement.status === "pay_later_accepted";
  const isCompleted = agreement.status === "officiant_signed";
  const isPayLater =
    agreement.status === "pay_later_accepted" || agreement.payLater;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard/officiant-agreements")}
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
            Back to Agreements
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Ceremony Agreement Management
          </h1>
          <p className="text-gray-600 mt-2">
            Status:{" "}
            <span className="font-semibold capitalize text-primary">
              {agreement.status.replace(/_/g, " ")}
            </span>
          </p>
          {!canEdit && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-center gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Editing is locked because the couple has already signed this
                agreement.
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <AgreementDetailsForm
              formData={formData}
              canEdit={canEdit}
              saving={saving}
              onInputChange={handleInputChange}
              onSave={handleSaveDetails}
            />

            {canSign && (
              <SignatureUpload
                status={agreement.status}
                formData={formData}
                signaturePreview={signaturePreview}
                uploading={uploading}
                onFileChange={handleFileChange}
                onRemoveSignature={() => {
                  setSignaturePreview("");
                  setOfficiantSignatureFile(null);
                }}
                onSubmitSignature={handleSubmitSignature}
              />
            )}
          </div>

          {/* Status & Actions Sidebar */}
          <div className="space-y-6">
            <StatusTracker
              status={agreement.status}
              isPayLater={!!isPayLater}
            />

            <ActionCards
              agreement={agreement}
              formData={formData}
              isPayLater={!!isPayLater}
              canSendPayment={canSendPayment}
              isCompleted={isCompleted}
              onSendPaymentRequest={handleSendPaymentRequest}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficiantAgreement;
