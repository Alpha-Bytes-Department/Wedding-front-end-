import type { AgreementData } from "./types";

interface AgreementSidebarProps {
  agreementData: AgreementData;
  formatDate: (date?: Date | string) => string;
}

const AgreementSidebar = ({
  agreementData,
  formatDate,
}: AgreementSidebarProps) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-yellow-600"
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
          Agreement Details
        </h2>

        <div className="space-y-4 mb-6">
          {/* Agreement Information */}
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              {agreementData.partner1Name} & {agreementData.partner2Name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Wedding Ceremony Service Agreement
            </p>
            <div className="grid grid-cols-1 gap-3 text-xs">
              <div className="bg-white p-2 rounded">
                <span className="text-gray-500">Ceremony Date:</span>
                <p className="font-medium">
                  {formatDate(agreementData.eventDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Venue
            </h4>
            <p className="text-yellow-800 font-medium">
              {agreementData.location}
            </p>
          </div>

          {/* Officiant */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Officiant
            </h4>
            <p className="text-orange-800 font-medium">
              {agreementData.officiantName || "Erie Wedding Officiants"}
            </p>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Payment Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800">Ceremony Fee:</span>
                <span className="font-medium">
                  ${(agreementData.price || 0).toFixed(2)}
                </span>
              </div>
              {agreementData.travelFee && agreementData.travelFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-800">Travel Fee:</span>
                  <span className="font-medium">
                    ${agreementData.travelFee.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-blue-200 pt-2 flex justify-between">
                <span className="text-blue-900 font-semibold">Total:</span>
                <span className="font-bold text-blue-900">
                  $
                  {(
                    (agreementData.price || 0) +
                    (agreementData.travelFee || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementSidebar;
