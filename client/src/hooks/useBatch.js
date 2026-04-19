import { useEffect, useState } from "react";
import { useBatchContext } from "../context/BatchContext.jsx";
import { useBatchNotifications } from "../services/batchSocketService.js";

/**
 * HOOK: useBatchMembers
 * Fetch and manage batch members
 */
export const useBatchMembers = (batchId) => {
  const { batches, loading, fetchBatches } = useBatchContext();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!batchId) return;

    fetchBatches().then(() => {
      const batch = batches.find((b) => b._id === batchId);
      setMembers(batch?.members || []);
    });
  }, [batchId, fetchBatches, batches]);

  return { members, loading };
};

/**
 * HOOK: useSimilarUsers
 * Fetch similar users for current user
 */
export const useSimilarUsers = (userId) => {
  const { similarUsers, loading, error, fetchSimilarUsers } = useBatchContext();

  useEffect(() => {
    if (userId) {
      fetchSimilarUsers(userId);
    }
  }, [userId, fetchSimilarUsers]);

  return { similarUsers, loading, error };
};

/**
 * HOOK: useBatchStats
 * Fetch and refresh batch statistics
 */
export const useBatchStats = () => {
  const { batchStats, loading, error, fetchBatchStats } = useBatchContext();

  useEffect(() => {
    fetchBatchStats();
  }, [fetchBatchStats]);

  return { batchStats, loading, error, refetch: fetchBatchStats };
};

/**
 * HOOK: useBatchNotificationsWithContext
 * Combine batch socket notifications with context
 */
export const useBatchNotificationsWithContext = (batchId) => {
  const [notifications, setNotifications] = useState([]);

  const handleNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 5000);
  };

  useBatchNotifications(batchId, handleNotification);

  return { notifications };
};
