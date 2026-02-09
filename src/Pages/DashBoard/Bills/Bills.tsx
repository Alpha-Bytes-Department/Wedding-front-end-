import { useEffect, useState } from "react";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import PdfMaker from "../../../Component/PDFGenerator/PdfMaker";
import GlassSwal from "../../../utils/glassSwal";

interface Location {
  line1?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

interface IBill {
  _id: string;
  userId: string;
  userName: string;
  eventType: string;
  eventDate: Date;
  eventName: string;
  officiantName: string;
  officiantId: string;
  cost: number;
  travelFee?: number;
  eventId?: string;
  agreementId?: string;
  amount: number;
  status: "paid" | "unpaid";
  issuedAt?: Date;
  paidAt?: Date;
  location?: Location;
  contacts?: string;
  transactionId?: string;
  billingMail?: string;
  billingName?: string;
}

const Bills = () => {
  const [bills, setBills] = useState<IBill[]>([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Restrict access to officiants
  useEffect(() => {
    if (user?.role === "officiant") {
      GlassSwal.fire({
        title: "Access Denied",
        text: "This page is only accessible to clients.",
        icon: "error",
        confirmButtonText: "Go to Dashboard",
      }).then(() => {
        navigate("/dashboard");
      });
    }
  }, [user?.role, navigate]);

  const formatDate = (date?: Date | string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/bills/user/${user?._id}`);
      setBills(response.data.bills || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
      GlassSwal.error("Error", "Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchBills();
    }
  }, [user?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Bills Yet
            </h2>
            <p className="text-gray-600">
              Your bills will appear here after completing payments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bills</h1>
          <p className="text-gray-600">
            View and download your payment receipts and invoices
          </p>
        </div>

        {/* Bills Grid */}
        <div className="grid gap-6">
          {bills.map((bill) => (
            <div
              key={bill._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Bill Information */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {bill.eventName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Invoice #{bill._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          bill.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {bill.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Date */}
                      <div className="flex items-center text-gray-600">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-500">Event Date</p>
                          <p className="font-medium">
                            {formatDate(bill.eventDate)}
                          </p>
                        </div>
                      </div>

                      {/* Officiant */}
                      <div className="flex items-center text-gray-600">
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
                        <div>
                          <p className="text-xs text-gray-500">Officiant</p>
                          <p className="font-medium">{bill.officiantName}</p>
                        </div>
                      </div>

                      {/* Payment Date */}
                      {bill.paidAt && (
                        <div className="flex items-center text-gray-600">
                          <svg
                            className="w-5 h-5 mr-2 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">Paid On</p>
                            <p className="font-medium">
                              {formatDate(bill.paidAt)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Transaction ID */}
                      {bill.transactionId && (
                        <div className="flex items-center text-gray-600">
                          <svg
                            className="w-5 h-5 mr-2 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                            />
                          </svg>
                          <div>
                            <p className="text-xs text-gray-500">
                              Transaction ID
                            </p>
                            <p className="font-mono text-xs">
                              {bill.transactionId.slice(0, 20).toUpperCase()}...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Amount Breakdown */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Ceremony Fee:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(bill.cost)}
                        </span>
                      </div>
                      {bill.travelFee && bill.travelFee > 0 && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            Travel Fee:
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(bill.travelFee)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 border-t border-yellow-300">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-yellow-700">
                          {formatCurrency(bill.amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <PdfMaker
                      eventId={bill.agreementId || bill.eventId || bill._id}
                    />
                    <button
                      onClick={() => {
                        // Copy transaction ID to clipboard
                        if (bill.transactionId) {
                          navigator.clipboard.writeText(bill.transactionId);
                          GlassSwal.success(
                            "Copied!",
                            "Transaction ID copied to clipboard"
                          );
                        }
                      }}
                      className="bg-gray-100 border border-gray-300 text-gray-700 text-sm px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                      disabled={!bill.transactionId}
                    >
                      Copy Transaction ID
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bills;
