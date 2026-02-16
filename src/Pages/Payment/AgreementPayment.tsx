import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useAxios } from "../../Component/Providers/useAxios";
import { useLocation, useNavigate } from "react-router-dom";
import GlassSwal from "../../utils/glassSwal";
import type { AgreementData, BillData } from "./payment/types";
import CheckoutForm from "./payment/CheckoutForm";
import AgreementSidebar from "./payment/AgreementSidebar";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const AgreementPayment = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const [billData, setBillData] = useState<BillData>({} as BillData);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const [agreementData, setAgreementData] = useState<AgreementData>(
    {} as AgreementData
  );
  const [loading, setLoading] = useState(true);

  // Get all parameters from URL
  const agreementId = searchParams.get("agreementId") || "";
  const amount = searchParams.get("amount") || "";
  const price = searchParams.get("price") || "";
  const travelFee = searchParams.get("travelFee") || "0";
  const partner1Name = searchParams.get("partner1Name") || "";
  const partner2Name = searchParams.get("partner2Name") || "";
  const officiantName = searchParams.get("officiantName") || "";
  const eventDate = searchParams.get("eventDate") || "";
  const userId = searchParams.get("userId") || "";
  const officiantId = searchParams.get("officiantId") || "";

  useEffect(() => {
    const initializePaymentData = async () => {
      try {
        setLoading(true);

        const agreementResponse = await axios.get(`/agreements/user/${userId}`);
        const agreement = agreementResponse.data.agreement;
        setAgreementData(agreement);

        const ceremonyPrice = parseFloat(price) || 0;
        const travelFeeAmount = parseFloat(travelFee) || 0;
        const totalAmount = ceremonyPrice + travelFeeAmount;

        setBillData({
          userId,
          userName: `${partner1Name} & ${partner2Name}`,
          eventType: "Wedding Ceremony",
          eventDate: new Date(eventDate),
          eventName: `Wedding of ${partner1Name} & ${partner2Name}`,
          officiantName,
          officiantId,
          cost: ceremonyPrice,
          travelFee: travelFeeAmount,
          agreementId,
          amount: totalAmount,
          status: "unpaid",
          issuedAt: new Date(),
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching agreement data:", error);
        GlassSwal.error("Error", "Failed to load payment information");
        setLoading(false);
      }
    };

    if (agreementId && userId) {
      initializePaymentData();
    }
  }, [agreementId, userId]);

  const formatDate = (date?: Date | string) => {
    if (!date) return "Not Set";
    return new Date(date).toLocaleDateString("en-US", {
      timeZone: "America/New_York",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!agreementData._id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Agreement Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to load payment information. Please try again.
          </p>
          <button
            onClick={() => navigate(`/dashboard/agreement/${agreementId}`)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Go to Agreement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(`/dashboard/agreement/${agreementId}`)}
            className="text-gray-600 hover:text-gray-800 font-medium mb-4 inline-flex items-center"
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
            Back to Agreement
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Ceremony Payment
          </h1>
          <p className="text-gray-600">
            Complete your wedding ceremony agreement payment securely
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <AgreementSidebar
            agreementData={agreementData}
            formatDate={formatDate}
          />

          {/* Payment Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  agreementData={agreementData}
                  setBillData={setBillData}
                  billData={billData}
                  price={parseFloat(amount)}
                />
              </Elements>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at
            support@erieweddingofficants.com
          </p>
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
            <span>Terms of Service</span>
            <span></span>
            <span>Privacy Policy</span>
            <span></span>
            <span>Refund Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementPayment;
