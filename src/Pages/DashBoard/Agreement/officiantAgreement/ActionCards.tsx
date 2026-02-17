import React from "react";
import type { AgreementData, AgreementFormData } from "./types";
import { formatDate, getTotalAmount } from "./types";

interface ActionCardsProps {
  agreement: AgreementData;
  formData: AgreementFormData;
  isPayLater: boolean;
  canSendPayment: boolean;
  isCompleted: boolean;
  onSendPaymentRequest: () => void;
}

const ActionCards: React.FC<ActionCardsProps> = ({
  agreement,
  formData,
  isPayLater,
  canSendPayment,
  isCompleted,
  onSendPaymentRequest,
}) => {
  return (
    <>
      {/* Payment Request Card */}
      {canSendPayment && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready for Payment
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Both partners have signed the agreement. Send a payment request to
            proceed.
          </p>
          <button
            onClick={onSendPaymentRequest}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Send Payment Request
          </button>
        </div>
      )}

      {/* Completion Card */}
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
              {isPayLater
                ? "All signatures received. Payment will be collected later."
                : "All signatures received and payment completed."}
            </p>
            {isPayLater && (
              <p className="text-xs text-amber-600 mt-2 font-medium">
                ⏰ Pay Later: ${getTotalAmount(formData)} pending
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
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
    </>
  );
};

export default ActionCards;
