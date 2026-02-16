import { useNavigate } from "react-router-dom";
import type { AgreementData } from "./types";

interface PaymentSuccessProps {
  agreementData: AgreementData;
  price: number;
  paymentMethod: string;
  transactionId: string;
}

const PaymentSuccess = ({
  agreementData,
  price,
  paymentMethod,
  transactionId,
}: PaymentSuccessProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-green-600"
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
      <h3 className="text-3xl font-bold text-gray-900 mb-2">
        Payment Successful! 🎉
      </h3>
      <p className="text-gray-600 mb-6">
        Your wedding ceremony agreement payment has been processed successfully.
      </p>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
        <h4 className="font-semibold text-yellow-800 mb-3">
          Payment Confirmation
        </h4>
        <div className="space-y-2 text-sm">
          <p className="text-yellow-700">
            Ceremony:{" "}
            <span className="font-medium">
              {agreementData.partner1Name} & {agreementData.partner2Name}
            </span>
          </p>
          <p className="text-yellow-700">
            Officiant:{" "}
            <span className="font-medium">
              {agreementData.officiantName || "Erie Wedding Officiants"}
            </span>
          </p>
          <p className="text-yellow-700">
            Amount Paid:{" "}
            <span className="font-bold">${price.toFixed(2)}</span>
          </p>
          <p className="text-yellow-700">
            Payment Method:{" "}
            <span className="font-medium">{paymentMethod}</span>
          </p>
          <p className="text-yellow-700">
            Transaction ID:{" "}
            <span className="font-mono text-xs">
              {transactionId.toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/dashboard/agreement/${agreementData._id}`)}
        className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-700"
      >
        View Agreement
      </button>
    </div>
  );
};

export default PaymentSuccess;
