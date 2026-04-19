/**
 * BATCH SOCKET.IO INTEGRATION
 * Real-time batch allocation and member updates via WebSocket
 *
 * To integrate in server.js:
 * import { initBatchSocket } from "./socket/batchSocket.js";
 * import { createServer } from "http";
 * import { Server } from "socket.io";
 *
 * const httpServer = createServer(app);
 * const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } });
 * initBatchSocket(io);
 * httpServer.listen(PORT);
 */

export const initBatchSocket = (io) => {
  const batchNamespace = io.of("/batches");

  /**
   * BATCH ALLOCATION EVENT
   * Broadcast when a user is allocated to a batch
   */
  batchNamespace.on("connection", (socket) => {
    console.log(`[Batch Socket] User connected: ${socket.id}`);

    // User joins batch room
    socket.on("join_batch", (batchId) => {
      socket.join(`batch_${batchId}`);
      console.log(`[Batch Socket] User joined batch room: batch_${batchId}`);

      // Notify batch members
      batchNamespace.to(`batch_${batchId}`).emit("member_joined", {
        batchId,
        timestamp: new Date(),
        message: "A new member joined the batch",
      });
    });

    // User leaves batch room
    socket.on("leave_batch", (batchId) => {
      socket.leave(`batch_${batchId}`);
      console.log(`[Batch Socket] User left batch room: batch_${batchId}`);

      // Notify batch members
      batchNamespace.to(`batch_${batchId}`).emit("member_left", {
        batchId,
        timestamp: new Date(),
        message: "A member left the batch",
      });
    });

    // Broadcast batch allocation
    socket.on("user_allocated", (data) => {
      const { batchId, userId, userName } = data;
      batchNamespace.emit("allocation_update", {
        batchId,
        userId,
        userName,
        action: "allocated",
        timestamp: new Date(),
      });
    });

    // Broadcast batch reallocation
    socket.on("user_reallocated", (data) => {
      const { oldBatchId, newBatchId, userId, userName } = data;
      batchNamespace.emit("reallocation_update", {
        oldBatchId,
        newBatchId,
        userId,
        userName,
        action: "reallocated",
        timestamp: new Date(),
      });
    });

    // Broadcast auto batch allocation
    socket.on("auto_allocation_started", (data) => {
      batchNamespace.emit("allocation_progress", {
        status: "started",
        message: "Auto batch allocation in progress",
        timestamp: new Date(),
      });
    });

    socket.on("auto_allocation_completed", (data) => {
      const { totalBatches, totalStudents } = data;
      batchNamespace.emit("allocation_progress", {
        status: "completed",
        message: "Auto batch allocation completed",
        totalBatches,
        totalStudents,
        timestamp: new Date(),
      });
    });

    // Broadcast batch interests update
    socket.on("batch_interests_updated", (data) => {
      const { batchId, interests } = data;
      batchNamespace.to(`batch_${batchId}`).emit("interests_updated", {
        batchId,
        interests,
        timestamp: new Date(),
      });
    });

    // Request batch statistics
    socket.on("request_batch_stats", (callback) => {
      socket.on("batch_stats_response", (stats) => {
        callback(stats);
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`[Batch Socket] User disconnected: ${socket.id}`);
    });
  });

  return batchNamespace;
};

/**
 * HELPER: Emit batch allocation event from controller
 */
export const emitBatchAllocation = (io, batchId, userId, userName) => {
  io.of("/batches").emit("allocation_update", {
    batchId,
    userId,
    userName,
    action: "allocated",
    timestamp: new Date(),
  });
};

/**
 * HELPER: Emit auto allocation completion from service
 */
export const emitAutoAllocationComplete = (io, totalBatches, totalStudents) => {
  io.of("/batches").emit("allocation_progress", {
    status: "completed",
    message: "Auto batch allocation completed",
    totalBatches,
    totalStudents,
    timestamp: new Date(),
  });
};

/**
 * HELPER: Notify batch members of member update
 */
export const notifyBatchMemberUpdate = (io, batchId, message) => {
  io.of("/batches").to(`batch_${batchId}`).emit("member_update", {
    batchId,
    message,
    timestamp: new Date(),
  });
};
