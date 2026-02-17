import React from "react";
import type { AgreementFormData } from "./types";
import { getTotalAmount } from "./types";

interface SignatureUploadProps {
  status: string;
  formData: AgreementFormData;
  signaturePreview: string;
  uploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveSignature: () => void;
  onSubmitSignature: () => void;
}

const SignatureUpload: React.FC<SignatureUploadProps> = ({
  status,
  formData,
  signaturePreview,
  uploading,
  onFileChange,
  onRemoveSignature,
  onSubmitSignature,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Complete Agreement
      </h2>
      <p className="text-gray-600 mb-6">
        {status === "pay_later_accepted"
          ? "The couple has agreed to pay later. Please upload your signature to complete the agreement."
          : "Payment has been received. Please upload your signature to complete the agreement."}
      </p>

      {status === "pay_later_accepted" && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-center gap-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            <strong>Pay Later:</strong> The couple has agreed to pay $
            {getTotalAmount(formData)} at a later date.
          </span>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {signaturePreview ? (
          <div className="text-center">
            <img
              src={signaturePreview}
              alt="Officiant Signature"
              className="max-h-40 mx-auto mb-4"
            />
            <button
              onClick={onRemoveSignature}
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
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <button
        onClick={onSubmitSignature}
        disabled={!signaturePreview || uploading}
        className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? "Uploading..." : "Complete Agreement"}
      </button>
    </div>
  );
};

export default SignatureUpload;
