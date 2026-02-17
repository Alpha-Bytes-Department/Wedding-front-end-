import React from "react";
import type { AgreementFormData } from "./types";
import { getTotalAmount } from "./types";

interface CreateAgreementViewProps {
  formData: AgreementFormData;
  saving: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CreateAgreementView: React.FC<CreateAgreementViewProps> = ({
  formData,
  saving,
  onInputChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onCancel}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                  onChange={onInputChange}
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
                  onChange={onInputChange}
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
                ${getTotalAmount(formData)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={onSave}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving
                ? "Creating Agreement..."
                : "Create Agreement & Notify Couple"}
            </button>
            <button
              onClick={onCancel}
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
                  request. After payment is received, you'll sign the agreement
                  to complete the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAgreementView;
