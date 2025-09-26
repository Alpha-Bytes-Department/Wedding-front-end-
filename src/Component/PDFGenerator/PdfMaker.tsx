import { useEffect, useState } from "react";
import { useAxios } from "../Providers/useAxios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./invoice.css";

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
  eventId: string;
  amount: number;
  status?: "paid" | "unpaid";
  issuedAt?: Date;
  paidAt?: Date;
  location?: Location;
  contacts?: string;
  transactionId?: string;
  billingMail?: string;
  billingName?: string;
}

interface PdfMakerProps {
  eventId: string;
}

const PdfMaker: React.FC<PdfMakerProps> = ({ eventId }) => {
  const [activeBill, setActiveBill] = useState<IBill | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const axios = useAxios();

  // Helper functions
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  // Function to generate HTML for invoice (matching DashHome.tsx exactly)
  const generateInvoiceHTML = (bill: IBill) => {
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
            ">#${bill._id.toUpperCase()}</p>
             <p style="
              color: #666;
              margin: 0;
              font-size: 14px;
            ">Transaction id: ${bill.transactionId.toUpperCase()}</p>
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
            <p style="color: #666; margin: 0 0 2px 0; font-size: 12px;">City, Country - 00000</p>
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
              bill.location?.line1
            }, ${bill.location?.country}, ${bill.location?.city}- ${
      bill.location?.postal_code
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
                bill.cost
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
                bill.cost
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
                  US$ ${bill.cost.toFixed(2)}
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
          </div>
        </div>
      </div>
    `;
  };

  // Updated PDF download function using html2canvas and jsPDF (matching DashHome.tsx exactly)
  const downloadPDF = async (billData?: IBill) => {
    try {
      setLoading(true);

      let targetBill = billData || activeBill;

      if (!targetBill) {
        console.error("No bill data available for PDF generation");
        setError("No bill data available for PDF generation");
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
        setError("Failed to generate PDF. Please try again.");
        throw error;
      } finally {
        // Clean up
        document.body.removeChild(iframe);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bill data
  const fetchBillData = async (eventId: string) => {
    try {
      const billResponse = await axios.get(`/bills/${eventId}`);
      setActiveBill(billResponse.data.bill || billResponse.data);
    } catch (error) {
      console.error("Error fetching bill:", error);
      setError("Failed to fetch bill data.");
    }
  };

  // Function to handle PDF download directly from event card
  const handleEventCardDownload = async () => {
    if (!activeBill) {
      setError("Bill data not available");
      return;
    }

    await downloadPDF(activeBill);
  };

  useEffect(() => {
    if (eventId) {
      fetchBillData(eventId);
    }
  }, [eventId]);

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleEventCardDownload}
        disabled={loading || !activeBill}
        className="bg-[#D4AF371A] border-1 border-primary text-[#55ad1a] text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 hover:text-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Generating PDF..." : "Download PDF"}
      </button>

      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
};

export default PdfMaker;
