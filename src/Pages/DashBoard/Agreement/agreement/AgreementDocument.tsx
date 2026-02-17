import React from "react";
import type { AgreementData } from "./types";
import { formatDate, getTotalAmount } from "./types";

interface AgreementDocumentProps {
  agreement: AgreementData;
}

const AgreementDocument: React.FC<AgreementDocumentProps> = ({ agreement }) => {
  return (
    <>
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
            <p className="text-sm font-medium text-gray-600 mb-1">Officiant</p>
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
              <span className="text-gray-700 font-medium">Ceremony Fee:</span>
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
                ${getTotalAmount(agreement)}
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
              This agreement is entered into between Erie Wedding Officiants and
              the couple named above for professional wedding ceremony services.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                The officiant agrees to perform the ceremony on the date and
                location specified above.
              </li>
              <li>
                The couple agrees to pay the total amount listed above according
                to the payment terms.
              </li>
              <li>
                A non-refundable deposit may be required to secure the date.
              </li>
              <li>
                The ceremony will include personalized elements as discussed and
                agreed upon.
              </li>
              <li>
                Filing of marriage license and all legal documentation will be
                completed promptly.
              </li>
              <li>
                Any changes to the agreement must be made in writing and agreed
                upon by both parties.
              </li>
            </ul>

            {/* Pay Later Clause */}
            {agreement.payLater && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-lg">
                <h5 className="font-semibold text-amber-900 mb-2">
                  DEFERRED PAYMENT CLAUSE
                </h5>
                <p className="text-amber-800 text-sm">
                  The couple ({agreement.partner1Name} &{" "}
                  {agreement.partner2Name}) and the officiant (
                  {agreement.officiantName || "Erie Wedding Officiants"}) have
                  mutually agreed that the total amount of{" "}
                  <strong>${getTotalAmount(agreement)}</strong> will be paid at
                  a later date. Both parties acknowledge and accept this
                  deferred payment arrangement. Payment should be completed
                  before the ceremony date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AgreementDocument;
