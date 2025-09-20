// types/chat.ts

export interface Officiant {
  id: number;
  name: string;
  ceremony: string;
  status: string;
  avatar: string;
  online: boolean;
}

export interface Message {
  id: number | string;
  sender: string;
  senderName?: string;
  type: "text" | "file" | "image" | "document" | "link";
  content: string;
  originalName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  timestamp?: string;
  serverId?: string;
  roomId?: string;
}

export interface TypingUser {
  userId: string;
  userName: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  filename?: string;
  fileUrl?: string;
  fileData?: Message;
  error?: string;
}

export interface FileUploadData {
  id: number | string;
  roomId: string;
  sender: string;
  senderName: string;
  type: "file" | "image" | "document";
  content: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface SocketEvents {
  // Client to server events
  joinRoom: (data: {
    roomId: string;
    userId: string;
    userName: string;
  }) => void;
  leaveRoom: (data: {
    roomId: string;
    userId: string;
    userName: string;
  }) => void;
  sendMessage: (message: Message) => void;
  typing: (data: {
    roomId: string;
    userId: string;
    userName: string;
    isTyping: boolean;
  }) => void;
  shareFile: (fileData: FileUploadData) => void;
  addReaction: (data: {
    messageId: string;
    roomId: string;
    emoji: string;
    userId: string;
    userName: string;
  }) => void;
  removeReaction: (data: {
    messageId: string;
    roomId: string;
    emoji: string;
    userId: string;
    userName: string;
  }) => void;
  markAsRead: (data: {
    roomId: string;
    messageIds: string[];
    userId: string;
    userName: string;
  }) => void;
  getRoomUsers: (roomId: string) => void;

  // Server to client events
  receiveMessage: (message: Message) => void;
  userTyping: (data: {
    userId: string;
    userName: string;
    isTyping: boolean;
  }) => void;
  userJoined: (data: {
    userId: string;
    userName: string;
    message: string;
  }) => void;
  userLeft: (data: {
    userId: string;
    userName: string;
    message: string;
  }) => void;
  messageReaction: (data: {
    messageId: string;
    emoji: string;
    userId: string;
    userName: string;
    action: "add" | "remove";
  }) => void;
  messagesRead: (data: {
    messageIds: string[];
    userId: string;
    userName: string;
    readAt: string;
  }) => void;
  roomUsers: (data: {
    roomId: string;
    users: Array<{ userId: string; userName: string }>;
  }) => void;
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;
  error: (error: Error) => void;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: Array<{ userId: string; userName: string }>;
  createdAt: string;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface UserStatus {
  userId: string;
  userName: string;
  online: boolean;
  lastSeen?: string;
  socketId?: string;
}

export interface FileTypes {
  image: string[];
  document: string[];
  archive: string[];
  spreadsheet: string[];
  presentation: string[];
}

export interface ChatConfig {
  maxFileSize: number; // in bytes
  maxFilesPerUpload: number;
  allowedFileTypes: FileTypes;
  socketUrl: string;
  apiBaseUrl: string;
}

export interface MessageReaction {
  messageId: string;
  emoji: string;
  users: Array<{ userId: string; userName: string }>;
  count: number;
}

export interface ReadReceipt {
  messageId: string;
  userId: string;
  userName: string;
  readAt: string;
}

// Utility types
export type MessageType = Message["type"];
export type MessageSender = Pick<Message, "sender" | "senderName">;
export type FileMessage = Message & { type: "file" | "image" | "document" };
export type TextMessage = Message & { type: "text" };
export type LinkMessage = Message & { type: "link" };

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface UploadFileResponse extends ApiResponse {
  filename?: string;
  fileUrl?: string;
  fileData?: FileUploadData;
}

export interface GetRoomsResponse extends ApiResponse {
  rooms: ChatRoom[];
}

export interface CreateRoomRequest {
  name: string;
  participants?: Array<{ userId: string; userName: string }>;
}

export interface CreateRoomResponse extends ApiResponse {
  room: ChatRoom;
}

// Hook return types
export interface UseChatReturn {
  messages: Message[];
  sendMessage: (content: string, type?: MessageType) => void;
  uploadFile: (file: File, type?: "file" | "image") => Promise<void>;
  shareLink: (url: string) => void;
  isTyping: boolean;
  typingUsers: TypingUser[];
  isConnected: boolean;
  error: string | null;
}

export interface UseSocketReturn {
  socket: any; // Socket type from socket.io-client
  isConnected: boolean;
  error: string | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (messageData: Message) => void;
  sendTyping: (roomId: string, isTyping: boolean) => void;
}
