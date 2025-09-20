import React, { useState, useEffect, useRef } from "react";
import { GoFileDirectoryFill } from "react-icons/go";
import {
  IoAttachOutline,
  IoSend,
  IoImage,
  IoDocument,
  IoLink,
  IoCalendarOutline,
} from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
interface ChatParticipant {
  _id: string;
  name: string;
  email: string;
  specialization?: string; // For officiants
  partner_1?: string; // For users
  partner_2?: string; // For users
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
  role?: string;
  lastMessageTime?: string;
}

// Keep the old interface for backward compatibility
interface Officiant extends ChatParticipant {}

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
  bookingData?: BookingProposal;
}

interface BookingProposal {
  eventId: string;
  eventName: string; // This will store the title from Event
  price: number;
  officiantId: string;
  officiantName: string;
  clientId: string;
  clientName: string;
  status?: "pending" | "accept" | "decline";
  respondedBy?: string;
  respondedAt?: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  ceremonyType: string;
  price?: number; // Optional since it might not exist in the schema
  duration?: string;
  features?: string[];
  category?: string;
}

interface BookingModalData {
  eventId: string;
  eventName: string;
  price: number;
  officiantId: string;
  officiantName: string;
  clientId: string;
  clientName: string;
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
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [customPrice, setCustomPrice] = useState<string>(""); // Custom price input by officiant

  // Hooks and refs
  const axios = useAxios();
  const { user } = useAuth(); // Get actual user from auth
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate private room ID for user-officiant conversation
  const generatePrivateRoomId = (
    userId: string,
    officiantId: string
  ): string => {
    // Create consistent room ID regardless of who initiates the conversation
    const ids = [userId, officiantId].sort();
    return `private_${ids[0]}_${ids[1]}`;
  };

  // Fetch chat participants based on user role
  useEffect(() => {
    const fetchChatParticipants = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);

        if (user.role === "officiant") {
          // If user is an officiant, fetch users who have messaged them
          const response = await axios.get(
            `/chat/users-for-officiant/${user._id}`
          );
          if (response.data.success) {
            const userData = response.data.data.map((user: any) => ({
              ...user,
              online: false, // Initial status, will be updated by socket
            }));
            setOfficiants(userData); // Using same state but it contains users for officiants
            if (userData.length > 0) {
              setSelected(userData[0]);
            }
          }
        } else {
          // If user is a regular user, fetch officiants (excluding current user if they are an officiant)
          const response = await axios.get("/chat/officiants");
          if (response.data.success) {
            const officiantData = response.data.data
              .filter((officiant: any) => officiant._id !== user._id) // Exclude current user
              .map((officiant: any) => ({
                ...officiant,
                online: false, // Initial status, will be updated by socket
              }));
            setOfficiants(officiantData);
            if (officiantData.length > 0) {
              setSelected(officiantData[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching chat participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatParticipants();
  }, [axios, user?._id, user?.role]);

  // Initialize socket connection
  useEffect(() => {
    if (!selected || !user?._id) return;

    const roomId = generatePrivateRoomId(user._id, selected._id);

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

    // Handle browser close/refresh to emit offline status
    const handleBeforeUnload = () => {
      if (newSocket.connected && user?._id) {
        newSocket.emit("userOffline", {
          userId: user._id,
          userName: user.partner_1 || user.partner_2 || "User",
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);
      setConnectionError(null);

      // Join room for the selected participant
      console.log(
        `🏠 Joining room: ${roomId} as ${
          user.partner_1 || user.partner_2 || "User"
        }`
      );
      newSocket.emit("joinRoom", {
        roomId: roomId,
        userId: user._id,
        userName: user.partner_1 || user.partner_2 || "User",
      });

      // Mark user as online
      console.log(`📡 Marking user as online: ${user._id}`);
      newSocket.emit("userOnline", {
        userId: user._id,
        userName: user.partner_1 || user.partner_2 || "User",
      });

      // Request online status for all participants
      console.log(`📡 Requesting online status for all participants`);
      newSocket.emit("getOnlineUsers", {});
    });
    newSocket.on("disconnect", (reason: string) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);

      // Emit user offline status
      if (user?._id) {
        newSocket.emit("userOffline", {
          userId: user._id,
          userName: user.partner_1 || user.partner_2 || "User",
        });
      }

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
        roomId: roomId,
        userId: user._id,
        userName: user.partner_1 || user.partner_2 || "User",
      });

      // Mark user as online again after reconnection
      newSocket.emit("userOnline", {
        userId: user._id,
        userName: user.partner_1 || user.partner_2 || "User",
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

      // Prevent duplicate messages with improved detection
      setMessages((prev) => {
        // Check for exact database ID match
        if (
          messageData._id &&
          prev.some((msg) => msg._id === messageData._id)
        ) {
          console.log("Duplicate message detected (DB ID):", messageData._id);
          return prev;
        }

        // Check for server-generated message ID match
        if (
          messageData.serverId &&
          prev.some((msg) => msg.serverId === messageData.serverId)
        ) {
          console.log(
            "Duplicate message detected (Server ID):",
            messageData.serverId
          );
          return prev;
        }

        // Check for client-generated ID match
        if (messageData.id && prev.some((msg) => msg.id === messageData.id)) {
          console.log(
            "Duplicate message detected (Client ID):",
            messageData.id
          );
          return prev;
        }

        // Fallback: Check for very similar messages (same content, sender, and recent timestamp)
        const duplicateFound = prev.some(
          (msg) =>
            msg.content === messageData.content &&
            msg.sender === messageData.sender &&
            msg.type === messageData.type &&
            Math.abs(
              new Date(msg.timestamp || msg.createdAt || "").getTime() -
                new Date(
                  messageData.timestamp || messageData.createdAt || ""
                ).getTime()
            ) < 5000 // 5 second window for duplicate detection
        );

        if (duplicateFound) {
          console.log(
            "Duplicate message detected (Content match):",
            messageData.content?.substring(0, 50)
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

    // Handle message confirmation from server (for own messages)
    newSocket.on("messageConfirmed", (confirmedMessage: Message) => {
      console.log("✅ Message confirmed by server:", confirmedMessage);

      // Update the local optimistic message with server data
      setMessages((prev) => {
        return prev.map((msg) => {
          // Find the optimistic message and replace it with confirmed data
          if (msg.id === confirmedMessage.id && msg.sender === user._id) {
            return {
              ...confirmedMessage,
              id: msg.id, // Keep original client ID for reference
            };
          }
          return msg;
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
        console.log(
          `📡 User status changed: ${statusUserId} is now ${
            isOnline ? "online" : "offline"
          }`
        );

        setOnlineUsers((prevOnline) => {
          const newSet = new Set(prevOnline);
          if (isOnline) {
            newSet.add(statusUserId);
          } else {
            newSet.delete(statusUserId);
          }
          console.log(`📊 Updated online users:`, Array.from(newSet));
          return newSet;
        });

        // Update participants online status (whether they are officiants or users)
        setOfficiants((prev) => {
          console.log(
            `👥 Current participants:`,
            prev.map((p: any) => ({
              id: p._id,
              name: p.name,
              online: p.online,
            }))
          );

          const updatedParticipants = prev.map((participant) =>
            participant._id === statusUserId
              ? { ...participant, online: isOnline }
              : participant
          );

          console.log(
            `👥 Updated participants:`,
            updatedParticipants.map((p: any) => ({
              id: p._id,
              name: p.name,
              online: p.online,
            }))
          );

          return updatedParticipants;
        });
      }
    );

    // Handle online users list response
    newSocket.on(
      "onlineUsersList",
      ({ onlineUsers: onlineUsersList }: { onlineUsers: string[] }) => {
        console.log(`📡 Received online users list:`, onlineUsersList);
        setOnlineUsers(new Set(onlineUsersList));

        // Update participants online status based on the received list
        setOfficiants((prev) => {
          const updated = prev.map((participant) => ({
            ...participant,
            online: onlineUsersList.includes(participant._id),
          }));
          console.log(
            `👥 Updated participants with online status:`,
            updated.map((p: any) => ({
              id: p._id,
              name: p.name,
              online: p.online,
            }))
          );
          return updated;
        });
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
        if (typingUserId !== user._id) {
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

    // Booking proposal event handlers
    newSocket.on("booking_proposal_received", (messageData: Message) => {
      console.log("📅 Booking proposal received:", messageData);
      setMessages((prevMessages) => {
        // Check for duplicates
        const isDuplicate = prevMessages.some(
          (msg) =>
            msg.id === messageData.id ||
            (msg.content === messageData.content &&
              msg.sender === messageData.sender &&
              msg.timestamp &&
              messageData.timestamp &&
              Math.abs(
                new Date(msg.timestamp).getTime() -
                  new Date(messageData.timestamp).getTime()
              ) < 5000)
        );

        if (isDuplicate) {
          console.log(
            "🚫 Duplicate booking proposal message detected, skipping:",
            messageData.id
          );
          return prevMessages;
        }

        return [...prevMessages, messageData];
      });
    });

    newSocket.on(
      "booking_response_received",
      ({
        messageId,
        response,
        userId,
      }: {
        messageId: string;
        response: "accept" | "decline";
        userId: string;
      }) => {
        console.log("📋 Booking response received:", {
          messageId,
          response,
          userId,
        });

        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.id === messageId && msg.type === "booking_proposal") {
              return {
                ...msg,
                bookingData: msg.bookingData
                  ? {
                      ...msg.bookingData,
                      status: response,
                      respondedBy: userId,
                      respondedAt: new Date().toISOString(),
                    }
                  : undefined,
              };
            }
            return msg;
          })
        );

        // Show notification based on response
        if (response === "accept") {
          Swal.fire({
            title: "Booking Accepted!",
            text: "The client has accepted your booking proposal.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Booking Declined",
            text: "The client has declined your booking proposal.",
            icon: "info",
            confirmButtonText: "OK",
          });
        }
      }
    );

    // Cleanup
    return () => {
      // Remove beforeunload event listener
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Properly leave room before disconnecting
      if (newSocket.connected && selected) {
        newSocket.emit("leaveRoom", {
          roomId: roomId,
          userId: user._id,
          userName: user.partner_1 || user.partner_2 || "User",
        });

        // Emit user offline status
        newSocket.emit("userOffline", {
          userId: user._id,
          userName: user.partner_1 || user.partner_2 || "User",
        });
      }

      // Remove all event listeners to prevent memory leaks
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, [selected?._id, user?._id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch events for booking modal
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await axios.get("/events/all");
      // Backend returns { events: [...] }, so we need response.data.events
      setEvents(response.data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load events. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  // Handle opening booking modal
  const handleOpenBookingModal = () => {
    setShowBookingModal(true);
    setSelectedEvent(""); // Reset event selection
    setCustomPrice(""); // Reset custom price
    fetchEvents();
  };

  // Handle booking proposal sending
  const handleSendBookingProposal = () => {
    if (!selectedEvent) {
      Swal.fire({
        title: "Error",
        text: "Please select an event to proceed.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!customPrice || parseFloat(customPrice) <= 0) {
      Swal.fire({
        title: "Error",
        text: "Please enter a valid price greater than 0.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!user?._id || !selected?._id) {
      Swal.fire({
        title: "Error",
        text: "User or participant information missing.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const event = events.find((e) => e._id === selectedEvent);
    if (!event) return;

    const roomId = generatePrivateRoomId(user._id, selected._id);
    const proposedPrice = parseFloat(customPrice);

    const bookingData: BookingModalData = {
      eventId: event._id,
      eventName: event.title,
      price: proposedPrice, // Use the custom price set by officiant
      officiantId: user._id,
      officiantName: user.partner_1 || user.partner_2 || "Officiant",
      clientId: selected._id,
      clientName: selected.partner_1 || selected.partner_2 || "Client",
    };

    if (socket) {
      socket.emit("send_booking_proposal", {
        roomId,
        bookingData,
        message: `Booking proposal for ${
          event.title
        } - $${proposedPrice.toFixed(2)}`,
      });
    }

    setShowBookingModal(false);
    setSelectedEvent("");
    setCustomPrice(""); // Reset custom price

    Swal.fire({
      title: "Success",
      text: "Booking proposal sent successfully!",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  // Handle booking response (accept/decline)
  const handleBookingResponse = (
    messageId: string,
    response: "accept" | "decline"
  ) => {
    if (!user?._id || !selected?._id) return;

    const roomId = generatePrivateRoomId(user._id, selected._id);

    if (socket) {
      socket.emit("booking_response", {
        roomId,
        messageId,
        response,
        userId: user._id,
      });
    }

    if (response === "accept") {
      // Navigate to payment page or show payment modal
      navigate("/payment");
    }
  };

  // Handle input changes and typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (!socket || !isConnected || !selected || !user?._id) return;

    const roomId = generatePrivateRoomId(user._id, selected._id);

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        roomId: roomId,
        userId: user._id,
        userName: user.partner_1 || user.partner_2 || "User",
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
        roomId: roomId,
        userId: user._id,
        userName: user.partner_1 || user.partner_2 || "User",
        isTyping: false,
      });
    }, 1000);
  };

  // Send message
  const handleSend = () => {
    if (!input.trim() || !selected || !user?._id) {
      return;
    }

    if (!socket || !isConnected) {
      setConnectionError("Cannot send message: Not connected to server");
      return;
    }

    try {
      const roomId = generatePrivateRoomId(user._id, selected._id);
      const clientId = Date.now();
      const messageData: Message = {
        id: clientId,
        roomId: roomId,
        sender: user._id,
        senderName: user.partner_1 || user.partner_2 || "User",
        type: "text",
        content: input.trim(),
        timestamp: new Date().toISOString(),
      };

      // Optimistically add message to local state first
      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some(
          (msg) =>
            msg.id === clientId ||
            (msg.content === messageData.content &&
              msg.sender === messageData.sender &&
              Math.abs(
                new Date(msg.timestamp || msg.createdAt || "").getTime() -
                  new Date(messageData.timestamp || "").getTime()
              ) < 1000)
        );

        if (exists) {
          return prev;
        }

        return [...prev, messageData].sort((a, b) => {
          const timeA = new Date(a.timestamp || a.createdAt || "").getTime();
          const timeB = new Date(b.timestamp || b.createdAt || "").getTime();
          return timeA - timeB;
        });
      });

      socket.emit("sendMessage", messageData);
      setInput("");
      setConnectionError(null);

      // Stop typing indicator
      setIsTyping(false);
      socket.emit("typing", {
        roomId: roomId,
        userId: user._id,
        userName: user.partner_1 || user.partner_2 || "User",
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
    if (!file || !socket || !isConnected || !selected || !user?._id) {
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

    const roomId = generatePrivateRoomId(user._id, selected._id);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomId", roomId);
    formData.append("sender", user._id);
    formData.append("senderName", user.partner_1 || user.partner_2 || "User");
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
    if (!selected || !user?._id) return;

    const url = prompt("Enter a URL to share:");
    if (url && socket && isConnected) {
      const roomId = generatePrivateRoomId(user._id, selected._id);
      const messageData: Message = {
        id: Date.now(),
        roomId: roomId,
        sender: user._id,
        senderName: user.partner_1 || user.partner_2 || "User",
        type: "link",
        content: url,
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", messageData);
    }
  };

  // Handle officiant selection
  const handleOfficiantSelect = (officiant: Officiant) => {
    if (!user?._id) return;

    if (socket && isConnected && selected) {
      // Leave current room
      const currentRoomId = generatePrivateRoomId(user._id, selected._id);
      socket.emit("leaveRoom", {
        roomId: currentRoomId,
        userId: user._id,
        userName: user.partner_1 || user.partner_2 || "User",
      });

      // Join new room
      const newRoomId = generatePrivateRoomId(user._id, officiant._id);
      socket.emit("joinRoom", {
        roomId: newRoomId,
        userId: user._id,
        userName: user.partner_1 || user.partner_2 || "User",
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
    const isMyMessage = msg.sender === user?._id || msg.sender === "me";

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
                    {msg.originalName ||
                      msg.fileData?.originalName ||
                      msg.content}
                  </div>
                  <div className="text-xs opacity-75 flex justify-between">
                    <span>
                      {msg.fileSize || msg.fileData?.fileSize
                        ? formatFileSize(
                            (msg.fileSize || msg.fileData?.fileSize)!
                          )
                        : ""}
                    </span>
                    <span>{formatTimestamp(msg.timestamp)}</span>
                  </div>
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
                      user?.role !== "officiant" && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() =>
                              handleBookingResponse(
                                String(msg.id || ""),
                                "accept"
                              )
                            }
                            className="flex-1 bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleBookingResponse(
                                String(msg.id || ""),
                                "decline"
                              )
                            }
                            className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                    {msg.bookingData.status === "accept" && (
                      <div className="bg-green-100 border border-green-300 rounded-md p-2 mt-3">
                        <p className="text-sm text-green-800 font-medium">
                          ✅ Booking Accepted
                        </p>
                      </div>
                    )}

                    {msg.bookingData.status === "decline" && (
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

  // Filter officiants based on search
  const filteredOfficiants = officiants.filter(
    (officiant) =>
      officiant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (officiant?.specialization &&
        officiant.specialization.toLowerCase().includes(search.toLowerCase()))
  );

  // If loading or no officiants, show loading state
  if (loading || !user?._id || officiants.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C7B7A3] mx-auto mb-4"></div>
            <p className="text-gray-600">
              {!user?._id ? "Please log in to access chat" : "Loading chat..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">
              {user?.role === "officiant"
                ? "No messages from clients yet. Clients will appear here when they message you."
                : "Select an officiant to start chatting"}
            </p>
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
            {user?.role === "officiant"
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

      <div className="flex-1 flex flex-col lg:flex-row lg:gap-0 gap-14 bg-white border-t border-gray-200">
        {/* Sidebar */}
        <div className="w-full lg:w-80 border border-gray-200 bg-white flex flex-col">
          <div className="p-4">
            <input
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-yellow-600 duration-300"
              placeholder={
                user?.role === "officiant"
                  ? "Search clients...."
                  : "Search officiants...."
              }
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
                    {user?.role === "officiant" ? (
                      // Show user info when officiant is viewing
                      <span className="text-gray-700">Client</span>
                    ) : (
                      // Show officiant specialization when user is viewing
                      <>
                        Specialization:{" "}
                        <span className="text-gray-700">
                          {o.specialization || "Wedding Officiant"}
                        </span>
                      </>
                    )}
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
                {user?.role === "officiant" ? (
                  // Show user info when officiant is viewing
                  <span className="text-gray-700">Client</span>
                ) : (
                  // Show officiant specialization when user is viewing
                  <>
                    Specialization:{" "}
                    <span className="text-gray-700">
                      {selected.specialization || "Wedding Officiant"}
                    </span>
                  </>
                )}
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
          <div className="flex-1 overflow-y-auto max-h-96 2xl:max-h-[735px] xl:max-h-[500px] px-6 py-4 flex flex-col gap-4">
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

                    {/* Booking button only for officiants */}
                    {user?.role === "officiant" && (
                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors"
                        onClick={() => {
                          handleOpenBookingModal();
                          setShowAttachMenu(false);
                        }}
                        disabled={!isConnected}
                      >
                        <IoCalendarOutline size={16} />
                        Send Booking
                      </button>
                    )}
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

      {/* Booking Proposal Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Send Booking Proposal
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Event
                  </label>
                  {loadingEvents ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <p className="text-sm text-gray-600 mt-2">
                        Loading events...
                      </p>
                    </div>
                  ) : (
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Choose an event...</option>
                      {events.map((event) => (
                        <option key={event._id} value={event._id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Custom Price Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set Your Price ($)
                  </label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="Enter your price..."
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {selectedEvent && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">
                      Event Details
                    </h3>
                    {(() => {
                      const event = events.find((e) => e._id === selectedEvent);
                      return event ? (
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Event:</span>{" "}
                            {event.title}
                          </p>
                          <p>
                            <span className="font-medium">
                              Event Default Price:
                            </span>{" "}
                            ${event.price || 0}
                          </p>
                          {customPrice && (
                            <p>
                              <span className="font-medium">
                                Your Proposed Price:
                              </span>{" "}
                              <span className="text-primary font-semibold">
                                ${customPrice}
                              </span>
                            </p>
                          )}
                          {event.description && (
                            <p>
                              <span className="font-medium">Description:</span>{" "}
                              {event.description}
                            </p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedEvent("");
                    setCustomPrice(""); // Reset custom price on cancel
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendBookingProposal}
                  disabled={
                    !selectedEvent ||
                    !customPrice ||
                    parseFloat(customPrice || "0") <= 0
                  }
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussions;
