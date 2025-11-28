import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAxios } from "../../Component/Providers/useAxios";
import { useLocation, useNavigate } from "react-router-dom";
import GlassSwal from "../../utils/glassSwal";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface AgreementData {
  _id: string;
  userId: string;
  officiantId: string;
  officiantName?: string;
  eventDate?: Date;
  partner1Name?: string;
  partner2Name?: string;
  location?: string;
  price?: number;
  travelFee?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BillData {
  userId: string;
  userName: string;
  eventType: string;
  eventDate: Date;
  eventName: string;
  officiantName: string;
  officiantId: string;
  cost: number;
  travelFee?: number;
  agreementId: string;
  amount: number;
  status: string;
  issuedAt?: Date;
  paidAt?: Date | null;
  location?: {
    line1: string;
    city: string;
    postal_code: string;
    country: string;
  };
  contacts?: string;
  transactionId?: string;
  billingMail?: string;
  billingName?: string;
}

const CheckoutForm = ({
  agreementData,
  billData,
  setBillData,
  price,
}: {
  agreementData: AgreementData;
  billData: BillData;
  setBillData: React.Dispatch<React.SetStateAction<BillData>>;
  price: number;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const axios = useAxios();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      city: "",
      postal_code: "",
      country: "US",
    },
  });

  useEffect(() => {
    axios
      .post("/marketing/create-checkout-session", {
        Price: price,
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error("Error fetching clientSecret:", err);
        setError("Failed to initialize payment. Please try again.");
      });
  }, [price]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setBillingDetails((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setBillingDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please wait.");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card element not found.");
      return;
    }

    if (!billingDetails.name || !billingDetails.email) {
      setError("Please fill in all required billing information.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: card,
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              phone: billingDetails.phone,
              address: {
                line1: billingDetails.address.line1,
                city: billingDetails.address.city,
                postal_code: billingDetails.address.postal_code,
                country: billingDetails.address.country,
              },
            },
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error);
        setError(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent.id.toUpperCase());
        setTransactionId(paymentIntent.id);
        setSuccess(true);

        // Create updated bill data with all information
        const updatedBillData = {
          ...billData,
          location: {
            line1: billingDetails.address.line1,
            city: billingDetails.address.city,
            postal_code: billingDetails.address.postal_code,
            country: billingDetails.address.country,
          },
          billingMail: billingDetails.email,
          billingName: billingDetails.name,
          contacts: billingDetails.phone,
          transactionId: paymentIntent.id,
          paidAt: new Date(),
          status: "paid",
        };

        // Update the state
        setBillData(updatedBillData);

        // Send the complete bill data to backend
        const updatedBill = await axios.post(`/bills/create`, updatedBillData);
        if (updatedBill.status === 200 || updatedBill.status === 201) {
          // Mark payment as completed in agreement
          await axios.patch(
            `/agreements/payment-completed/${agreementData._id}`
          );

          GlassSwal.fire({
            title: "Success!",
            text: "Payment completed successfully! Your agreement is now finalized.",
            icon: "success",
            confirmButtonText: "View Agreement",
          }).then(() => {
            navigate(`/dashboard/agreement/${agreementData._id}`);
          });
        }

        // Get payment method details from paymentIntent
        const paymentMethod = paymentIntent.payment_method;
        if (typeof paymentMethod === "object" && paymentMethod?.card) {
          setPaymentMethod("**** **** **** " + paymentMethod.card.last4);
        } else {
          setPaymentMethod("Payment completed successfully");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
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
          Your wedding ceremony agreement payment has been processed
          successfully.
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
  }

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-yellow-600"
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
          Billing Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={billingDetails.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={billingDetails.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={billingDetails.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="address.city"
              value={billingDetails.address.city}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="New York"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address.line1"
              value={billingDetails.address.line1}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Main Street"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              name="address.postal_code"
              value={billingDetails.address.postal_code}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10001"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          Payment Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="w-full border border-gray-300 rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-transparent">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Your payment information is secure and encrypted
        </div>
      </div>

      {/* Bill Summary */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-yellow-600"
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
          Payment Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Ceremony Fee</span>
            <span>${billData.cost.toFixed(2)}</span>
          </div>
          {billData.travelFee && billData.travelFee > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Travel Fee</span>
              <span>${billData.travelFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Processing Fee</span>
            <span>Included</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total Amount</span>
              <span>${billData.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <svg
            className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h4 className="text-red-800 font-medium">Payment Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!clientSecret || processing}
        className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Processing Payment...
          </>
        ) : (
          <>
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure Payment - ${price.toFixed(2)}
          </>
        )}
      </button>

      {/* Trust Indicators */}
      <div className="text-center space-y-2">
        <p className="text-xs text-gray-500 flex items-center justify-center">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Protected by 256-bit SSL encryption
        </p>
        <div className="flex justify-center space-x-4 opacity-60">
          <span className="text-xs text-gray-400">VISA</span>
          <span className="text-xs text-gray-400">MASTERCARD</span>
          <span className="text-xs text-gray-400">AMEX</span>
          <span className="text-xs text-gray-400">DISCOVER</span>
        </div>
      </div>
    </div>
  );
};

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

        // Fetch agreement data
        const agreementResponse = await axios.get(`/agreements/user/${userId}`);
        const agreement = agreementResponse.data.agreement;
        setAgreementData(agreement);

        // Set bill data based on agreement
        const ceremonyPrice = parseFloat(price) || 0;
        const travelFeeAmount = parseFloat(travelFee) || 0;
        const totalAmount = ceremonyPrice + travelFeeAmount;

        setBillData({
          userId: userId,
          userName: `${partner1Name} & ${partner2Name}`,
          eventType: "Wedding Ceremony",
          eventDate: new Date(eventDate),
          eventName: `Wedding of ${partner1Name} & ${partner2Name}`,
          officiantName: officiantName,
          officiantId: officiantId,
          cost: ceremonyPrice,
          travelFee: travelFeeAmount,
          agreementId: agreementId,
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
          {/* Agreement Details - Left Side */}
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

              {/* Agreement Information */}
              <div className="space-y-4 mb-6">
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
                      <span className="text-blue-900 font-semibold">
                        Total:
                      </span>
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

          {/* Payment Form - Right Side */}
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
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Refund Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementPayment;
