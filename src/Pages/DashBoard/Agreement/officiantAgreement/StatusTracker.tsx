import React from "react";

interface StatusTrackerProps {
  status: string;
  isPayLater: boolean;
}

const StatusTracker: React.FC<StatusTrackerProps> = ({
  status,
  isPayLater,
}) => {
  const pastSigned = [
    "user_signed",
    "payment_requested",
    "payment_completed",
    "pay_later_accepted",
    "officiant_signed",
  ];

  const pastPayment = [
    "payment_completed",
    "pay_later_accepted",
    "officiant_signed",
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Agreement Status
      </h3>

      <div className="space-y-3">
        {/* Step 1 — Details Filled */}
        <div
          className={`flex items-center ${
            status !== "pending" ? "text-green-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              status !== "pending" ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            {status !== "pending" ? "✓" : "1"}
          </div>
          <span className="text-sm font-medium">Details Filled</span>
        </div>

        {/* Step 2 — Couple Signed */}
        <div
          className={`flex items-center ${
            pastSigned.includes(status) ? "text-green-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              pastSigned.includes(status) ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            {pastSigned.includes(status) ? "✓" : "2"}
          </div>
          <span className="text-sm font-medium">Couple Signed</span>
        </div>

        {/* Step 3 — Payment / Pay Later */}
        <div
          className={`flex items-center ${
            pastPayment.includes(status)
              ? isPayLater
                ? "text-amber-600"
                : "text-green-600"
              : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              pastPayment.includes(status)
                ? isPayLater
                  ? "bg-amber-100"
                  : "bg-green-100"
                : "bg-gray-100"
            }`}
          >
            {pastPayment.includes(status) ? "✓" : "3"}
          </div>
          <span className="text-sm font-medium">
            {isPayLater ? "Pay Later Agreed" : "Payment Received"}
          </span>
        </div>

        {/* Step 4 — Complete */}
        <div
          className={`flex items-center ${
            status === "officiant_signed" ? "text-green-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              status === "officiant_signed" ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            {status === "officiant_signed" ? "✓" : "4"}
          </div>
          <span className="text-sm font-medium">Agreement Complete</span>
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;
