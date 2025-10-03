// hooks/useSocket.ts
import { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";
import {type Message } from "./chat";

interface UseSocketProps {
  userId: string;
  userName: string;
  serverUrl?: string;
}

interface UseSocketReturn {
  socket: ReturnType<typeof io> | null;
  isConnected: boolean;
  error: string | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (messageData: Message) => void;
  sendTyping: (roomId: string, isTyping: boolean) => void;
  shareFile: (fileData: any) => void;
  addReaction: (messageId: string, roomId: string, emoji: string) => void;
  markAsRead: (roomId: string, messageIds: string[]) => void;
  getRoomUsers: (roomId: string) => void;

  // Event listeners
  onReceiveMessage: (callback: (message: Message) => void) => void;
  onUserTyping: (
    callback: (data: {
      userId: string;
      userName: string;
      isTyping: boolean;
    }) => void
  ) => void;
  onUserJoined: (
    callback: (data: {
      userId: string;
      userName: string;
      message: string;
    }) => void
  ) => void;
  onUserLeft: (
    callback: (data: {
      userId: string;
      userName: string;
      message: string;
    }) => void
  ) => void;
  onMessageReaction: (callback: (data: any) => void) => void;
  onMessagesRead: (callback: (data: any) => void) => void;
  onRoomUsers: (callback: (data: any) => void) => void;

  // Cleanup
  offReceiveMessage: (callback: (message: Message) => void) => void;
  offUserTyping: (
    callback: (data: {
      userId: string;
      userName: string;
      isTyping: boolean;
    }) => void
  ) => void;
  offUserJoined: (
    callback: (data: {
      userId: string;
      userName: string;
      message: string;
    }) => void
  ) => void;
  offUserLeft: (
    callback: (data: {
      userId: string;
      userName: string;
      message: string;
    }) => void
  ) => void;
}


export const useSocket = ({
  userId,
  userName,
  serverUrl,
}: UseSocketProps): UseSocketReturn => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const SOCKET_SERVER_URL =
    serverUrl || import.meta.env.VITE_APP_SOCKET_URL || "http://localhost:5000";

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ["polling", "websocket"], // Try polling first for better compatibility
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true,
      secure: SOCKET_SERVER_URL.startsWith('https'),
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("🔥 Socket connection error:", err);
      setError(err.message);
      setIsConnected(false);
    });

    socket.on("error", (err: Error) => {
      console.error("🔥 Socket error:", err);
      setError(err.message);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [SOCKET_SERVER_URL]);

  // Socket methods
  const joinRoom = useCallback(
    (roomId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("joinRoom", {
          roomId,
          userId,
          userName,
        });
        console.log(`👤 Joining room: ${roomId}`);
      }
    },
    [isConnected, userId, userName]
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("leaveRoom", {
          roomId,
          userId,
          userName,
        });
        console.log(`👋 Leaving room: ${roomId}`);
      }
    },
    [isConnected, userId, userName]
  );

  const sendMessage = useCallback(
    (messageData: Message) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("sendMessage", messageData);
        console.log("📤 Message sent:", messageData);
      } else {
        console.warn("⚠️ Cannot send message: Socket not connected");
      }
    },
    [isConnected]
  );

  const sendTyping = useCallback(
    (roomId: string, isTyping: boolean) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("typing", {
          roomId,
          userId,
          userName,
          isTyping,
        });
      }
    },
    [isConnected, userId, userName]
  );

  const shareFile = useCallback(
    (fileData: any) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("shareFile", fileData);
        console.log("📎 File shared:", fileData);
      }
    },
    [isConnected]
  );

  const addReaction = useCallback(
    (messageId: string, roomId: string, emoji: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("addReaction", {
          messageId,
          roomId,
          emoji,
          userId,
          userName,
        });
      }
    },
    [isConnected, userId, userName]
  );

  const markAsRead = useCallback(
    (roomId: string, messageIds: string[]) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("markAsRead", {
          roomId,
          messageIds,
          userId,
          userName,
        });
      }
    },
    [isConnected, userId, userName]
  );

  const getRoomUsers = useCallback(
    (roomId: string) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("getRoomUsers", roomId);
      }
    },
    [isConnected]
  );

  // Event listeners
  const onReceiveMessage = useCallback(
    (callback: (message: Message) => void) => {
      if (socketRef.current) {
        socketRef.current.on("receiveMessage", callback);
      }
    },
    []
  );

  const onUserTyping = useCallback(
    (
      callback: (data: {
        userId: string;
        userName: string;
        isTyping: boolean;
      }) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.on("userTyping", callback);
      }
    },
    []
  );

  const onUserJoined = useCallback(
    (
      callback: (data: {
        userId: string;
        userName: string;
        message: string;
      }) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.on("userJoined", callback);
      }
    },
    []
  );

  const onUserLeft = useCallback(
    (
      callback: (data: {
        userId: string;
        userName: string;
        message: string;
      }) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.on("userLeft", callback);
      }
    },
    []
  );

  const onMessageReaction = useCallback((callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("messageReaction", callback);
    }
  }, []);

  const onMessagesRead = useCallback((callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("messagesRead", callback);
    }
  }, []);

  const onRoomUsers = useCallback((callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("roomUsers", callback);
    }
  }, []);

  // Cleanup listeners
  const offReceiveMessage = useCallback(
    (callback: (message: Message) => void) => {
      if (socketRef.current) {
        socketRef.current.off("receiveMessage", callback);
      }
    },
    []
  );

  const offUserTyping = useCallback(
    (
      callback: (data: {
        userId: string;
        userName: string;
        isTyping: boolean;
      }) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.off("userTyping", callback);
      }
    },
    []
  );

  const offUserJoined = useCallback(
    (
      callback: (data: {
        userId: string;
        userName: string;
        message: string;
      }) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.off("userJoined", callback);
      }
    },
    []
  );

  const offUserLeft = useCallback(
    (
      callback: (data: {
        userId: string;
        userName: string;
        message: string;
      }) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.off("userLeft", callback);
      }
    },
    []
  );

  return {
    socket: socketRef.current,
    isConnected,
    error,

    // Actions
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    shareFile,
    addReaction,
    markAsRead,
    getRoomUsers,

    // Event listeners
    onReceiveMessage,
    onUserTyping,
    onUserJoined,
    onUserLeft,
    onMessageReaction,
    onMessagesRead,
    onRoomUsers,

    // Cleanup
    offReceiveMessage,
    offUserTyping,
    offUserJoined,
    offUserLeft,
  };
};

export default useSocket;
