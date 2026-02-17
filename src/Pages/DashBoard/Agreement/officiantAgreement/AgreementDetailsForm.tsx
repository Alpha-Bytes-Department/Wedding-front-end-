import React from "react";
import type { AgreementFormData } from "./types";
import { getTotalAmount } from "./types";

interface AgreementDetailsFormProps {
  formData: AgreementFormData;
  canEdit: boolean;
  saving: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSave: () => void;
}

const AgreementDetailsForm: React.FC<AgreementDetailsFormProps> = ({
  formData,
  canEdit,
  saving,
  onInputChange,
  onSave,
}) => {
  return (
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
            onChange={onInputChange}
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
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={onInputChange}
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
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                name="travelFee"
                value={formData.travelFee}
                onChange={onInputChange}
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
              ${getTotalAmount(formData)}
            </span>
          </div>
        </div>

        {/* Save Button */}
        {canEdit && (
          <button
            onClick={onSave}
            disabled={saving}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving..." : "Save Details & Notify Couple"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AgreementDetailsForm;
