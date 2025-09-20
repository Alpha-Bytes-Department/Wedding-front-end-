import React, { useState, useEffect, useRef } from "react";
import { GoFileDirectoryFill } from "react-icons/go";
import {
  IoAttachOutline,
  IoSend,
  IoImage,
  IoDocument,
  IoLink,
} from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

// Socket interface
interface SocketInterface {
  id?: string;
  connected: boolean;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: () => void;
  disconnect: () => void;
  connect: () => void;
}

// Types
interface Officiant {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  profilePicture?: string;
  bio?: string;
  bookingPackage?: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
  }>;
  languages?: string[];
  location?: string;
  online?: boolean;
}

interface Message {
  _id?: string;
  id?: number | string;
  messageId?: string;
  sender: string;
  senderName?: string;
  type: "text" | "file" | "image" | "document" | "link" | "booking_proposal";
  content: string;
  originalName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  timestamp?: string;
  createdAt?: string;
  serverId?: string;
  roomId?: string;
  fileData?: {
    originalName: string;
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  };
}

interface BookingProposal {
  id: string;
  type: "booking_proposal";
  title: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  eventDate?: string;
  location?: string;
  duration?: string;
  packageId?: string;
  validUntil?: string;
  response?: {
    action: "accept" | "decline";
    respondedBy: string;
    respondedByName: string;
    respondedAt: string;
  };
}

interface TypingUser {
  userId: string;
  userName: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  filename?: string;
  fileUrl?: string;
  fileData?: Message;
}

const Discussions: React.FC = () => {
  // State management
  const [search, setSearch] = useState<string>("");
  const [officiants, setOfficiants] = useState<Officiant[]>([]);
  const [selected, setSelected] = useState<Officiant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [socket, setSocket] = useState<SocketInterface | null>(null);
  const [userId] = useState<string>(
    `user_${Math.random().toString(36).substr(2, 9)}`
  );
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Hooks and refs
  const axios = useAxios();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch officiants
  useEffect(() => {
    const fetchOfficiants = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/chat/officiants");
        if (response.data.success) {
          const officiantData = response.data.data.map((officiant: any) => ({
            ...officiant,
            online: false, // Initial status, will be updated by socket
          }));
          setOfficiants(officiantData);
          if (officiantData.length > 0) {
            setSelected(officiantData[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching officiants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficiants();
  }, [axios]);

  // Initialize socket connection
  useEffect(() => {
    if (!selected) return;

    const newSocket: SocketInterface = io(
      import.meta.env.VITE_APP_SOCKET_URL || "http://localhost:5000",
      {
        transports: ["websocket", "polling"],
        autoConnect: true,
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    setSocket(newSocket);

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);
      setConnectionError(null);

      // Join room for the selected officiant
      newSocket.emit("joinRoom", {
        roomId: `chat_${selected._id}`,
        userId: userId,
        userName: "You",
      });

      // Mark user as online
      newSocket.emit("userOnline", {
        userId: userId,
        userName: "You",
      });
    });

    newSocket.on("disconnect", (reason: string) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);

      // Attempt to reconnect for certain disconnect reasons
      if (reason === "io server disconnect" || reason === "transport close") {
        console.log("🔄 Attempting to reconnect...");
        setTimeout(() => {
          if (!newSocket.connected) {
            newSocket.connect();
          }
        }, 2000);
      }
    });

    newSocket.on("reconnect", (attemptNumber: number) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      setIsConnected(true);

      // Rejoin the current room
      newSocket.emit("joinRoom", {
        roomId: `chat_${selected._id}`,
        userId: userId,
        userName: "You",
      });
    });

    newSocket.on("connect_error", (error: Error) => {
      console.error("🔥 Socket connection error:", error);
      setIsConnected(false);
      setConnectionError(`Connection failed: ${error.message}`);
    });

    // Load existing messages
    newSocket.on(
      "loadExistingMessages",
      ({ messages: existingMessages }: { messages: Message[] }) => {
        console.log("� Loading existing messages:", existingMessages.length);
        setMessages(existingMessages);
      }
    );

    // Chat events
    newSocket.on("receiveMessage", (messageData: Message) => {
      console.log("📩 Message received:", messageData);

      // Prevent duplicate messages
      setMessages((prev) => {
        const messageExists = prev.some(
          (msg) =>
            msg._id === messageData._id ||
            msg.messageId === messageData.messageId ||
            (msg.content === messageData.content &&
              msg.sender === messageData.sender &&
              Math.abs(
                new Date(msg.timestamp || msg.createdAt || "").getTime() -
                  new Date(
                    messageData.timestamp || messageData.createdAt || ""
                  ).getTime()
              ) < 1000)
        );

        if (messageExists) {
          console.log(
            "Duplicate message detected, skipping:",
            messageData._id || messageData.messageId
          );
          return prev;
        }

        const newMessages = [...prev, messageData];

        // Sort messages by timestamp to ensure proper ordering
        return newMessages.sort((a, b) => {
          const timeA = new Date(a.timestamp || a.createdAt || "").getTime();
          const timeB = new Date(b.timestamp || b.createdAt || "").getTime();
          return timeA - timeB;
        });
      });
    });

    // User status events
    newSocket.on(
      "userStatusChanged",
      ({
        userId: statusUserId,
        isOnline,
      }: {
        userId: string;
        isOnline: boolean;
      }) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          if (isOnline) {
            newSet.add(statusUserId);
          } else {
            newSet.delete(statusUserId);
          }
          return newSet;
        });

        // Update officiant online status
        setOfficiants((prev) =>
          prev.map((officiant) =>
            officiant._id === statusUserId
              ? { ...officiant, online: isOnline }
              : officiant
          )
        );
      }
    );

    // Typing events
    newSocket.on(
      "userTyping",
      ({
        userId: typingUserId,
        userName,
        isTyping: typing,
      }: {
        userId: string;
        userName: string;
        isTyping: boolean;
      }) => {
        if (typingUserId !== userId) {
          setTypingUsers((prev) => {
            if (typing) {
              return [
                ...prev.filter((u) => u.userId !== typingUserId),
                { userId: typingUserId, userName },
              ];
            } else {
              return prev.filter((u) => u.userId !== typingUserId);
            }
          });
        }
      }
    );

    // User join/leave events
    newSocket.on(
      "userJoined",
      ({ userName, message }: { userName: string; message: string }) => {
        console.log(`${userName} joined:`, message);
      }
    );

    newSocket.on(
      "userLeft",
      ({ userName, message }: { userName: string; message: string }) => {
        console.log(`${userName} left:`, message);
      }
    );

    // Cleanup
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Properly leave room before disconnecting
      if (newSocket.connected && selected) {
        newSocket.emit("leaveRoom", {
          roomId: `chat_${selected._id}`,
          userId: userId,
          userName: "You",
        });
      }

      // Remove all event listeners to prevent memory leaks
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, [selected?._id, userId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input changes and typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (!socket || !isConnected || !selected) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        roomId: `chat_${selected._id}`,
        userId: userId,
        userName: "You",
        isTyping: true,
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit("typing", {
        roomId: `chat_${selected._id}`,
        userId: userId,
        userName: "You",
        isTyping: false,
      });
    }, 1000);
  };

  // Send message
  const handleSend = () => {
    if (!input.trim() || !selected) {
      return;
    }

    if (!socket || !isConnected) {
      setConnectionError("Cannot send message: Not connected to server");
      return;
    }

    try {
      const messageData: Message = {
        id: Date.now(),
        roomId: `chat_${selected._id}`,
        sender: userId,
        senderName: "You",
        type: "text",
        content: input.trim(),
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", messageData);
      setInput("");
      setConnectionError(null);

      // Stop typing indicator
      setIsTyping(false);
      socket.emit("typing", {
        roomId: `chat_${selected._id}`,
        userId: userId,
        userName: "You",
        isTyping: false,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      setConnectionError("Failed to send message");
    }
  };

  // Handle file upload
  const handleFileUpload = async (
    file: File,
    type: "file" | "image" = "file"
  ) => {
    if (!file || !socket || !isConnected || !selected) {
      setUploadError("Cannot upload file: Not connected to server");
      return;
    }

    // Validate file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError("File size exceeds 10MB limit");
      return;
    }

    // Validate file type for images
    if (type === "image" && !file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    const fileId = `${Date.now()}_${file.name}`;
    setUploadingFiles((prev) => new Set(prev).add(fileId));
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomId", `chat_${selected._id}`);
    formData.append("sender", userId);
    formData.append("senderName", "You");
    formData.append("type", type);

    try {
      const response = await axios.post<UploadResponse>(
        "/chat/upload-chat-file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (response.data.success) {
        console.log("File uploaded successfully:", response.data.fileData);
        // The socket will automatically receive the message via the backend emission
      } else {
        console.error("Upload failed:", response.data.message);
        setUploadError(`Upload failed: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      let errorMessage = "Failed to upload file";

      if (error.code === "ECONNABORTED") {
        errorMessage = "Upload timeout - file too large or connection slow";
      } else if (error.response?.status === 413) {
        errorMessage = "File too large for server";
      } else if (error.response?.status === 415) {
        errorMessage = "File type not supported";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setUploadError(errorMessage);
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  // Handle link sharing
  const handleLinkShare = () => {
    if (!selected) return;

    const url = prompt("Enter a URL to share:");
    if (url && socket && isConnected) {
      const messageData: Message = {
        id: Date.now(),
        roomId: `chat_${selected._id}`,
        sender: userId,
        senderName: "You",
        type: "link",
        content: url,
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", messageData);
    }
  };

  // Handle officiant selection
  const handleOfficiantSelect = (officiant: Officiant) => {
    if (socket && isConnected && selected) {
      // Leave current room
      socket.emit("leaveRoom", {
        roomId: `chat_${selected._id}`,
        userId: userId,
        userName: "You",
      });

      // Join new room
      socket.emit("joinRoom", {
        roomId: `chat_${officiant._id}`,
        userId: userId,
        userName: "You",
      });
    }

    setSelected(officiant);
    setMessages([]); // Clear messages when switching chats
    setTypingUsers([]);
  };

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Message renderer
  const renderMessage = (msg: Message) => {
    const isMyMessage = msg.sender === userId || msg.sender === "me";

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
                src={msg.fileUrl}
                alt={msg.originalName}
                className="rounded max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(msg.fileUrl, "_blank")}
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
              className={`max-w-xs rounded-lg px-4 py-3 ${
                isMyMessage
                  ? "bg-primary text-white"
                  : "bg-white border border-primary text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <GoFileDirectoryFill size={24} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {msg.originalName || msg.content}
                  </div>
                  <div className="text-xs opacity-75 flex justify-between">
                    <span>
                      {msg.fileSize ? formatFileSize(msg.fileSize) : ""}
                    </span>
                    <span>{formatTimestamp(msg.timestamp)}</span>
                  </div>
                </div>
                {msg.fileUrl && (
                  <a
                    href={msg.fileUrl}
                    download={msg.originalName}
                    className="p-1 rounded hover:bg-black/10 transition-colors"
                    title="Download file"
                  >
                    <FiDownload size={16} />
                  </a>
                )}
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
                  href={msg.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline hover:no-underline break-all"
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

  // Handle payment (placeholder - would integrate with actual payment system)
  const makePayment = async () => {
    navigate("/payment", {
      state: {
        eventDetails: {
          officiant: selected?.name,
          service: "Wedding Ceremony",
          // Add more details as needed
        },
      },
    });
  };

  // Filter officiants based on search
  const filteredOfficiants = officiants.filter(
    (officiant) =>
      officiant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (officiant?.specialization &&
        officiant.specialization.toLowerCase().includes(search.toLowerCase()))
  );

  // If loading or no officiants, show loading state
  if (!selected || officiants.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C7B7A3] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:h-[87vh] bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6">
        <div className="text-gray-500 text-sm mb-1">Dashboard / Discussion</div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-primary font-bold text-gray-900 mb-2">
            Discussion with Officiant
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

      <div className="flex-1 flex flex-col lg:flex-row lg:gap-0 gap-14 bg-white border-t border-gray-200">
        {/* Sidebar */}
        <div className="w-full lg:w-80 border border-gray-200 bg-white flex flex-col">
          <div className="p-4">
            <input
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-600 duration-300"
              placeholder="Search officiants...."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto min-h-40 lg:max-h-[68vh] max-h-60">
            {filteredOfficiants.map((o) => (
              <div
                key={`${o._id}-${o.name}`}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-[#f8f2e4] duration-200 cursor-pointer border-b border-gray-100 ${
                  selected?._id === o._id ? "bg-[#f8f2e4]" : "bg-transparent"
                }`}
                onClick={() => handleOfficiantSelect(o)}
              >
                <div className="relative">
                  <img
                    src={
                      o.profilePicture ||
                      "https://via.placeholder.com/40x40?text=👤"
                    }
                    alt={o.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {o.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {o.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    Specialization:{" "}
                    <span className="text-gray-700">
                      {o.specialization || "Wedding Officiant"}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full border ${
                    o.online
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {o.online ? "Available" : "Offline"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 rounded-xl flex flex-col bg-[#f8f2e4]">
          {/* Chat Header */}
          <h1 className="text-2xl block lg:hidden font-semibold font-primary py-2 text-center border-b border-gray-200 w-full">
            Chat
          </h1>

          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
            <div className="relative">
              <img
                src={
                  selected.profilePicture ||
                  "https://via.placeholder.com/40x40?text=👤"
                }
                alt={selected.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {selected.online && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{selected.name}</div>
              <div className="text-xs text-gray-500">
                Specialization:{" "}
                <span className="text-gray-700">
                  {selected.specialization || "Wedding Officiant"}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 text-xs rounded-full border ${
                selected.online
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              {selected.online ? "Available" : "Offline"}
            </span>
          </div>

          {/* Error Notifications */}
          {(connectionError || uploadError) && (
            <div className="px-6 py-2">
              {connectionError && (
                <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <span className="text-red-700 text-sm">
                    {connectionError}
                  </span>
                  <button
                    onClick={() => setConnectionError(null)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}
              {uploadError && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
                  <span className="text-orange-700 text-sm">{uploadError}</span>
                  <button
                    onClick={() => setUploadError(null)}
                    className="text-orange-500 hover:text-orange-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {messages.map(renderMessage)}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex">
                <div className="bg-gray-200 rounded-lg px-4 py-2 text-gray-600 text-sm animate-pulse">
                  {typingUsers.map((u) => u.userName).join(", ")}{" "}
                  {typingUsers.length === 1 ? "is" : "are"} typing...
                </div>
              </div>
            )}

            {/* Upload Indicator */}
            {uploadingFiles.size > 0 && (
              <div className="flex justify-end">
                <div className="bg-primary/80 text-white rounded-lg px-4 py-2 text-sm">
                  Uploading {uploadingFiles.size} file
                  {uploadingFiles.size > 1 ? "s" : ""}...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="bg-white border-t border-gray-200 px-2 lg:px-6 py-4">
            <div className="flex justify-center items-center gap-1 sm:gap-3">
              <div className="relative">
                <button
                  className="flex items-center md:gap-2 px-2 md:px-4 py-2 rounded-full border border-primary text-primary bg-primary/10 hover:bg-primary/20 font-medium transition-colors"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  disabled={!isConnected}
                >
                  <IoAttachOutline size={24} />
                  <span className="hidden md:inline">Attach</span>
                </button>

                {showAttachMenu && (
                  <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[160px] z-10">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        imageInputRef.current?.click();
                        setShowAttachMenu(false);
                      }}
                      disabled={!isConnected}
                    >
                      <IoImage size={16} />
                      Image
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowAttachMenu(false);
                      }}
                      disabled={!isConnected}
                    >
                      <IoDocument size={16} />
                      Document
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors"
                      onClick={() => {
                        handleLinkShare();
                        setShowAttachMenu(false);
                      }}
                      disabled={!isConnected}
                    >
                      <IoLink size={16} />
                      Link
                    </button>
                  </div>
                )}
              </div>

              <input
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-yellow-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder={isConnected ? "Type message...." : "Connecting..."}
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                disabled={!isConnected}
              />

              <button
                className="px-6 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={!isConnected || !input.trim()}
              >
                <IoSend size={16} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.zip,.rar"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0], "file");
                e.target.value = "";
              }
            }}
          />

          <input
            ref={imageInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0], "image");
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Discussions;
