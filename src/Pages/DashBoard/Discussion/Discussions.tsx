import React, { useState, useEffect, useRef } from "react";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import io from "socket.io-client";

// Import new components
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import MessageRenderer from "./MessageRenderer";
import ChatInput from "./ChatInput";
import BookingModal from "./BookingModal";
import type {
  SocketInterface,
  ChatParticipant,
  Message,
  BookingProposal,
  Event,
  TypingUser,
} from "./types";

// Keep the old interface for backward compatibility
interface Officiant extends ChatParticipant {}

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

  // Hooks and refs
  const axios = useAxios();
  const { user } = useAuth(); // Get actual user from auth
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
        console.log("📥 Loading existing messages:", existingMessages.length);
        console.log(
          "📋 Message types:",
          existingMessages.map((msg) => ({
            id: msg.id,
            type: msg.type,
            sender: msg.senderName,
          }))
        );

        // Log booking proposals specifically
        const bookingProposals = existingMessages.filter(
          (msg) => msg.type === "booking_proposal"
        );
        console.log(
          "📅 Booking proposals found:",
          bookingProposals.length,
          bookingProposals
        );

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

        // Update the online users set
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

        // Update the online users set
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
      console.log("🎯 Current user role:", user?.role);
      console.log("💼 Booking data:", messageData.bookingData);

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

        console.log("✅ Adding booking proposal to messages");
        return [...prevMessages, messageData];
      });
    });

    newSocket.on(
      "booking_proposal_response_received",
      ({
        messageId,
        response,
        userId,
        bookingData,
      }: {
        messageId: string;
        response: "accept" | "decline";
        userId: string;
        bookingData?: BookingProposal;
      }) => {
        console.log("📋 Booking response received:", {
          messageId,
          response,
          userId,
          bookingData,
        });

        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (
              (String(msg.id) === messageId ||
                String(msg._id) === messageId ||
                String(msg.serverId) === messageId ||
                String(msg.messageId) === messageId) &&
              msg.type === "booking_proposal"
            ) {
              console.log(
                "📋 Updating booking proposal message:",
                msg.id,
                "with status:",
                response
              );
              return {
                ...msg,
                bookingData:
                  bookingData ||
                  (msg.bookingData
                    ? {
                        ...msg.bookingData,
                        status:
                          response === "accept"
                            ? "accepted"
                            : ("declined" as "accepted" | "declined"),
                        respondedBy: userId,
                        respondedAt: new Date().toISOString(),
                      }
                    : undefined),
              } as Message;
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
    try {
      const response = await axios.get(
        `/events/officiant-Client/${selected?._id}/${user?._id}`
      );
      console.log("Fetched events:", response);

      setEvents(response.data.events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      // Fallback to all events if filtering fails
      try {
        const fallbackResponse = await axios.get("/events/all");
        setEvents(fallbackResponse.data.events || []);
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError);
        Swal.fire({
          title: "Error",
          text: "Failed to load events. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // Handle opening booking modal
  const handleOpenBookingModal = () => {
    setShowBookingModal(true);
    fetchEvents();
  };

  // Handle booking response (accept/decline)
  const handleBookingResponse = async (
    messageId: string,
    response: "accept" | "decline",
    bookingData?: BookingProposal
  ) => {
    if (!user?._id || !selected?._id || !socket) return;

    console.log("📅 Booking response initiated:", {
      messageId,
      response,
      bookingData,
      userId: user._id,
      selectedUser: selected._id,
    });

    try {
      const roomId = generatePrivateRoomId(user._id, selected._id);
      console.log("🏠 Room ID for response:", roomId);

      // Update the booking status locally first (optimistic update)
      setMessages((prevMessages) => {
        return prevMessages.map((msg) => {
          if (
            (String(msg.id) === messageId ||
              String(msg._id) === messageId ||
              String(msg.messageId) === messageId ||
              String(msg.serverId) === messageId) &&
            msg.type === "booking_proposal"
          ) {
            console.log("🔄 Optimistically updating message:", msg);
            return {
              ...msg,
              bookingData: msg.bookingData
                ? {
                    ...msg.bookingData,
                    status:
                      response === "accept"
                        ? "accepted"
                        : ("declined" as "accepted" | "declined"),
                    respondedBy: user._id || "",
                    respondedAt: new Date().toISOString(),
                  }
                : undefined,
            } as Message;
          }
          return msg;
        });
      });

      // Prepare data for socket emission
      const responseData = {
        roomId,
        messageId,
        response,
        bookingData: bookingData
          ? {
              ...bookingData,
              status: response === "accept" ? "accepted" : "declined",
              respondedBy: user._id || "",
              respondedAt: new Date().toISOString(),
            }
          : undefined,
      };

      console.log("📡 Sending booking response via socket:", responseData);

      // Send response via socket
      socket.emit("booking_proposal_response", responseData);

      // Handle accept response - redirect to payment
      if (response === "accept" && bookingData) {
        // Show success message
        await Swal.fire({
          title: "Booking Accepted!",
          text: "You have accepted the booking proposal. You will be redirected to payment.",
          icon: "success",
          confirmButtonText: "Proceed to Payment",
        });

        // Get user details for navigation
        const userName = user.partner_1 || user.partner_2 || "Client";

        // Create URL parameters with all booking details
        const params = new URLSearchParams({
          eventId: bookingData.eventId,
          eventName: bookingData.eventName,
          price: bookingData.price.toString(),
          officiantId: bookingData.officiantId,
          officiantName: bookingData.officiantName,
          clientId: user._id,
          clientName: userName,
        });

        // Navigate to payment page with all booking details
        navigate(`/dashboard/payment?${params.toString()}`);
      } else if (response === "decline") {
        // Show decline message
        Swal.fire({
          title: "Booking Declined",
          text: "You have declined the booking proposal.",
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error responding to booking proposal:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to respond to booking proposal. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
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

  // Handle input change for ChatInput component (string only)
  const handleInputStringChange = (value: string) => {
    setInput(value);

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

  // Add missing handler functions
  const handleLinkSend = (url: string) => {
    if (!socket || !selected) return;
    console.log("🔗 Sending link to:", selected.name, "URL:", url);

    const roomId = generatePrivateRoomId(user?._id || "", selected._id);
    const linkMessage: Message = {
      id: Date.now(),
      sender: user?._id || "",
      senderName:
        user?.partner_1 && user?.partner_2
          ? `${user.partner_1} & ${user.partner_2}`
          : user?.email || "",
      type: "link",
      content: url,
      timestamp: new Date().toISOString(),
      roomId: roomId,
    };

    // Use sendMessage to match backend handler
    socket.emit("sendMessage", linkMessage);

    // Add to local messages immediately for better UX
    setMessages((prev) => [...prev, linkMessage]);
  };

  const handleSendBookingProposalViaModal = (proposal: BookingProposal) => {
    if (!socket || !selected) return;

    const roomId = generatePrivateRoomId(user?._id || "", selected._id);
    const message = `Booking proposal for ${proposal.eventName}`;

    console.log("📤 Sending booking proposal:", {
      roomId,
      bookingData: proposal,
      message,
      selectedUser: selected,
    });

    // Use the correct event that the backend expects
    socket.emit("send_booking_proposal", {
      roomId,
      bookingData: proposal,
      message,
    });
  };

  // Compute user display name
  const getUserDisplayName = () => {
    if (user?.partner_1 && user?.partner_2) {
      return `${user.partner_1} & ${user.partner_2}`;
    }
    return user?.email || "User";
  };

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
      <ChatHeader userRole={user?.role} isConnected={isConnected} />

      <div className="flex-1 flex flex-col lg:flex-row lg:gap-0 gap-14 bg-white border-t border-gray-200">
        {/* Sidebar */}
        <ChatSidebar
          userRole={user?.role}
          search={search}
          setSearch={setSearch}
          filteredParticipants={filteredOfficiants}
          selected={selected}
          setSelected={handleOfficiantSelect}
          onlineUsers={onlineUsers}
        />

        {/* Chat Area */}
        <div className="flex-1 rounded-xl flex flex-col bg-[#f8f2e4]">
          {/* Chat Header */}
          <h1 className="text-2xl block lg:hidden font-semibold font-primary py-2 text-center border-b border-gray-200 w-full">
            Chat
          </h1>

          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
            <div className="relative">
              <img
                src={selected.profilePicture}
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
            {messages.map((msg) => (
              <MessageRenderer
                key={msg._id || msg.id}
                msg={msg}
                isMyMessage={msg.sender === user?._id}
                userRole={user?.role}
                onBookingResponse={handleBookingResponse}
              />
            ))}

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
          <ChatInput
            inputMessage={input}
            onInputChange={handleInputStringChange}
            onSendMessage={handleSend}
            onSendImage={(file) => handleFileUpload(file, "image")}
            onSendFile={(file) => handleFileUpload(file, "file")}
            onSendLink={handleLinkSend}
            onCreateBooking={handleOpenBookingModal}
            showMenu={showAttachMenu}
            onToggleMenu={() => setShowAttachMenu(!showAttachMenu)}
            userRole={user?.role}
            isConnected={isConnected}
          />
        </div>
      </div>

      {/* Booking Proposal Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
        }}
        events={events}
        onSendBookingProposal={handleSendBookingProposalViaModal}
        officiantId={user?._id || ""}
        officiantName={getUserDisplayName()}
        clientId={selected?._id || ""}
        clientName={selected?.name || ""}
      />
    </div>
  );
};

export default Discussions;
