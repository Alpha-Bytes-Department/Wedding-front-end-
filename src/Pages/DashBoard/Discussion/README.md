# Realtime Chat Implementation

## Overview

This document describes the comprehensive realtime chat system implemented for the Wedding Planner application. The chat system allows users to communicate with officiants in real-time with support for text messages, file uploads, typing indicators, and connection recovery.

## Features Implemented

### ✅ Core Features

1. **Real-time messaging** - Instant message delivery using Socket.io
2. **Typing indicators** - Shows when users are typing
3. **File upload support** - Images, documents, and links
4. **Connection status** - Visual connection status indicator
5. **Message ordering** - Proper timestamp-based message ordering
6. **Duplicate prevention** - Prevents duplicate messages
7. **Error handling** - Comprehensive error handling and user notifications
8. **Connection recovery** - Automatic reconnection with proper room rejoining

### 🔧 Technical Implementation

#### Socket.io Integration

- **Client**: socket.io-client v4.8.1
- **Connection**: WebSocket with polling fallback
- **Reconnection**: Automatic with configurable attempts (5 attempts, 1s delay)
- **Room Management**: Dynamic room joining/leaving based on officiant selection

#### State Management

- **Messages**: Stored in React state with duplicate prevention
- **Connection**: Real-time connection status tracking
- **Typing**: Multi-user typing indicator support
- **Errors**: Separate error states for connection and upload issues

#### File Upload System

- **Size Limit**: 10MB maximum file size
- **Types**: Images, documents (PDF, DOC, DOCX, TXT, ZIP, RAR)
- **Validation**: Client-side type and size validation
- **Error Handling**: Comprehensive upload error handling
- **Progress**: Upload progress indication

## File Structure

```
src/Pages/DashBoard/Discussion/
├── Discussions.tsx          # Main chat component
├── useSocket.ts            # Socket.io hook (separate implementation)
├── chat.ts                 # Type definitions and utilities
└── README.md              # This documentation
```

## Environment Variables

Create `.env` file in project root:

```env
# Development Environment Variables
VITE_APP_SOCKET_URL=http://localhost:5000
VITE_APP_API_URL=http://localhost:5000/api
VITE_APP_UPLOAD_URL=http://localhost:5000/uploads
```

## Socket Events

### Client → Server Events

- `joinRoom` - Join a chat room
- `leaveRoom` - Leave a chat room
- `sendMessage` - Send a text message
- `typing` - Send typing indicator
- File uploads via HTTP API

### Server → Client Events

- `receiveMessage` - Receive new message
- `userTyping` - Receive typing indicator
- `userJoined` - User joined room
- `userLeft` - User left room
- Connection events: `connect`, `disconnect`, `reconnect`, etc.

## Message Types

### Text Messages

```typescript
{
  id: number | string,
  sender: string,
  senderName: string,
  type: "text",
  content: string,
  timestamp: string,
  roomId: string
}
```

### File Messages

```typescript
{
  id: number | string,
  sender: string,
  senderName: string,
  type: "file" | "image" | "document",
  content: string,           // filename
  originalName: string,
  fileUrl: string,
  fileSize: number,
  mimeType: string,
  timestamp: string,
  roomId: string
}
```

### Link Messages

```typescript
{
  id: number | string,
  sender: string,
  senderName: string,
  type: "link",
  content: string,           // URL
  timestamp: string,
  roomId: string
}
```

## Error Handling

### Connection Errors

- **Display**: Red notification banner
- **Auto-dismiss**: User can manually dismiss
- **Recovery**: Automatic reconnection attempts
- **Fallback**: Graceful degradation when offline

### Upload Errors

- **Validation**: File size and type validation
- **Network**: Timeout and network error handling
- **Server**: HTTP status code error mapping
- **Display**: Orange notification banner

### Message Errors

- **Duplicate Prevention**: Content and timestamp-based deduplication
- **Ordering**: Timestamp-based message ordering
- **Validation**: Input sanitization and validation

## Performance Optimizations

### Memory Management

- **Event Cleanup**: Proper removal of all socket event listeners
- **Component Cleanup**: Cleanup timeouts and intervals
- **State Optimization**: Efficient state updates and re-renders

### Network Optimization

- **Reconnection Strategy**: Exponential backoff for reconnection
- **Efficient Polling**: WebSocket with polling fallback
- **File Upload**: Chunked upload support (server-side implementation needed)

## UI/UX Features

### Visual Indicators

- **Connection Status**: Green/Red indicator in header
- **Typing Indicator**: Animated typing bubble
- **Upload Progress**: File upload progress indication
- **Message Status**: Timestamp and delivery indicators

### Responsive Design

- **Mobile Optimized**: Responsive layout for mobile devices
- **Sidebar**: Collapsible officiant list
- **Chat Input**: Adaptive input area with attachment options

### Error Notifications

- **Connection Errors**: Dismissible red banners
- **Upload Errors**: Dismissible orange banners
- **Inline Validation**: Real-time input validation

## Testing Checklist

### ✅ Connection Testing

- [x] Initial connection establishment
- [x] Reconnection after network loss
- [x] Multiple tab/window handling
- [x] Server restart recovery

### ✅ Message Testing

- [x] Text message sending/receiving
- [x] Message ordering
- [x] Duplicate prevention
- [x] Special character handling

### ✅ File Upload Testing

- [x] Image uploads
- [x] Document uploads
- [x] File size validation
- [x] File type validation
- [x] Upload error handling

### ✅ UI/UX Testing

- [x] Responsive design
- [x] Error notifications
- [x] Typing indicators
- [x] Connection status
- [x] Room switching

## Server Requirements

The chat system requires a Socket.io server with the following endpoints:

### Socket Events

- `joinRoom`, `leaveRoom` - Room management
- `sendMessage` - Message broadcasting
- `typing` - Typing indicator broadcast

### HTTP Endpoints

- `POST /api/chat/upload-chat-file` - File upload endpoint

### Example Server Implementation (Node.js)

```javascript
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId, userId, userName }) => {
    socket.join(roomId);
    socket
      .to(roomId)
      .emit("userJoined", { userName, message: "joined the chat" });
  });

  socket.on("sendMessage", (messageData) => {
    io.to(messageData.roomId).emit("receiveMessage", messageData);
  });

  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("userTyping", data);
  });
});
```

## Troubleshooting

### Common Issues

1. **Connection Failed**

   - Check VITE_APP_SOCKET_URL environment variable
   - Verify server is running and accessible
   - Check network connectivity

2. **Messages Not Sending**

   - Check connection status indicator
   - Verify socket event listeners are properly set up
   - Check browser console for errors

3. **File Upload Failures**

   - Check file size (10MB limit)
   - Verify file type is supported
   - Check server upload endpoint

4. **Typing Indicators Not Working**
   - Verify typing event listeners
   - Check room ID consistency
   - Verify timeout handling

### Debug Information

Enable debug mode by adding to browser console:

```javascript
localStorage.debug = "socket.io-client:socket";
```

## Future Enhancements

### Planned Features

- [ ] Message reactions (emoji)
- [ ] Message replies/threading
- [ ] Read receipts
- [ ] User presence (online/offline)
- [ ] Message search
- [ ] Chat history persistence
- [ ] Voice messages
- [ ] Video calling integration

### Performance Improvements

- [ ] Message pagination
- [ ] Virtual scrolling for large message lists
- [ ] Image compression before upload
- [ ] Lazy loading of chat history

### Security Enhancements

- [ ] Message encryption
- [ ] User authentication integration
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] File type security validation

## Dependencies

```json
{
  "socket.io-client": "^4.8.1",
  "@types/socket.io-client": "^1.4.36",
  "react": "^19.1.1",
  "react-icons": "^5.5.0",
  "axios": "^1.12.2"
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## License

This chat implementation is part of the Wedding Planner application and follows the same licensing terms.
