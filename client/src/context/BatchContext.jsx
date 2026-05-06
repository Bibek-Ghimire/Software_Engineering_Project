import React, { createContext, useState, useCallback, useEffect } from "react";
import {
  autoAllocateBatches,
  getAllBatches,
  getUserBatch,
  getSimilarUsers,
  getBatchStatistics,
} from "../services/batchService.js";

export const BatchContext = createContext();

export const BatchProvider = ({ children }) => {
  const [batches, setBatches] = useState([]);
  const [userBatch, setUserBatch] = useState(null);
  const [similarUsers, setSimilarUsers] = useState([]);
  const [batchStats, setBatchStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all batches
  const fetchBatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBatches();
      setBatches(data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch batches");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's batch
  const fetchUserBatch = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserBatch(userId);
      setUserBatch(data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch user batch");
      setUserBatch(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch similar users
  const fetchSimilarUsers = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSimilarUsers(userId);
      setSimilarUsers(data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch similar users");
      setSimilarUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch batch statistics
  const fetchBatchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBatchStatistics();
      setBatchStats(data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch batch statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto allocate batches
  const handleAutoAllocate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await autoAllocateBatches();
      await fetchBatches();
      return data;
    } catch (err) {
      setError(err.message || "Failed to auto allocate batches");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBatches]);

  const value = {
    batches,
    userBatch,
    similarUsers,
    batchStats,
    loading,
    error,
    fetchBatches,
    fetchUserBatch,
    fetchSimilarUsers,
    fetchBatchStats,
    handleAutoAllocate,
  };

  return (
    <BatchContext.Provider value={value}>{children}</BatchContext.Provider>
  );
};

export const useBatchContext = () => {
  const context = React.useContext(BatchContext);
  if (!context) {
    throw new Error("useBatchContext must be used within BatchProvider");
  }
  return context;
};
