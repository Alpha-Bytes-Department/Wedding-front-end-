import React from "react";
import type { AgreementData } from "./types";
import { formatDate, getTotalAmount } from "./types";

interface StatusAlertsProps {
  agreement: AgreementData;
  onPayNow: () => void;
  onPayLater: () => void;
  onNavigate: (path: string) => void;
}

const StatusAlerts: React.FC<StatusAlertsProps> = ({
  agreement,
  onPayNow,
  onPayLater,
  onNavigate,
}) => {
  const isPending = agreement.status === "pending";
  const isPaymentRequested = agreement.status === "payment_requested";
  const isPaymentCompleted = agreement.status === "payment_completed";
  const isPayLaterAccepted = agreement.status === "pay_later_accepted";

  return (
    <>
      {/* Agreement Used Alert */}
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
                  onClick={() => onNavigate("/dashboard/schedule")}
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

      {/* Pending Alert */}
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
                  You have signed the agreement. Please proceed with payment to
                  finalize, or choose to pay later.
                </p>
                <p className="text-2xl font-bold text-blue-900 mt-2">
                  Total Amount: ${getTotalAmount(agreement)}
                </p>
              </div>
            </div>
            <div className="ml-4 flex flex-col gap-2">
              <button
                onClick={onPayNow}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Pay Now
              </button>
              <button
                onClick={onPayLater}
                className="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors whitespace-nowrap"
              >
                Pay Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Later Accepted Alert */}
      {isPayLaterAccepted && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-amber-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900">
                Pay Later Accepted
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                You have agreed to pay the total amount of{" "}
                <strong>${getTotalAmount(agreement)}</strong> at a later date.
                The officiant will now sign to complete the agreement.
              </p>
              <p className="text-sm text-amber-700 mt-2">
                This deferred payment has been recorded in the agreement. Please
                ensure payment is made before the ceremony date.
              </p>
            </div>
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
              onClick={() => onNavigate("/dashboard/bills")}
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
                    onClick={() => onNavigate("/dashboard/ceremony")}
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
                    onClick={() => onNavigate("/dashboard/bills")}
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
    </>
  );
};

export default StatusAlerts;
