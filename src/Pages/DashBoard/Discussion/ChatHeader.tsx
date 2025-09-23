import React from "react";

interface ChatHeaderProps {
  userRole?: string;
  isConnected: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userRole, isConnected }) => {
  return (
    <div className="px-6 pt-1">
      <div className="text-gray-500 text-sm mb-1">Dashboard / Discussion</div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-primary font-bold text-gray-900 mb-2">
          {userRole === "officiant"
            ? "Messages from Clients"
            : "Discussion with Officiant"}
        </h1>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            isConnected
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
