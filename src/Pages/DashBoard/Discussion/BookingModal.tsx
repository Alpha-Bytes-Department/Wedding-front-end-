import React, { useState } from "react";
import { IoClose, IoCalendarOutline } from "react-icons/io5";
import type { Event, BookingProposal } from "./types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  onSendBookingProposal: (proposal: BookingProposal) => void;
  officiantId: string;
  officiantName: string;
  clientId: string;
  clientName: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  events,
  onSendBookingProposal,
  officiantId,
  officiantName,
  clientId,
  clientName,
}) => {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedEvent = events.find((event) => event._id === selectedEventId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEvent || !customPrice.trim()) {
      return;
    }

    const price = parseFloat(customPrice);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    setIsLoading(true);
    try {
      const proposal: BookingProposal = {
        eventId: selectedEvent._id,
        eventName: selectedEvent.title,
        price: price,
        officiantId: officiantId,
        officiantName: officiantName,
        clientId: clientId,
        clientName: clientName,
        status: "pending",
      };

      onSendBookingProposal(proposal);

      // Reset form and close modal
      setSelectedEventId("");
      setCustomPrice("");
      onClose();
    } catch (error) {
      console.error("Error sending booking proposal:", error);
      alert("Failed to send booking proposal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedEventId("");
      setCustomPrice("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#cfc64788]  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <IoCalendarOutline size={24} className="text-primary" />
            <h3 className="text-lg font-semibold">Create Booking Proposal</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              disabled={isLoading}
            >
              <option value="">Choose an event...</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title} - {event.ceremonyType}
                </option>
              ))}
              {events.length === 0 && (<option value="">No events are submitted for this client</option>)}
            </select>
          </div>

          {selectedEvent && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Event Details</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Title:</span>{" "}
                  {selectedEvent.title}
                </p>
                <p>
                  <span className="font-medium">Ceremony Type:</span>{" "}
                  {selectedEvent.ceremonyType}
                </p>
                {selectedEvent.duration && (
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {selectedEvent.duration}
                  </p>
                )}
                {selectedEvent.description && (
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {selectedEvent.description}
                  </p>
                )}
                {selectedEvent.price && (
                  <p>
                    <span className="font-medium">Suggested Price:</span> $
                    {selectedEvent.price}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Set your price for this wedding service
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Proposal Summary</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <span className="font-medium">From:</span> {officiantName}
              </p>
              <p>
                <span className="font-medium">To:</span> {clientName}
              </p>
              {selectedEvent && (
                <p>
                  <span className="font-medium">Event:</span>{" "}
                  {selectedEvent.title}
                </p>
              )}
              {customPrice && (
                <p>
                  <span className="font-medium">Price:</span> $
                  {parseFloat(customPrice || "0").toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedEventId || !customPrice.trim() || isLoading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Sending..." : "Send Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
