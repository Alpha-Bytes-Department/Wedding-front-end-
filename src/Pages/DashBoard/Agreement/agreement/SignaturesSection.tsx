import React from "react";
import type { AgreementData } from "./types";

interface SignaturesSectionProps {
  agreement: AgreementData;
  canSign: boolean;
  isSigned: boolean;
  partner1Preview: string;
  partner2Preview: string;
  uploading: boolean;
  onFileChange: (
    partner: "partner1" | "partner2",
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemoveSignature: (partner: "partner1" | "partner2") => void;
  onSubmitSignatures: () => void;
}

const SignaturesSection: React.FC<SignaturesSectionProps> = ({
  agreement,
  canSign,
  isSigned,
  partner1Preview,
  partner2Preview,
  uploading,
  onFileChange,
  onRemoveSignature,
  onSubmitSignatures,
}) => {
  return (
    <div className="space-y-6 pt-6 border-t-2 border-gray-300">
      <h4 className="text-lg font-semibold text-gray-900">SIGNATURES</h4>

      {/* Partner Signatures Upload */}
      {canSign && (
        <div className="space-y-4 bg-blue-50 p-6 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-4">
            Please upload both partners' signatures to accept this agreement:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Partner 1 Signature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {agreement.partner1Name || "Partner 1"} Signature
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {partner1Preview ? (
                  <div>
                    <img
                      src={partner1Preview}
                      alt="Partner 1 Signature"
                      className="max-h-32 mx-auto mb-2"
                    />
                    <button
                      onClick={() => onRemoveSignature("partner1")}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-2"
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
                      <span className="text-sm text-gray-600">
                        Click to upload (max 1MB)
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) => onFileChange("partner1", e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Partner 2 Signature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {agreement.partner2Name || "Partner 2"} Signature
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {partner2Preview ? (
                  <div>
                    <img
                      src={partner2Preview}
                      alt="Partner 2 Signature"
                      className="max-h-32 mx-auto mb-2"
                    />
                    <button
                      onClick={() => onRemoveSignature("partner2")}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-2"
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
                      <span className="text-sm text-gray-600">
                        Click to upload (max 1MB)
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) => onFileChange("partner2", e)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onSubmitSignatures}
            disabled={!partner1Preview || !partner2Preview || uploading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Uploading..." : "Submit Signatures"}
          </button>
        </div>
      )}

      {/* Display Signed Signatures */}
      {(isSigned || agreement.status === "officiant_signed") && (
        <div className="space-y-6">
          <p className="text-sm font-medium text-gray-700">
            By signing below, the parties acknowledge and agree to the terms
            stated in this agreement:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agreement.partner1Signature && (
              <div className="signature-block">
                <div className="border-2 border-gray-300 rounded-lg p-3 bg-white">
                  <img
                    src={agreement.partner1Signature}
                    alt="Partner 1 Signature"
                    className="max-h-24 w-full object-contain"
                  />
                </div>
                <div className="mt-2 pt-2 border-t border-gray-400">
                  <p className="text-sm font-semibold text-gray-900">
                    {agreement.partner1Name}
                  </p>
                  <p className="text-xs text-gray-600">Partner 1</p>
                  <p className="text-xs text-green-600 mt-1">✓ Signed</p>
                </div>
              </div>
            )}

            {agreement.partner2Signature && (
              <div className="signature-block">
                <div className="border-2 border-gray-300 rounded-lg p-3 bg-white">
                  <img
                    src={agreement.partner2Signature}
                    alt="Partner 2 Signature"
                    className="max-h-24 w-full object-contain"
                  />
                </div>
                <div className="mt-2 pt-2 border-t border-gray-400">
                  <p className="text-sm font-semibold text-gray-900">
                    {agreement.partner2Name}
                  </p>
                  <p className="text-xs text-gray-600">Partner 2</p>
                  <p className="text-xs text-green-600 mt-1">✓ Signed</p>
                </div>
              </div>
            )}

            {agreement.officiantSignature && (
              <div className="signature-block">
                <div className="border-2 border-gray-300 rounded-lg p-3 bg-white">
                  <img
                    src={agreement.officiantSignature}
                    alt="Officiant Signature"
                    className="max-h-24 w-full object-contain"
                  />
                </div>
                <div className="mt-2 pt-2 border-t border-gray-400">
                  <p className="text-sm font-semibold text-gray-900">
                    {agreement.officiantName || "Erie Wedding Officiants"}
                  </p>
                  <p className="text-xs text-gray-600">Officiant</p>
                  <p className="text-xs text-green-600 mt-1">✓ Signed</p>
                </div>
              </div>
            )}
          </div>

          {/* Signature placeholders for missing signatures */}
          {!agreement.officiantSignature &&
            (agreement.partner1Signature || agreement.partner2Signature) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Waiting for officiant to sign the
                  agreement.
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SignaturesSection;
