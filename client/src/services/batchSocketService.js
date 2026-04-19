/**
 * CLIENT-SIDE BATCH SOCKET SERVICE
 * Real-time batch updates in React
 *
 * Usage:
 * import { useBatchSocket } from './services/batchSocketService';
 *
 * const socket = useBatchSocket();
 * socket.onAllocationUpdate((data) => { ... });
 */

import { useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const useBatchSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to batch namespace
    socketRef.current = io(`${SOCKET_URL}/batches`, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("[Batch Socket] Connected");
    });

    socketRef.current.on("disconnect", () => {
      console.log("[Batch Socket] Disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const joinBatch = useCallback((batchId) => {
    socketRef.current?.emit("join_batch", batchId);
  }, []);

  const leaveBatch = useCallback((batchId) => {
    socketRef.current?.emit("leave_batch", batchId);
  }, []);

  const onAllocationUpdate = useCallback((callback) => {
    socketRef.current?.on("allocation_update", callback);
  }, []);

  const onReallocationUpdate = useCallback((callback) => {
    socketRef.current?.on("reallocation_update", callback);
  }, []);

  const onAllocationProgress = useCallback((callback) => {
    socketRef.current?.on("allocation_progress", callback);
  }, []);

  const onMemberJoined = useCallback((callback) => {
    socketRef.current?.on("member_joined", callback);
  }, []);

  const onMemberLeft = useCallback((callback) => {
    socketRef.current?.on("member_left", callback);
  }, []);

  const onInterestsUpdated = useCallback((callback) => {
    socketRef.current?.on("interests_updated", callback);
  }, []);

  const onMemberUpdate = useCallback((callback) => {
    socketRef.current?.on("member_update", callback);
  }, []);

  return {
    joinBatch,
    leaveBatch,
    onAllocationUpdate,
    onReallocationUpdate,
    onAllocationProgress,
    onMemberJoined,
    onMemberLeft,
    onInterestsUpdated,
    onMemberUpdate,
  };
};

/**
 * BATCH EVENT LISTENER COMPONENT
 * Higher-level component for batch notifications
 */
export const useBatchNotifications = (batchId, onNotification) => {
  const socket = useBatchSocket();

  useEffect(() => {
    if (!batchId) return;

    socket.joinBatch(batchId);

    socket.onMemberJoined((data) => {
      if (data.batchId === batchId) {
        onNotification({
          type: "member_joined",
          message: data.message,
        });
      }
    });

    socket.onMemberLeft((data) => {
      if (data.batchId === batchId) {
        onNotification({
          type: "member_left",
          message: data.message,
        });
      }
    });

    socket.onMemberUpdate((data) => {
      if (data.batchId === batchId) {
        onNotification({
          type: "update",
          message: data.message,
        });
      }
    });

    return () => {
      socket.leaveBatch(batchId);
    };
  }, [batchId, socket, onNotification]);
};
