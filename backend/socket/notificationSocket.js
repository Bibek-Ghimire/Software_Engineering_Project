/**
 * NOTIFICATION SOCKET.IO INTEGRATION
 * Real-time enrollment approval notifications via WebSocket
 *
 * To integrate in server.js:
 * import { initNotificationSocket } from "./socket/notificationSocket.js";
 * const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } });
 * const notificationIO = initNotificationSocket(io);
 * global.notificationIO = notificationIO;
 */

export const initNotificationSocket = (io) => {
  const notificationNamespace = io.of("/notifications");

  notificationNamespace.on("connection", (socket) => {
    console.log(`[Notification Socket] User connected: ${socket.id}`);

    // User joins their personal notification room
    socket.on("join_notifications", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(
          `[Notification Socket] User ${userId} joined room user_${userId}`,
        );

        // Send a test message to confirm connection
        socket.emit("connection_confirmed", {
          message: "Connected to notification system",
          userId,
          timestamp: new Date(),
        });
      } else {
        console.warn(
          "[Notification Socket] join_notifications called without userId",
        );
      }
    });

    // User leaves their notification room
    socket.on("leave_notifications", (userId) => {
      if (userId) {
        socket.leave(`user_${userId}`);
        console.log(
          `[Notification Socket] User ${userId} left room user_${userId}`,
        );
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Notification Socket] User disconnected: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error(`[Notification Socket] Error on ${socket.id}:`, error);
    });
  });

  // Function to send a notification to a specific user
  notificationNamespace.emitToUser = (userId, eventName, data) => {
    const roomId = `user_${userId}`;
    console.log(
      `[Notification Socket] Emitting "${eventName}" to room "${roomId}"`,
    );
    console.log(`[Notification Socket] Event data:`, data);
    notificationNamespace.to(roomId).emit(eventName, data);
  };

  // Function to broadcast to all connected users
  notificationNamespace.broadcastToAll = (eventName, data) => {
    console.log(
      `[Notification Socket] Broadcasting "${eventName}" to all users`,
    );
    notificationNamespace.emit(eventName, data);
  };

  return notificationNamespace;
};
