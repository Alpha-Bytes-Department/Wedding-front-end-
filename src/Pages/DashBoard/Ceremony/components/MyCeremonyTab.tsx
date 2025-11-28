import { useState } from "react";
import jsPDF from "jspdf";
import type { CeremonyData } from "../types";
import AddReview from "./AddReview";

interface MyCeremonyTabProps {
  ceremonies: CeremonyData[];
  onDeleteCeremony: (id: string) => void | Promise<void>;
  onCreateNew: () => void;
  loading?: boolean;
}

const MyCeremonyTab = ({
  ceremonies,
  onDeleteCeremony,
  onCreateNew,
  loading = false,
}: MyCeremonyTabProps) => {
  const [selectedCeremony, setSelectedCeremony] = useState<CeremonyData | null>(
    null
  );
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async (ceremony: CeremonyData) => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      let yPosition = 30;
      
      // Title and decorative elements
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("Wedding Ceremony", pageWidth / 2, yPosition, { align: 'center' });
      
      // Decorative line
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition + 5, pageWidth - 20, yPosition + 5);
      
      yPosition += 25;
      
      // Ceremony Title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(ceremony.title || "Untitled Ceremony", pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 20;
      
      // Basic Information Section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Ceremony Details", 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      
      const basicInfo = [
        `Language: ${ceremony.language || 'Not specified'}`,
        `Event Date: ${ceremony.eventDate ? new Date(ceremony.eventDate).toLocaleDateString() : 'Not specified'}`,
        `Event Time: ${ceremony.eventTime ? new Date(ceremony.eventTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not specified'}`,
        `Location: ${ceremony.location || 'Not specified'}`,
        `Officiant: ${ceremony.officiantName || 'Not specified'}`,
        `Status: ${ceremony.status}`,
      ];
      
      basicInfo.forEach(info => {
        pdf.text(info, 20, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Names Section
      if (ceremony.groomName || ceremony.brideName) {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Couple", 20, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        if (ceremony.groomName) {
          pdf.text(`Groom: ${ceremony.groomName}`, 20, yPosition);
          yPosition += 8;
        }
        if (ceremony.brideName) {
          pdf.text(`Bride: ${ceremony.brideName}`, 20, yPosition);
          yPosition += 8;
        }
        yPosition += 10;
      }
      
      // Description
      if (ceremony.description) {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Description", 20, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        const splitDescription = pdf.splitTextToSize(ceremony.description, pageWidth - 40);
        pdf.text(splitDescription, 20, yPosition);
        yPosition += splitDescription.length * 6 + 10;
      }
      
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 30;
      }
      
      // Ceremony Content Sections
      const sections = [
        { title: "Greeting Speech", key: "greetingSpeech" },
        { title: "Presentation of Bride", key: "presentationOfBride" },
        { title: "Question for Presentation", key: "questionForPresentation" },
        { title: "Response to Question", key: "responseToQuestion" },
        { title: "Invocation", key: "invocation" },
        { title: "Charge to Groom and Bride", key: "chargeToGroomAndBride" },
        { title: "Pledge", key: "pledge" },
        { title: "Introduction to Exchange of Vows", key: "introductionToExchangeOfVows" },
        { title: "Vows", key: "vows" },
        { title: "Readings", key: "readings" },
        { title: "Introduction to Exchange of Rings", key: "introductionToExchangeOfRings" },
        { title: "Blessings of Rings", key: "blessingsOfRings" },
        { title: "Exchange of Rings (Groom)", key: "exchangeOfRingsGroom" },
        { title: "Exchange of Rings (Bride)", key: "exchangeOfRingsBride" },
        { title: "Prayer on the New Union", key: "prayerOnTheNewUnion" },
        { title: "Rituals Selection", key: "ritualsSelection" },
        { title: "Closing Statement", key: "closingStatement" },
        { title: "Pronouncing", key: "pronouncing" },
        { title: "Kiss", key: "kiss" },
        { title: "Introduction of Couple", key: "introductionOfCouple" },
      ];
      
      sections.forEach(section => {
        const content = ceremony[section.key as keyof CeremonyData] as string;
        if (content) {
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = 30;
          }
          
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(section.title, 20, yPosition);
          yPosition += 8;
          
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          const splitContent = pdf.splitTextToSize(content, pageWidth - 40);
          pdf.text(splitContent, 20, yPosition);
          yPosition += splitContent.length * 5 + 12;
        }
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "italic");
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
      
      // Save the PDF
      pdf.save(`${ceremony.title || 'ceremony'}-details.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-primary font-bold text-gray-900 mb-8">
        My Ceremonies
      </h1>

      {ceremonies.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">
            No completed ceremonies found.
          </p>
          <button
            onClick={onCreateNew}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create New Ceremony
          </button>
        </div>
      ) : (
        ceremonies.map((ceremony) => (
          <div
            key={ceremony.id}
            className="bg-white rounded-2xl border border-primary p-4 md:p-6 shadow-xl w-full flex flex-col"
          >
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <span className="text-primary font-primary font-medium text-base md:text-lg">
                  Title :{" "}
                  <span className="font-medium text-black">
                    {ceremony.title}
                  </span>
                </span>
                <span
                  className={`p-1 border border-primary rounded-full px-2 text-center font-bold ${
                    ceremony.status === "approved"
                      ? "text-green-600"
                      : ceremony.status === "planned"
                      ? "text-yellow-600"
                      : ceremony.status === "submitted"
                      ? "text-gray-600"
                      : ceremony.status === "completed"
                      ? "text-blue-600"
                      : ceremony.status === "canceled" ||
                        ceremony.status === "cancelled"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {ceremony.status}
                </span>
              </div>
              <span className="text-xs text-primary font-secondary mt-2 md:mt-0">
                {new Date(ceremony.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Description */}
            <hr className="border-t border-primary mb-4" />
            <div className="text-gray-700 min-h-24 text-sm md:text-base mb-4">
              {ceremony.description || "No description provided"}
            </div>
            <hr className="border-t border-primary mb-4" />

            {/* Buttons */}
            <div className=" flex justify-between flex-wrap gap-4">
              <AddReview status={ceremony.status} eventid={ ceremony._id } officiantid={ ceremony.officiantId } eventName={ ceremony.title }/>
              <div className="flex justify-end gap-4 ">
                <button
                  onClick={() =>
                    onDeleteCeremony(ceremony.id || ceremony._id || "")
                  }
                  disabled={loading}
                  className="px-2 md:px-6 py-2 border border-primary text-[#e0b94c] rounded-full font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => generatePDF(ceremony)}
                  disabled={isGeneratingPDF}
                  className="px-6 py-2 border border-primary text-[#e0b94c] rounded-full font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingPDF ? "Generating..." : "Download PDF"}
                </button>
                <button
                  onClick={() => {
                    setSelectedCeremony(ceremony);
                    (document.getElementById("ceremony_modal") as HTMLDialogElement)?.showModal();
                  }}
                  className="px-6 py-2 border border-primary text-[#e0b94c] rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      <dialog id="ceremony_modal" className="modal">
        <div className="modal-box max-w-5xl bg-white text-gray-800 rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 z-10">
              ✕
            </button>
          </form>

          {selectedCeremony && (
            <>
              <h2 className="text-2xl font-bold text-[#e0b94c] mb-6 pr-8">
                {selectedCeremony.title}
              </h2>

              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  <div>
                    <p className="text-sm text-gray-500">Language</p>
                    <p className="font-semibold">{selectedCeremony.language || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Event Date</p>
                    <p className="font-semibold">
                      {selectedCeremony.eventDate
                        ? new Date(selectedCeremony.eventDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Event Time</p>
                    <p className="font-semibold">
                      {selectedCeremony.eventTime
                        ? new Date(selectedCeremony.eventTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{selectedCeremony.location || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Officiant</p>
                    <p className="font-semibold">{selectedCeremony.officiantName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rehearsal Date</p>
                    <p className="font-semibold">
                      {selectedCeremony.rehearsalDate
                        ? new Date(selectedCeremony.rehearsalDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className="px-3 py-1 text-sm rounded-full bg-[#e0b94c] text-white font-medium">
                      {selectedCeremony.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Couple Information */}
              {(selectedCeremony.groomName || selectedCeremony.brideName) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                    Couple
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCeremony.groomName && (
                      <div>
                        <p className="text-sm text-gray-500">Groom's Name</p>
                        <p className="font-semibold">{selectedCeremony.groomName}</p>
                      </div>
                    )}
                    {selectedCeremony.brideName && (
                      <div>
                        <p className="text-sm text-gray-500">Bride's Name</p>
                        <p className="font-semibold">{selectedCeremony.brideName}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedCeremony.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                    Description
                  </h3>
                  <p className="font-medium text-gray-700 leading-relaxed">
                    {selectedCeremony.description}
                  </p>
                </div>
              )}

              {/* Greeting Elements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  Greeting Elements
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Greeting Speech", key: "greetingSpeech" },
                    { label: "Presentation of Bride", key: "presentationOfBride" },
                    { label: "Question for Presentation", key: "questionForPresentation" },
                    { label: "Response to Question", key: "responseToQuestion" },
                    { label: "Invocation", key: "invocation" },
                  ].map(item => {
                    const content = selectedCeremony[item.key as keyof CeremonyData] as string;
                    return content ? (
                      <div key={item.key}>
                        <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                        <p className="font-medium text-gray-700 mt-1">{content}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Vows Elements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  Vows Elements
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Charge to Groom and Bride", key: "chargeToGroomAndBride" },
                    { label: "Pledge", key: "pledge" },
                    { label: "Introduction to Exchange of Vows", key: "introductionToExchangeOfVows" },
                    { label: "Vows", key: "vows" },
                    { label: "Readings", key: "readings" },
                    { label: "Introduction to Exchange of Rings", key: "introductionToExchangeOfRings" },
                    { label: "Blessings of Rings", key: "blessingsOfRings" },
                    { label: "Exchange of Rings (Groom)", key: "exchangeOfRingsGroom" },
                    { label: "Exchange of Rings (Bride)", key: "exchangeOfRingsBride" },
                    { label: "Prayer on the New Union", key: "prayerOnTheNewUnion" },
                  ].map(item => {
                    const content = selectedCeremony[item.key as keyof CeremonyData] as string;
                    return content ? (
                      <div key={item.key}>
                        <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                        <p className="font-medium text-gray-700 mt-1">{content}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Ritual Elements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  Ritual Elements
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Rituals Selection", key: "ritualsSelection" },
                    { label: "Rituals Option", key: "ritualsOption" },
                    { label: "Closing Statement", key: "closingStatement" },
                    { label: "Pronouncing", key: "pronouncing" },
                    { label: "Kiss", key: "kiss" },
                    { label: "Introduction of Couple", key: "introductionOfCouple" },
                  ].map(item => {
                    const content = selectedCeremony[item.key as keyof CeremonyData] as string;
                    return content ? (
                      <div key={item.key}>
                        <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                        <p className="font-medium text-gray-700 mt-1">{content}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Timestamps */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Created: </span>
                    {new Date(selectedCeremony.createdAt).toLocaleDateString()} at{" "}
                    {new Date(selectedCeremony.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated: </span>
                    {new Date(selectedCeremony.updatedAt).toLocaleDateString()} at{" "}
                    {new Date(selectedCeremony.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default MyCeremonyTab;
