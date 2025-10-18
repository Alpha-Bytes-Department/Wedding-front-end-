import { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useAxios } from "../../../Component/Providers/useAxios";
import { Link, useNavigate } from "react-router-dom";
// import { usePDF } from "react-to-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import GlassSwal from "../../../utils/glassSwal";

type Notification = {
  _id: string;
  userId: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type events = {
  officiantId: string;
  status: string;
  _id: string;
  title: string;
};

type booking = {
  _id: string;
  eventDate: Date;
  eventType: string;
  approvedStatus: string;
  updatedAt: Date;
};

type Ceremony = {
  id: string;
  name: string;
  date: string;
  officiant: string;
  complete: string;
};

type bill = {
  _id: string;
  userId: string;
  userName: string;
  eventType: string;
  eventDate: string;
  eventName: string;
  officiantName: string;
  officiantId: string;
  cost: number;
  eventId: string;
  amount: number;
  status: string;
  issuedAt: string;
  paidAt: string;
  location: {
    line1: string;
    city: string;
    country: string;
    postal_code: string;
  };
  contacts: string;
  transactionId: string;
};

const DashHome = () => {
  const [showingAll, setShowingAll] = useState(false);
  const navigate = useNavigate();
  const [ceremonies, setCeremonies] = useState<Ceremony[]>([]);
  const [activeBill, setActiveBill] = useState<bill | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [newBookings, setNewBookings] = useState<booking[]>([]);
  const [ceremony, setCeremony] = useState<events[]>([]);
  const [billAvailability, setBillAvailability] = useState<
    Record<string, boolean>
  >({});
  const [checkingBills, setCheckingBills] = useState(false);

  // Updated PDF download function using html2canvas and jsPDF
  const downloadPDF = async (billData?: bill) => {
    try {
      setIsDownloading(true);

      let targetBill = billData || activeBill;

      if (!targetBill) {
        console.error("No bill data available for PDF generation");
        GlassSwal.error("Error", "No bill data available for PDF generation");
        return;
      }

      // Create a temporary iframe to isolate the content from page styles
      const iframe = document.createElement("iframe");
      iframe.style.visibility = "hidden";
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      iframe.style.top = "0";
      iframe.style.width = "800px";
      iframe.style.height = "1200px"; // Make it tall enough
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      // Wait for iframe to load
      await new Promise<void>((resolve) => {
        iframe.onload = () => resolve();
        iframe.src = "about:blank";
      });

      // Get iframe document
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("Could not access iframe document");
      }

      // Add base styles to iframe to reset everything
      const style = iframeDoc.createElement("style");
      style.textContent = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }
        body {
          background-color: #ffffff;
        }
      `;
      iframeDoc.head.appendChild(style);

      // Create container and add invoice HTML
      const container = iframeDoc.createElement("div");
      container.style.width = "800px";
      container.style.backgroundColor = "#ffffff";
      container.style.padding = "40px";
      container.style.position = "relative";
      container.innerHTML = generateInvoiceHTML(targetBill);
      iframeDoc.body.appendChild(container);

      // Wait a bit for all content to render properly
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        // Generate PDF using html2canvas and jsPDF
        const canvas = await html2canvas(iframeDoc.body, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`invoice-${targetBill._id.slice(-8)}.pdf`);
      } catch (error) {
        console.error("Error rendering PDF content:", error);
        GlassSwal.error("Error", "Failed to generate PDF. Please try again.");
        throw error;
      } finally {
        // Clean up
        document.body.removeChild(iframe);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      GlassSwal.error("Error", "Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const fetchScheduleData = async () => {
    try {
      const response = await axios.get(`/schedule/get-officiant/${user?._id}`);

      setNewBookings(response.data);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

  // Function to generate HTML for invoice
  const generateInvoiceHTML = (bill: bill) => {
    return `
      <div style="
        background-color: white;
        padding: 40px;
        min-height: 800px;
        font-family: Arial, sans-serif;
        position: relative;
        font-size: 14px;
        line-height: 1.4;
        color: #000;
      ">
        <!-- Invoice Header -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        ">
          <div>
            <h1 style="
              font-size: 36px;
              font-weight: bold;
              color: #000;
              margin: 0 0 8px 0;
              letter-spacing: 2px;
            ">INVOICE</h1>
            <p style="
              color: #666;
              margin: 0;
              font-size: 14px;
            ">#${bill._id.slice(-12).toUpperCase()}</p>
            <p style="
              color: #666;
              margin: 0;
              font-size: 14px;
            ">Trnx ID : ${bill.transactionId}</p>
          </div>
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
            <img
              src="/image.png"
              alt="Erie Wedding Officiants Logo"
              style="
                width: 80px;
                height: 80px;
                object-fit: contain;
              "
            />
            <span style="
              color: #D4AF37;
              font-size: 12px;
              font-weight: bold;
              text-align: center;
              margin-top: 8px;
            ">ERIE WEDDING OFFICIANTS</span>
          </div>
        </div>

        <!-- Status Badge -->
        <div style="
          position: absolute;
          top: 200px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 48px;
          font-weight: bold;
          color: ${bill.status === "paid" ? "#10B981" : "#EF4444"};
          opacity: 0.3;
          border: 3px solid ${bill.status === "paid" ? "#10B981" : "#EF4444"};
          padding: 20px 40px;
          border-radius: 10px;
          text-transform: uppercase;
        ">${bill.status}</div>

        <!-- Issue and Due Dates -->
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          position: relative;
          z-index: 2;
        ">
          <div>
            <p style="
              color: #666;
              margin: 0 0 4px 0;
              font-size: 12px;
              font-weight: bold;
            ">Issued</p>
            <p style="
              color: #000;
              margin: 0;
              font-size: 14px;
            ">${formatDate(bill.issuedAt)}</p>
          </div>
          <div>
            <p style="
              color: #666;
              margin: 0 0 4px 0;
              font-size: 12px;
              font-weight: bold;
            ">Due</p>
            <p style="
              color: #000;
              margin: 0;
              font-size: 14px;
            ">${bill.paidAt ? formatDate(bill.paidAt) : "Upon receipt"}</p>
          </div>
        </div>

        <!-- From, To Section -->
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          position: relative;
          z-index: 2;
        ">
          <div style="width: 45%;">
            <p style="
              color: #666;
              margin: 0 0 8px 0;
              font-size: 12px;
              font-weight: bold;
            ">From</p>
            <p style="
              color: #000;
              margin: 0 0 4px 0;
              font-size: 14px;
              font-weight: bold;
            ">ERIE WEDDING OFFICIANTS</p>
            <p style="color: #666; margin: 0 0 2px 0; font-size: 12px;">Company address</p>
            <p style="color: #666; margin: 0 0 2px 0; font-size: 12px;">123 Love Lane, Erie, Pennsylvania</p>
            <p style="color: #666; margin: 0; font-size: 12px;">TAX ID 00XXXXXI234XOXX</p>
          </div>

          <div style="width: 45%;">
            <p style="
              color: #666;
              margin: 0 0 8px 0;
              font-size: 12px;
              font-weight: bold;
            ">TO</p>
            <p style="
              color: #000;
              margin: 0 0 4px 0;
              font-size: 14px;
              font-weight: bold;
            ">${bill.userName}</p>
            <p style="color: #666; margin: 0 0 2px 0; font-size: 12px;">Address</p>
            <p style="color: #666; margin: 0 0 2px 0; font-size: 12px;">${
              bill.location.line1
            }, ${bill.location.city}, ${bill.location.country} - ${
      bill.location.postal_code
    }</p>
            <p style="color: #666; margin: 0; font-size: 12px;">${
              bill.contacts
            }</p>
          </div>
        </div>

        <!-- Service Table -->
        <div style="
          margin-bottom: 40px;
          position: relative;
          z-index: 2;
        ">
          <!-- Table Header -->
          <div style="
            display: flex;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
            margin-bottom: 12px;
          ">
            <div style="width: 50%; font-size: 12px; font-weight: bold; color: #666;">Service</div>
            <div style="width: 15%; font-size: 12px; font-weight: bold; color: #666; text-align: center;">Qty</div>
            <div style="width: 15%; font-size: 12px; font-weight: bold; color: #666; text-align: right;">Rate</div>
            <div style="width: 20%; font-size: 12px; font-weight: bold; color: #666; text-align: right;">Line total</div>
          </div>

          <!-- Service Row -->
          <div style="display: flex; margin-bottom: 12px;">
            <div style="width: 50%;">
              <p style="
                margin: 0 0 4px 0;
                font-size: 14px;
                font-weight: bold;
                color: #000;
              ">${bill.eventType} Service</p>
              <p style="margin: 0; font-size: 12px; color: #666;">
                ${bill.eventName} • ${formatDate(bill.eventDate)}
              </p>
            </div>
            <div style="width: 15%; font-size: 14px; text-align: center;">1</div>
            <div style="width: 15%; font-size: 14px; text-align: right;">${formatCurrency(
              bill.cost
            )}</div>
            <div style="width: 20%; font-size: 14px; text-align: right;">${formatCurrency(
              bill.cost
            )}</div>
          </div>

         
        </div>

        <!-- Total Section -->
        <div style="
          margin-bottom: 60px;
          position: relative;
          z-index: 2;
        ">
          <div style="
            width: 40%;
            margin-left: auto;
            border-top: 1px solid #ddd;
            padding-top: 12px;
          ">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #666;">Subtotal</span>
              <span style="font-size: 14px; color: #000;">${formatCurrency(
                bill.amount
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 14px; color: #666;">Tax (0%)</span>
              <span style="font-size: 14px; color: #000;">$0.00</span>
            </div>
            <div style="
              display: flex;
              justify-content: space-between;
              border-top: 1px solid #ddd;
              padding-top: 8px;
              margin-top: 8px;
            ">
              <span style="font-size: 16px; font-weight: bold; color: #000;">Total</span>
              <span style="font-size: 16px; font-weight: bold; color: #000;">${formatCurrency(
                bill.amount
              )}</span>
            </div>
            <div style="
              border-bottom: 3px solid #D4AF37;
              margin-top: 8px;
              padding-bottom: 8px;
            ">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 14px; font-weight: bold; color: #D4AF37;">Amount due</span>
                <span style="font-size: 18px; font-weight: bold; color: #D4AF37;">
                  US$ ${bill.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
          position: relative;
          z-index: 2;
        ">
          <p style="margin: 0 0 4px 0;">Thank you for choosing our services!</p>
          <p style="margin: 0;">This is a computer-generated invoice.</p>
          <div style="margin-top: 12px;">
            <p style="margin: 0 0 4px 0; font-weight: bold;">Officiant: ${
              bill.officiantName
            }</p>
            <p style="margin: 0;">Event ID: ${bill.eventId}</p>
            <p style="margin: 0;">Event : ${bill.eventName}</p>
          </div>
        </div>
      </div>
    `;
  };

  // Function to check bill availability for each ceremony
  const checkBillAvailability = async (ceremonies: Ceremony[]) => {
    if (ceremonies.length === 0) return;

    setCheckingBills(true);
    const availability: Record<string, boolean> = {};

    // Check each ceremony for bill availability in parallel
    const promises = ceremonies.map(async (ceremony) => {
      try {
        await axios.get(`/bills/${ceremony.id}`);
        availability[ceremony.id] = true;
      } catch (error) {
        availability[ceremony.id] = false;
        console.log(
          `No bill data found for ceremony: ${ceremony.name} (${ceremony.id})`
        );
      }
    });

    await Promise.all(promises);
    setBillAvailability(availability);
    setCheckingBills(false);
  };

  // Function to handle PDF download directly from event card
  const handleEventCardDownload = async (ceremonyId: string) => {
    try {
      setIsDownloading(true);
      const billResponse = await axios.get(`/bills/${ceremonyId}`);
      const billData = billResponse.data.bill;
      await downloadPDF(billData);
    } catch (error) {
      console.error("Error fetching invoice for download:", error);
      GlassSwal.error(
        "Error",
        "Invoice data not found for this ceremony. Unable to generate PDF."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const axios = useAxios();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const getNotifications = async () => {
    try {
      const response = await axios.get("/notifications/my");
      console.log(
        `Found ${response.data.notifications.length} notifications for user ${user?._id}`
      );
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const getCeremonies = async () => {
    try {
      const response = await axios.get(
        `/events/by-role/${user?._id}/${user?.role}`
      );
      const ceremonyData = response.data.events
        .filter((ceremony: any) => ceremony.status === "completed")
        .map((ceremony: any) => ({
          id: ceremony._id,
          name: ceremony.title,
          date: new Date(ceremony.eventDate).toLocaleDateString(),
          officiant: ceremony.officiantName,
          complete: ceremony.status,
        }));

      setCeremonies(ceremonyData);

      // Check bill availability after setting ceremonies
      await checkBillAvailability(ceremonyData);
    } catch (error) {
      console.error("Error fetching ceremonies:", error);
    }
  };

  useEffect(() => {
    getNotifications();
    getCeremonies();
    fetchScheduleData();
    getCeremony();
  }, []);

  const costInvoice = async (ceremonyId: string) => {
    try {
      const bill = await axios.get(`/bills/${ceremonyId}`);
      console.log("Invoice data:", bill.data.bill);
      setActiveBill(bill.data.bill);
      setError(null);
      (document.getElementById("my_modal_4") as HTMLDialogElement).showModal();
    } catch (error) {
      setError(
        "Invoice data not found for this ceremony. Please contact support if this is unexpected."
      );
      console.error("Error fetching invoice:", error);
      (document.getElementById("my_modal_4") as HTMLDialogElement).showModal();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const toggleShowAll = () => {
    setShowingAll((prev) => !prev);
  };
  const getCeremony = async () => {
    const response = await axios.get(`/events/officiantAccess/all`);
    console.log("ceremony", response);
    setCeremony(response?.data && response?.data.events);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Dashboard Header */}
        <div className="bg-white w-full lg:w-5/7 shadow-xl rounded-2xl border border-primary py-14 flex flex-col text-center items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-4xl font-semibold font-primary text-gray-900 mb-2">
              Dashboard Home
            </h1>
            <p className="text-black-web font-secondary text-lg lg:text-xl">
              Welcome Back!{" "}
              {user?.name
                ? user.name
                : `${user?.partner_1} & ${user?.partner_2}`}
              .
            </p>
          </div>

          {user?.role === "officiant" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 md:gap-x-10 font-secondary mt-5">
              <div className="border flex flex-col py-2 px-4 rounded-md border-gray-200">
                <p>New bookings</p>{" "}
                <p>
                  {
                    newBookings.filter(
                      (booking) => booking.approvedStatus === "pending"
                    ).length
                  }
                </p>
              </div>
              <div className="border flex flex-col py-2 px-4 rounded-md border-gray-200">
                <p>Total Clients served</p>{" "}
                <p>
                  {
                    ceremony.filter(
                      (ceremony) =>
                        ceremony.officiantId === user._id &&
                        ceremony.status === "completed"
                    ).length
                  }
                </p>
              </div>
              <div className="border flex flex-col py-2 px-4 rounded-md border-gray-200">
                <p>Ongoing Clients</p>
                <p>
                  {
                    ceremony.filter(
                      (ceremony) =>
                        ceremony.officiantId === user._id &&
                        ceremony.status === "approved"
                    ).length
                  }
                </p>
              </div>
              <div className="border flex flex-col py-2 px-4 rounded-md border-gray-200">
                <p>Confirmed this week</p>{" "}
                <p>
                  {
                    newBookings.filter((booking) => {
                      const sevenDaysAgo = new Date();
                      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                      return (
                        new Date(booking.updatedAt) >= sevenDaysAgo &&
                        booking.approvedStatus === "approved"
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col lg:flex-row gap-4 mx-auto ">
              <Link
                to="/dashboard/ceremony"
                className="bg-primary group text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Start A new Ceremony</span>
                <MdKeyboardArrowRight
                  className="group-hover:translate-x-3 transition-transform duration-200"
                  size={20}
                />
              </Link>
              <button
                onClick={() =>
                  navigate("/dashboard/ceremony", { state: { tab: "draft" } })
                }
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Continue Editing
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white w-full lg:w-2/7 shadow-xl rounded-2xl flex flex-col items-center justify-center border border-primary p-6 ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl lg:text-4xl font-primary font-semibold text-gray-900">
              Notifications
            </h2>
          </div>
          <div className="space-y-3 lg:py-4 p-2 max-h-60 py-5 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No notifications available.
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-center space-x-3 p-3 rounded-2xl border border-primary"
                >
                  <span className="bg-[#D4AF371A] text-primary border border-primary px-2 py-1 rounded-2xl text-xs font-secondary font-semibold">
                    {notification.type}
                  </span>
                  <p className="text-sm text-gray-700">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Past Ceremonies */}
      <div className="bg-white rounded-2xl border border-primary shadow-xl p-6 ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl lg:text-4xl font-primary text-start font-semibold text-gray-900">
            Past Ceremonies
          </h2>
          {ceremonies.length > 3 && (
            <button
              onClick={toggleShowAll}
              className="text-yellow-600 font-Secondary hover:text-yellow-700 font-medium"
            >
              {showingAll ? "Show Less" : "Show All"}
            </button>
          )}
        </div>

        <div
          className={`space-y-4 px-3 ${
            showingAll ? "lg:max-h-80 overflow-y-auto" : ""
          }`}
        >
          {ceremonies.length > 0 ? (
            (showingAll ? ceremonies : ceremonies.slice(0, 3)).map(
              (ceremony) => (
                <div
                  key={ceremony.id}
                  className="flex items-start gap-6 flex-col lg:flex-row justify-between p-4 border lg:items-center border-primary rounded-2xl"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 text-xl lg:text-2xl font-primary">
                      {ceremony.name}
                    </h3>
                    <p className="text-base text-gray-500 font-secondary">
                      {ceremony.date} • Officiant: {ceremony.officiant}
                    </p>
                  </div>
                  <div className="flex justify-center flex-col space-y-3 lg:flex-row items-center space-x-2">
                    {checkingBills ? (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <span className="text-sm">Checking data...</span>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      </div>
                    ) : billAvailability[ceremony.id] === false ? (
                      <div className="flex flex-col space-y-2 items-center">
                        <div className="flex items-center space-x-2">
                          <button
                            disabled
                            className="px-4 py-1 lg:py-2 text-sm border border-gray-300 rounded-2xl bg-gray-100 text-gray-400 cursor-not-allowed"
                          >
                            View
                          </button>
                          <button
                            disabled
                            className="px-4 py-1 lg:py-2 text-sm border border-gray-300 rounded-2xl bg-gray-100 text-gray-400 cursor-not-allowed"
                          >
                            Download PDF
                          </button>
                        </div>
                        <p className="text-xs text-red-500 text-center">
                          Invoice data not available
                        </p>
                      </div>
                    ) : (
                      <div className={`flex items-center space-x-2`}>
                        <button
                          onClick={() => costInvoice(ceremony.id)}
                          className="px-4 py-1 cursor-pointer lg:py-2 text-sm border border-primary rounded-2xl hover:bg-gray-50"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleEventCardDownload(ceremony.id)}
                          disabled={isDownloading}
                          className="px-4 cursor-pointer py-1 lg:py-2 text-sm bg-primary border border-primary rounded-2xl text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDownloading ? "Downloading..." : "Download PDF"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="w-full py-10 flex flex-col items-center justify-center text-center space-y-4">
              <svg
                width="88"
                height="88"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow-500"
                aria-hidden="true"
                role="img"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M16 2v4M8 2v4M3 10h18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="8.5" cy="15.5" r="1.25" fill="currentColor" />
                <circle cx="12" cy="15.5" r="1.25" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="1.25" fill="currentColor" />
              </svg>

              <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
                No past ceremonies found
              </h3>

              {user?.role === "user" && (
                <p className="text-sm text-gray-500 max-w-prose">
                  You don't have any completed ceremonies yet. Create your first
                  ceremony or continue editing an existing draft to get started.
                </p>
              )}

              {user?.role === "user" && (
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Link
                    to="/dashboard/ceremony"
                    className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90"
                  >
                    Start a new ceremony
                  </Link>

                  <button
                    onClick={() =>
                      navigate("/dashboard/ceremony", {
                        state: { tab: "draft" },
                      })
                    }
                    className="inline-flex items-center justify-center px-4 py-2 border border-primary text-gray-700 bg-white rounded-2xl font-medium hover:bg-gray-50"
                  >
                    Continue Editing Drafts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box max-w-4xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          {error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : activeBill ? (
            <div className="space-y-4">
              {/* Modal Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
                <button
                  onClick={() => downloadPDF()}
                  disabled={isDownloading}
                  className="mt-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? "Generating PDF..." : "Download PDF"}
                </button>
              </div>

              {/* Invoice Content - Keep existing but remove targetRef */}
              <div
                style={{
                  backgroundColor: "white",
                  padding: "40px",
                  minHeight: "800px",
                  fontFamily: "Arial, sans-serif",
                  position: "relative",
                  fontSize: "14px",
                  lineHeight: "1.4",
                }}
              >
                {/* Invoice Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "40px",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        color: "#000",
                        margin: "0 0 8px 0",
                        letterSpacing: "2px",
                      }}
                    >
                      INVOICE
                    </h1>
                    <p
                      style={{
                        color: "#666",
                        margin: "0",
                        fontSize: "14px",
                      }}
                    >
                      #{activeBill._id.slice(-12).toUpperCase()}
                    </p>
                    <p
                      style={{
                        color: "#666",
                        margin: "0",
                        fontSize: "14px",
                      }}
                    >
                      TrnxId: {activeBill.transactionId.toUpperCase()}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="/image.png"
                      alt="Erie Wedding Officiants Logo"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                      }}
                    />
                    <span
                      style={{
                        color: "#D4AF37",
                        fontSize: "12px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "8px",
                      }}
                    >
                      ERIE WEDDING OFFICIANTS
                    </span>
                  </div>
                </div>

                {/* Status Overlay */}
                {activeBill.status === "paid" ? (
                  <img
                    src="https://png.pngtree.com/png-vector/20230225/ourmid/pngtree-paid-stamp-vector-illustration-png-image_6616360.png"
                    alt="paid stamp"
                    style={{
                      position: "absolute",
                      top: "200px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "200px",
                      opacity: "0.3",
                      zIndex: "1",
                    }}
                  />
                ) : (
                  <img
                    src="https://png.pngtree.com/png-clipart/20230912/original/pngtree-overdue-document-office-documents-vector-picture-image_12995901.png"
                    alt="overdue stamp"
                    style={{
                      position: "absolute",
                      top: "200px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "200px",
                      opacity: "0.3",
                      zIndex: "1",
                    }}
                  />
                )}

                {/* Issue and Due Dates */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "30px",
                    position: "relative",
                    zIndex: "2",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "#666",
                        margin: "0 0 4px 0",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Issued
                    </p>
                    <p
                      style={{
                        color: "#000",
                        margin: "0",
                        fontSize: "14px",
                      }}
                    >
                      {formatDate(activeBill.issuedAt)}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#666",
                        margin: "0 0 4px 0",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Due
                    </p>
                    <p
                      style={{
                        color: "#000",
                        margin: "0",
                        fontSize: "14px",
                      }}
                    >
                      {activeBill.paidAt
                        ? formatDate(activeBill.paidAt)
                        : "Upon receipt"}
                    </p>
                  </div>
                </div>

                {/* From, To Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "40px",
                    position: "relative",
                    zIndex: "2",
                  }}
                >
                  <div style={{ width: "30%" }}>
                    <p
                      style={{
                        color: "#666",
                        margin: "0 0 8px 0",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      From
                    </p>
                    <p
                      style={{
                        color: "#000",
                        margin: "0 0 4px 0",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      ERIE WEDDING OFFICIANTS
                    </p>
                    <p
                      style={{
                        color: "#666",
                        margin: "0 0 2px 0",
                        fontSize: "12px",
                      }}
                    >
                      Company address
                    </p>
                    <p
                      style={{
                        color: "#666",
                        margin: "0 0 2px 0",
                        fontSize: "12px",
                      }}
                    >
                      123 Love Lane, Erie, Pennsylvania
                    </p>
                    <p
                      style={{
                        color: "#666",
                        margin: "0",
                        fontSize: "12px",
                      }}
                    >
                      TAX ID 00XXXXXI234XOXX
                    </p>
                  </div>

                  <div style={{ width: "30%" }}>
                    <p
                      style={{
                        color: "#666",
                        margin: "0 0 8px 0",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      TO
                    </p>
                    <p
                      style={{
                        color: "#000",
                        margin: "0 0 4px 0",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {activeBill.userName}
                    </p>
                    <p
                      style={{
                        color: "#666",
                        margin: "0 0 2px 0",
                        fontSize: "12px",
                      }}
                    >
                      Address
                    </p>
                    <p
                      style={{
                        color: "#666",
                        margin: "0 0 2px 0",
                        fontSize: "12px",
                      }}
                    >
                      {activeBill.location.line1}, {activeBill.location.city}
                      {activeBill.location.country}, IN -{" "}
                      {activeBill.location.postal_code}
                    </p>
                    <p
                      style={{
                        color: "#666",
                        margin: "0",
                        fontSize: "12px",
                      }}
                    >
                      {activeBill.contacts}
                    </p>
                  </div>
                </div>

                {/* Service Table */}
                <div
                  style={{
                    marginBottom: "40px",
                    position: "relative",
                    zIndex: "2",
                  }}
                >
                  {/* Table Header */}
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "50%",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#666",
                      }}
                    >
                      Service
                    </div>
                    <div
                      style={{
                        width: "15%",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#666",
                        textAlign: "center",
                      }}
                    >
                      Qty
                    </div>
                    <div
                      style={{
                        width: "15%",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#666",
                        textAlign: "right",
                      }}
                    >
                      Rate
                    </div>
                    <div
                      style={{
                        width: "20%",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#666",
                        textAlign: "right",
                      }}
                    >
                      Line total
                    </div>
                  </div>

                  {/* Service Row */}
                  <div style={{ display: "flex", marginBottom: "12px" }}>
                    <div style={{ width: "50%" }}>
                      <p
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        {activeBill.eventType} Service
                      </p>
                      <p
                        style={{ margin: "0", fontSize: "12px", color: "#666" }}
                      >
                        {activeBill.eventName} •{" "}
                        {formatDate(activeBill.eventDate)}
                      </p>
                    </div>
                    <div
                      style={{
                        width: "15%",
                        fontSize: "14px",
                        textAlign: "center",
                      }}
                    >
                      1
                    </div>
                    <div
                      style={{
                        width: "15%",
                        fontSize: "14px",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(activeBill.cost)}
                    </div>
                    <div
                      style={{
                        width: "20%",
                        fontSize: "14px",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(activeBill.cost)}
                    </div>
                  </div>
                </div>

                {/* Total Section */}
                <div
                  style={{
                    marginBottom: "60px",
                    position: "relative",
                    zIndex: "2",
                  }}
                >
                  <div
                    style={{
                      width: "40%",
                      marginLeft: "auto",
                      borderTop: "1px solid #ddd",
                      paddingTop: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#666" }}>
                        Subtotal
                      </span>
                      <span style={{ fontSize: "14px", color: "#000" }}>
                        {formatCurrency(activeBill.amount)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#666" }}>
                        Tax (0%)
                      </span>
                      <span style={{ fontSize: "14px", color: "#000" }}>
                        $0.00
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px solid #ddd",
                        paddingTop: "8px",
                        marginTop: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        Total
                      </span>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        {formatCurrency(activeBill.amount)}
                      </span>
                    </div>
                    <div
                      style={{
                        borderBottom: "3px solid #D4AF37",
                        marginTop: "8px",
                        paddingBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#D4AF37",
                          }}
                        >
                          Amount due
                        </span>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#D4AF37",
                          }}
                        >
                          US$ {activeBill.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  style={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: "12px",
                    borderTop: "1px solid #ddd",
                    paddingTop: "20px",
                    position: "relative",
                    zIndex: "2",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0" }}>
                    Thank you for choosing our services!
                  </p>
                  <p style={{ margin: "0" }}>
                    This is a computer-generated invoice.
                  </p>
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
                      Officiant: {activeBill.officiantName}
                    </p>
                    <p style={{ margin: "0" }}>
                      Event ID: {activeBill.eventId}
                    </p>
                    <p style={{ margin: "0" }}>
                      Event : {activeBill.eventName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Loading invoice...</div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default DashHome;
