import api from "./api.js";

/**
 * AUTO ALLOCATE ALL STUDENTS
 * POST /api/batches/auto-allocate
 */
export const autoAllocateBatches = async () => {
  try {
    const response = await api.post("/batches/auto-allocate");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * ALLOCATE SINGLE USER
 * POST /api/batches/allocate-user/:userId
 */
export const allocateSingleUser = async (userId) => {
  try {
    const response = await api.post(`/batches/allocate-user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * REALLOCATE USER (INTEREST UPDATE)
 * POST /api/batches/reallocate-user/:userId
 */
export const reallocateUserBatch = async (userId) => {
  try {
    const response = await api.post(`/batches/reallocate-user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * GET ALL BATCHES
 * GET /api/batches
 */
export const getAllBatches = async () => {
  try {
    const response = await api.get("/batches");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * GET SINGLE BATCH
 * GET /api/batches/:batchId
 */
export const getBatchById = async (batchId) => {
  try {
    const response = await api.get(`/batches/${batchId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * GET USER'S BATCH
 * GET /api/batches/user/:userId
 */
export const getUserBatch = async (userId) => {
  try {
    const response = await api.get(`/batches/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * GET TOP 5 SIMILAR USERS
 * GET /api/batches/similar-users/:userId
 */
export const getSimilarUsers = async (userId) => {
  try {
    const response = await api.get(`/batches/similar-users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * GET BATCH DOMINANT INTERESTS
 * GET /api/batches/:batchId/dominant-interests
 */
export const getBatchDominantInterests = async (batchId) => {
  try {
    const response = await api.get(`/batches/${batchId}/dominant-interests`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * REMOVE USER FROM BATCH
 * DELETE /api/batches/:batchId/members/:userId
 */
export const removeUserFromBatch = async (batchId, userId) => {
  try {
    const response = await api.delete(`/batches/${batchId}/members/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * DELETE BATCH
 * DELETE /api/batches/:batchId
 */
export const deleteBatch = async (batchId) => {
  try {
    const response = await api.delete(`/batches/${batchId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * GET BATCH STATISTICS
 * GET /api/batches/stats/overview
 */
export const getBatchStatistics = async () => {
  try {
    const response = await api.get("/batches/stats/overview");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * ============================================
 * PROTECTED ROUTES - Requires Authentication
 * ============================================
 */

/**
 * GET CURRENT USER'S BATCH (PROTECTED)
 * GET /api/batches/protected/my-batch
 */
export const getMyBatch = async () => {
  try {
    const response = await api.get("/batches/protected/my-batch");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * GET CURRENT USER'S BATCH MEMBERS (PROTECTED)
 * GET /api/batches/protected/my-batch/members
 */
export const getMyBatchMembers = async () => {
  try {
    const response = await api.get("/batches/protected/my-batch/members");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * GET SIMILAR USERS IN MY BATCH (PROTECTED)
 * GET /api/batches/protected/my-batch/similar-users
 */
export const getMyBatchSimilarUsers = async () => {
  try {
    const response = await api.get("/batches/protected/my-batch/similar-users");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * GET PROTECTED BATCH BY ID (PROTECTED)
 * Only accessible if user is a member
 * GET /api/batches/protected/:batchId
 */
export const getProtectedBatchById = async (batchId) => {
  try {
    const response = await api.get(`/batches/protected/${batchId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
