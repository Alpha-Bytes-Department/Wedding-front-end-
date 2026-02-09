import React from "react";
import { GoFileDirectoryFill } from "react-icons/go";
import type { ChatParticipant } from "./types";

interface ChatSidebarProps {
  userRole?: string;
  search: string;
  setSearch: (search: string) => void;
  filteredParticipants: ChatParticipant[];
  selected: ChatParticipant | null;
  setSelected: (participant: ChatParticipant) => void;
  onlineUsers: Set<string>;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  userRole,
  search,
  setSearch,
  filteredParticipants,
  selected,
  setSelected,
  onlineUsers,
}) => {
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: "2-digit", minute: "2-digit" });
  };
  const getProfileImageUrl = (profilePicture?: string) => {
    if (!profilePicture) return "";
    // Check if it's already a complete URL
    if (profilePicture.startsWith("http")) {
      return profilePicture;
    }
    // For images in the public folder, construct the URL relative to the app root
    return `/${profilePicture}`;
  };

  return (
    <div className="w-full lg:w-80 border border-gray-200 bg-white flex flex-col">
      <div className="p-4">
        <input
          className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-600 duration-300"
          placeholder={
            userRole === "officiant"
              ? "Search clients..."
              : "Search officiants..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredParticipants.length === 0 ? (
          <div className="p-8 text-center">
            <GoFileDirectoryFill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              No {userRole === "officiant" ? "clients" : "officiants"} found
            </h3>
            <p className="text-sm text-gray-500">
              {userRole === "officiant"
                ? "Your clients will appear here"
                : "Available officiants will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredParticipants.map((participant) => (
              <div
                key={participant._id}
                className={`mx-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  selected?._id === participant._id
                    ? "bg-yellow-50 border border-yellow-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelected(participant)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={
                        getProfileImageUrl(participant.profilePicture) 
                      }
                      alt={participant.name || "Profile"}
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                        onlineUsers.has(participant._id)
                          ? "bg-green-400"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {participant.name ||
                        participant.partner_1 ||
                        participant.partner_2 ||
                        "No Name"}
                    </p>
                    {userRole === "officiant" ? (
                      <p className="text-xs text-gray-500 truncate">Client</p>
                    ) : (
                      <p className="text-xs text-gray-500 truncate">
                        {participant.specialization || "Officiant"}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTimestamp(participant.lastMessageTime)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
