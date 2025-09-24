// Types and Interfaces for Chat Components

// Socket interface
export interface SocketInterface {
  id?: string;
  connected: boolean;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: () => void;
  disconnect: () => void;
  connect: () => void;
}

// Chat participant interface
export interface ChatParticipant {
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

// Message interface
export interface Message {
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

// Booking proposal interface
export interface BookingProposal {
  eventId: string;
  eventName: string;
  price: number;
  officiantId: string;
  officiantName: string;
  clientId: string;
  clientName: string;
  status?: "pending" | "accepted" | "declined";
  respondedBy?: string;
  respondedAt?: string;
}

// Event interface
export interface Event {
  _id: string;
  title: string;
  description: string;
  ceremonyType: string;
  price?: number;
  duration?: string;
  features?: string[];
  category?: string;
  userId?: string;
  officiantId?: string;
  officiantName?: string;
}

// Booking modal data interface
export interface BookingModalData {
  eventId: string;
  eventName: string;
  price: number;
  officiantId: string;
  officiantName: string;
  clientId: string;
  clientName: string;
}

// Typing user interface
export interface TypingUser {
  userId: string;
  userName: string;
}
