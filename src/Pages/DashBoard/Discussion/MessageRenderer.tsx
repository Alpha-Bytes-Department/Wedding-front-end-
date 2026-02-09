import React from "react";
import { IoLink, IoCalendarOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import type { Message, BookingProposal } from "./types";

interface MessageRendererProps {
  msg: Message;
  isMyMessage: boolean;
  userRole?: string;
  onBookingResponse: (
    messageId: string,
    response: "accept" | "decline",
    bookingData?: BookingProposal
  ) => void;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({
  msg,
  isMyMessage,
  userRole,
  onBookingResponse,
}) => {
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: "short", day: "numeric" });
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  switch (msg.type) {
    case "image":
      return (
        <div
          key={msg.id}
          className={`flex ${isMyMessage ? "justify-end" : ""} group`}
        >
          <div
            className={`max-w-xs rounded-lg p-2 ${
              isMyMessage
                ? "bg-primary text-white"
                : "bg-white border border-primary text-gray-900"
            }`}
          >
            <img
              src={msg.fileUrl || msg.fileData?.fileUrl}
              alt={msg.originalName || msg.fileData?.originalName}
              className="rounded max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() =>
                window.open(msg.fileUrl || msg.fileData?.fileUrl, "_blank")
              }
              onError={() => {
                console.error(
                  "Image failed to load:",
                  msg.fileUrl || msg.fileData?.fileUrl
                );
                console.error("Message data:", msg);
              }}
            />
            <div className="text-xs mt-1 opacity-75 flex justify-between items-center">
              <span className="truncate">{msg.originalName}</span>
              <span className="text-xs ml-2">
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>
          </div>
        </div>
      );

    case "file":
    case "document":
      return (
        <div
          key={msg.id}
          className={`flex ${isMyMessage ? "justify-end" : ""} group`}
        >
          <div
            className={`max-w-xs rounded-lg p-3 ${
              isMyMessage
                ? "bg-primary text-white"
                : "bg-white border border-primary text-gray-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {(msg.originalName || msg.fileData?.originalName || "file")
                      .split(".")
                      .pop()
                      ?.toUpperCase()
                      .slice(0, 3)}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {msg.originalName ||
                    msg.fileData?.originalName ||
                    "Unknown file"}
                </p>
                <p className="text-xs opacity-75">
                  {msg.fileSize || msg.fileData?.fileSize
                    ? `${
                        Math.round(
                          ((msg.fileSize || msg.fileData?.fileSize || 0) /
                            1024 /
                            1024) *
                            100
                        ) / 100
                      } MB`
                    : "Unknown size"}
                </p>
              </div>
              {(msg.fileUrl || msg.fileData?.fileUrl) && (
                <a
                  href={msg.fileUrl || msg.fileData?.fileUrl}
                  download={msg.originalName || msg.fileData?.originalName}
                  className="p-1 rounded hover:bg-black/10 transition-colors"
                  title="Download file"
                >
                  <FiDownload size={16} />
                </a>
              )}
            </div>
            <div className="text-xs mt-2 opacity-75">
              {formatTimestamp(msg.timestamp)}
            </div>
          </div>
        </div>
      );

    case "link":
      return (
        <div
          key={msg.id}
          className={`flex ${isMyMessage ? "justify-end" : ""} group`}
        >
          <div
            className={`max-w-xs rounded-lg px-4 py-2 ${
              isMyMessage
                ? "bg-primary text-white"
                : "bg-white border border-primary text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <IoLink size={16} />
              <span className="text-sm font-medium">Shared Link</span>
            </div>
            {isValidUrl(msg.content) ? (
              <a
                href={
                  msg.content.startsWith("http")
                    ? msg.content
                    : `https://${msg.content}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm underline hover:no-underline break-all block ${
                  isMyMessage
                    ? "text-white hover:text-gray-200"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {msg.content}
              </a>
            ) : (
              <span className="text-sm break-all">{msg.content}</span>
            )}
            <div className="text-xs mt-2 opacity-75">
              {formatTimestamp(msg.timestamp)}
            </div>
          </div>
        </div>
      );

    case "booking_proposal":
      return (
        <div
          key={msg.id}
          className={`flex ${isMyMessage ? "justify-end" : ""} group`}
        >
          <div
            className={`max-w-sm rounded-lg border-2 ${
              isMyMessage
                ? "border-primary bg-primary/5"
                : "border-green-400 bg-green-50"
            }`}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <IoCalendarOutline size={20} className="text-primary" />
                <span className="font-semibold text-gray-800">
                  Booking Proposal
                </span>
              </div>

              {msg.bookingData && (
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {msg.bookingData.eventName}
                    </h4>
                    <p className="text-2xl font-bold text-primary">
                      ${msg.bookingData.price}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>
                      <span className="font-medium">From:</span>{" "}
                      {msg.bookingData.officiantName}
                    </p>
                    <p>
                      <span className="font-medium">To:</span>{" "}
                      {msg.bookingData.clientName}
                    </p>
                  </div>

                  {msg.bookingData.status === "pending" &&
                    !isMyMessage &&
                    userRole !== "officiant" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() =>
                            onBookingResponse(
                              String(
                                msg._id ||
                                  msg.messageId ||
                                  msg.serverId ||
                                  msg.id ||
                                  ""
                              ),
                              "accept",
                              msg.bookingData
                            )
                          }
                          className="flex-1 bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            onBookingResponse(
                              String(
                                msg._id ||
                                  msg.messageId ||
                                  msg.serverId ||
                                  msg.id ||
                                  ""
                              ),
                              "decline",
                              msg.bookingData
                            )
                          }
                          className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                  {msg.bookingData.status === "accepted" && (
                    <div className="bg-green-100 border border-green-300 rounded-md p-3 mt-3">
                      <p className="text-sm text-green-800 font-medium mb-2">
                        ✅ Booking Accepted
                      </p>
                      
                    </div>
                  )}

                  {msg.bookingData.status === "declined" && (
                    <div className="bg-red-100 border border-red-300 rounded-md p-2 mt-3">
                      <p className="text-sm text-red-800 font-medium">
                        ❌ Booking Declined
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs mt-3 opacity-75 text-gray-600">
                {formatTimestamp(msg.timestamp)}
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div
          key={msg.id}
          className={`flex ${isMyMessage ? "justify-end" : ""} group`}
        >
          <div
            className={`max-w-xs rounded-lg px-4 py-2 font-medium ${
              isMyMessage
                ? "bg-primary text-white"
                : "bg-white border border-primary text-gray-900"
            }`}
          >
            <div>{msg.content}</div>
            <div className="text-xs mt-1 opacity-75">
              {formatTimestamp(msg.timestamp)}
            </div>
          </div>
        </div>
      );
  }
};

export default MessageRenderer;
