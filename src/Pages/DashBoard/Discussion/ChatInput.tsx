import React, { useState, useRef } from "react";
import {
  FiSend,
  FiImage,
  FiPaperclip,
  FiCalendar,
  FiLink,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface ChatInputProps {
  inputMessage: string;
  onInputChange: (message: string) => void;
  onSendMessage: () => void;
  onSendImage: (file: File) => void;
  onSendFile: (file: File) => void;
  onSendLink: (url: string) => void;
  onCreateBooking: () => void;
  showMenu: boolean;
  onToggleMenu: () => void;
  userRole?: string;
  isConnected?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputMessage,
  onInputChange,
  onSendMessage,
  onSendImage,
  onSendFile,
  onSendLink,
  onCreateBooking,
  showMenu,
  onToggleMenu,
  userRole = "user",
  isConnected = false,
}) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        onSendImage(file);
      } else {
        onSendFile(file);
      }
      onToggleMenu(); // Close menu after selection
    }
    // Reset input
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSendImage(file);
      onToggleMenu(); // Close menu after selection
    }
    // Reset input
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleSendLink = () => {
    if (linkUrl.trim()) {
      onSendLink(linkUrl.trim());
      setLinkUrl("");
      setShowLinkInput(false);
      onToggleMenu(); // Close menu after sending
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) {
        onSendMessage();
      }
    }
  };

  const handleLinkKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendLink();
    }
    if (e.key === "Escape") {
      setShowLinkInput(false);
      setLinkUrl("");
    }
  };

  // Show booking option only for officiants
  const canCreateBooking = userRole === "officiant";

  return (
    <div className="border-t border-gray-200 p-4 bg-white relative">
      {/* Attachment Menu Popup */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-opacity-20 z-40"
            onClick={onToggleMenu}
          />

          {/* Popup Menu */}
          <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-2 min-w-[200px]">
            <div className="space-y-1">
              <button
                onClick={() => {
                  imageInputRef.current?.click();
                  onToggleMenu();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiImage className="text-blue-600" size={16} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Image</div>
                  <div className="text-xs text-gray-500">Share photos</div>
                </div>
              </button>

              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  onToggleMenu();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FiPaperclip className="text-green-600" size={16} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">File</div>
                  <div className="text-xs text-gray-500">Share documents</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowLinkInput(true);
                  onToggleMenu();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiLink className="text-purple-600" size={16} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Link</div>
                  <div className="text-xs text-gray-500">Share a URL</div>
                </div>
              </button>

              {/* Only show booking option for officiants */}
              {canCreateBooking && (
                <button
                  onClick={() => {
                    onCreateBooking();
                    onToggleMenu();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FiCalendar className="text-orange-600" size={16} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Booking</div>
                    <div className="text-xs text-gray-500">
                      Schedule meeting
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Link Input */}
      {showLinkInput && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FiLink className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">
              Share Link
            </span>
            <button
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl("");
              }}
              className="ml-auto p-1 hover:bg-blue-100 rounded"
            >
              <IoClose size={16} />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={handleLinkKeyPress}
              placeholder="Enter URL..."
              className="flex-1 px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSendLink}
              disabled={!linkUrl.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {!isConnected && (
        <div className="mb-2 text-sm text-red-500 text-center">
          Disconnected - Messages may not be sent
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-end gap-2">
        <button
          onClick={onToggleMenu}
          className={`p-2 rounded-full transition-colors ${
            showMenu
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
          }`}
          title="Attachments"
        >
          <FiPaperclip size={20} />
        </button>

        <div className="flex-1 relative">
          <textarea
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none max-h-32 min-h-[42px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={1}
            style={{
              height: "auto",
              minHeight: "42px",
              maxHeight: "128px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
        </div>

        <button
          onClick={() => {
            if (inputMessage.trim()) {
              onSendMessage();
            }
          }}
          disabled={!inputMessage.trim() || !isConnected}
          className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Send message"
        >
          <FiSend size={20} />
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />

      <input
        ref={imageInputRef}
        type="file"
        onChange={handleImageSelect}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default ChatInput;
