import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/useAxios";
import GlassSwal from "../../../utils/glassSwal";
import { convertLocalDateToISO, formatDateForInput } from "../../../utils/dateUtils";

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
  partner1Signature?: string;
  partner2Signature?: string;
  officiantSignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OfficiantAgreement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  const axios = useAxios();
  const [agreement, setAgreement] = useState<AgreementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [agreementNotFound, setAgreementNotFound] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
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
    if (userId) {
      fetchAgreement();
    }
  }, [userId]);

  const fetchAgreement = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await axios.get(`/agreements/user/${userId}`);
      const data = response.data.agreement;
      setAgreement(data);
      setAgreementNotFound(false);

      // Populate form if data exists
      if (data) {
        setFormData({
          officiantName: data.officiantName || "",
          eventDate: data.eventDate
            ? formatDateForInput(data.eventDate)
            : "",
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
        // Agreement doesn't exist yet - this is fine, we'll show create form
        setAgreementNotFound(true);
        setAgreement(null);
      } else {
        GlassSwal.error(
          "Error",
          error.response?.data?.message || "Failed to load agreement"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveDetails = async () => {
    // Validation
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
        "Please fill in all required fields"
      );
      return;
    }

    if (!userId) {
      GlassSwal.error("Error", "User information not found");
      return;
    }

    try {
      setSaving(true);

      // If agreement doesn't exist, create it
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
          "Agreement has been created. The couple will be notified to review and sign."
        );
      } else {
        // Agreement exists, just update details
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
          "Agreement details have been updated. The couple will be notified to review and sign."
        );
      }

      // Refresh agreement data
      fetchAgreement();
    } catch (error: any) {
      console.error("Error saving details:", error);
      GlassSwal.error(
        "Save Failed",
        error.response?.data?.message || "Failed to save agreement details"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSendPaymentRequest = async () => {
    if (!agreement) return;

    const result = await GlassSwal.confirm(
      "Send Payment Request?",
      `This will notify the couple to pay $${(
        (parseFloat(formData.price) || 0) +
        (parseFloat(formData.travelFee) || 0)
      ).toFixed(2)}`
    );

    if (!result.isConfirmed) return;

    try {
      await axios.post(`/agreements/send-payment-request/${agreement._id}`);

      GlassSwal.success(
        "Payment Request Sent",
        "The couple has been notified and can now proceed with payment."
      );

      // Refresh agreement data
      fetchAgreement();
    } catch (error: any) {
      console.error("Error sending payment request:", error);
      GlassSwal.error(
        "Failed",
        error.response?.data?.message || "Failed to send payment request"
      );
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB)
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
        "Only image files (JPG, PNG, GIF, WebP) are allowed"
      );
      return;
    }

    // Create preview
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

      const formData = new FormData();
      formData.append("officiantSignature", officiantSignatureFile);

      await axios.post(
        `/agreements/upload-officiant-signature/${agreement._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      GlassSwal.success(
        "Agreement Completed",
        "Your signature has been uploaded. The agreement is now complete!"
      );

      // Refresh agreement data
      fetchAgreement();
    } catch (error: any) {
      console.error("Error uploading signature:", error);
      GlassSwal.error(
        "Upload Failed",
        error.response?.data?.message || "Failed to upload signature"
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

  // Show create form when agreement doesn't exist
  if (!agreement && agreementNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/dashboard/bookings")}
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
              Back to Bookings
            </button>
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg p-6 mb-6">
              <h1 className="text-3xl font-bold mb-2">
                Create Ceremony Agreement
              </h1>
              <p className="text-white/90">
                Fill in the details below to create the agreement for this
                ceremony.
              </p>
            </div>
          </div>

          {/* Create Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Agreement Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Officiant Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Officiant) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="officiantName"
                  value={formData.officiantName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Partner 1 Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner 1 Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="partner1Name"
                  value={formData.partner1Name}
                  onChange={handleInputChange}
                  placeholder="Enter first partner's full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Partner 2 Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner 2 Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="partner2Name"
                  value={formData.partner2Name}
                  onChange={handleInputChange}
                  placeholder="Enter second partner's full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ceremony Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ceremony venue or address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Ceremony Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ceremony Fee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Travel Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Fee (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="travelFee"
                    value={formData.travelFee}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-primary">
                  $
                  {(
                    (parseFloat(formData.price) || 0) +
                    (parseFloat(formData.travelFee) || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSaveDetails}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving
                  ? "Creating Agreement..."
                  : "Create Agreement & Notify Couple"}
              </button>
              <button
                onClick={() => navigate("/dashboard/bookings")}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    What happens next?
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    After creating the agreement, the couple will be notified to
                    review and sign. Once they sign, you can send a payment
                    request. After payment is received, you'll sign the
                    agreement to complete the process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  const canEdit = agreement.status === "pending";
  const canSendPayment = agreement.status === "user_signed";
  const canSign = agreement.status === "payment_completed";
  const isCompleted = agreement.status === "officiant_signed";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
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
            Ceremony Agreement Management
          </h1>
          <p className="text-gray-600 mt-2">
            Status:{" "}
            <span className="font-semibold capitalize text-primary">
              {agreement.status.replace(/_/g, " ")}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agreement Details Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Ceremony Details
              </h2>

              <div className="space-y-4">
                {/* Officiant Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name (Officiant) *
                  </label>
                  <input
                    type="text"
                    name="officiantName"
                    value={formData.officiantName}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                {/* Partner Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partner 1 Name *
                    </label>
                    <input
                      type="text"
                      name="partner1Name"
                      value={formData.partner1Name}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      placeholder="First partner's full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partner 2 Name *
                    </label>
                    <input
                      type="text"
                      name="partner2Name"
                      value={formData.partner2Name}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      placeholder="Second partner's full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ceremony Location *
                  </label>
                  <textarea
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    rows={2}
                    placeholder="Full venue address or location details"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ceremony Fee *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        disabled={!canEdit}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Fee
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="travelFee"
                        value={formData.travelFee}
                        onChange={handleInputChange}
                        disabled={!canEdit}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      $
                      {(
                        (parseFloat(formData.price) || 0) +
                        (parseFloat(formData.travelFee) || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                {canEdit && (
                  <button
                    onClick={handleSaveDetails}
                    disabled={saving}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? "Saving..." : "Save Details & Notify Couple"}
                  </button>
                )}
              </div>
            </div>

            {/* Signature Upload Section */}
            {canSign && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Complete Agreement
                </h2>
                <p className="text-gray-600 mb-6">
                  Payment has been received. Please upload your signature to
                  complete the agreement.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {signaturePreview ? (
                    <div className="text-center">
                      <img
                        src={signaturePreview}
                        alt="Officiant Signature"
                        className="max-h-40 mx-auto mb-4"
                      />
                      <button
                        onClick={() => {
                          setSignaturePreview("");
                          setOfficiantSignatureFile(null);
                        }}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Remove Signature
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-16 h-16 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-lg font-medium text-gray-700 mb-2">
                          Upload Your Signature
                        </span>
                        <span className="text-sm text-gray-500">
                          Click to select image (max 1MB)
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <button
                  onClick={handleSubmitSignature}
                  disabled={!officiantSignatureFile || uploading}
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? "Uploading..." : "Complete Agreement"}
                </button>
              </div>
            )}
          </div>

          {/* Status & Actions Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Agreement Status
              </h3>

              <div className="space-y-3">
                {/* Status Steps */}
                <div
                  className={`flex items-center ${
                    agreement.status !== "pending"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      agreement.status !== "pending"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {agreement.status !== "pending" ? "✓" : "1"}
                  </div>
                  <span className="text-sm font-medium">Details Filled</span>
                </div>

                <div
                  className={`flex items-center ${
                    [
                      "user_signed",
                      "payment_requested",
                      "payment_completed",
                      "officiant_signed",
                    ].includes(agreement.status)
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      [
                        "user_signed",
                        "payment_requested",
                        "payment_completed",
                        "officiant_signed",
                      ].includes(agreement.status)
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {[
                      "user_signed",
                      "payment_requested",
                      "payment_completed",
                      "officiant_signed",
                    ].includes(agreement.status)
                      ? "✓"
                      : "2"}
                  </div>
                  <span className="text-sm font-medium">Couple Signed</span>
                </div>

                <div
                  className={`flex items-center ${
                    ["payment_completed", "officiant_signed"].includes(
                      agreement.status
                    )
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      ["payment_completed", "officiant_signed"].includes(
                        agreement.status
                      )
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {["payment_completed", "officiant_signed"].includes(
                      agreement.status
                    )
                      ? "✓"
                      : "3"}
                  </div>
                  <span className="text-sm font-medium">Payment Received</span>
                </div>

                <div
                  className={`flex items-center ${
                    agreement.status === "officiant_signed"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      agreement.status === "officiant_signed"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {agreement.status === "officiant_signed" ? "✓" : "4"}
                  </div>
                  <span className="text-sm font-medium">
                    Agreement Complete
                  </span>
                </div>
              </div>
            </div>

            {/* Action Card */}
            {canSendPayment && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready for Payment
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Both partners have signed the agreement. Send a payment
                  request to proceed.
                </p>
                <button
                  onClick={handleSendPaymentRequest}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Send Payment Request
                </button>
              </div>
            )}

            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Agreement Complete!
                  </h3>
                  <p className="text-sm text-green-700">
                    All signatures received and payment completed.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {formatDate(agreement.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium">
                    {formatDate(agreement.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Agreement ID:</span>
                  <span className="font-mono text-xs">
                    {agreement._id?.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficiantAgreement;
